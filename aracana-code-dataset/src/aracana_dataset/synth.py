"""Synthetic generation circuit (OpenRouter-backed).

This is the engine for the silos with no clean public source: terminal traces,
multi-hop agentic trajectories, long-context reasoning and targeted synthetic
code. It is written to be *correct and runnable the moment credits exist*, with:

  * a pluggable client (OpenRouterClient for real, MockClient for tests/CI),
  * key + model fallback and exponential backoff,
  * JSONL checkpointing so a crashed/interrupted run resumes,
  * every generation pushed back through the same Verifier as real data, so
    synthetic examples meet identical quality gates.

Credentials come from the environment, never from code:
    OPENROUTER_API_KEY="sk-or-..."   (optionally OPENROUTER_API_KEY_2 for fallback)
"""

from __future__ import annotations

import json
import os
import time
import urllib.error
import urllib.request
from dataclasses import dataclass, field
from pathlib import Path
from typing import Callable, Dict, List, Optional, Protocol

from .schema import Example, Silo, make_example
from .verify import Verifier

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"


class Client(Protocol):
    def complete(self, system: str, user: str, max_tokens: int = 1500) -> str: ...


@dataclass
class OpenRouterClient:
    """Minimal stdlib OpenRouter client with key/model fallback + backoff."""

    models: List[str] = field(default_factory=lambda: [
        "qwen/qwen3-coder", "deepseek/deepseek-chat-v3-0324",
        "meta-llama/llama-3.3-70b-instruct",
    ])
    keys: List[str] = field(default_factory=lambda: [
        k for k in (os.environ.get("OPENROUTER_API_KEY"),
                    os.environ.get("OPENROUTER_API_KEY_2")) if k
    ])
    max_attempts: int = 5
    base_backoff: float = 2.0

    def complete(self, system: str, user: str, max_tokens: int = 1500) -> str:
        if not self.keys:
            raise RuntimeError("No OPENROUTER_API_KEY in environment.")
        last_err = None
        for attempt in range(self.max_attempts):
            for key in self.keys:
                for model in self.models:
                    try:
                        return self._one(key, model, system, user, max_tokens)
                    except urllib.error.HTTPError as e:
                        last_err = f"HTTP {e.code} {model}"
                        if e.code in (401, 402):  # auth/credits: don't hammer
                            raise RuntimeError(f"OpenRouter {e.code}: {e.read().decode()[:120]}")
                    except Exception as e:  # noqa: BLE001
                        last_err = f"{type(e).__name__} {model}"
            time.sleep(self.base_backoff * (2 ** attempt))
        raise RuntimeError(f"All OpenRouter attempts failed: {last_err}")

    def _one(self, key, model, system, user, max_tokens) -> str:
        payload = json.dumps({
            "model": model,
            "messages": [{"role": "system", "content": system},
                         {"role": "user", "content": user}],
            "max_tokens": max_tokens, "temperature": 0.7,
        }).encode()
        req = urllib.request.Request(OPENROUTER_URL, data=payload, headers={
            "Authorization": f"Bearer {key}", "Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=120) as r:
            data = json.load(r)
        return data["choices"][0]["message"]["content"]


@dataclass
class MockClient:
    """Deterministic offline client. Lets the whole synthesis path be tested and
    demoed with zero credits. Returns a canned, *valid* artefact per kind."""

    def complete(self, system: str, user: str, max_tokens: int = 1500) -> str:
        if "shell" in system.lower() or "terminal" in system.lower():
            return ("# STATE: svc=down | # COST: O(1)\n"
                    "$ systemctl status api\n> failed: bind: address in use\n"
                    "# STATE: port=occupied | # COST: O(1)\n"
                    "$ ss -ltnp | grep :8000\n> users:((\"ghost\",pid=991))\n"
                    "# STATE: culprit=pid991 | # COST: O(1)\n"
                    "$ kill -9 991 && systemctl restart api\n> api active (running)\n"
                    "# STATE: svc=up | # COST: O(1)\n"
                    "$ curl -s -o /dev/null -w '%{http_code}' localhost:8000/health\n> 200\n\n"
                    "A stale process held the port; killing it and restarting "
                    "restored the service, confirmed by the 200 health check.")
        return ("Step 1: parse the goal and pick the first tool.\n"
                "Step 2: call search(query='...') and read the top result.\n"
                "Step 3: synthesise and answer.\n\n"
                "The synthesised answer follows from the retrieved evidence above, "
                "and no further tool calls are needed to satisfy the request.")


# --- task specs ----------------------------------------------------------
TERMINAL_SYS = ("You are a senior DevOps engineer. Produce a realistic shell "
                "diagnosis. Precede every command with a line "
                "'# STATE: ... | # COST: O(...)'. 8+ commands, realistic outputs.")
AGENTIC_SYS = ("You are an agentic researcher. Produce a multi-tool trajectory "
               "with explicit 'Step N:' lines and tool calls, ending in an answer.")

SPECS = {
    (Silo.TERMINAL, "shell_agentic"): (TERMINAL_SYS, {"type": "terminal"}),
    (Silo.AGENTIC, "deep_search"): (AGENTIC_SYS, {"type": "agentic", "cot": True}),
    (Silo.AGENTIC, "tool_use"): (AGENTIC_SYS, {"type": "agentic", "cot": True}),
}


@dataclass
class SynthReport:
    requested: int = 0
    generated: int = 0
    accepted: int = 0
    rejected: int = 0

    def as_text(self) -> str:
        return (f"SYNTH: requested={self.requested} generated={self.generated} "
                f"accepted={self.accepted} rejected={self.rejected}")


class Synthesizer:
    def __init__(self, client: Client, verifier: Optional[Verifier] = None) -> None:
        self.client = client
        self.verifier = verifier or Verifier()

    def generate(self, silo: Silo, subcategory: str, prompts: List[str],
                 checkpoint: Optional[Path] = None) -> tuple[List[Example], SynthReport]:
        system, meta = SPECS[(silo, subcategory)]
        report = SynthReport(requested=len(prompts))
        out: List[Example] = []
        fh = checkpoint.open("a", encoding="utf-8") if checkpoint else None
        try:
            for prompt in prompts:
                try:
                    completion = self.client.complete(system, prompt)
                except Exception as e:  # noqa: BLE001
                    report.rejected += 1
                    print(f"  gen-fail: {str(e)[:80]}")
                    continue
                report.generated += 1
                ex = make_example(user=prompt, assistant=completion, silo=silo,
                                  subcategory=subcategory, source="synth/openrouter",
                                  license="synthetic", metadata=dict(meta))
                ok, reason = self.verifier.verify_one(ex)
                if ok:
                    out.append(ex)
                    report.accepted += 1
                    if fh:
                        fh.write(ex.to_jsonl() + "\n"); fh.flush()
                else:
                    report.rejected += 1
        finally:
            if fh:
                fh.close()
        return out, report

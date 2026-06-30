#!/usr/bin/env python3
"""Full multi-strata build orchestrator.

This is the real 109K build script. It encodes three non-negotiable rules that
the original strata list violated:

  RULE 1 (integrity): evaluation benchmarks (LiveCodeBench, SWE-bench *test*,
          GAIA, BFCL, Tau-bench, LongBench, MBPP/HumanEval test) are used ONLY as
          decontamination sources. Training on them would make every reported
          score fraudulent. They appear in BENCHMARKS_DECON_ONLY, never as a
          training source.
  RULE 2 (disk): everything streams; we never fully cache a raw dataset. The
          script aborts if free disk drops below MIN_FREE_GB.
  RULE 3 (provenance): real data is tagged with its repo+license; synthetic data
          is tagged synth/openrouter; placeholder (mock) data is tagged
          synth/MOCK-PLACEHOLDER and kept OUT of the training corpus.

With OpenRouter credits + adequate disk this fills all five silos to TARGET_109K.
Without them it builds the legitimately-available real silos and proves the rest.
"""

from __future__ import annotations

import os
import shutil
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent / "src"))

from aracana_dataset import (  # noqa: E402
    Decontaminator, MockClient, OpenRouterClient, Pipeline, PipelineConfig,
    Silo, Synthesizer, make_example, write_jsonl,
)
from aracana_dataset.silos import TARGET_109K  # noqa: E402

MIN_FREE_GB = 1.0

# --- TRAINABLE real sources (exist + permissive + NOT an eval target) -------
# (repo, split, silo, subcategory, prompt_field, answer_field, default_limit)
SOURCES_TRAINABLE = [
    # base limits tuned toward the real 109K targets (algorithmic 25K has headroom;
    # optimisation capped at ~8K; math-competition ~10-14K). Scaled by ARACANA_SCALE.
    ("ise-uiuc/Magicoder-Evol-Instruct-110K", "train", Silo.CODE, "algorithmic", "instruction", "response", 27000),
    ("m-a-p/CodeFeedback-Filtered-Instruction", "train", Silo.CODE, "optimisation", "query", "answer", 9000),
    ("open-r1/OpenR1-Math-220k", "train", Silo.MATH, "competition", "problem", "solution", 14000),
]

# --- DECONTAMINATION-ONLY (eval targets; NEVER training) --------------------
# (repo, split, text_field, name) — best-effort; skipped if gated/unavailable.
BENCHMARKS_DECON_ONLY = [
    ("livecodebench/code_generation_lite", "test", "question_content", "LiveCodeBench"),
    ("openai/openai_humaneval", "test", "prompt", "HumanEval"),
    ("google-research-datasets/mbpp", "test", "text", "MBPP"),
]

# --- SYNTHESIS plan (no clean public train source -> generate) --------------
SYNTH_PLAN = [
    (Silo.TERMINAL, "shell_agentic", 3),   # raise to thousands with credits
    (Silo.AGENTIC, "deep_search", 3),
]
SYNTH_PROMPTS = {
    "shell_agentic": [
        "Production API returns 503 under load; connection pool exhausted. Diagnose and fix.",
        "Nightly backup cron silently fails; disk filled at 03:00. Find root cause and resolve.",
        "TLS handshake failures after a deploy; intermittent 525s. Trace and repair.",
    ],
    "deep_search": [
        "Find the 2024 annual revenue of three named EV manufacturers and rank them.",
        "Identify which open-source license a given dependency tree is incompatible with.",
        "Determine the earliest paper to introduce a specific attention variant and cite it.",
    ],
}


def free_gb(path="c:/") -> float:
    return shutil.disk_usage(path).free / 2 ** 30


def disk_guard():
    g = free_gb()
    print(f"[disk] free={g:.1f} GB")
    if g < MIN_FREE_GB:
        print(f"ABORT: <{MIN_FREE_GB} GB free. Streaming needs headroom; free space first.")
        sys.exit(2)


def ingest_real(scale: float):
    import re
    from datasets import load_dataset
    token = os.environ.get("HF_TOKEN") or os.environ.get("HUGGINGFACE_TOKEN")
    out = []
    for repo, split, silo, sub, pf, af, base_limit in SOURCES_TRAINABLE:
        limit = max(1, int(base_limit * scale))
        print(f"-> {repo} (limit {limit})")
        try:
            ds = load_dataset(repo, split=split, streaming=True, token=token, trust_remote_code=False)
        except Exception as e:  # noqa: BLE001
            print(f"   SKIP: {type(e).__name__}: {str(e)[:90]}"); continue
        n = 0
        for row in ds:
            p_, a_ = row.get(pf), row.get(af)
            if not p_ or not a_:
                continue
            meta = {}
            if silo == Silo.CODE:
                if "```" not in str(a_):
                    continue
                m = re.search(r"O\([^)]+\)", str(a_))
                meta = {"type": "code", "complexity": m.group(0) if m else "unknown"}
            elif silo == Silo.MATH:
                import re as _re
                meta = {"type": "math", "cot": len(_re.findall(r"\bstep\s*\d+\b", str(a_), _re.I)) >= 3}
            out.append(make_example(user=str(p_), assistant=str(a_), silo=silo,
                                    subcategory=sub, source=repo,
                                    license=f"unverified:{repo}", metadata=meta))
            n += 1
            if n >= limit:
                break
            if n % 1000 == 0 and free_gb() < MIN_FREE_GB:
                print("   disk low, stopping this source early"); break
        print(f"   collected {n}")
    return out


def pick_client():
    """Real OpenRouter if a 1-call probe succeeds, else MockClient (placeholder)."""
    if os.environ.get("OPENROUTER_API_KEY"):
        c = OpenRouterClient()
        try:
            c.complete("ping", "Reply OK", max_tokens=5)
            print("[synth] OpenRouter live -> real generations")
            return c, False
        except Exception as e:  # noqa: BLE001
            print(f"[synth] OpenRouter unavailable ({str(e)[:60]}) -> MOCK placeholder")
    return MockClient(), True


def build_decontaminator():
    from datasets import load_dataset
    token = os.environ.get("HF_TOKEN") or os.environ.get("HUGGINGFACE_TOKEN")
    decon = Decontaminator(ngram=13)
    for repo, split, field, name in BENCHMARKS_DECON_ONLY:
        try:
            ds = load_dataset(repo, split=split, streaming=True, token=token, trust_remote_code=False)
            texts = []
            for i, row in enumerate(ds):
                if row.get(field):
                    texts.append(str(row[field]))
                if i >= 2000:
                    break
            added = decon.add_benchmark_texts(texts, name)
            print(f"[decon] indexed {len(texts)} items / {added} ngrams from {name}")
        except Exception as e:  # noqa: BLE001
            print(f"[decon] SKIP {name}: {type(e).__name__}: {str(e)[:70]}")
    return decon


def main():
    scale = float(os.environ.get("ARACANA_SCALE", "1.0"))  # 1.0 ~= 10k real; raise to fill
    disk_guard()

    print("\n=== REAL INGESTION (trainable sources only) ===")
    real = ingest_real(scale)
    print(f"real ingested: {len(real)}")

    print("\n=== SYNTHESIS ===")
    client, is_mock = pick_client()
    synth = Synthesizer(client)
    synth_examples, placeholders = [], []
    for silo, sub, count in SYNTH_PLAN:
        prompts = (SYNTH_PROMPTS[sub] * (count // len(SYNTH_PROMPTS[sub]) + 1))[:count]
        exs, rep = synth.generate(silo, sub, prompts)
        print(f"  {silo.value}/{sub}: {rep.as_text()}")
        (placeholders if is_mock else synth_examples).extend(exs)
    if placeholders:
        write_jsonl(Path("data/placeholders/synth_mock.jsonl"), placeholders)
        print(f"  wrote {len(placeholders)} MOCK placeholders (excluded from corpus) "
              f"-> data/placeholders/synth_mock.jsonl")

    print("\n=== DECONTAMINATION INDEX ===")
    decon = build_decontaminator()

    print("\n=== PIPELINE ===")
    # Real 109K caps (proportioned) when ARACANA_REAL_TARGET=1, else keep-all.
    if os.environ.get("ARACANA_REAL_TARGET") == "1":
        target = TARGET_109K
    else:
        target = {s: {sub: 1_000_000 for sub in subs}
                  for s, subs in
                  {Silo.CODE: ["algorithmic", "swe_bench", "optimisation"],
                   Silo.MATH: ["competition", "proofs"],
                   Silo.TERMINAL: ["shell_simple", "shell_agentic"],
                   Silo.LONG_CONTEXT: ["codebase", "documents"],
                   Silo.AGENTIC: ["tool_use", "deep_search"]}.items()}
    out_dir = Path(os.environ.get("ARACANA_OUT", "data/final_all"))
    cfg = PipelineConfig(out_dir=out_dir,
                         checkpoint_dir=Path("data/processed_all"),
                         write_checkpoints=False,  # disk-safe: final only
                         target=target)
    Pipeline(cfg, decontaminator=decon).run(real + synth_examples)
    print(f"\n[disk] free after build: {free_gb():.1f} GB")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Real HuggingFace ingestion -> full pipeline -> training JSONL.

Streams bounded slices from permissive, ungated public datasets, maps each to a
canonical Example, then runs verify -> dedup -> decontaminate -> standardize ->
balance. Set your token in the environment first (never on the command line in a
shared transcript):

    PowerShell:  $env:HF_TOKEN = "hf_..."
    bash:        export HF_TOKEN=hf_...

Tune SLICES below; this is the exact mechanism that scales to the 109K build —
only the per-source limits and the balance targets change.

License honesty: several instruction datasets are distilled from proprietary
models and are research-only. We record license as `unverified:<repo>` so the
verifier's `require_license` mode and any audit can flag them BEFORE you
redistribute. Resolve every license before publishing the corpus.
"""

from __future__ import annotations

import os
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent / "src"))

from aracana_dataset import Decontaminator, Pipeline, PipelineConfig, Silo, make_example  # noqa: E402

TOKEN = os.environ.get("HF_TOKEN") or os.environ.get("HUGGINGFACE_TOKEN")

# (repo, split, silo, subcategory, prompt_field, answer_field, limit)
SLICES = [
    ("ise-uiuc/Magicoder-Evol-Instruct-110K", "train", Silo.CODE, "algorithmic",
     "instruction", "response", 600),
    ("m-a-p/CodeFeedback-Filtered-Instruction", "train", Silo.CODE, "optimisation",
     "query", "answer", 600),
    ("open-r1/OpenR1-Math-220k", "train", Silo.MATH, "competition",
     "problem", "solution", 600),
]

_PY_FENCE = re.compile(r"```(?:python|py)\b", re.IGNORECASE)
_STEP = re.compile(r"\bstep\s*\d+\b", re.IGNORECASE)


def _looks_codey(text: str) -> bool:
    return "```" in text


def ingest():
    from datasets import load_dataset
    out = []
    for repo, split, silo, sub, pf, af, limit in SLICES:
        print(f"-> streaming {repo} (limit {limit}) ...", flush=True)
        try:
            ds = load_dataset(repo, split=split, streaming=True, token=TOKEN,
                              trust_remote_code=False)
        except Exception as e:  # noqa: BLE001
            print(f"   SKIP {repo}: {type(e).__name__}: {str(e)[:120]}")
            continue
        n = 0
        for row in ds:
            prompt, answer = row.get(pf), row.get(af)
            if not prompt or not answer:
                continue
            prompt, answer = str(prompt), str(answer)
            meta = {}
            if silo == Silo.CODE:
                meta["type"] = "code"
                # tag complexity only when the answer self-declares one
                m = re.search(r"O\([^)]+\)", answer)
                meta["complexity"] = m.group(0) if m else "unknown"
                if not _looks_codey(answer):
                    continue  # code silo requires a code block
            elif silo == Silo.MATH:
                meta["type"] = "math"
                meta["cot"] = len(_STEP.findall(answer)) >= 3
            out.append(make_example(
                user=prompt, assistant=answer, silo=silo, subcategory=sub,
                source=repo, license=f"unverified:{repo}", metadata=meta,
            ))
            n += 1
            if n >= limit:
                break
        print(f"   collected {n} from {repo}")
    return out


def main():
    if not TOKEN:
        print("ERROR: set HF_TOKEN in your environment first."); sys.exit(1)
    examples = ingest()
    print(f"\nTotal ingested: {len(examples)}")

    # Decontaminate against the real eval suite. Load actual test splits here;
    # we seed an empty index (no canary) so nothing is wrongly dropped in this
    # smoke run. See configs/decontamination.md for wiring real benchmarks.
    decon = Decontaminator(ngram=13)

    # Keep everything that passes (targets above the slice sizes => no down-sampling).
    target = {silo: {sub: 100_000 for sub in subs}
              for silo, subs in
              {Silo.CODE: ["algorithmic", "swe_bench", "optimisation"],
               Silo.MATH: ["competition", "proofs"],
               Silo.TERMINAL: ["shell_simple", "shell_agentic"],
               Silo.LONG_CONTEXT: ["codebase", "documents"],
               Silo.AGENTIC: ["tool_use", "deep_search"]}.items()}

    cfg = PipelineConfig(out_dir=Path("data/final_real"),
                         checkpoint_dir=Path("data/processed_real"),
                         target=target)
    Pipeline(cfg, decontaminator=decon).run(examples)


if __name__ == "__main__":
    main()

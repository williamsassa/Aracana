# ARACANA-Code Dataset Toolkit

A **robustness-first** pipeline for building a training-ready SFT corpus for a
small (3B-class) coding model. The thesis: at small scale, data *quality and
integrity* — not size — is the lever. Every example is verified, deduplicated,
benchmark-decontaminated, standardized and causally weighted before it reaches
the final JSONL.

> **Honest scope.** This toolkit builds a corpus aimed at making a 3B model
> best-in-class *for its size* and competitive with specific larger **open**
> coding models on a defined benchmark subset. It does **not** make a 3B model
> beat frontier systems across all benchmarks — no dataset does that at 3B.

## Layout
```
aracana-code-dataset/
├── src/aracana_dataset/
│   ├── schema.py          # canonical Example record (provenance + taxonomy)
│   ├── verify.py          # multi-criterion verification, tallied rejections
│   ├── dedup.py           # exact + MinHash/LSH near-duplicate removal
│   ├── decontaminate.py   # 13-gram benchmark decontamination (release gate)
│   ├── silos.py           # silo targets, balancing, causal weighting
│   ├── sources.py         # HuggingFace ingestion adapters (your own token)
│   └── pipeline.py        # orchestrator + composition report
├── demo_build.py          # runnable synthetic end-to-end demo (no network)
├── build_real.py          # real HF ingestion -> pipeline (needs HF_TOKEN)
├── tests/test_pipeline.py # stage-level tests (10/10, stdlib + pytest)
├── configs/decontamination.md
├── paper/                 # arXiv scaffold (main.tex, references.bib)
└── data/                  # checkpoints + final JSONL + composition reports
```

## Quick start
```bash
# 1. Prove the pipeline end-to-end with synthetic data (no network, no deps):
python demo_build.py

# 2. Run the tests:
python tests/test_pipeline.py      # or: python -m pytest tests/ -q

# 3. Real ingestion from HuggingFace — set YOUR token in the ENV first:
#    PowerShell:  $env:HF_TOKEN = "hf_..."
#    bash:        export HF_TOKEN=hf_...
pip install datasets
python build_real.py
```

## Pipeline stages
1. **Verify** — structure, taxonomy, Python AST syntax, CoT completeness,
   terminal STATE/COST coherence, length, non-triviality, leaked-prompt filter.
2. **Dedup** — exact (sha256) then near-dup (64-perm MinHash, 16-band LSH,
   Jaccard ≥ 0.85). MinHash estimate verified against true Jaccard.
3. **Decontaminate** — drop any example sharing a 13-gram with a benchmark test
   item; attributed per benchmark. **Wire real test splits before building**
   (see `configs/decontamination.md`).
4. **Standardize** — ensure a system prompt; compute the causal weight.
5. **Balance** — down-sample each silo/subcategory to target. Never fabricates
   duplicates; shortfalls are reported, not hidden.

## Proven, not claimed
- `demo_build.py`: 8 synthetic → verify 8/8 → near-dedup −1 → decon −1 → 6 final.
- `build_real.py`: 1,800 real HF examples → **1,562 accepted (86.8%)** → JSONL.
- `tests/`: **10/10 pass**.

## Scaling to 109K
Raise the per-source `limit`s in `build_real.py`, add the remaining silos
(terminal / long-context / agentic) via more source adapters or synthesis, wire
the real benchmark test splits into the decontaminator, and set the balance
target to `TARGET_109K`. The mechanism is unchanged — only volume and sources.

## License integrity
Distilled instruction datasets are often research-only. The ingester records
license as `unverified:<repo>`; resolve every license before redistribution.
Turn on `VerifyConfig(require_license=True)` for redistribution-strict runs.

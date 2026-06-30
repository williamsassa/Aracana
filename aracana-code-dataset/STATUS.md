# ARACANA-Code — Build Status (honest)

_Last updated: 2026-06-27._

## TL;DR
The **engineering is done and proven**; the **corpus is partially built**. Two
external blockers stop a full 109K on this machine: **OpenRouter has no credits**
(synthesis blocked) and **disk is ~3 GB** (tight but the 109K *output* fits; raw
caching does not, so we stream).

## What is DONE and verified
| Component | State |
|---|---|
| Canonical schema + provenance/taxonomy | ✅ |
| Verifier (9 checks, tallied) | ✅ |
| Dedup (exact + MinHash/LSH) | ✅ |
| Decontamination (13-gram, eval-only sources) | ✅ (HumanEval+MBPP indexed) |
| Standardize + example-level causal weight | ✅ |
| Silo balancing | ✅ |
| **SFT token-level causal weighting** (AST, Rho-1-grounded) | ✅ 6 tests |
| **RL verifiable rewards** (RLVR, DPO+pointwise export) | ✅ 6 tests |
| Synthesis circuit (OpenRouter client + mock) | ✅ code; ⛔ blocked at runtime (no credits) |
| Paper (LaTeX + **PDF**) | ✅ `paper/ARACANA-Code.pdf` |
| Tests | ✅ **16/16** |

## Real data actually produced
- Smoke build: 1,562 clean examples (`data/final_real/`).
- Keep-all build: **43,829** (`data/final_all/`).
- **Definitive proportioned build** (`data/final_109k/`, 109K caps applied):
  **42,947 clean examples** hitting real targets exactly —
  code/algorithmic **25,000/25,000**, code/optimisation **8,000/8,000**,
  math/competition **9,947/10,000**. 181 HumanEval/MBPP leaks removed.
- All real; the 6 synthesis-dependent subcategories are empty (blocked on credits).
- **42,947 / 109,000 = 39% of corpus** — and it is exactly the silos that do NOT
  need synthesis, at correct target proportions. The remaining 61% (swe_bench,
  math/proofs, terminal×2, long_context×2, agentic×2) needs API credits.

## Corpus vs 109K target
| Silo | Target | Achievable now | Blocker |
|---|---:|---|---|
| Code (algorithmic+optimisation) | 33K | ✅ from Magicoder + CodeFeedback | none |
| Math (competition) | 10K | ✅ from OpenR1-Math | none |
| Math (proofs) | 8K | ⚠️ needs a proofs source or synthesis | partial |
| Code (swe_bench) | 12K | ⛔ needs SWE-style train data or synthesis | source/credits |
| Terminal | 15K | ⛔ synthesis only | **credits** |
| Long context | 15K | ⛔ synthesis or gated sources | **credits/gating** |
| Agentic | 16K | ⛔ synthesis; xlam is gated | **credits/gating** |
| **Reachable today** | **~51K real** | code+math | — |
| **Remaining ~58K** | | terminal/agentic/long-ctx/swe | synthesis |

## What it takes to finish 109K
1. **OpenRouter credits** (or Claude/DeepSeek API). Rough order of magnitude for
   ~58K synthetic examples at a few hundred output tokens each on a mid-tier model:
   **~$50–200** depending on model + retries. Then raise `SYNTH_PLAN` counts and
   re-run `build_all.py`.
2. **Disk**: the 109K JSONL is ~300 MB; with final-only checkpoints it fits in
   3 GB. For comfort, free ~5 GB (your call — I will not delete your files).
3. **Wire real decontamination test splits** (see `configs/decontamination.md`)
   before publishing any score.
4. **Gated datasets**: accept terms on HF (xlam, some SWE variants) so your token
   can stream them.

## How to scale the real silos right now (no credits needed)
```powershell
$env:HF_TOKEN = "hf_..."          # set yours; never paste in chat
$env:ARACANA_SCALE = "6.0"        # ~ fills code+math toward target
python build_all.py
```

## Reminder
Revoke the HF / GitHub / OpenRouter tokens you pasted earlier — they are exposed.

"""ARACANA code dataset construction toolkit.

A robustness-first pipeline for building a training-ready SFT corpus for a small
(3B-class) coding model. Engineering priorities, in order: provenance integrity,
benchmark decontamination, deduplication, verifiable per-example quality.
"""

from .schema import Example, Message, Silo, SUBCATEGORIES, make_example
from .verify import Verifier, VerifyConfig, VerifyReport
from .dedup import Deduplicator, DedupReport, minhash_signature
from .decontaminate import Decontaminator, DecontReport
from .silos import (TARGET_109K, balance, standardize, compute_causal_weight,
                    total_target)
from .pipeline import Pipeline, PipelineConfig, composition_report, read_jsonl, write_jsonl
from .synth import Synthesizer, OpenRouterClient, MockClient, SynthReport
from .causal_tokens import weight_python_block, weights_for_offsets, summarize, WEIGHTS
from .rl import (RLExample, RLCandidate, verifiable_code_reward, score_candidates,
                 to_dpo_pairs, to_pointwise, write_rl_jsonl)

__version__ = "0.1.0"

__all__ = [
    "Example", "Message", "Silo", "SUBCATEGORIES", "make_example",
    "Verifier", "VerifyConfig", "VerifyReport",
    "Deduplicator", "DedupReport", "minhash_signature",
    "Decontaminator", "DecontReport",
    "TARGET_109K", "balance", "standardize", "compute_causal_weight", "total_target",
    "Pipeline", "PipelineConfig", "composition_report", "read_jsonl", "write_jsonl",
]

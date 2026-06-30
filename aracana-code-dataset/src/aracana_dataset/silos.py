"""Silo configuration, balancing, standardisation and causal weighting."""

from __future__ import annotations

import random
from dataclasses import dataclass, field
from typing import Dict, List

from .schema import Example, SUBCATEGORIES, Silo

# Target composition of the full 109K corpus (silo -> subcategory -> count).
TARGET_109K: Dict[Silo, Dict[str, int]] = {
    Silo.CODE: {"algorithmic": 25_000, "swe_bench": 12_000, "optimisation": 8_000},
    Silo.TERMINAL: {"shell_simple": 7_000, "shell_agentic": 8_000},
    Silo.MATH: {"competition": 10_000, "proofs": 8_000},
    Silo.LONG_CONTEXT: {"codebase": 9_000, "documents": 6_000},
    Silo.AGENTIC: {"tool_use": 9_000, "deep_search": 7_000},
}

DEFAULT_SYSTEM_PROMPT = (
    "You are an elite agentic software engineer with deep training in causal "
    "reasoning and algorithmic rigour. Produce the most correct, efficient and "
    "maintainable solution. Justify every non-trivial decision by its "
    "algorithmic or mathematical basis, and state the complexity of what you "
    "write."
)


def total_target(target: Dict[Silo, Dict[str, int]] = TARGET_109K) -> int:
    return sum(sum(sub.values()) for sub in target.values())


@dataclass
class BalanceReport:
    requested: Dict[str, int] = field(default_factory=dict)
    delivered: Dict[str, int] = field(default_factory=dict)

    def as_text(self) -> str:
        lines = ["BALANCE (key = silo/subcategory : delivered / requested):"]
        for key in sorted(self.requested):
            lines.append(f"  - {key}: {self.delivered.get(key, 0)} / {self.requested[key]}")
        return "\n".join(lines)


def compute_causal_weight(ex: Example) -> float:
    """Loss weight emphasising causally-load-bearing examples.

    Heuristic and intentionally transparent: control-flow-bearing code, target
    benchmark families, and higher complexity get up-weighted. Tuned later from
    training-time gradient signal; this is the principled starting point.
    """
    w = 1.0
    meta = ex.metadata
    text = ex.assistant_text
    if meta.get("type") == "code" and any(kw in text for kw in ("for ", "while ", "if ", "recursion")):
        w *= 1.5
    priority = ("swe_bench", "terminal", "tool_use", "deep_search")
    if ex.subcategory in priority or meta.get("type") in ("terminal", "agentic"):
        w *= 1.4
    complexity = str(meta.get("complexity", ""))
    if any(c in complexity for c in ("O(n^2)", "O(n^3)", "O(2^n)", "O(n!)")):
        w *= 1.3
    if meta.get("cot"):
        w *= 1.2
    return round(min(w, 4.0), 3)


def standardize(ex: Example, system_prompt: str = DEFAULT_SYSTEM_PROMPT) -> Example:
    """Ensure a system prompt is present and (re)compute the causal weight."""
    if not ex.messages or ex.messages[0].role != "system":
        from .schema import Message
        ex.messages.insert(0, Message("system", system_prompt))
    ex.causal_weight = compute_causal_weight(ex)
    if not ex.content_hash:
        ex.compute_hash()
    return ex


def balance(
    examples: List[Example],
    target: Dict[Silo, Dict[str, int]] = TARGET_109K,
    seed: int = 42,
) -> tuple[List[Example], BalanceReport]:
    """Down-sample each silo/subcategory bucket to its target count.

    Never up-samples (no fabricated duplicates). If a bucket is under target it
    is delivered in full and the shortfall is visible in the report — honesty
    over hitting a round number.
    """
    rng = random.Random(seed)
    buckets: Dict[tuple[Silo, str], List[Example]] = {}
    for ex in examples:
        buckets.setdefault((ex.silo, ex.subcategory), []).append(ex)

    report = BalanceReport()
    out: List[Example] = []
    for silo, subs in target.items():
        for sub, want in subs.items():
            key = (silo, sub)
            report.requested[f"{silo.value}/{sub}"] = want
            pool = buckets.get(key, [])
            rng.shuffle(pool)
            take = pool[:want]
            report.delivered[f"{silo.value}/{sub}"] = len(take)
            out.extend(take)
    rng.shuffle(out)
    return out, report

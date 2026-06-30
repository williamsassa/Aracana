"""Benchmark decontamination.

The single most important integrity step. If a benchmark test item leaks into
training data, every reported score is fraudulent. This module removes any
example that shares a long n-gram (default 13-gram, the LLaMA/GPT-style
convention) with any known benchmark item.

Usage:
  decon = Decontaminator(ngram=13)
  decon.add_benchmark_texts(livecodebench_test_prompts)
  decon.add_benchmark_texts(swebench_test_problem_statements)
  clean, report = decon.run(examples)

`add_benchmark_texts` accepts the raw test prompts/answers of every benchmark in
the eval suite. We ship a tiny built-in seed for the demo; for real runs you load
the actual test splits (see configs/decontamination.md).
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Dict, Iterable, List, Set, Tuple

from .schema import Example

_WORD_RE = re.compile(r"\w+")


def _ngrams(text: str, n: int) -> Set[str]:
    tokens = _WORD_RE.findall(text.lower())
    if len(tokens) < n:
        return {" ".join(tokens)} if tokens else set()
    return {" ".join(tokens[i:i + n]) for i in range(len(tokens) - n + 1)}


@dataclass
class DecontReport:
    total: int = 0
    removed: int = 0
    by_benchmark: Dict[str, int] = field(default_factory=dict)

    @property
    def kept(self) -> int:
        return self.total - self.removed

    def as_text(self) -> str:
        lines = [f"DECONTAMINATION: total={self.total} removed={self.removed} "
                 f"kept={self.kept}"]
        for bench, n in sorted(self.by_benchmark.items(), key=lambda kv: -kv[1]):
            lines.append(f"  - leaked from {bench}: {n}")
        return "\n".join(lines)


class Decontaminator:
    def __init__(self, ngram: int = 13) -> None:
        self.ngram = ngram
        # map n-gram -> benchmark name (first writer wins, fine for attribution)
        self._index: Dict[str, str] = {}

    def add_benchmark_texts(self, texts: Iterable[str], benchmark: str) -> int:
        added = 0
        for t in texts:
            for g in _ngrams(t, self.ngram):
                if g not in self._index:
                    self._index[g] = benchmark
                    added += 1
        return added

    def is_contaminated(self, ex: Example) -> Tuple[bool, str]:
        for g in _ngrams(ex.normalized_text, self.ngram):
            bench = self._index.get(g)
            if bench is not None:
                return True, bench
        return False, ""

    def run(self, examples: List[Example]) -> Tuple[List[Example], DecontReport]:
        report = DecontReport(total=len(examples))
        kept: List[Example] = []
        for ex in examples:
            contaminated, bench = self.is_contaminated(ex)
            if contaminated:
                report.removed += 1
                report.by_benchmark[bench] = report.by_benchmark.get(bench, 0) + 1
            else:
                kept.append(ex)
        return kept, report

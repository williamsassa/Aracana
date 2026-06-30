"""Deduplication: exact + near-duplicate.

Two stages:
  1. Exact dedup on the canonical content hash (sha256 of normalized text).
  2. Near-duplicate dedup with MinHash over word k-shingles, banded LSH to keep
     it near-linear. Pure stdlib (uses hashlib), no datasketch dependency, so it
     runs in the demo and scales to the full corpus.

Near-dup matters for training quality: copy-paste forks of the same solution
inflate a silo's apparent size while teaching the model nothing new and biasing
it toward whatever pattern happens to be duplicated.
"""

from __future__ import annotations

import hashlib
import re
from dataclasses import dataclass
from typing import Dict, List, Set, Tuple

from .schema import Example

_WORD_RE = re.compile(r"\w+")


def _shingles(text: str, k: int = 5) -> Set[str]:
    tokens = _WORD_RE.findall(text.lower())
    if len(tokens) < k:
        return {" ".join(tokens)} if tokens else set()
    return {" ".join(tokens[i:i + k]) for i in range(len(tokens) - k + 1)}


def _hash_int(s: str, seed: int) -> int:
    h = hashlib.blake2b(s.encode("utf-8"), digest_size=8,
                        salt=seed.to_bytes(8, "little")).digest()
    return int.from_bytes(h, "little")


def minhash_signature(text: str, num_perm: int = 64, k: int = 5) -> Tuple[int, ...]:
    sh = _shingles(text, k)
    if not sh:
        return tuple([0] * num_perm)
    sig = []
    for seed in range(num_perm):
        sig.append(min(_hash_int(s, seed) for s in sh))
    return tuple(sig)


def _estimate_jaccard(a: Tuple[int, ...], b: Tuple[int, ...]) -> float:
    if not a:
        return 0.0
    return sum(1 for x, y in zip(a, b) if x == y) / len(a)


@dataclass
class DedupReport:
    total: int = 0
    exact_removed: int = 0
    near_removed: int = 0

    @property
    def kept(self) -> int:
        return self.total - self.exact_removed - self.near_removed

    def as_text(self) -> str:
        return (f"DEDUP: total={self.total} exact_removed={self.exact_removed} "
                f"near_removed={self.near_removed} kept={self.kept}")


class Deduplicator:
    def __init__(self, num_perm: int = 64, bands: int = 16,
                 jaccard_threshold: float = 0.85, k: int = 5) -> None:
        assert num_perm % bands == 0, "num_perm must be divisible by bands"
        self.num_perm = num_perm
        self.bands = bands
        self.rows = num_perm // bands
        self.threshold = jaccard_threshold
        self.k = k

    def run(self, examples: List[Example]) -> Tuple[List[Example], DedupReport]:
        report = DedupReport(total=len(examples))

        # Stage 1: exact
        seen_hash: Set[str] = set()
        stage1: List[Example] = []
        for ex in examples:
            if not ex.content_hash:
                ex.compute_hash()
            if ex.content_hash in seen_hash:
                report.exact_removed += 1
                continue
            seen_hash.add(ex.content_hash)
            stage1.append(ex)

        # Stage 2: near-dup via banded LSH
        signatures = [minhash_signature(ex.normalized_text, self.num_perm, self.k)
                      for ex in stage1]
        buckets: Dict[Tuple[int, Tuple[int, ...]], List[int]] = {}
        removed: Set[int] = set()

        for idx, sig in enumerate(signatures):
            if idx in removed:
                continue
            candidates: Set[int] = set()
            for b in range(self.bands):
                band = sig[b * self.rows:(b + 1) * self.rows]
                key = (b, band)
                bucket = buckets.setdefault(key, [])
                candidates.update(j for j in bucket if j not in removed)
                bucket.append(idx)
            for j in candidates:
                if _estimate_jaccard(sig, signatures[j]) >= self.threshold:
                    removed.add(idx)
                    report.near_removed += 1
                    break

        kept = [ex for i, ex in enumerate(stage1) if i not in removed]
        return kept, report

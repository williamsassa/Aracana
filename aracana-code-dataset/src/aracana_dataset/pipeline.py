"""End-to-end orchestrator: verify -> dedup -> decontaminate -> standardize ->
balance -> write. Each stage is checkpointed and produces a human-readable
report. Re-runnable and resumable: every stage reads/writes JSONL on disk.
"""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List

from .decontaminate import Decontaminator
from .dedup import Deduplicator
from .schema import Example, Silo
from .silos import TARGET_109K, balance, standardize, total_target
from .verify import Verifier, VerifyConfig


@dataclass
class PipelineConfig:
    out_dir: Path = Path("data/final")
    checkpoint_dir: Path = Path("data/processed")
    verify: VerifyConfig = field(default_factory=VerifyConfig)
    target: Dict[Silo, Dict[str, int]] = field(default_factory=lambda: TARGET_109K)
    seed: int = 42
    write_checkpoints: bool = True  # off for big/low-disk runs (final only)


def write_jsonl(path: Path, examples: List[Example]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as f:
        for ex in examples:
            f.write(ex.to_jsonl() + "\n")


def read_jsonl(path: Path) -> List[Example]:
    out: List[Example] = []
    with path.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                out.append(Example.from_dict(json.loads(line)))
    return out


def composition_report(examples: List[Example]) -> Dict:
    by_silo: Dict[str, int] = {}
    by_sub: Dict[str, int] = {}
    weights: List[float] = []
    licenses: Dict[str, int] = {}
    for ex in examples:
        by_silo[ex.silo.value] = by_silo.get(ex.silo.value, 0) + 1
        key = f"{ex.silo.value}/{ex.subcategory}"
        by_sub[key] = by_sub.get(key, 0) + 1
        weights.append(ex.causal_weight)
        licenses[ex.license] = licenses.get(ex.license, 0) + 1
    return {
        "total": len(examples),
        "by_silo": by_silo,
        "by_subcategory": by_sub,
        "by_license": licenses,
        "causal_weight": {
            "min": min(weights) if weights else 0,
            "max": max(weights) if weights else 0,
            "mean": round(sum(weights) / len(weights), 3) if weights else 0,
        },
    }


class Pipeline:
    def __init__(self, config: PipelineConfig | None = None,
                 decontaminator: Decontaminator | None = None) -> None:
        self.cfg = config or PipelineConfig()
        self.verifier = Verifier(self.cfg.verify)
        self.deduper = Deduplicator()
        self.decon = decontaminator or Decontaminator()
        self.logs: List[str] = []

    def _log(self, msg: str) -> None:
        self.logs.append(msg)
        print(msg, flush=True)

    def _ckpt(self, name: str, kept: List[Example]) -> None:
        if self.cfg.write_checkpoints:
            write_jsonl(self.cfg.checkpoint_dir / name, kept)

    def run(self, examples: List[Example]) -> List[Example]:
        self._log(f"\n[0] ingested: {len(examples)}  (target corpus = "
                  f"{total_target(self.cfg.target):,})")

        kept, vreport = self.verifier.verify(examples)
        self._log("\n[1] " + vreport.as_text())
        self._ckpt("01_verified.jsonl", kept)

        kept, dreport = self.deduper.run(kept)
        self._log("\n[2] " + dreport.as_text())
        self._ckpt("02_deduped.jsonl", kept)

        kept, creport = self.decon.run(kept)
        self._log("\n[3] " + creport.as_text())
        self._ckpt("03_decontaminated.jsonl", kept)

        kept = [standardize(ex) for ex in kept]
        self._log(f"\n[4] standardized + causal-weighted: {len(kept)}")
        self._ckpt("04_standardized.jsonl", kept)

        final, breport = balance(kept, self.cfg.target, self.cfg.seed)
        self._log("\n[5] " + breport.as_text())

        out_path = self.cfg.out_dir / "aracana_code_dataset.jsonl"
        write_jsonl(out_path, final)
        report = composition_report(final)
        rep_path = self.cfg.out_dir / "composition_report.json"
        rep_path.parent.mkdir(parents=True, exist_ok=True)
        rep_path.write_text(json.dumps(report, indent=2, ensure_ascii=False),
                            encoding="utf-8")
        (self.cfg.out_dir / "pipeline_log.txt").write_text(
            "\n".join(self.logs), encoding="utf-8")

        self._log(f"\n[DONE] {len(final):,} examples -> {out_path}")
        self._log(f"        composition -> {rep_path}")
        return final

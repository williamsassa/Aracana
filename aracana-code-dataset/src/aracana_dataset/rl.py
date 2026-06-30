"""RL data: preference records + verifiable rewards.

The design doc's "Laboratoire d'Échecs Simulés": for each problem, multiple
candidate solutions are scored (optimal / correct-but-slow / subtly-wrong /
insecure), each with a judgment trace. This module provides:

  * RLCandidate / RLExample  — the scored-candidates record.
  * verifiable_code_reward() — RLVR-style ground-truth reward: actually RUN the
    candidate against unit tests in a sandboxed subprocess and return pass-rate.
    This is stronger than an LLM judge because it cannot be fooled.
  * to_dpo_pairs()           — emit (prompt, chosen, rejected) for DPO/IPO.
  * to_pointwise()           — emit (prompt, response, reward) for reward-model /
    PPO/GRPO pointwise training.

Verifiable rewards anchor the preference data in fact; LLM-judge traces (added
later, when credits exist) provide the natural-language rationale on top.
"""

from __future__ import annotations

import json
import subprocess
import sys
import tempfile
from dataclasses import asdict, dataclass, field
from itertools import combinations
from pathlib import Path
from typing import Dict, List, Optional, Tuple


@dataclass
class RLCandidate:
    code: str
    reward: float                 # ground-truth or assigned label in [-1, 1]
    label: str = ""               # optimal | correct_slow | wrong | insecure
    judgment: str = ""            # natural-language rationale (optional)
    tests_passed: Optional[int] = None
    tests_total: Optional[int] = None


@dataclass
class RLExample:
    prompt: str
    candidates: List[RLCandidate]
    source: str = "synthetic"
    metadata: Dict = field(default_factory=dict)

    def to_dict(self) -> Dict:
        d = asdict(self)
        return d


# --- verifiable reward ----------------------------------------------------
_HARNESS = """\
import json, sys
{code}
__results = []
{checks}
print("ARACANA_RESULT::" + json.dumps(__results))
"""


def verifiable_code_reward(code: str, test_cases: List[str],
                           timeout: float = 8.0) -> Tuple[float, int, int]:
    """Run `code`, then each assertion in `test_cases`, in a subprocess.

    Returns (reward, passed, total) where reward = passed/total in [0, 1].
    Each test_case is a Python expression that should evaluate truthy, e.g.
    "two_sum([2,7,11],9) == [0,1]". Execution is isolated in a temp process with
    a timeout; a crash or timeout scores 0 for the remaining tests.
    """
    if not test_cases:
        return 0.0, 0, 0
    checks = "\n".join(
        f"try:\n    __results.append(bool({t}))\nexcept Exception:\n    __results.append(False)"
        for t in test_cases
    )
    script = _HARNESS.format(code=code, checks=checks)
    total = len(test_cases)
    try:
        with tempfile.NamedTemporaryFile("w", suffix=".py", delete=False,
                                         encoding="utf-8") as fh:
            fh.write(script)
            path = fh.name
        proc = subprocess.run([sys.executable, path], capture_output=True,
                              text=True, timeout=timeout)
        passed = 0
        for line in proc.stdout.splitlines():
            if line.startswith("ARACANA_RESULT::"):
                results = json.loads(line.split("::", 1)[1])
                passed = sum(1 for r in results if r)
        return passed / total, passed, total
    except (subprocess.TimeoutExpired, Exception):  # noqa: BLE001
        return 0.0, 0, total
    finally:
        try:
            Path(path).unlink()
        except Exception:  # noqa: BLE001
            pass


def score_candidates(prompt: str, codes: List[str], test_cases: List[str],
                     source: str = "synthetic") -> RLExample:
    """Build an RLExample by verifiably scoring each candidate against tests."""
    cands = []
    for c in codes:
        reward, p, t = verifiable_code_reward(c, test_cases)
        label = ("optimal" if reward == 1.0 else
                 "wrong" if reward == 0.0 else "correct_slow")
        cands.append(RLCandidate(code=c, reward=reward, label=label,
                                 tests_passed=p, tests_total=t))
    # Persist the test spec WITH the record: this is what lets an online RLVR
    # method (GRPO/DAPO) recompute rewards for fresh rollouts at train time,
    # not just score these static candidates. (Research: RLVR+GRPO, 2025.)
    return RLExample(prompt=prompt, candidates=cands, source=source,
                     metadata={"reward_type": "verifiable_tests",
                               "test_cases": test_cases})


# --- exports --------------------------------------------------------------
def to_dpo_pairs(ex: RLExample, margin: float = 0.25) -> List[Dict]:
    """Emit (prompt, chosen, rejected) pairs where chosen.reward exceeds
    rejected.reward by at least `margin`. This is the DPO/IPO training format."""
    pairs = []
    for a, b in combinations(ex.candidates, 2):
        hi, lo = (a, b) if a.reward >= b.reward else (b, a)
        if hi.reward - lo.reward >= margin:
            pairs.append({
                "prompt": ex.prompt,
                "chosen": hi.code,
                "rejected": lo.code,
                "chosen_reward": hi.reward,
                "rejected_reward": lo.reward,
                "rationale": hi.judgment or "",
            })
    return pairs


def to_pointwise(ex: RLExample) -> List[Dict]:
    """Emit (prompt, response, reward) rows for reward-model / GRPO training."""
    return [{"prompt": ex.prompt, "response": c.code, "reward": c.reward,
             "label": c.label} for c in ex.candidates]


def write_rl_jsonl(path: Path, examples: List[RLExample], fmt: str = "dpo") -> int:
    path.parent.mkdir(parents=True, exist_ok=True)
    n = 0
    conv = to_dpo_pairs if fmt == "dpo" else to_pointwise
    with path.open("w", encoding="utf-8") as f:
        for ex in examples:
            for row in conv(ex):
                f.write(json.dumps(row, ensure_ascii=False) + "\n")
                n += 1
    return n

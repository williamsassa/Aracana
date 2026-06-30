"""Tests for the SFT (token causal weighting) and RL (verifiable reward) modules.

Grounded in: Rho-1 selective LM (token weighting) and RLVR+GRPO (verifiable
unit-test rewards). Pure stdlib + subprocess; runnable offline.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from aracana_dataset.causal_tokens import (  # noqa: E402
    weight_python_block, weights_for_offsets)
from aracana_dataset.rl import (  # noqa: E402
    score_candidates, to_dpo_pairs, to_pointwise, verifiable_code_reward)

NESTED = ("def f(xs):\n"
          "    # comment\n"
          "    for i in range(len(xs)):\n"
          "        for j in range(len(xs)):\n"
          "            if xs[i] > xs[j]:\n"
          "                swap(xs, i, j)\n"
          "    return xs")


def test_loop_depth_scaling():
    spans = weight_python_block(NESTED)
    cf = sorted(s.weight for s in spans if s.kind == "control_flow")
    # three control nodes at depths 0,1,2 -> 3.0, 4.5, 6.0
    assert cf == [3.0, 4.5, 6.0]


def test_comment_downweighted_def_up():
    spans = weight_python_block(NESTED)
    assert any(s.kind == "comment" and s.weight == 0.1 for s in spans)
    assert any(s.kind == "definition" and s.weight == 2.0 for s in spans)


def test_offsets_alignment():
    spans = weight_python_block(NESTED)
    # char offset inside the deepest 'if' line should map to weight 6.0
    if_idx = NESTED.index("if xs[i]")
    w = weights_for_offsets(spans, [(if_idx, if_idx + 2)])
    assert w[0] == 6.0


def test_verifiable_reward_correct_vs_wrong():
    good = "def add(a,b):\n    return a+b"
    bad = "def add(a,b):\n    return a-b"
    tests = ["add(2,3)==5", "add(0,0)==0", "add(-1,1)==0"]
    rg, pg, tg = verifiable_code_reward(good, tests)
    rb, pb, tb = verifiable_code_reward(bad, tests)
    assert rg == 1.0 and pg == 3
    assert rb < 1.0


def test_reward_handles_crash_safely():
    crashes = "def add(a,b):\n    raise RuntimeError('boom')"
    r, p, t = verifiable_code_reward(crashes, ["add(1,2)==3"])
    assert r == 0.0 and p == 0


def test_dpo_and_pointwise_export():
    good = "def m(a,b):\n    return max(a,b)"
    bad = "def m(a,b):\n    return min(a,b)"
    tests = ["m(1,2)==2", "m(5,3)==5"]
    ex = score_candidates("max of two", [good, bad], tests)
    pairs = to_dpo_pairs(ex)
    assert len(pairs) == 1 and pairs[0]["chosen"] == good
    assert len(to_pointwise(ex)) == 2
    assert ex.metadata["test_cases"] == tests  # online-GRPO spec carried


if __name__ == "__main__":
    import traceback
    fns = [v for k, v in sorted(globals().items()) if k.startswith("test_")]
    passed = 0
    for fn in fns:
        try:
            fn(); passed += 1; print(f"PASS {fn.__name__}")
        except Exception:  # noqa: BLE001
            print(f"FAIL {fn.__name__}"); traceback.print_exc()
    print(f"\n{passed}/{len(fns)} passed")
    sys.exit(0 if passed == len(fns) else 1)

"""Stage-level tests. Pure stdlib + pytest; no network, no heavy deps.

Run:  python -m pytest tests/ -q     (or: python tests/test_pipeline.py)
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from aracana_dataset import (  # noqa: E402
    Decontaminator, Deduplicator, Silo, Verifier, make_example,
    compute_causal_weight, minhash_signature,
)
from aracana_dataset.dedup import _estimate_jaccard  # noqa: E402


def _good_code():
    return make_example(
        user="Sum a list in O(n).",
        assistant=("Iterate once and accumulate; this is linear.\n\n"
                   "```python\ndef total(xs):\n    s = 0\n    for x in xs:\n"
                   "        s += x\n    return s\n```\n\n"
                   "Complexity O(n): each element is added exactly once, so the "
                   "running time grows linearly with the input length. There is no "
                   "nested iteration and no hidden quadratic cost, the accumulator "
                   "uses constant extra space, and the same single-pass structure "
                   "generalises to any associative reduction such as product, min "
                   "or max without changing the asymptotic complexity at all."),
        silo=Silo.CODE, subcategory="algorithmic", source="t",
        metadata={"type": "code", "complexity": "O(n)"})


# --- schema ---------------------------------------------------------------
def test_example_roundtrip():
    ex = _good_code()
    from aracana_dataset import Example
    assert Example.from_dict(ex.to_dict()).normalized_text == ex.normalized_text
    assert ex.id and ex.content_hash


# --- verify ---------------------------------------------------------------
def test_verifier_accepts_good():
    kept, rep = Verifier().verify([_good_code()])
    assert len(kept) == 1 and rep.passed == 1


def test_verifier_rejects_bad_syntax():
    ex = make_example(
        user="broken", assistant="```python\ndef f(:\n  pass\n```\n" + "word " * 70,
        silo=Silo.CODE, subcategory="algorithmic", source="t",
        metadata={"type": "code", "complexity": "O(n)"})
    kept, rep = Verifier().verify([ex])
    assert not kept and "invalid_python_syntax" in rep.failed


def test_verifier_rejects_trivial_and_short():
    short = make_example(user="hi", assistant="too short", silo=Silo.CODE,
                         subcategory="algorithmic", source="t",
                         metadata={"type": "code", "complexity": "O(n)"})
    kept, rep = Verifier().verify([short])
    assert not kept


def test_verifier_rejects_bad_subcategory():
    ex = _good_code()
    ex.subcategory = "not_a_real_sub"
    kept, rep = Verifier().verify([ex])
    assert not kept and any("bad_subcategory" in k for k in rep.failed)


def test_terminal_requires_state():
    ex = make_example(
        user="run it", assistant=("Here is the fix.\n$ ls\n> files\n" + "word " * 70),
        silo=Silo.TERMINAL, subcategory="shell_simple", source="t",
        metadata={"type": "terminal"})
    kept, rep = Verifier().verify([ex])
    assert not kept and "terminal_missing_state_annotation" in rep.failed


# --- dedup ----------------------------------------------------------------
def test_exact_dedup():
    a, b = _good_code(), _good_code()
    kept, rep = Deduplicator().run([a, b])
    assert len(kept) == 1 and rep.exact_removed == 1


def test_minhash_tracks_jaccard():
    t1 = "the quick brown fox jumps over the lazy dog near the river bank"
    t2 = "the quick brown fox jumps over the lazy dog near the river side"
    est = _estimate_jaccard(minhash_signature(t1), minhash_signature(t2))
    assert est > 0.5  # highly similar texts -> high estimated jaccard


# --- decontaminate --------------------------------------------------------
def test_decontamination_removes_leak():
    leak_text = ("compute the maximal subarray sum using kadane dynamic "
                 "programming in linear time for the hidden official test set today")
    ex = make_example(user="solve", assistant=leak_text + "\n\n```python\nx=1\n```\n"
                      + "word " * 70, silo=Silo.CODE, subcategory="algorithmic",
                      source="t", metadata={"type": "code", "complexity": "O(n)"})
    decon = Decontaminator(ngram=8)
    decon.add_benchmark_texts([leak_text], benchmark="canary")
    kept, rep = decon.run([ex])
    assert not kept and rep.by_benchmark.get("canary") == 1


# --- causal weight --------------------------------------------------------
def test_causal_weight_bounds_and_boost():
    ex = _good_code()
    w = compute_causal_weight(ex)
    assert 1.0 <= w <= 4.0 and w > 1.0  # has control flow -> boosted


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

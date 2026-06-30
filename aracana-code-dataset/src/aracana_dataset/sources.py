"""HuggingFace source adapters.

These convert raw public datasets into canonical :class:`Example` objects. They
are written to be run *by you*, on a machine with the storage/bandwidth for it,
with your OWN credentials supplied via environment variable:

    PowerShell:  $env:HF_TOKEN = "hf_..."     # never paste a token into a prompt
    bash:        export HF_TOKEN=hf_...

`datasets` is an optional dependency: importing this module never fails, but
calling a loader without `datasets` installed raises a clear error. This keeps
the core pipeline (and the test suite) dependency-free while making real
ingestion a one-liner once you install `pip install datasets`.

Licensing note: each adapter records the dataset's license so the verifier's
`require_license` mode and any redistribution audit can rely on it. You are
responsible for honouring each source license.
"""

from __future__ import annotations

import os
from typing import Iterator, List, Optional

from .schema import Example, Silo, make_example


def _require_datasets():
    try:
        import datasets  # noqa: F401
        return datasets
    except ImportError as e:  # pragma: no cover - environment dependent
        raise RuntimeError(
            "The `datasets` package is required for HF ingestion. Install it "
            "with `pip install datasets`, then set HF_TOKEN in your environment."
        ) from e


def _hf_token() -> Optional[str]:
    return os.environ.get("HF_TOKEN") or os.environ.get("HUGGINGFACE_TOKEN")


# Map of recommended public sources -> (silo, subcategory, license). These are
# the *real, non-gated-where-possible* analogues of the spec's wishlist. Swap in
# the exact datasets your license review approves.
RECOMMENDED_SOURCES = {
    "deepmind/code_contests": (Silo.CODE, "algorithmic", "apache-2.0"),
    "codeparrot/apps": (Silo.CODE, "algorithmic", "mit"),
    "bigcode/the-stack-smol": (Silo.CODE, "optimisation", "various-permissive"),
    "SWE-bench/SWE-bench": (Silo.CODE, "swe_bench", "mit"),
    "nvidia/OpenCodeReasoning": (Silo.CODE, "algorithmic", "cc-by-4.0"),
    "EleutherAI/hendrycks_math": (Silo.MATH, "competition", "mit"),
    "open-r1/OpenR1-Math-220k": (Silo.MATH, "proofs", "apache-2.0"),
    "Salesforce/xlam-function-calling-60k": (Silo.AGENTIC, "tool_use", "cc-by-4.0"),
}


def iter_hf_generic(
    repo: str,
    silo: Silo,
    subcategory: str,
    *,
    license: str = "unknown",
    split: str = "train",
    limit: Optional[int] = None,
    prompt_field: str = "question",
    answer_field: str = "solution",
) -> Iterator[Example]:
    """Generic streaming adapter for question/answer-shaped datasets.

    Real datasets vary in their field names; pass `prompt_field`/`answer_field`
    accordingly. Streaming keeps memory flat regardless of corpus size.
    """
    datasets = _require_datasets()
    ds = datasets.load_dataset(
        repo, split=split, streaming=True, token=_hf_token(),
        trust_remote_code=False,
    )
    n = 0
    for row in ds:
        prompt = row.get(prompt_field)
        answer = row.get(answer_field)
        if not prompt or not answer:
            continue
        is_code = silo in (Silo.CODE,)
        yield make_example(
            user=str(prompt),
            assistant=str(answer),
            silo=silo,
            subcategory=subcategory,
            source=repo,
            license=license,
            metadata={"type": "code" if is_code else silo.value},
        )
        n += 1
        if limit and n >= limit:
            break


def load_recommended(repo: str, **kwargs) -> List[Example]:
    """Convenience wrapper using RECOMMENDED_SOURCES metadata."""
    if repo not in RECOMMENDED_SOURCES:
        raise KeyError(f"{repo} not in RECOMMENDED_SOURCES; use iter_hf_generic.")
    silo, sub, lic = RECOMMENDED_SOURCES[repo]
    return list(iter_hf_generic(repo, silo, sub, license=lic, **kwargs))

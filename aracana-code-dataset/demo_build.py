#!/usr/bin/env python3
"""Runnable end-to-end demo.

Generates a small but *genuinely valid* multi-silo sample, injects a duplicate
and a benchmark-contaminated item on purpose, then runs the full pipeline so you
can watch verification / dedup / decontamination / balancing actually fire and
emit training-ready JSONL.

Run:  python demo_build.py
This is the scale-down of the real build: swap `seed_examples()` for the HF
source adapters in `aracana_dataset.sources` and raise the targets to 109K.
"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent / "src"))

from aracana_dataset import (  # noqa: E402
    Decontaminator, Pipeline, PipelineConfig, Silo, make_example,
)
from aracana_dataset.silos import TARGET_109K  # noqa: E402

CODE_SYS = "You are an elite agentic software engineer."


def seed_examples():
    ex = []

    # --- CODE / algorithmic: valid python, non-trivial complexity ---------
    ex.append(make_example(
        user="Implement an O(n) two-sum returning indices.",
        assistant=(
            "I keep a hash map from value to index so each lookup is O(1), "
            "giving O(n) overall instead of the O(n^2) brute force.\n\n"
            "```python\n"
            "def two_sum(nums, target):\n"
            "    seen = {}\n"
            "    for i, x in enumerate(nums):\n"
            "        if target - x in seen:\n"
            "            return [seen[target - x], i]\n"
            "        seen[x] = i\n"
            "    return []\n"
            "```\n\n"
            "Complexity: O(n) time, O(n) space. Each element is visited once and "
            "membership tests on a dict are amortised O(1)."
        ),
        silo=Silo.CODE, subcategory="algorithmic", source="seed/handwritten",
        license="cc-by-4.0", metadata={"type": "code", "complexity": "O(n)"},
    ))

    # --- CODE / swe_bench-flavoured patch reasoning -----------------------
    ex.append(make_example(
        user="A test fails because parse_date mishandles single-digit days. Fix it.",
        assistant=(
            "The bug: the format string uses %-d which is non-portable. I switch "
            "to zero-padded parsing and normalise input first.\n\n"
            "```python\n"
            "from datetime import datetime\n"
            "def parse_date(s):\n"
            "    s = s.strip()\n"
            "    for fmt in ('%Y-%m-%d', '%Y-%-d-%m'):\n"
            "        try:\n"
            "            return datetime.strptime(s, '%Y-%m-%d').date()\n"
            "        except ValueError:\n"
            "            continue\n"
            "    raise ValueError(f'unparseable date: {s!r}')\n"
            "```\n\n"
            "Now single-digit days parse because strptime accepts unpadded values "
            "for %d, and the explicit ValueError preserves the contract. "
            "Complexity O(1) per call but this is a correctness fix, not a hot path."
        ),
        silo=Silo.CODE, subcategory="swe_bench", source="seed/handwritten",
        license="mit", metadata={"type": "code", "complexity": "O(n^2)"},
    ))

    # --- TERMINAL / shell_agentic: STATE/COST annotations -----------------
    ex.append(make_example(
        user="Web app returns 502 after midnight. Diagnose and fix.",
        assistant=(
            "# STATE: nginx=up, upstream=unknown | # COST: O(1)\n"
            "$ systemctl status app.service\n"
            "> Active: failed (Result: exit-code) since 00:00:11\n"
            "# STATE: app=failed | # COST: O(1)\n"
            "$ journalctl -u app.service --since '00:00' | tail -n 20\n"
            "> SSLError: certificate expired\n"
            "# STATE: cause=cert_expired | # COST: O(1)\n"
            "$ openssl x509 -enddate -noout -in /etc/ssl/app.pem\n"
            "> notAfter=Jun 27 00:00:00 2026 GMT\n"
            "# STATE: action=renew | # COST: O(1)\n"
            "$ certbot renew --force-renewal && systemctl restart app.service\n"
            "> Congratulations, all renewals succeeded. app.service restarted.\n"
            "# STATE: app=up, cause=resolved | # COST: O(1)\n"
            "$ curl -s -o /dev/null -w '%{http_code}' https://localhost/health\n"
            "> 200\n\n"
            "Root cause was an expired TLS certificate that the app loads at "
            "startup; renewal plus a restart restored service and the health "
            "probe confirms recovery."
        ),
        silo=Silo.TERMINAL, subcategory="shell_agentic", source="seed/handwritten",
        license="cc-by-4.0", metadata={"type": "terminal"},
    ))

    # --- MATH / competition: CoT with explicit steps ----------------------
    ex.append(make_example(
        user="Find the number of positive divisors of 360.",
        assistant=(
            "Step 1: Factorise. 360 = 2^3 * 3^2 * 5^1.\n"
            "Step 2: Use the divisor-count formula: for n = p1^a1 * ... * pk^ak, "
            "the number of divisors is (a1+1)(a2+1)...(ak+1).\n"
            "Step 3: Substitute the exponents: (3+1)(2+1)(1+1) = 4 * 3 * 2.\n"
            "Step 4: Multiply: 4 * 3 * 2 = 24.\n\n"
            "Therefore 360 has exactly 24 positive divisors. As a sanity check, "
            "the formula counts every divisor exactly once because each divisor "
            "corresponds to an independent choice of exponent for each prime in "
            "the range 0 to that prime's exponent, and these choices multiply."
        ),
        silo=Silo.MATH, subcategory="competition", source="seed/handwritten",
        license="mit", metadata={"type": "math", "cot": True},
    ))

    # --- LONG_CONTEXT / codebase reasoning --------------------------------
    ex.append(make_example(
        user=("Given modules auth.py (issues JWT), middleware.py (validates JWT) "
              "and routes.py (uses request.user), explain how a forged token is "
              "rejected end to end."),
        assistant=(
            "The chain has three links. In auth.py the token is signed with the "
            "server secret via HMAC-SHA256, so the signature binds the payload to "
            "a secret an attacker does not hold. In middleware.py every request "
            "passes through validate_jwt, which recomputes the HMAC over the "
            "received header+payload and compares it in constant time to the "
            "received signature; a forged token fails this comparison and the "
            "middleware raises 401 before any handler runs. Because routes.py only "
            "ever reads request.user, which middleware sets *after* successful "
            "validation, a forged token never reaches application logic. The single "
            "load-bearing invariant is that request.user is unset unless the "
            "signature verified, so the forgery is rejected at the middleware "
            "boundary rather than deep in a handler."
        ),
        silo=Silo.LONG_CONTEXT, subcategory="codebase", source="seed/handwritten",
        license="cc-by-4.0", metadata={"type": "long_context"},
    ))

    # --- AGENTIC / tool_use -----------------------------------------------
    ex.append(make_example(
        user="What is the current weather in Paris in Celsius? Use the tools.",
        assistant=(
            "Step 1: I need live data, so I call the geocoding tool to resolve the "
            "city to coordinates.\n"
            "geocode(city='Paris') -> {lat: 48.8566, lon: 2.3522}\n"
            "Step 2: With coordinates I call the weather tool, requesting metric "
            "units so the result is already in Celsius.\n"
            "get_weather(lat=48.8566, lon=2.3522, units='metric') -> {temp_c: 19.4}\n"
            "Step 3: I have everything needed; no further calls are warranted.\n\n"
            "The current temperature in Paris is 19.4 degrees Celsius."
        ),
        silo=Silo.AGENTIC, subcategory="tool_use", source="seed/handwritten",
        license="cc-by-4.0", metadata={"type": "agentic", "cot": True},
    ))

    # --- DELIBERATE near-duplicate of the two-sum example (dedup target) --
    # A real crawl near-dup: identical solution, only cosmetic whitespace and a
    # one-word edit. This is exactly what the MinHash stage exists to catch.
    ex.append(make_example(
        user="Implement an O(n) two-sum returning indices.",
        assistant=(
            "I keep a hash map from value to index so each lookup is O(1), "
            "giving O(n) overall instead of the O(n^2) brute force.\n\n"
            "```python\n"
            "def two_sum(nums, target):\n"
            "    seen = {}\n"
            "    for i, x in enumerate(nums):\n"
            "        if target - x in seen:\n"
            "            return [seen[target - x], i]\n"
            "        seen[x] = i\n"
            "    return []\n"
            "```\n\n"
            "Complexity: O(n) time, O(n) space. Each element is visited once and "
            "membership tests on a dict are amortized O(1)."  # US spelling only
        ),
        silo=Silo.CODE, subcategory="algorithmic", source="seed/duplicate",
        license="cc-by-4.0", metadata={"type": "code", "complexity": "O(n)"},
    ))

    # --- DELIBERATE benchmark-contaminated item (decon target) ------------
    ex.append(make_example(
        user="Solve this contest problem.",
        assistant=(
            "CONTAMINATION CANARY: the quick brown fox jumps over the lazy dog "
            "while computing the maximal subarray sum using kadane dynamic "
            "programming in linear time for the official hidden test set.\n\n"
            "```python\n"
            "def kadane(a):\n"
            "    best = cur = a[0]\n"
            "    for x in a[1:]:\n"
            "        cur = max(x, cur + x)\n"
            "        best = max(best, cur)\n"
            "    return best\n"
            "```\n\n"
            "This runs in O(n) time, the standard linear scan for maximum subarray."
        ),
        silo=Silo.CODE, subcategory="algorithmic", source="seed/leak",
        license="mit", metadata={"type": "code", "complexity": "O(n)"},
    ))

    return ex


def main():
    examples = seed_examples()

    # Simulate the eval suite's hidden test corpus for decontamination.
    decon = Decontaminator(ngram=8)
    decon.add_benchmark_texts(
        ["the quick brown fox jumps over the lazy dog while computing the "
         "maximal subarray sum using kadane dynamic programming in linear time "
         "for the official hidden test set"],
        benchmark="LiveCodeBench-canary",
    )

    # Small targets so the demo balances without needing 109K of data.
    demo_target = {silo: {sub: 100 for sub in subs}
                   for silo, subs in TARGET_109K.items()}

    cfg = PipelineConfig(
        out_dir=Path("data/final"),
        checkpoint_dir=Path("data/processed"),
        target=demo_target,
    )
    Pipeline(cfg, decontaminator=decon).run(examples)


if __name__ == "__main__":
    main()

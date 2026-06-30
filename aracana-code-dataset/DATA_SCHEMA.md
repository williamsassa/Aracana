# ARACANA-Code — End-to-End Data Route & Schemas

Research-grounded design for an SFT+RL corpus that boosts a 3B coding model.
Citations: **Rho-1 / Selective LM** (token weighting), **RLVR + GRPO** (verifiable
rewards), **GPT-3 13-gram** (decontamination convention).

## 0. The route (bout en bout)

```
                 RAW SOURCES (HF, streamed)              EVAL BENCHMARKS (test splits)
                 code · math · (synth: term/agent)       LiveCodeBench/SWE/GAIA/BFCL/...
                          │                                        │
                          ▼                                        ▼  (decon index only)
   ┌──────────┐   ┌──────────────┐   ┌──────────┐   ┌───────────────────┐   ┌──────────────┐
   │ INGEST   │──▶│  VERIFY (9)  │──▶│  DEDUP   │──▶│ DECONTAMINATE 13g │──▶│ STANDARDIZE  │
   │ canonical│   │ struct/syntax│   │ exact +  │   │ drop test leaks   │   │ chat + causal│
   │ Example  │   │ cot/term/len │   │ MinHash  │   │ (release gate)    │   │ weight       │
   └──────────┘   └──────────────┘   └──────────┘   └───────────────────┘   └──────┬───────┘
                                                                                    ▼
                              ┌───────────────────────────────┬─────────────────────────────┐
                              ▼                                ▼                             ▼
                      ┌───────────────┐              ┌──────────────────┐          ┌──────────────────┐
                      │  SFT JSONL    │              │ TOKEN WEIGHTS    │          │   RL JSONL       │
                      │ messages[]    │   +AST  ───▶ │ per-token causal │          │ DPO pairs +      │
                      │ +causal_weight│              │ (Rho-1 style)    │          │ pointwise + tests│
                      └───────────────┘              └──────────────────┘          └──────────────────┘
```

## 1. Canonical record (every example, all silos) — `schema.py`

```json
{
  "id": "code-1a2b3c4d5e6f7890",
  "messages": [
    {"role": "system",    "content": "You are an elite agentic software engineer..."},
    {"role": "user",      "content": "<task>"},
    {"role": "assistant", "content": "<reasoning + code + (terminal/CoT)>"}
  ],
  "silo": "code", "subcategory": "algorithmic",
  "source": "ise-uiuc/Magicoder-Evol-Instruct-110K",
  "license": "unverified:<repo>",
  "metadata": {"type": "code", "complexity": "O(n)", "cot": false},
  "quality": {},
  "causal_weight": 1.5,
  "content_hash": "<sha256 of normalized text>"
}
```

Why these fields: `source`+`license` = provenance/audit; `silo`/`subcategory` =
taxonomy the balancer enforces; `metadata.type` drives the type-specific verifier
checks; `causal_weight` = example-level loss weight; `content_hash` = dedup key.

## 2. Per-silo `assistant` shape (concrete)

- **code/algorithmic**: rationale → fenced `python` block (must parse) → explicit
  complexity statement (no `O(1)` trivial).
- **terminal/shell_agentic**: every command line preceded by
  `# STATE: <component>=<state> | # COST: O(...)`, with realistic simulated output,
  progressing symptom → hypothesis → check → fix → validate.
- **math/competition**: `Step 1: … Step N:` CoT (≥3 steps) → boxed final answer.
- **long_context/codebase**: cross-file causal explanation naming the single
  load-bearing invariant.
- **agentic/{tool_use,deep_search}**: `Step N:` + explicit `tool(args) -> result`
  turns ending in a synthesised answer.

## 3. SFT signal: token-level causal weighting — `causal_tokens.py`

Per **Rho-1** ("Not All Tokens Are What You Need", NeurIPS'24): not every token
deserves equal loss. We compute weights from the **Python AST** (transparent,
deterministic prior), scaled by loop depth:

| token kind | weight | rationale |
|---|---|---|
| control flow (`if/for/while/try/with/match`) | 3.0 × (1+0.5·loop_depth) | drives behaviour |
| definitions (`def/class`) | 2.0 | structure |
| calls / attribute access | 1.5 | causal edges |
| comments / docstrings | 0.1 | low causal load |
| default prose/code | 1.0 | — |

Output = `(span, weight)` intervals → map onto your tokenizer offsets with
`weights_for_offsets`. **Upgrade hook**: combine with a Rho-1 reference-model
excess-loss score (`w_final = w_ast * w_reference`) for the learned variant.

Training loss:
```python
loss = (F.cross_entropy(logits, labels, reduction="none") * token_weights).mean()
```

## 4. RL signal: verifiable rewards — `rl.py`

Per **RLVR + GRPO** (2025-dominant for code): reward = run unit tests, not an LLM
judge. Record:

```json
{
  "prompt": "Write two_sum(nums,target)...",
  "candidates": [
    {"code": "...", "reward": 1.0, "label": "optimal",     "tests_passed": 3, "tests_total": 3},
    {"code": "...", "reward": 0.0, "label": "wrong",       "tests_passed": 0, "tests_total": 3}
  ],
  "metadata": {"reward_type": "verifiable_tests", "test_cases": ["two_sum([2,7],9)==[0,1]", "..."]}
}
```
Exports: `to_dpo_pairs()` → `(prompt, chosen, rejected)` for DPO; `to_pointwise()`
→ `(prompt, response, reward)` for reward-model / GRPO. The `test_cases` travel
with the record so **online GRPO can score fresh rollouts** at train time.
*Extension*: add a timing/complexity probe to separate `optimal` from
`correct_slow` (functional tests alone can't).

## 5. Decontamination (release gate) — `decontaminate.py`

13-gram token overlap (GPT-3 convention) against every eval test item; attributed
per benchmark; runs **after** dedup. Eval benchmarks are **decon sources only,
never training data** — this is the line that keeps reported scores honest.

## 6. Balancing & loss priority

`balance()` down-samples each silo/subcategory to target (never fabricates dupes;
shortfalls reported). Example-level `causal_weight` (silos.py) up-weights
SWE/terminal/tool-use/deep-search and high-complexity/CoT — the corpus-level
analogue of the token-level priority in §3.

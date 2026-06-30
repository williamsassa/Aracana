# Wiring real benchmark decontamination

Decontamination is a **release gate**: if a benchmark test item leaks into
training, every reported score is invalid. Before the full build, load the
*actual test splits* of every benchmark in your eval suite and feed their text
to the `Decontaminator`.

```python
from aracana_dataset import Decontaminator
from datasets import load_dataset
import os

decon = Decontaminator(ngram=13)  # 13-gram is the GPT-3/LLaMA convention
tok = os.environ["HF_TOKEN"]

# LiveCodeBench (problem statements of the eval split)
lcb = load_dataset("livecodebench/code_generation_lite", split="test",
                   token=tok, trust_remote_code=False)
decon.add_benchmark_texts((r["question_content"] for r in lcb), "LiveCodeBench")

# SWE-bench (problem statements)
swe = load_dataset("SWE-bench/SWE-bench", split="test", token=tok)
decon.add_benchmark_texts((r["problem_statement"] for r in swe), "SWE-bench")

# HumanEval / MBPP / GSM8K / MATH test prompts + answers ...
# add_benchmark_texts both prompts AND reference answers for each benchmark.

clean, report = decon.run(examples)
print(report.as_text())
```

## Rules
1. Index **both** the prompt and the reference answer of each test item.
2. Run decontamination **after** dedup so a near-duplicate cannot smuggle a
   leaked item back in.
3. Keep the `report.by_benchmark` breakdown with the corpus as an audit artifact.
4. Never tune `ngram` down to "rescue" examples — that defeats the purpose.

## Gated datasets
`Salesforce/xlam-function-calling-60k` and some SWE-bench variants are gated:
accept the terms once on the dataset page while logged in, then your `HF_TOKEN`
can stream them. Do this from the website, never by pasting a token into a chat.

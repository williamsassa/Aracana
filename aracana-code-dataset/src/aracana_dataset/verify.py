"""Multi-criterion verification.

The original spec listed 7 checks. Several were either trivially gameable or
not actually testable as written (e.g. "ontological hallucination" against an
ontology field that does not exist on real data). This module keeps the spirit
— strict, traceable rejection with a tallied report — but every check here is
one that actually *runs* and means something.

A failing example is rejected, never silently mutated. The verifier returns the
surviving subset plus a full rejection breakdown.
"""

from __future__ import annotations

import ast
import re
from dataclasses import dataclass, field
from typing import Callable, Dict, List, Tuple

from .schema import Example, SUBCATEGORIES, Silo

CODE_BLOCK_RE = re.compile(r"```(?:python|py)\s*\n(.*?)```", re.DOTALL)
ANY_BLOCK_RE = re.compile(r"```(\w+)?\s*\n(.*?)```", re.DOTALL)
SHELL_PROMPT_RE = re.compile(r"^\s*\$\s+\S")
STEP_RE = re.compile(r"(?:^|\n)\s*(?:#+\s*)?(?:step|étape|stage)\s*\d+", re.IGNORECASE)


@dataclass
class VerifyConfig:
    min_completion_words: int = 60
    max_completion_words: int = 6000
    min_cot_steps: int = 3
    require_license: bool = False  # flip on for redistribution-strict runs


@dataclass
class VerifyReport:
    total: int = 0
    passed: int = 0
    failed: Dict[str, int] = field(default_factory=dict)

    def reject(self, reason: str) -> None:
        self.failed[reason] = self.failed.get(reason, 0) + 1

    def as_text(self) -> str:
        lines = ["=" * 52, "VERIFICATION REPORT", "=" * 52,
                 f"total examined : {self.total}",
                 f"accepted       : {self.passed} "
                 f"({100 * self.passed / self.total:.1f}%)" if self.total else "accepted: 0",
                 f"rejected       : {self.total - self.passed}", "", "rejections:"]
        for reason, n in sorted(self.failed.items(), key=lambda kv: -kv[1]):
            lines.append(f"  - {reason}: {n}")
        return "\n".join(lines)


class Verifier:
    def __init__(self, config: VerifyConfig | None = None) -> None:
        self.cfg = config or VerifyConfig()

    # --- individual checks (each returns reason string or None) ----------
    def _check_structure(self, ex: Example) -> str | None:
        if not ex.messages:
            return "no_messages"
        for m in ex.messages:
            err = m.validate()
            if err:
                return err
        roles = [m.role for m in ex.messages]
        if "user" not in roles or "assistant" not in roles:
            return "missing_user_or_assistant"
        if roles[-1] != "assistant":
            return "does_not_end_on_assistant"
        return None

    def _check_taxonomy(self, ex: Example) -> str | None:
        if not isinstance(ex.silo, Silo):
            return "bad_silo"
        if ex.subcategory not in SUBCATEGORIES[ex.silo]:
            return f"bad_subcategory:{ex.silo.value}/{ex.subcategory}"
        return None

    def _check_code_syntax(self, ex: Example) -> str | None:
        if ex.metadata.get("type") != "code":
            return None
        # A code example must contain at least one fenced block (any language).
        any_blocks = ANY_BLOCK_RE.findall(ex.assistant_text)
        if not any_blocks:
            return "code_example_without_code_block"
        # Syntax-check only the Python blocks; other languages we cannot parse
        # here but still accept (the fence requirement guards against prose-only).
        for code in CODE_BLOCK_RE.findall(ex.assistant_text):
            try:
                ast.parse(code)
            except SyntaxError:
                return "invalid_python_syntax"
        return None

    def _check_cot(self, ex: Example) -> str | None:
        if not ex.metadata.get("cot"):
            return None
        steps = STEP_RE.findall(ex.assistant_text)
        if len(steps) < self.cfg.min_cot_steps:
            return "cot_too_few_steps"
        return None

    def _check_terminal_state(self, ex: Example) -> str | None:
        if ex.metadata.get("type") != "terminal":
            return None
        text = ex.assistant_text
        if "# STATE:" not in text:
            return "terminal_missing_state_annotation"
        # every shell command line must be preceded by a STATE/COST annotation
        lines = text.split("\n")
        for i, line in enumerate(lines):
            if SHELL_PROMPT_RE.match(line) and i > 0:
                window = " ".join(lines[max(0, i - 2):i])
                if "# STATE:" not in window and "# COST:" not in window:
                    return "terminal_command_without_state"
        return None

    def _check_length(self, ex: Example) -> str | None:
        n = len(ex.assistant_text.split())
        if n < self.cfg.min_completion_words:
            return "too_short"
        if n > self.cfg.max_completion_words:
            return "too_long"
        return None

    def _check_nontrivial(self, ex: Example) -> str | None:
        if ex.metadata.get("type") != "code":
            return None
        if ex.metadata.get("complexity") == "O(1)":
            return "trivial_complexity"
        return None

    def _check_license(self, ex: Example) -> str | None:
        if self.cfg.require_license and ex.license in ("unknown", "", None):
            return "missing_license"
        return None

    def _check_no_leaked_prompt(self, ex: Example) -> str | None:
        """Reject obvious generation artefacts that leak the meta-prompt."""
        bad = ["as an ai language model", "[output format]", "votre_cle",
               "votre_token", "i cannot fulfill", "vous_cle_ici"]
        low = ex.assistant_text.lower()
        for b in bad:
            if b in low:
                return "leaked_prompt_artifact"
        return None

    # --- driver ----------------------------------------------------------
    def _checks(self) -> List[Callable[[Example], str | None]]:
        return [
            self._check_structure,
            self._check_taxonomy,
            self._check_code_syntax,
            self._check_cot,
            self._check_terminal_state,
            self._check_length,
            self._check_nontrivial,
            self._check_license,
            self._check_no_leaked_prompt,
        ]

    def verify_one(self, ex: Example) -> Tuple[bool, str]:
        for check in self._checks():
            reason = check(ex)
            if reason:
                return False, reason
        return True, "ok"

    def verify(self, examples: List[Example]) -> Tuple[List[Example], VerifyReport]:
        report = VerifyReport()
        kept: List[Example] = []
        for ex in examples:
            report.total += 1
            ok, reason = self.verify_one(ex)
            if ok:
                kept.append(ex)
                report.passed += 1
            else:
                report.reject(reason)
        return kept, report

"""Canonical record schema for the ARACANA code dataset.

Every example that survives the pipeline conforms to :class:`Example`. The schema
is intentionally explicit and self-describing so that (a) verification is
unambiguous, (b) provenance is always traceable (source -> silo -> weight), and
(c) the final JSONL is directly consumable by SFT training code.

Pure stdlib: this module runs anywhere, no heavy deps.
"""

from __future__ import annotations

import hashlib
import json
import re
from dataclasses import asdict, dataclass, field
from enum import Enum
from typing import Any, Dict, List, Optional


class Silo(str, Enum):
    CODE = "code"
    TERMINAL = "terminal"
    MATH = "math"
    LONG_CONTEXT = "long_context"
    AGENTIC = "agentic"


# Allowed subcategories per silo. Used by the verifier and the balancer so a
# typo in a source adapter can never silently pollute a silo.
SUBCATEGORIES: Dict[Silo, List[str]] = {
    Silo.CODE: ["algorithmic", "swe_bench", "optimisation"],
    Silo.TERMINAL: ["shell_simple", "shell_agentic"],
    Silo.MATH: ["competition", "proofs"],
    Silo.LONG_CONTEXT: ["codebase", "documents"],
    Silo.AGENTIC: ["tool_use", "deep_search"],
}

ROLES = ("system", "user", "assistant")


@dataclass
class Message:
    role: str
    content: str

    def validate(self) -> Optional[str]:
        if self.role not in ROLES:
            return f"invalid_role:{self.role}"
        if not isinstance(self.content, str) or not self.content.strip():
            return "empty_message_content"
        return None


@dataclass
class Example:
    """One training example in canonical form."""

    messages: List[Message]
    silo: Silo
    subcategory: str
    source: str
    license: str = "unknown"
    metadata: Dict[str, Any] = field(default_factory=dict)
    quality: Dict[str, Any] = field(default_factory=dict)
    causal_weight: float = 1.0
    id: str = ""
    content_hash: str = ""

    # --- derived helpers -------------------------------------------------
    @property
    def user_text(self) -> str:
        return "\n".join(m.content for m in self.messages if m.role == "user")

    @property
    def assistant_text(self) -> str:
        return "\n".join(m.content for m in self.messages if m.role == "assistant")

    @property
    def normalized_text(self) -> str:
        """Lowercased, whitespace-collapsed full conversation. Used for dedup
        and decontamination so cosmetic differences do not hide overlap."""
        raw = " ".join(m.content for m in self.messages)
        return re.sub(r"\s+", " ", raw.lower()).strip()

    def compute_hash(self) -> str:
        h = hashlib.sha256(self.normalized_text.encode("utf-8")).hexdigest()
        self.content_hash = h
        if not self.id:
            self.id = f"{self.silo.value}-{h[:16]}"
        return h

    # --- (de)serialisation ----------------------------------------------
    def to_dict(self) -> Dict[str, Any]:
        d = asdict(self)
        d["silo"] = self.silo.value
        d["messages"] = [{"role": m.role, "content": m.content} for m in self.messages]
        return d

    def to_jsonl(self) -> str:
        return json.dumps(self.to_dict(), ensure_ascii=False)

    @classmethod
    def from_dict(cls, d: Dict[str, Any]) -> "Example":
        msgs = [Message(m["role"], m["content"]) for m in d["messages"]]
        ex = cls(
            messages=msgs,
            silo=Silo(d["silo"]),
            subcategory=d["subcategory"],
            source=d["source"],
            license=d.get("license", "unknown"),
            metadata=d.get("metadata", {}),
            quality=d.get("quality", {}),
            causal_weight=d.get("causal_weight", 1.0),
            id=d.get("id", ""),
            content_hash=d.get("content_hash", ""),
        )
        return ex


def make_example(
    *,
    user: str,
    assistant: str,
    silo: Silo,
    subcategory: str,
    source: str,
    system: Optional[str] = None,
    license: str = "unknown",
    metadata: Optional[Dict[str, Any]] = None,
) -> Example:
    """Convenience constructor for the common system/user/assistant shape."""
    messages: List[Message] = []
    if system:
        messages.append(Message("system", system))
    messages.append(Message("user", user))
    messages.append(Message("assistant", assistant))
    ex = Example(
        messages=messages,
        silo=silo,
        subcategory=subcategory,
        source=source,
        license=license,
        metadata=metadata or {},
    )
    ex.compute_hash()
    return ex

"""Lightweight JSON-file persistence for inbound submissions.

Good enough for V1 (contact messages, applications, early-access requests).
V2 swaps this for a real database behind the same function signatures.
"""

from __future__ import annotations

import json
import threading
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict

_DATA_DIR = Path(__file__).resolve().parent.parent / "data"
_DATA_DIR.mkdir(exist_ok=True)
_LOCK = threading.Lock()


def _file(kind: str) -> Path:
    return _DATA_DIR / f"{kind}.jsonl"


def save(kind: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    """Append a record and return it with an id + timestamp."""
    record = {
        "id": uuid.uuid4().hex[:12],
        "received_at": datetime.now(timezone.utc).isoformat(),
        "kind": kind,
        **payload,
    }
    with _LOCK:
        with _file(kind).open("a", encoding="utf-8") as fh:
            fh.write(json.dumps(record, ensure_ascii=False) + "\n")
    return record


def count(kind: str) -> int:
    path = _file(kind)
    if not path.exists():
        return 0
    with path.open("r", encoding="utf-8") as fh:
        return sum(1 for _ in fh)

"""Token-level causal loss weighting (AST-driven).

Implements the design doc's "Causal Cross-Entropy Loss Weighting": instead of a
uniform loss, every token carries a weight reflecting its causal load. Control
flow drives program behaviour, so it is weighted most; comments least. The model
is thereby forced to spend capacity where correctness actually lives.

This module produces, for the assistant turn of an example, a parallel array of
per-character (and hence per-token, after the tokenizer aligns) weights. It is
deliberately tokenizer-agnostic: we emit a list of (span, weight) intervals over
the raw assistant string. At training time you map your tokenizer's offsets onto
these spans (helper `weights_for_offsets` provided). Pure stdlib.

Weights (from the design doc, tunable in WEIGHTS):
    control flow (if/for/while/try/with/match) ... 3.0
    definitions (def/class)                     ... 2.0
    function calls / attribute access           ... 1.5
    operators in loop bodies (O(n^2)+ context)  ... boosted via depth
    comments / docstrings                       ... 0.1
    default prose / other code                  ... 1.0
"""

from __future__ import annotations

import ast
import io
import tokenize
from dataclasses import dataclass
from typing import Dict, List, Tuple

WEIGHTS: Dict[str, float] = {
    "control_flow": 3.0,
    "definition": 2.0,
    "call": 1.5,
    "comment": 0.1,
    "default": 1.0,
}

CONTROL_NODES = (ast.If, ast.For, ast.While, ast.Try, ast.With,
                 ast.AsyncFor, ast.AsyncWith)
if hasattr(ast, "Match"):  # py3.10+
    CONTROL_NODES = CONTROL_NODES + (ast.Match,)
DEF_NODES = (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)


@dataclass
class Span:
    start: int
    end: int
    weight: float
    kind: str


def _line_col_to_offset(code: str) -> List[int]:
    """Cumulative offsets: index i holds the start offset of 1-indexed line i+1.
    So the start of line L is offsets[L-1]; the end of line L is offsets[L]."""
    offsets = [0]
    for line in code.splitlines(keepends=True):
        offsets.append(offsets[-1] + len(line))
    return offsets


def weight_python_block(code: str) -> List[Span]:
    """Return weighted spans over a single Python source string.

    Loop-depth scaling: a control-flow keyword nested inside k loops is boosted
    by (1 + 0.5k), capturing the doc's "token inside an O(n^2) loop weighs more".
    """
    spans: List[Span] = []
    line_off = _line_col_to_offset(code)

    def off(lineno: int, col: int) -> int:
        if lineno < 1 or lineno - 1 >= len(line_off):
            return 0
        return line_off[lineno - 1] + col

    def line_end(lineno: int) -> int:
        return line_off[lineno] if lineno < len(line_off) else len(code)

    # 1. comments via tokenizer
    try:
        for tok in tokenize.generate_tokens(io.StringIO(code).readline):
            if tok.type == tokenize.COMMENT:
                s = off(tok.start[0], tok.start[1])
                e = off(tok.end[0], tok.end[1])
                spans.append(Span(s, e, WEIGHTS["comment"], "comment"))
    except (tokenize.TokenError, IndentationError):
        pass

    # 2. AST-driven structural weights with loop-depth scaling
    try:
        tree = ast.parse(code)
    except SyntaxError:
        return spans

    def visit(node: ast.AST, loop_depth: int) -> None:
        kind = None
        w = None
        if isinstance(node, CONTROL_NODES):
            kind = "control_flow"
            w = WEIGHTS["control_flow"] * (1 + 0.5 * loop_depth)
        elif isinstance(node, DEF_NODES):
            kind = "definition"
            w = WEIGHTS["definition"]
        elif isinstance(node, ast.Call):
            kind = "call"
            w = WEIGHTS["call"]
        if kind and hasattr(node, "lineno"):
            s = off(node.lineno, node.col_offset)
            end_line = getattr(node, "end_lineno", node.lineno)
            end_col = getattr(node, "end_col_offset", node.col_offset + 1)
            # keep the weighted region to the node's header line for control/def
            if kind in ("control_flow", "definition"):
                # weight the header line only (up to end of that line)
                spans.append(Span(s, max(s + 1, line_end(node.lineno)), w, kind))
            else:
                spans.append(Span(s, off(end_line, end_col), w, kind))
        nd = loop_depth + (1 if isinstance(node, (ast.For, ast.While, ast.AsyncFor)) else 0)
        for child in ast.iter_child_nodes(node):
            visit(child, nd)

    visit(tree, 0)
    return spans


def weights_for_offsets(spans: List[Span], offsets: List[Tuple[int, int]],
                        default: float = 1.0) -> List[float]:
    """Map tokenizer (start,end) char offsets onto span weights.

    For each token we take the MAX weight of any overlapping span (causal salience
    dominates). Tokens overlapping nothing get `default`.
    """
    out: List[float] = []
    for (ts, te) in offsets:
        w = default
        for sp in spans:
            if sp.start < te and ts < sp.end:  # overlap
                if sp.weight > w:
                    w = sp.weight
        out.append(w)
    return out


def summarize(code: str) -> Dict[str, float]:
    """Quick diagnostic: mean weight and per-kind counts for a code block."""
    spans = weight_python_block(code)
    by_kind: Dict[str, int] = {}
    for sp in spans:
        by_kind[sp.kind] = by_kind.get(sp.kind, 0) + 1
    return {"n_spans": len(spans), **by_kind}

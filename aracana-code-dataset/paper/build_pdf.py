#!/usr/bin/env python3
"""Render the ARACANA-Code paper to PDF without a system LaTeX install.

Uses reportlab (pure-Python). Produces paper/ARACANA-Code.pdf. Content mirrors
main.tex; keep the two in sync. Run: python paper/build_pdf.py
"""

from pathlib import Path

from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (Paragraph, SimpleDocTemplate, Spacer, Table,
                                TableStyle)

OUT = Path(__file__).parent / "ARACANA-Code.pdf"

styles = getSampleStyleSheet()
H1 = ParagraphStyle("H1", parent=styles["Heading1"], fontSize=13, spaceBefore=12,
                    spaceAfter=6, textColor=colors.HexColor("#1a1a1a"))
H2 = ParagraphStyle("H2", parent=styles["Heading2"], fontSize=11, spaceBefore=8,
                    spaceAfter=4)
BODY = ParagraphStyle("BODY", parent=styles["BodyText"], fontSize=9.5,
                      leading=13.5, alignment=TA_JUSTIFY, spaceAfter=6)
TITLE = ParagraphStyle("TITLE", parent=styles["Title"], fontSize=18,
                       alignment=TA_CENTER, spaceAfter=4)
SUB = ParagraphStyle("SUB", parent=styles["Normal"], fontSize=10,
                     alignment=TA_CENTER, textColor=colors.grey, spaceAfter=2)
ABS = ParagraphStyle("ABS", parent=BODY, fontSize=9, leftIndent=18,
                     rightIndent=18, textColor=colors.HexColor("#222222"))


def p(t):
    return Paragraph(t, BODY)


def build():
    doc = SimpleDocTemplate(str(OUT), pagesize=A4, topMargin=1.8 * cm,
                            bottomMargin=1.8 * cm, leftMargin=2 * cm,
                            rightMargin=2 * cm, title="ARACANA-Code")
    e = []
    e.append(Paragraph("ARACANA-Code: A Decontaminated, Causally-Weighted SFT "
                       "Corpus for Small Coding Language Models", TITLE))
    e.append(Paragraph("ARACANA AI &nbsp;&bull;&nbsp; Paris &bull; Brussels &bull; Europe", SUB))
    e.append(Paragraph("Technical Report (pre-results draft)", SUB))
    e.append(Spacer(1, 10))

    e.append(Paragraph("Abstract", H2))
    e.append(Paragraph(
        "We describe ARACANA-Code, a supervised fine-tuning corpus engineered "
        "for a 3B-parameter coding model. Our thesis is that for small models the "
        "dominant lever is not scale but the structural and causal quality of the "
        "training data. We contribute (i) a strict per-example verification "
        "protocol, (ii) two-stage exact and near-duplicate deduplication, "
        "(iii) an n-gram benchmark decontamination stage treated as a release "
        "gate, and (iv) a transparent causal-weighting scheme. We report the data "
        "methodology and acceptance statistics; model results follow once training "
        "completes. We frame targets against comparably-sized models and named "
        "larger open baselines on a defined benchmark subset, not uniform "
        "superiority over frontier systems &mdash; a claim a 3B model cannot "
        "support.", ABS))
    e.append(Spacer(1, 6))

    e.append(Paragraph("1. Introduction", H1))
    e.append(p("Small language models are attractive for sovereign, on-premise "
               "and edge deployment. Closing the gap to larger models on coding "
               "tasks is primarily a data problem: a small model has limited "
               "capacity, so every training token must carry signal. ARACANA-Code "
               "operationalises this with an auditable pipeline in which no example "
               "reaches the final corpus without passing structural, semantic and "
               "integrity checks."))
    e.append(p("<b>Scope of claims.</b> We do not claim a 3B model surpasses "
               "frontier systems across all benchmarks; that is not achievable at "
               "this parameter count. Our goal is best-in-class performance for its "
               "size, and to beat specific larger open coding models on a chosen "
               "subset of public benchmarks. All reported numbers are real and "
               "decontaminated."))

    e.append(Paragraph("2. Corpus Design", H1))
    e.append(p("The corpus is organised into five silos with a target of 109K "
               "examples (Table 1). Each example is stored in a canonical record "
               "with explicit provenance (source, license), taxonomy (silo, "
               "subcategory), per-example quality signals and a causal weight."))
    data = [["Silo", "Subcategories", "Target"],
            ["Code", "algorithmic, swe_bench, optimisation", "45,000"],
            ["Terminal", "shell_simple, shell_agentic", "15,000"],
            ["Math", "competition, proofs", "18,000"],
            ["Long context", "codebase, documents", "15,000"],
            ["Agentic", "tool_use, deep_search", "16,000"],
            ["Total", "", "109,000"]]
    t = Table(data, colWidths=[3 * cm, 8.5 * cm, 3 * cm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2c3e50")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.grey),
        ("BACKGROUND", (0, -1), (-1, -1), colors.HexColor("#ecf0f1")),
        ("FONTNAME", (0, -1), (-1, -1), "Helvetica-Bold"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -2), [colors.white, colors.HexColor("#f7f9fa")]),
    ]))
    e.append(t)
    e.append(Paragraph("<i>Table 1: Target composition of ARACANA-Code.</i>", SUB))
    e.append(Spacer(1, 6))

    e.append(Paragraph("3. Pipeline", H1))
    e.append(Paragraph("3.1 Verification", H2))
    e.append(p("Each example must pass, in order: structural validity (well-formed "
               "system/user/assistant turns ending on the assistant); taxonomy "
               "validity; code syntax (every Python fenced block parses under the "
               "CPython AST, and code-typed examples contain at least one fenced "
               "block); chain-of-thought completeness (CoT-tagged examples contain "
               "at least three explicit steps); terminal-state coherence (every "
               "shell command is preceded by a # STATE / # COST annotation); length "
               "bounds; non-triviality (no O(1) code problems); optional license "
               "presence; and a leaked-prompt-artefact filter. Rejections are "
               "tallied by reason for full auditability."))
    e.append(Paragraph("3.2 Deduplication", H2))
    e.append(p("We remove exact duplicates on a SHA-256 of normalised text, then "
               "near-duplicates using 64-permutation MinHash over 5-word shingles "
               "with banded LSH (16 bands) and a Jaccard threshold of 0.85. We "
               "verified the MinHash estimate tracks true Jaccard closely (0.594 "
               "estimated vs. 0.576 true on a held pair)."))
    e.append(Paragraph("3.3 Decontamination", H2))
    e.append(p("We treat benchmark contamination as a release-blocking defect. We "
               "index every token-level 13-gram of every benchmark test item in our "
               "evaluation suite and drop any training example sharing one. Removed "
               "examples are attributed to their source benchmark. This stage runs "
               "after dedup so contamination cannot re-enter through a near "
               "duplicate. Crucially, evaluation benchmarks (LiveCodeBench, "
               "SWE-bench test, GAIA, BFCL, Tau-bench) are used here as "
               "contamination sources, never as training data."))
    e.append(Paragraph("3.4 Causal Weighting", H2))
    e.append(p("Each surviving example receives a loss weight w in [1, 4] that "
               "multiplicatively boosts control-flow-bearing code, priority "
               "benchmark families (SWE-bench, terminal, tool-use, deep-search), "
               "high-complexity solutions (O(n^2) and above) and CoT traces. The "
               "weighting is transparent and refined post-hoc from training-time "
               "gradient statistics."))

    e.append(Paragraph("4. Data Statistics", H1))
    e.append(p("On a representative real ingestion slice of 1,800 examples drawn "
               "from public permissive datasets (Magicoder-Evol-Instruct, "
               "CodeFeedback, OpenR1-Math-220k), verification accepted 86.8% "
               "(1,562), with rejections dominated by length (200), trivial "
               "complexity (14), invalid Python syntax (13) and missing code "
               "blocks (11). These rates characterise the pipeline; the full-corpus "
               "table replaces this paragraph at build time."))

    e.append(Paragraph("5. Results", H1))
    e.append(p("<i>To be completed after training.</i> We will report pass@1 / "
               "pass@k on the public benchmark subset, each computed on a "
               "decontaminated test set, with the exact base model, training recipe "
               "and decoding parameters. Targets are expressed relative to "
               "comparably-sized models and named larger open baselines."))

    e.append(Paragraph("6. Ethics and Integrity", H1))
    e.append(p("ARACANA-Code follows the ARACANA principle of sovereign, auditable "
               "AI. We do not redistribute data whose license forbids it; license "
               "status is recorded per example and unverified sources are flagged "
               "before release. Decontamination ensures reported scores reflect "
               "generalisation rather than memorisation. We disclose the true scope "
               "of our claims rather than overstating small-model capability."))

    e.append(Paragraph("7. Reproducibility", H1))
    e.append(p("The construction toolkit (schema, verifier, deduplicator, "
               "decontaminator, balancer, pipeline) and a runnable end-to-end demo "
               "accompany this report. Every stage is deterministic under a fixed "
               "seed and emits a machine-readable report."))

    doc.build(e)
    print(f"wrote {OUT}  ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    build()

"""In-memory content store for the ARACANA AI API.

This is the single source of truth the backend serves. In V2 it will be
replaced by a database; the API contract stays the same.
"""

from __future__ import annotations

# ──────────────── Research ────────────────
RESEARCH = [
    {
        "id": "recursive-self-improvement",
        "index": "01",
        "title": "Recursive Self-Improvement",
        "abstract": (
            "We study AI systems that improve their own learning process. Instead of a "
            "single static training run, an ARACANA model proposes refinements to its data "
            "curation, reward shaping and optimisation schedule, evaluates them, and folds the "
            "winning changes back into the next iteration — a controlled, auditable loop."
        ),
        "points": [
            "Self-curated curricula: the model ranks and re-weights its own training mixtures.",
            "Reward-model co-training under explicit guardrails and human checkpoints.",
            "Verifiable improvement: every self-edit is logged, reproducible and gated by held-out evals.",
        ],
    },
    {
        "id": "mechanism-informed",
        "index": "02",
        "title": "Mechanism-Informed Multimodal AI",
        "abstract": (
            "Frontier models that respect the mechanisms of the physical world. We fuse "
            "language, vision, signals and structured simulation so a model reasons with the "
            "laws of a domain — physics, chemistry, biology, control — not only surface text."
        ),
        "points": [
            "Physics- and biology-aware priors injected into the architecture and the loss.",
            "Cross-modal grounding: text, image, video, time-series and structure share a latent space.",
            "Mechanism-consistency checks that flag outputs violating known constraints.",
        ],
    },
    {
        "id": "state-integrity",
        "index": "03",
        "title": "State Integrity & Sovereignty",
        "abstract": (
            "AI that strengthens, rather than erodes, the autonomy of European states. Models "
            "that can be trained, audited, hosted and governed entirely within sovereign "
            "infrastructure, with verifiable provenance and on-premise deployment."
        ),
        "points": [
            "Sovereign-by-construction: training, weights and inference can live inside national infra.",
            "Provenance and auditability of data, model lineage and every decision.",
            "Resilience and integrity guarantees for critical-function deployments.",
        ],
    },
]

# ──────────────── Solutions ────────────────
SOLUTIONS = [
    {
        "id": "generative",
        "title": "Generative AI",
        "summary": "Sovereign generation across text, image and video — built for European languages, regulation and brand-grade quality.",
        "capabilities": ["Long-context multilingual text generation", "High-fidelity image synthesis & editing", "Controllable video generation"],
        "status": "soon",
    },
    {
        "id": "coding-agent",
        "title": "Coding Agent",
        "summary": "An autonomous software engineer that plans, edits, tests and ships across real repositories with human-in-the-loop control.",
        "capabilities": ["Repo-scale reasoning and refactoring", "Test-driven, self-verifying execution", "On-premise / air-gapped deployment"],
        "status": "soon",
    },
    {
        "id": "ai-scientist",
        "title": "AI Scientist",
        "summary": "An autonomous research engine for scientific discovery — from hypothesis to drug-candidate to disease pathway analysis.",
        "capabilities": ["Automated hypothesis generation & testing", "Drug discovery & molecular design", "Disease-pathway and target identification"],
        "status": "research",
    },
    {
        "id": "space",
        "title": "Space & Very-High Altitude",
        "summary": "Onboard intelligence for satellites, stratospheric platforms and very-high-altitude systems with limited compute and connectivity.",
        "capabilities": ["Edge inference under power & latency limits", "Earth-observation analysis pipelines", "Autonomous tasking & anomaly detection"],
        "status": "research",
    },
    {
        "id": "defense",
        "title": "State Defense",
        "summary": "Decision-support and integrity systems for sovereign defense — auditable, on-premise and aligned with European command structures.",
        "capabilities": ["Sovereign, air-gapped deployment", "Multi-source situational awareness", "Human-authority-preserving decision support"],
        "status": "research",
    },
    {
        "id": "multi-agent",
        "title": "Multi-Agent Systems",
        "summary": "Fleets of specialised agents that coordinate, negotiate and self-organise to solve problems no single model can.",
        "capabilities": ["Role-specialised agent orchestration", "Shared memory & verifiable communication", "Emergent planning with central oversight"],
        "status": "research",
    },
]

# ──────────────── Products ────────────────
PRODUCTS = [
    {
        "slug": "generative-model",
        "name": "Generative Model",
        "full_name": "ARACANA Generative Model",
        "modality": "Text · Image · Video",
        "status": "soon",
        "background": False,
        "tagline": "Sovereign generation across text, image and video.",
        "summary": "A unified, multimodal generative model designed for European languages, regulation and brand-grade output — text, image and video from one sovereign system.",
        "overview": [
            "The ARACANA Generative Model is a single multimodal system that writes, illustrates and animates. It treats text, image and video as one shared representation.",
            "It is built sovereignty-first: trained, hosted and audited inside European infrastructure with full provenance over its data and outputs.",
            "Quality is aligned with reinforcement learning against a blend of human-preference and rule-based rewards.",
        ],
        "capabilities": [
            {"title": "Long-context multilingual text", "desc": "Drafting, rewriting and reasoning across European languages with long-document context."},
            {"title": "High-fidelity image synthesis", "desc": "Generation and precise editing with layout, style and brand constraints."},
            {"title": "Controllable video", "desc": "Short-form video generation with consistent characters, motion and shot control."},
            {"title": "Grounded & cited", "desc": "Optional retrieval grounding so generated text can be traced to sources."},
        ],
        "specs": [
            {"label": "Modalities", "value": "Text, Image, Video"},
            {"label": "Context", "value": "Long-context (target 128K+ tokens)"},
            {"label": "Alignment", "value": "Reinforcement Learning + human preference"},
            {"label": "Deployment", "value": "Cloud / On-prem / Sovereign"},
            {"label": "Status", "value": "Soon"},
        ],
        "reward_intro": "For generation, no single verifier can say an answer is 'correct'. We blend several reward signals across a batch of sampled candidates.",
        "reward_components": [
            {"signal": "Human-preference reward model", "weight": "0.50", "desc": "Learned from European annotators ranking outputs for helpfulness and tone."},
            {"signal": "Factual-grounding check", "weight": "0.20", "desc": "Rewards claims supported by retrieved sources; penalises hallucination."},
            {"signal": "Aesthetic / fidelity model", "weight": "0.20", "desc": "For image & video: scores resolution, coherence and prompt alignment."},
            {"signal": "Safety & policy filter", "weight": "0.10", "desc": "Hard penalty for unsafe or non-compliant content."},
        ],
        "reward_example": "Example: for one prompt we sample 16 captions for an image, score each by the preference model and the grounding check, combine, then z-score within the group of 16. The caption that is both well-written and faithful gets the highest advantage.",
    },
    {
        "slug": "coding-agent-model",
        "name": "Coding Agent Model",
        "full_name": "ARACANA Coding Agent Model",
        "modality": "Autonomous software engineering",
        "status": "soon",
        "background": False,
        "tagline": "An autonomous software engineer you can run on-premise.",
        "summary": "A coding agent that plans, edits, runs and tests real codebases — verifying its own work against tests and types before proposing a change.",
        "overview": [
            "The ARACANA Coding Agent Model operates over real repositories: it reads the project, plans a change, edits multiple files, runs the tests and iterates — human in the loop at every gate.",
            "Because correctness in software is verifiable, it is an ideal target for reinforcement learning: the reward is grounded in deterministic execution, producing a clean, low-noise signal.",
            "It is designed for sensitive environments and can run fully air-gapped.",
        ],
        "capabilities": [
            {"title": "Repo-scale reasoning", "desc": "Understands and edits across many files and modules at once."},
            {"title": "Self-verifying execution", "desc": "Runs builds, tests and type-checks and reads their output to correct itself."},
            {"title": "Plan → act → review", "desc": "Produces an auditable plan and diff for human approval before merge."},
            {"title": "Air-gapped deployment", "desc": "Runs on-premise with zero external calls for classified codebases."},
        ],
        "specs": [
            {"label": "Interface", "value": "CLI · IDE · API"},
            {"label": "Verification", "value": "Build + tests + type-check"},
            {"label": "Alignment", "value": "Reinforcement Learning (execution)"},
            {"label": "Deployment", "value": "On-prem / Air-gapped"},
            {"label": "Status", "value": "Soon"},
        ],
        "reward_intro": "Code is verifiable, so the reward is almost entirely rule-based — the cleanest possible reinforcement signal. We sample many candidate patches and execute every one.",
        "reward_components": [
            {"signal": "Tests passing", "weight": "0.55", "desc": "Fraction of the relevant test suite that goes from red to green."},
            {"signal": "Compiles / type-checks", "weight": "0.20", "desc": "Binary gate: the patch must build and type-check."},
            {"signal": "No regressions", "weight": "0.15", "desc": "Penalty for any previously-passing test the patch breaks."},
            {"signal": "Diff minimality & style", "weight": "0.10", "desc": "Rewards small, idiomatic, lint-clean changes."},
        ],
        "reward_example": "Example: a bug ticket is the prompt. We sample 8 patches, apply each in a sandbox and run the suite. Patch o₃ fixes the bug and breaks nothing (R=1.0); o₅ fixes it but breaks two tests (R=0.4); o₇ doesn't compile (R=0). the model is reinforced toward o₃ — no human label required.",
    },
    {
        "slug": "state-space-sovereignty-model",
        "name": "State Space Sovereignty Model",
        "full_name": "ARACANA State Space Sovereignty Model",
        "modality": "Sovereign decision intelligence",
        "status": "soon",
        "background": False,
        "tagline": "Auditable decision intelligence for sovereign institutions.",
        "summary": "A long-horizon, state-space model for sovereign decision support — efficient over very long sequences, auditable end-to-end, deployable on national infrastructure.",
        "overview": [
            "Built on a state-space backbone, it scales near-linearly over extremely long sequences — months of signals or documents held in a single context.",
            "Every inference is traceable: the model exposes the evidence and intermediate state behind each recommendation for human audit.",
            "It is sovereign by construction — weights, training and inference hosted within national infrastructure, with no foreign-cloud dependency.",
        ],
        "capabilities": [
            {"title": "Very-long-horizon context", "desc": "State-space backbone scales near-linearly over very long sequences."},
            {"title": "Auditable decisions", "desc": "Exposes supporting evidence and internal state for human review."},
            {"title": "Multi-source fusion", "desc": "Integrates documents, signals and time-series into one situational picture."},
            {"title": "Sovereign deployment", "desc": "Fully on-premise, air-gapped, no foreign-cloud dependency."},
        ],
        "specs": [
            {"label": "Architecture", "value": "State-space (linear-time)"},
            {"label": "Context", "value": "Ultra-long horizon"},
            {"label": "Alignment", "value": "Reinforcement Learning + causal modelling"},
            {"label": "Deployment", "value": "Sovereign / Air-gapped"},
            {"label": "Status", "value": "Soon"},
        ],
        "reward_intro": "Sovereign decision support must be correct AND accountable. The reward combines outcome accuracy with a premium on traceability and human-authority preservation.",
        "reward_components": [
            {"signal": "Decision accuracy", "weight": "0.40", "desc": "Correctness against verified historical or simulated outcomes."},
            {"signal": "Evidence faithfulness", "weight": "0.30", "desc": "Every recommendation must cite supporting evidence that checks out."},
            {"signal": "Calibration", "weight": "0.20", "desc": "Rewards well-calibrated confidence; penalises overconfident errors."},
            {"signal": "Authority-preserving", "weight": "0.10", "desc": "Penalises outputs that bypass required human approval."},
        ],
        "reward_example": "Example: on a replayed historical scenario we sample 12 assessments, scoring each for matching the known outcome, real cited evidence and calibrated confidence. The model is reinforced toward assessments that were both right and honestly evidenced.",
    },
    {
        "slug": "multi-agent-system",
        "name": "Multi-Agent System",
        "full_name": "ARACANA Multi-Agent System",
        "modality": "Orchestrated agent fleets",
        "status": "development",
        "background": True,
        "tagline": "Fleets of specialised agents that solve what one model can't.",
        "summary": "An orchestration layer where specialised agents plan, negotiate and self-organise under central oversight — in active development.",
        "overview": [
            "The ARACANA Multi-Agent System coordinates many specialised agents into a single problem-solving fleet under a central orchestrator.",
            "Agents share a verifiable memory and communicate over an auditable channel, so the whole system's reasoning can be inspected after the fact.",
            "This system is in active development and underpins our other products.",
        ],
        "capabilities": [
            {"title": "Role-specialised agents", "desc": "Each agent is tuned for a narrow, well-defined function."},
            {"title": "Verifiable communication", "desc": "All inter-agent messages are logged and auditable."},
            {"title": "Shared memory", "desc": "A common, consistent memory keeps the fleet coordinated."},
            {"title": "Central oversight", "desc": "An orchestrator bounds emergent behaviour and keeps humans in control."},
        ],
        "specs": [
            {"label": "Pattern", "value": "Orchestrator + specialists"},
            {"label": "Comms", "value": "Auditable, logged"},
            {"label": "Alignment", "value": "Reinforcement Learning (agent + system)"},
            {"label": "Deployment", "value": "Cloud / On-prem"},
            {"label": "Status", "value": "In development"},
        ],
        "reward_intro": "Multi-agent training adds a system-level reward on top of each agent's own reinforcement signal: the fleet is rewarded for the quality of the final, jointly-produced result.",
        "reward_components": [
            {"signal": "Task success (system)", "weight": "0.50", "desc": "Did the fleet solve the overall goal, verified end-to-end?"},
            {"signal": "Per-agent contribution", "weight": "0.25", "desc": "Credit assignment: how much each agent's output helped."},
            {"signal": "Communication efficiency", "weight": "0.15", "desc": "Rewards reaching the goal with fewer, clearer messages."},
            {"signal": "Safety & oversight", "weight": "0.10", "desc": "Penalty for actions that escape the orchestrator's bounds."},
        ],
        "reward_example": "Example: a fleet of 4 agents tackles a research-and-build task. We sample several full rollouts, score each on whether the final artifact passed verification, then z-score across rollouts, sharing credit by contribution.",
    },
    {
        "slug": "ai-scientist",
        "name": "AI Scientist",
        "full_name": "ARACANA AI Scientist",
        "modality": "Autonomous scientific discovery",
        "status": "development",
        "background": True,
        "tagline": "From hypothesis to drug candidate to disease pathway.",
        "summary": "An autonomous research engine for scientific discovery — generating hypotheses, designing molecules and mapping disease pathways — in active development.",
        "overview": [
            "The ARACANA AI Scientist closes the scientific loop: it proposes hypotheses, designs molecules, evaluates against simulators and literature, and refines its next proposal.",
            "It is mechanism-informed: it reasons with the underlying biology and physics, so proposals are physically plausible, not just statistically likely.",
            "Outputs are intended to assist and be verified by human scientists, never to replace expert and regulatory review.",
        ],
        "capabilities": [
            {"title": "Hypothesis generation", "desc": "Proposes and ranks testable scientific hypotheses."},
            {"title": "Molecular design", "desc": "Designs candidate molecules under drug-likeness and synthesis constraints."},
            {"title": "Pathway analysis", "desc": "Maps disease mechanisms and identifies promising targets."},
            {"title": "Simulator-grounded", "desc": "Evaluates proposals against physics/biology simulators before suggesting them."},
        ],
        "specs": [
            {"label": "Domains", "value": "Drug discovery · Biology"},
            {"label": "Grounding", "value": "Simulators + literature"},
            {"label": "Alignment", "value": "Reinforcement Learning (simulator)"},
            {"label": "Deployment", "value": "Sovereign / On-prem"},
            {"label": "Status", "value": "In development"},
        ],
        "reward_intro": "Scientific proposals can be partially verified by simulation and known constraints, giving a strong, mechanism-grounded reward signal without waiting for wet-lab results.",
        "reward_components": [
            {"signal": "Simulated efficacy", "weight": "0.40", "desc": "Predicted binding / activity from physics-based simulators."},
            {"signal": "Drug-likeness & safety", "weight": "0.25", "desc": "ADMET and toxicity proxies; hard penalty for unsafe candidates."},
            {"signal": "Synthesizability", "weight": "0.20", "desc": "Rewards molecules that can plausibly be made."},
            {"signal": "Novelty", "weight": "0.15", "desc": "Rewards genuinely new candidates over rediscoveries."},
        ],
        "reward_example": "Example: for one target the model proposes 32 molecules, each scored by a docking simulator, a toxicity model and a synthesis-route predictor. The blended score is z-scored across the 32, reinforcing candidates that are potent, safe and makeable.",
    },
]

# ──────────────── Careers ────────────────
ROLES = [
    {"title": "Research Scientist — Recursive Self-Improvement", "team": "Research", "location": "Paris / Remote (EU)", "type": "Full-time"},
    {"title": "Member of Technical Staff — Reinforcement Learning", "team": "Training", "location": "Paris / Remote (EU)", "type": "Full-time"},
    {"title": "Research Engineer — Multimodal Pretraining", "team": "Research", "location": "Brussels / Remote (EU)", "type": "Full-time"},
    {"title": "Software Engineer — Coding Agent", "team": "Product", "location": "Paris / Remote (EU)", "type": "Full-time"},
    {"title": "Infrastructure Engineer — Sovereign Compute", "team": "Platform", "location": "Paris / On-site", "type": "Full-time"},
    {"title": "Computational Biologist — AI Scientist", "team": "Science", "location": "Remote (EU)", "type": "Full-time"},
]

# ──────────────── Methodology (Reinforcement Learning × Causality) ────────────────
METHODOLOGY = {
    "title": "How our models learn",
    "subtitle": "Reinforcement Learning × Causality",
    "lede": "We drive our research with two forces. Reinforcement learning lets a model improve from outcomes — it proposes, is scored, and reinforces what works. Causality lets it reason about cause and effect, not mere correlation — so it generalises, stays robust, and explains itself.",
    "pillars": [
        {
            "tag": "01",
            "title": "Reinforcement Learning",
            "body": "The model proposes many candidate answers, each is scored against verifiable outcomes and human preference, and the model is nudged toward what scores well and away from what doesn't — under human oversight at every checkpoint.",
            "points": [
                "Outcome-grounded rewards, not opinion alone",
                "Sample broadly, reinforce the best",
                "Every improvement gated by held-out evaluation",
            ],
        },
        {
            "tag": "02",
            "title": "Causality",
            "body": "We teach models the causal structure of a domain — the mechanisms behind the data. Reasoning over cause, effect and counterfactuals makes the model robust to spurious correlations and able to justify its decisions.",
            "points": [
                "Mechanism-informed, not correlation-only",
                "Counterfactual reasoning for robustness",
                "Decisions that can be explained and audited",
            ],
        },
    ],
    "loop": [
        {"n": "01", "title": "Propose", "body": "The model generates a diverse set of candidate responses for each situation."},
        {"n": "02", "title": "Evaluate", "body": "Each candidate is scored — by verifiers, simulators, human preference, and a causal-consistency check."},
        {"n": "03", "title": "Reinforce", "body": "The model is updated toward high-scoring, causally-sound behaviour, then re-evaluated before promotion."},
    ],
}


def get_product(slug: str):
    for p in PRODUCTS:
        if p["slug"] == slug:
            return p
    return None

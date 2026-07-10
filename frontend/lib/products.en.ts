/* Product catalogue for ARACANA AI — English source of truth.
   Three flagship models are front-office (status "soon"); two more are
   "in development" / background. Every model shares the same training
   methodology (lib/methodology.ts) with a product-specific signal design. */

export type ProductStatus = "soon" | "development";

export type RewardComponent = { signal: string; weight: string; desc: string };

export type Product = {
  slug: string;
  name: string; // wordmark-friendly short name
  codename: string; // big Palantir-style display name (e.g. AEGIS)
  fullName: string;
  modality: string;
  status: ProductStatus;
  background: boolean; // true => not shown as a primary card, listed as "in development"
  tagline: string;
  summary: string;
  overview: string[];
  capabilities: { title: string; desc: string }[];
  specs: { label: string; value: string }[];
  // Learning-signal design specific to this model:
  rewardIntro: string;
  rewardComponents: RewardComponent[];
  rewardExample: string;
};

export const PRODUCTS_EN: Product[] = [
  {
    slug: "generative-model",
    name: "Generative Model",
    codename: "GENESIS",
    fullName: "ARACANA Generative Model",
    modality: "Text · Image · Video",
    status: "soon",
    background: false,
    tagline: "Sovereign generation across text, image and video.",
    summary:
      "A unified, multimodal generative model designed for European languages, regulation and brand-grade output — text, image and video from one sovereign system.",
    overview: [
      "The ARACANA Generative Model is a single multimodal system that writes, illustrates and animates. It treats text, image and video as one shared representation, so a prompt can flow seamlessly from a written brief to a finished visual sequence.",
      "It is built sovereignty-first: it can be trained, hosted and audited entirely inside European infrastructure, with full provenance over its training data and outputs. That makes it suitable for regulated industries — finance, public sector, media — where data residency and auditability are non-negotiable.",
      "Quality is aligned with reinforcement learning against a blend of human-preference and rule-based rewards, so the model learns brand-grade tone, factual grounding and visual fidelity rather than generic averages.",
    ],
    capabilities: [
      { title: "Long-context multilingual text", desc: "Drafting, rewriting and reasoning across European languages with long-document context." },
      { title: "High-fidelity image synthesis", desc: "Generation and precise editing with layout, style and brand constraints." },
      { title: "Controllable video", desc: "Short-form video generation with consistent characters, motion and shot control." },
      { title: "Grounded & cited", desc: "Optional retrieval grounding so generated text can be traced to sources." },
    ],
    specs: [
      { label: "Modalities", value: "Text, Image, Video" },
      { label: "Context", value: "Long-context (target 128K+ tokens)" },
      { label: "Alignment", value: "Reinforcement Learning + human preference" },
      { label: "Deployment", value: "Cloud / On-prem / Sovereign" },
      { label: "Status", value: "Soon" },
    ],
    rewardIntro:
      "For generation, no single verifier can say an answer is 'correct'. We therefore blend several reward signals across a batch of sampled candidates.",
    rewardComponents: [
      { signal: "Human-preference reward model", weight: "0.50", desc: "Learned from European annotators ranking pairs of outputs for helpfulness and tone." },
      { signal: "Factual-grounding check", weight: "0.20", desc: "Rewards claims that are supported by retrieved sources; penalises hallucination." },
      { signal: "Aesthetic / fidelity model", weight: "0.20", desc: "For image & video: scores resolution, coherence and prompt alignment." },
      { signal: "Safety & policy filter", weight: "0.10", desc: "Hard penalty for unsafe or non-compliant content." },
    ],
    rewardExample:
      "Example: for one prompt we sample 16 captions for an image. Each caption is scored by the preference model and the grounding check, the scores are combined and compared across the 16 candidates. The caption that is both well-written and faithful to the image scores highest and is reinforced.",
  },
  {
    slug: "coding-agent-model",
    name: "Coding Agent Model",
    codename: "FORGE",
    fullName: "ARACANA Coding Agent Model",
    modality: "Autonomous software engineering",
    status: "soon",
    background: false,
    tagline: "An autonomous software engineer you can run on-premise.",
    summary:
      "A coding agent that plans, edits, runs and tests real codebases — verifying its own work against tests and types before proposing a change.",
    overview: [
      "The ARACANA Coding Agent Model is trained to operate over real repositories, not isolated snippets. It reads the project, plans a change, edits multiple files, runs the test suite, reads the failures and iterates — with a human in the loop at every gate.",
      "Because correctness in software is verifiable (it compiles or it doesn't; tests pass or they don't), it is an ideal target for reinforcement learning: the reward is grounded in deterministic execution rather than opinion, which produces a clean, low-noise training signal.",
      "It is designed for sensitive environments: it can run fully air-gapped, so proprietary or classified source code never leaves sovereign infrastructure.",
    ],
    capabilities: [
      { title: "Repo-scale reasoning", desc: "Understands and edits across many files and modules at once." },
      { title: "Self-verifying execution", desc: "Runs builds, tests and type-checks and reads their output to correct itself." },
      { title: "Plan → act → review", desc: "Produces an auditable plan and diff for human approval before merge." },
      { title: "Air-gapped deployment", desc: "Runs on-premise with zero external calls for classified codebases." },
    ],
    specs: [
      { label: "Interface", value: "CLI · IDE · API" },
      { label: "Verification", value: "Build + tests + type-check" },
      { label: "Alignment", value: "Reinforcement Learning (execution)" },
      { label: "Deployment", value: "On-prem / Air-gapped" },
      { label: "Status", value: "Soon" },
    ],
    rewardIntro:
      "Code is verifiable, so the reward is almost entirely rule-based — the cleanest possible reinforcement signal. We sample many candidate patches and execute every one.",
    rewardComponents: [
      { signal: "Tests passing", weight: "0.55", desc: "Fraction of the relevant test suite that goes from red to green." },
      { signal: "Compiles / type-checks", weight: "0.20", desc: "Binary gate: the patch must build and type-check." },
      { signal: "No regressions", weight: "0.15", desc: "Penalty for any previously-passing test that the patch breaks." },
      { signal: "Diff minimality & style", weight: "0.10", desc: "Rewards small, idiomatic, lint-clean changes over sprawling ones." },
    ],
    rewardExample:
      "Example: a bug ticket is the prompt. We sample 8 candidate patches, apply each in a sandbox, and run the suite. Patch o₃ fixes the bug and breaks nothing (R = 1.0); patch o₅ fixes it but breaks two other tests (R = 0.4); patch o₇ doesn't compile (R = 0). The model is reinforced toward o₃ and away from o₇ — no human label required.",
  },
  {
    slug: "state-space-sovereignty-model",
    name: "State Space Sovereignty Model",
    codename: "AEGIS",
    fullName: "ARACANA State Space Sovereignty Model",
    modality: "Sovereign decision intelligence",
    status: "soon",
    background: false,
    tagline: "Auditable decision intelligence for sovereign institutions.",
    summary:
      "A long-horizon, state-space model for sovereign decision support — efficient over very long sequences, auditable end-to-end, and deployable fully on national infrastructure.",
    overview: [
      "The ARACANA State Space Sovereignty Model is built on a state-space backbone, giving it near-linear scaling over extremely long sequences — months of signals, sensor streams or documents held in a single context. This makes it well-suited to situational awareness and long-horizon decision support.",
      "Every inference is traceable. The model exposes the evidence and intermediate state behind each recommendation, so a human authority can audit why a conclusion was reached — a hard requirement for defense, critical infrastructure and public-sector use.",
      "It is sovereign by construction: weights, training and inference can be hosted entirely within national infrastructure, with no dependency on foreign clouds, and aligned with European command and accountability structures.",
    ],
    capabilities: [
      { title: "Very-long-horizon context", desc: "State-space backbone scales near-linearly over very long sequences." },
      { title: "Auditable decisions", desc: "Exposes supporting evidence and internal state for human review." },
      { title: "Multi-source fusion", desc: "Integrates documents, signals and time-series into one situational picture." },
      { title: "Sovereign deployment", desc: "Fully on-premise, air-gapped, no foreign-cloud dependency." },
    ],
    specs: [
      { label: "Architecture", value: "State-space (linear-time)" },
      { label: "Context", value: "Ultra-long horizon" },
      { label: "Alignment", value: "Reinforcement Learning + causal modelling" },
      { label: "Deployment", value: "Sovereign / Air-gapped" },
      { label: "Status", value: "Soon" },
    ],
    rewardIntro:
      "Sovereign decision support must be correct AND accountable. The reward therefore combines outcome accuracy with a strong premium on traceability and human-authority preservation.",
    rewardComponents: [
      { signal: "Decision accuracy", weight: "0.40", desc: "Correctness against verified historical or simulated outcomes." },
      { signal: "Evidence faithfulness", weight: "0.30", desc: "Every recommendation must cite supporting state/evidence that checks out." },
      { signal: "Calibration", weight: "0.20", desc: "Rewards well-calibrated confidence; penalises overconfident errors." },
      { signal: "Authority-preserving", weight: "0.10", desc: "Penalises outputs that bypass required human approval." },
    ],
    rewardExample:
      "Example: on a replayed historical scenario, we sample 12 candidate assessments. Each is scored for whether it matched the known outcome, whether its cited evidence is real, and whether its confidence was calibrated. The model is reinforced toward assessments that were both right and honestly evidenced — not merely confident.",
  },
  {
    slug: "multi-agent-system",
    name: "Multi-Agent System",
    codename: "SWARM",
    fullName: "ARACANA Multi-Agent System",
    modality: "Orchestrated agent fleets",
    status: "development",
    background: true,
    tagline: "Fleets of specialised agents that solve what one model can't.",
    summary:
      "An orchestration layer where specialised agents plan, negotiate and self-organise under central oversight — in active development.",
    overview: [
      "The ARACANA Multi-Agent System coordinates many specialised agents — researchers, coders, verifiers, planners — into a single problem-solving fleet. A central orchestrator decomposes a goal, assigns roles, and reconciles the results.",
      "Agents share a verifiable memory and communicate over an auditable channel, so the whole system's reasoning can be inspected after the fact. Central oversight keeps emergent behaviour bounded.",
      "This system is in active development and underpins our other products by letting them call on each other. Its public availability will be announced separately.",
    ],
    capabilities: [
      { title: "Role-specialised agents", desc: "Each agent is tuned for a narrow, well-defined function." },
      { title: "Verifiable communication", desc: "All inter-agent messages are logged and auditable." },
      { title: "Shared memory", desc: "A common, consistent memory keeps the fleet coordinated." },
      { title: "Central oversight", desc: "An orchestrator bounds emergent behaviour and keeps humans in control." },
    ],
    specs: [
      { label: "Pattern", value: "Orchestrator + specialists" },
      { label: "Comms", value: "Auditable, logged" },
      { label: "Alignment", value: "Reinforcement Learning (agent + system)" },
      { label: "Deployment", value: "Cloud / On-prem" },
      { label: "Status", value: "In development" },
    ],
    rewardIntro:
      "Multi-agent training adds a system-level reward on top of each agent's own reinforcement signal: the fleet is rewarded for the quality of the final, jointly-produced result.",
    rewardComponents: [
      { signal: "Task success (system)", weight: "0.50", desc: "Did the fleet solve the overall goal, verified end-to-end?" },
      { signal: "Per-agent contribution", weight: "0.25", desc: "Credit assignment: how much each agent's output helped." },
      { signal: "Communication efficiency", weight: "0.15", desc: "Rewards reaching the goal with fewer, clearer messages." },
      { signal: "Safety & oversight", weight: "0.10", desc: "Penalty for actions that escape the orchestrator's bounds." },
    ],
    rewardExample:
      "Example: a fleet of 4 agents tackles a research-and-build task. We sample several full rollouts of the fleet, score each rollout on whether the final artifact passed verification, then compare across rollouts. Agents whose rollouts succeeded are reinforced, with credit shared according to their measured contribution.",
  },
  {
    slug: "ai-scientist",
    name: "AI Scientist",
    codename: "CURIE",
    fullName: "ARACANA AI Scientist",
    modality: "Autonomous scientific discovery",
    status: "development",
    background: true,
    tagline: "From hypothesis to drug candidate to disease pathway.",
    summary:
      "An autonomous research engine for scientific discovery — generating hypotheses, designing molecules and mapping disease pathways — in active development.",
    overview: [
      "The ARACANA AI Scientist closes the scientific loop: it proposes hypotheses, designs experiments or molecules, evaluates results against simulators and literature, and refines its next proposal. It is aimed squarely at drug discovery and disease understanding.",
      "It is mechanism-informed: rather than pattern-matching on chemical strings, it reasons with the underlying biology and physics — binding mechanisms, pathways, conservation laws — so its proposals are physically plausible, not just statistically likely.",
      "This system is in active development. Its outputs are intended to assist, accelerate and be verified by human scientists, never to replace expert and regulatory review.",
    ],
    capabilities: [
      { title: "Hypothesis generation", desc: "Proposes and ranks testable scientific hypotheses." },
      { title: "Molecular design", desc: "Designs candidate molecules under drug-likeness and synthesis constraints." },
      { title: "Pathway analysis", desc: "Maps disease mechanisms and identifies promising targets." },
      { title: "Simulator-grounded", desc: "Evaluates proposals against physics/biology simulators before suggesting them." },
    ],
    specs: [
      { label: "Domains", value: "Drug discovery · Biology" },
      { label: "Grounding", value: "Simulators + literature" },
      { label: "Alignment", value: "Reinforcement Learning (simulator)" },
      { label: "Deployment", value: "Sovereign / On-prem" },
      { label: "Status", value: "In development" },
    ],
    rewardIntro:
      "Scientific proposals can be partially verified by simulation and known constraints, which gives a strong, mechanism-grounded reward signal without waiting for wet-lab results.",
    rewardComponents: [
      { signal: "Simulated efficacy", weight: "0.40", desc: "Predicted binding / activity from physics-based simulators." },
      { signal: "Drug-likeness & safety", weight: "0.25", desc: "ADMET and toxicity proxies; hard penalty for unsafe candidates." },
      { signal: "Synthesizability", weight: "0.20", desc: "Rewards molecules that can plausibly be made." },
      { signal: "Novelty", weight: "0.15", desc: "Rewards genuinely new candidates over rediscoveries." },
    ],
    rewardExample:
      "Example: for one target, the model proposes 32 candidate molecules. Each is scored by a docking simulator, a toxicity model and a synthesis-route predictor. The blended score is compared across the 32, reinforcing candidates that are simultaneously potent, safe and makeable — the molecules worth taking to a human lab.",
  },
];

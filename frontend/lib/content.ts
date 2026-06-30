/* Editorial content for Research, Solutions and Careers.
   All copy is production-grade placeholder authored for ARACANA AI.
   Real figures/benchmarks land in V2. */

export type ResearchAxis = {
  id: string;
  index: string;
  title: string;
  abstract: string;
  points: string[];
};

export const RESEARCH: ResearchAxis[] = [
  {
    id: "recursive-self-improvement",
    index: "01",
    title: "Recursive Self-Improvement",
    abstract:
      "We study AI systems that improve their own learning process. Instead of a single static training run, an ARACANA model proposes refinements to its data curation, reward shaping and optimisation schedule, evaluates them, and folds the winning changes back into the next iteration — a controlled, auditable loop rather than an open-ended one.",
    points: [
      "Self-curated curricula: the model ranks and re-weights its own training mixtures under a measurable proxy of capability and safety.",
      "Reward-model co-training, where the evaluator and the policy improve together under explicit guardrails and human checkpoints.",
      "Verifiable improvement: every self-edit is logged, reproducible and gated by held-out evaluations before it is allowed to persist.",
    ],
  },
  {
    id: "mechanism-informed",
    index: "02",
    title: "Mechanism-Informed Multimodal AI",
    abstract:
      "Frontier models that respect the mechanisms of the physical world. We fuse language, vision, signals and structured simulation so that an ARACANA model reasons with the laws of a domain — physics, chemistry, biology, control — rather than only with surface correlations in text.",
    points: [
      "Physics- and biology-aware priors injected directly into the architecture and the loss.",
      "Cross-modal grounding: text, image, video, time-series and molecular structure share one latent space.",
      "Mechanism consistency checks that flag outputs violating known conservation laws or biological constraints.",
    ],
  },
  {
    id: "state-integrity",
    index: "03",
    title: "State Integrity & Sovereignty",
    abstract:
      "AI that strengthens, rather than erodes, the autonomy of European states. We design models that can be trained, audited, hosted and governed entirely within sovereign infrastructure, with verifiable provenance and on-premise deployment as first-class requirements.",
    points: [
      "Sovereign-by-construction: training, weights and inference can live fully inside national infrastructure.",
      "Provenance and auditability of data, model lineage and every decision the system makes.",
      "Resilience and integrity guarantees for critical-function deployments under adversarial conditions.",
    ],
  },
];

export type Solution = {
  id: string;
  title: string;
  summary: string;
  capabilities: string[];
  status: "available" | "soon" | "research";
};

export const SOLUTIONS: Solution[] = [
  {
    id: "generative",
    title: "Generative AI",
    summary:
      "Sovereign generation across text, image and video — built for European languages, regulation and brand-grade quality.",
    capabilities: [
      "Long-context multilingual text generation",
      "High-fidelity image synthesis & editing",
      "Controllable video generation",
    ],
    status: "soon",
  },
  {
    id: "coding-agent",
    title: "Coding Agent",
    summary:
      "An autonomous software engineer that plans, edits, tests and ships across real repositories with human-in-the-loop control.",
    capabilities: [
      "Repo-scale reasoning and refactoring",
      "Test-driven, self-verifying execution",
      "On-premise / air-gapped deployment",
    ],
    status: "soon",
  },
  {
    id: "ai-scientist",
    title: "AI Scientist",
    summary:
      "An autonomous research engine for scientific discovery — from hypothesis to drug-candidate to disease pathway analysis.",
    capabilities: [
      "Automated hypothesis generation & testing",
      "Drug discovery & molecular design",
      "Disease-pathway and target identification",
    ],
    status: "research",
  },
  {
    id: "space",
    title: "Space & Very-High Altitude",
    summary:
      "Onboard intelligence for satellites, stratospheric platforms and very-high-altitude systems operating with limited compute and connectivity.",
    capabilities: [
      "Edge inference under power & latency limits",
      "Earth-observation analysis pipelines",
      "Autonomous tasking & anomaly detection",
    ],
    status: "research",
  },
  {
    id: "defense",
    title: "State Defense",
    summary:
      "Decision-support and integrity systems for sovereign defense — auditable, on-premise and aligned with European command structures.",
    capabilities: [
      "Sovereign, air-gapped deployment",
      "Multi-source situational awareness",
      "Human-authority-preserving decision support",
    ],
    status: "research",
  },
  {
    id: "multi-agent",
    title: "Multi-Agent Systems",
    summary:
      "Fleets of specialised agents that coordinate, negotiate and self-organise to solve problems no single model can.",
    capabilities: [
      "Role-specialised agent orchestration",
      "Shared memory & verifiable communication",
      "Emergent planning with central oversight",
    ],
    status: "research",
  },
];

export type Value = { title: string; body: string };

export const ABOUT_VALUES: Value[] = [
  {
    title: "Sovereignty first",
    body: "We build AI that European states and enterprises can own, audit and run on their own terms — never as a black box rented from elsewhere.",
  },
  {
    title: "Frontier, responsibly",
    body: "We push capability hard, but every self-improvement loop is measurable, reversible and gated by human checkpoints.",
  },
  {
    title: "Mechanism over mimicry",
    body: "We prefer models that understand the mechanisms of a domain to models that merely imitate its surface.",
  },
  {
    title: "Useful in the real world",
    body: "From industrial workflows to finance to everyday tasks, our work is judged by the value it creates outside the lab.",
  },
];

export type OpenRole = {
  title: string;
  team: string;
  location: string;
  type: string;
};

export const ROLES: OpenRole[] = [
  {
    title: "Research Scientist — Recursive Self-Improvement",
    team: "Research",
    location: "Paris / Remote (EU)",
    type: "Full-time",
  },
  {
    title: "Member of Technical Staff — Reinforcement Learning",
    team: "Training",
    location: "Paris / Remote (EU)",
    type: "Full-time",
  },
  {
    title: "Research Engineer — Multimodal Pretraining",
    team: "Research",
    location: "Brussels / Remote (EU)",
    type: "Full-time",
  },
  {
    title: "Software Engineer — Coding Agent",
    team: "Product",
    location: "Paris / Remote (EU)",
    type: "Full-time",
  },
  {
    title: "Infrastructure Engineer — Sovereign Compute",
    team: "Platform",
    location: "Paris / On-site",
    type: "Full-time",
  },
  {
    title: "Computational Biologist — AI Scientist",
    team: "Science",
    location: "Remote (EU)",
    type: "Full-time",
  },
];

export const TEAMS = [
  "Research",
  "Training",
  "Product",
  "Platform",
  "Science",
  "Operations",
];

/* Our research approach — framed around two forces: Reinforcement Learning
   and Causality. No method names exposed; this is the public narrative. */

export const METHOD = {
  eyebrow: "Approach",
  title: "How our models learn",
  subtitle: "Reinforcement Learning × Causality",
  lede: "We drive our research with two forces. Reinforcement learning lets a model improve from outcomes — it proposes, is scored, and reinforces what works. Causality lets it reason about cause and effect, not mere correlation — so it generalises, stays robust, and explains itself.",
  pillars: [
    {
      tag: "01",
      title: "Reinforcement Learning",
      body: "The model proposes many candidate answers, each is scored against verifiable outcomes and human preference, and the model is nudged toward what scores well and away from what doesn't — under human oversight at every checkpoint.",
      points: [
        "Outcome-grounded rewards, not opinion alone",
        "Sample broadly, reinforce the best",
        "Every improvement gated by held-out evaluation",
      ],
    },
    {
      tag: "02",
      title: "Causality",
      body: "We teach models the causal structure of a domain — the mechanisms behind the data. Reasoning over cause, effect and counterfactuals (“what would happen if…”) makes the model robust to spurious correlations and able to justify its decisions.",
      points: [
        "Mechanism-informed, not correlation-only",
        "Counterfactual reasoning for robustness",
        "Decisions that can be explained and audited",
      ],
    },
  ],
  loop: [
    { n: "01", title: "Propose", body: "The model generates a diverse set of candidate responses for each situation." },
    { n: "02", title: "Evaluate", body: "Each candidate is scored — by verifiers, simulators, human preference, and a causal-consistency check." },
    { n: "03", title: "Reinforce", body: "The model is updated toward high-scoring, causally-sound behaviour, then re-evaluated before promotion." },
  ],
  note: "V1 ships production-grade placeholder content describing our public approach. Detailed methods, benchmarks and reference results land in V2.",
};

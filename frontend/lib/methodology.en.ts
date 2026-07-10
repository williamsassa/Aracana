/* Our research approach — framed around two forces: Reinforcement Learning
   and Causality. No method names exposed; this is the public narrative. */

export const METHOD_EN = {
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

/* Wider 5-stage research loop used on the Research page (distinct granularity
   from METHOD.loop, which drives the compact MethodologySection on product pages). */
export const RESEARCH_LOOP_EN = [
  { n: "01", title: "Propose", body: "Generate a diverse set of candidate hypotheses, models or responses for the problem at hand." },
  { n: "02", title: "Evaluate", body: "Score each candidate against verifiers, simulators and human preference." },
  { n: "03", title: "Causal Analysis", body: "Test whether the winning candidates hold up under counterfactual and mechanism-level scrutiny, not just correlation." },
  { n: "04", title: "Reinforce", body: "Update the model toward candidates that are both high-scoring and causally sound." },
  { n: "05", title: "Iterate", body: "Fold the verified improvement back into the next round — a controlled, auditable loop." },
];

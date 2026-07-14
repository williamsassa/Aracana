/* Our alignment approach — framed around an explicit mathematical objective,
   not an opaque preference. No proprietary formulation exposed; this is the
   public narrative. V2: replaces the earlier "Reinforcement Learning ×
   Causality" framing with "Alignment: A Mathematical Model". */

export const METHOD_EN = {
  eyebrow: "Approach",
  title: "How we align our models",
  subtitle: "Alignment: A Mathematical Model",
  lede: "We do not align models by hand-tuned intuition. Every model is judged against an explicit objective function — a formula, not a feeling — so what 'good' means is written down, inspectable, and falsifiable before a single weight is updated.",
  formula: {
    display: "R(x) = w₁·Outcome(x) + w₂·Consistency(x) + w₃·Calibration(x)",
    caption: "A representative shape of the objective a model is optimised against — the real weights and terms are product-specific (see the signals below).",
  },
  pillars: [
    {
      tag: "01",
      title: "Explicit Objective",
      body: "Every model optimises a named, written-down function of its outputs — not an implicit house style. Candidates are scored against that function, and the model is nudged toward what scores well, under human oversight at every checkpoint.",
      points: [
        "The objective is specified before training, not inferred after the fact",
        "Every term in the function is named and independently inspectable",
        "Every improvement gated by held-out evaluation against that same function",
      ],
    },
    {
      tag: "02",
      title: "Verifiable Structure",
      body: "A mathematical objective is only trustworthy if it holds up under scrutiny — so we test each model's behaviour against counterfactuals and known constraints, not just average-case performance, catching objectives that look good on paper but reward the wrong thing.",
      points: [
        "Stress-tested against counterfactuals, not just held-out averages",
        "Consistency checks flag outputs that violate known constraints",
        "Every score is reproducible and auditable after the fact",
      ],
    },
  ],
  loop: [
    { n: "01", title: "Formulate", body: "Define the objective function for the task — the explicit formula a candidate is scored against." },
    { n: "02", title: "Optimise", body: "Sample a diverse set of candidates and score every one against that objective." },
    { n: "03", title: "Verify", body: "Stress-test the winning candidates for consistency before the update is allowed to persist." },
  ],
  note: "V1 ships production-grade placeholder content describing our public approach. The exact objective functions, benchmarks and reference results land in V2.",
};

/* Wider 5-stage research loop used on the Research page (distinct granularity
   from METHOD.loop, which drives the compact MethodologySection on product pages). */
export const RESEARCH_LOOP_EN = [
  { n: "01", title: "Formulate", body: "Write down an explicit objective function for the problem at hand — what 'good' means, as a formula, before anything is trained." },
  { n: "02", title: "Evaluate", body: "Score a diverse set of candidates against that objective, using verifiers, simulators and human preference where each applies." },
  { n: "03", title: "Verify", body: "Stress-test the leading candidates against counterfactuals and known constraints — not just average-case scores." },
  { n: "04", title: "Optimise", body: "Update the model toward candidates that are both high-scoring and verifiably consistent." },
  { n: "05", title: "Iterate", body: "Fold the verified improvement back into the next round — a controlled, auditable loop." },
];

import type { Metadata } from "next";
import { SectionHeading } from "@/components/Bits";
import Reveal from "@/components/Reveal";
import { RESEARCH } from "@/lib/content";

export const metadata: Metadata = {
  title: "Research",
  description:
    "ARACANA AI research: recursive self-improvement, mechanism-informed multimodal AI, and state integrity & sovereignty.",
};

export default function ResearchPage() {
  return (
    <>
      <section className="container-x py-20 md:py-28">
        <Reveal>
          <div className="eyebrow">Research</div>
          <h1 className="display-1 mt-4 max-w-4xl">
            Pushing the frontier, under sovereign control.
          </h1>
          <p className="lead mt-6 max-w-2xl">
            Our research turns three long-horizon bets into the models behind
            every ARACANA product. Two forces drive everything we train:
            reinforcement learning and causality.
          </p>
        </Reveal>
      </section>

      <div className="hairline" />

      {RESEARCH.map((r, i) => (
        <section
          key={r.id}
          id={r.id}
          className="scroll-mt-28 border-b border-paper-line"
        >
          <div className="container-x grid gap-10 py-20 md:grid-cols-[0.8fr_1.2fr] md:py-28">
            <Reveal>
              <div className="md:sticky md:top-28">
                <div className="font-mono text-sm text-accent">{r.index}</div>
                <h2 className="display-2 mt-3">{r.title}</h2>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div>
                <p className="text-lg leading-relaxed text-ink-soft">
                  {r.abstract}
                </p>
                <ul className="mt-8 space-y-4">
                  {r.points.map((p) => (
                    <li key={p} className="flex gap-4">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span className="text-ink-soft">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>
      ))}

      <section className="container-x py-20 md:py-28">
        <Reveal>
          <SectionHeading
            eyebrow="Approach"
            title="Reinforcement Learning × Causality."
            intro="Reinforcement learning lets our models improve from outcomes; causality lets them reason about cause and effect rather than correlation. Together they make models that are capable, robust and explainable. See how it applies on any product page."
          />
          <div className="mt-8">
            <a
              href="/products/coding-agent-model#methodology"
              className="btn-dark"
            >
              See our approach
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { SectionHeading } from "@/components/Bits";
import Reveal from "@/components/Reveal";
import { ROLES, TEAMS } from "@/lib/content";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join ARACANA AI. We are hiring researchers and engineers across Europe to build sovereign frontier AI.",
};

export default function CareersPage() {
  return (
    <>
      <section className="container-x py-20 md:py-28">
        <Reveal>
          <div className="eyebrow">Careers</div>
          <h1 className="display-1 mt-4 max-w-4xl">
            Build the AI Europe can call its own.
          </h1>
          <p className="lead mt-6 max-w-2xl">
            We are a focused team of researchers and engineers. We move fast,
            publish our methods, and care deeply about sovereignty, safety and
            real-world impact.
          </p>
        </Reveal>
      </section>

      {/* Why join */}
      <section className="border-y border-paper-line bg-paper-soft">
        <div className="container-x grid gap-8 py-16 md:grid-cols-3">
          {[
            ["Frontier work", "Train and align models with reinforcement learning, causality and recursive self-improvement — at the edge of what's possible."],
            ["Sovereign mission", "Your work strengthens European autonomy in the most strategic technology of the century."],
            ["Real ownership", "Small team, high trust, direct impact. No layers between you and the model."],
          ].map(([t, d], i) => (
            <Reveal key={t} delay={i * 100}>
              <div>
                <div className="font-mono text-sm text-accent">0{i + 1}</div>
                <h3 className="mt-3 font-display text-xl text-ink">{t}</h3>
                <p className="mt-2 text-sm text-ink-muted">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Teams */}
      <section className="container-x py-16 md:py-20">
        <Reveal>
          <SectionHeading eyebrow="Teams" title="Where you could fit." />
          <div className="mt-8 flex flex-wrap gap-3">
            {TEAMS.map((t) => (
              <span
                key={t}
                className="rounded-full border border-paper-line bg-paper-raised px-5 py-2 font-display text-sm text-ink-soft"
              >
                {t}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Open roles */}
      <section className="container-x pb-24">
        <Reveal>
          <SectionHeading eyebrow="Open roles" title="Now hiring." />
        </Reveal>
        <div className="mt-10 overflow-hidden rounded-2xl border border-paper-line">
          {ROLES.map((r, i) => (
            <Reveal key={r.title} delay={(i % 3) * 60}>
              <a
                href={`mailto:${SITE.email}?subject=${encodeURIComponent(
                  "Application — " + r.title
                )}`}
                className="group grid grid-cols-1 items-center gap-3 border-b border-paper-line bg-paper-raised p-6 transition-colors last:border-0 hover:bg-paper-soft md:grid-cols-[1.6fr_0.9fr_0.7fr_auto]"
              >
                <div className="font-display text-lg text-ink">{r.title}</div>
                <div className="text-sm text-ink-muted">{r.location}</div>
                <div className="font-mono text-[11px] uppercase tracking-wide2 text-ink-faint">
                  {r.team} · {r.type}
                </div>
                <span className="font-mono text-[12px] uppercase tracking-wide2 text-ink transition-transform group-hover:translate-x-1">
                  Apply →
                </span>
              </a>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="mt-8 text-sm text-ink-muted">
            Don&apos;t see your role?{" "}
            <a
              href={`mailto:${SITE.email}?subject=Open%20application`}
              className="link-underline"
            >
              Send us an open application
            </a>
            .
          </p>
        </Reveal>
      </section>
    </>
  );
}

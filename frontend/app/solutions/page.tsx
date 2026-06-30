import type { Metadata } from "next";
import Link from "next/link";
import { StatusBadge } from "@/components/Bits";
import Reveal from "@/components/Reveal";
import { SOLUTIONS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "ARACANA AI solutions across generative AI, coding agents, AI scientist, space & very-high altitude, state defense and multi-agent systems.",
};

export default function SolutionsPage() {
  return (
    <>
      <section className="container-x py-20 md:py-28">
        <Reveal>
          <div className="eyebrow">Solutions</div>
          <h1 className="display-1 mt-4 max-w-4xl">
            Frontier AI, applied where it matters.
          </h1>
          <p className="lead mt-6 max-w-2xl">
            Six domains, one sovereign stack — engineered for European industry,
            finance, science, space and defense.
          </p>
        </Reveal>
      </section>

      <div className="hairline" />

      {SOLUTIONS.map((s, i) => (
        <section
          key={s.id}
          id={s.id}
          className="scroll-mt-28 border-b border-paper-line"
        >
          <div className="container-x grid items-start gap-10 py-16 md:grid-cols-[0.9fr_1.1fr] md:py-20">
            <Reveal>
              <div className="flex items-center gap-4">
                <span className="font-mono text-sm text-ink-faint">
                  0{i + 1}
                </span>
                <StatusBadge status={s.status} />
              </div>
              <h2 className="display-2 mt-4">{s.title}</h2>
            </Reveal>
            <Reveal delay={120}>
              <div>
                <p className="text-lg leading-relaxed text-ink-soft">
                  {s.summary}
                </p>
                <div className="mt-7 grid gap-3 sm:grid-cols-1">
                  {s.capabilities.map((c) => (
                    <div
                      key={c}
                      className="flex items-center gap-3 rounded-xl border border-paper-line px-4 py-3"
                    >
                      <span className="font-mono text-xs text-accent">+</span>
                      <span className="text-sm text-ink-soft">{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      ))}

      <section className="container-x py-20 text-center md:py-28">
        <Reveal>
          <h2 className="display-2">See the models behind the solutions.</h2>
          <div className="mt-8">
            <Link href="/products" className="btn-dark">
              Explore Products
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}

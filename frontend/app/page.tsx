import Link from "next/link";
import { HeroWordmark } from "@/components/Logo";
import { Orb, SectionHeading, ArrowLink } from "@/components/Bits";
import Reveal from "@/components/Reveal";
import OurModels from "@/components/OurModels";
import { SOLUTIONS, RESEARCH } from "@/lib/content";
import { SITE } from "@/lib/site";

export default function Home() {
  return (
    <>
      {/* ───────── Hero ───────── */}
      <section className="relative overflow-hidden">
        <div className="dot-grid absolute inset-0 -z-10 opacity-60" />
        <div className="container-x relative flex min-h-[78vh] flex-col items-center justify-center py-24 text-center">
          <Orb className="absolute -top-6 right-[6%] hidden h-40 w-40 md:block" />
          <Orb className="absolute bottom-10 left-[4%] hidden h-24 w-24 opacity-70 md:block" />

          <Reveal>
            <HeroWordmark />
          </Reveal>
          <Reveal delay={120}>
            <p className="lead mt-8 max-w-2xl">{SITE.tagline}</p>
          </Reveal>
          <Reveal delay={220}>
            <p className="mt-3 max-w-xl text-sm text-ink-muted">
              AI for the sovereignty of European states and the expansion of
              artificial intelligence across industry, finance and everyday
              life.
            </p>
          </Reveal>
          <Reveal delay={320}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link href="/products" className="btn-dark">
                Explore Products
              </Link>
              <Link href="/research" className="btn-ghost">
                Our Research
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────── Mission strip ───────── */}
      <section className="border-y border-paper-line bg-paper-soft">
        <div className="container-x grid gap-8 py-12 md:grid-cols-3">
          {[
            ["Sovereign by design", "Trained, hosted and audited on European infrastructure."],
            ["Frontier capability", "Recursive self-improvement under human oversight."],
            ["Real-world useful", "From industry and finance to everyday tasks."],
          ].map(([t, d], i) => (
            <Reveal key={t} delay={i * 100}>
              <div className="flex gap-4">
                <span className="font-mono text-sm text-accent">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="font-display text-lg text-ink">{t}</h3>
                  <p className="mt-1 text-sm text-ink-muted">{d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────── Solutions ───────── */}
      <section className="container-x py-24 md:py-32">
        <Reveal>
          <SectionHeading
            eyebrow="Solutions"
            title="Six domains, one sovereign stack."
            intro="ARACANA AI builds across the frontier — from generation to autonomous science to state defense."
          />
        </Reveal>
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-paper-line bg-paper-line md:grid-cols-2 lg:grid-cols-3">
          {SOLUTIONS.map((s, i) => (
            <Reveal key={s.id} delay={(i % 3) * 80}>
              <Link
                href={`/solutions#${s.id}`}
                className="group flex h-full flex-col bg-paper-raised p-7 transition-colors hover:bg-paper-soft"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-ink-faint">
                    0{i + 1}
                  </span>
                  <span className="text-ink-faint transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>
                <h3 className="mt-6 font-display text-xl text-ink">
                  {s.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
                  {s.summary}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="mt-8">
          <ArrowLink href="/solutions">All solutions</ArrowLink>
        </div>
      </section>

      {/* ───────── Our Models (Palantir-style showcase) ───────── */}
      <OurModels />

      {/* ───────── Research ───────── */}
      <section className="container-x py-24 md:py-32">
        <Reveal>
          <SectionHeading
            eyebrow="Research"
            title="Where we push the frontier."
            intro="Three long-horizon research axes underpin everything we build."
          />
        </Reveal>
        <div className="mt-14 divide-y divide-paper-line border-y border-paper-line">
          {RESEARCH.map((r, i) => (
            <Reveal key={r.id} delay={i * 80}>
              <Link
                href={`/research#${r.id}`}
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-6 py-7 transition-colors hover:bg-paper-soft md:gap-10"
              >
                <span className="font-mono text-sm text-ink-faint">
                  {r.index}
                </span>
                <div>
                  <h3 className="font-display text-xl text-ink md:text-2xl">
                    {r.title}
                  </h3>
                  <p className="mt-1.5 max-w-2xl text-sm text-ink-muted">
                    {r.abstract.split(". ")[0]}.
                  </p>
                </div>
                <span className="text-ink-faint transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────── CTA ───────── */}
      <section className="border-t border-paper-line bg-paper-soft">
        <div className="container-x flex flex-col items-center gap-6 py-24 text-center">
          <Reveal>
            <h2 className="display-2 max-w-2xl">
              Build sovereign frontier AI with us.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="lead max-w-xl">
              We are hiring researchers and engineers across Europe.
            </p>
          </Reveal>
          <Reveal delay={220}>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/careers" className="btn-dark">
                Open Roles
              </Link>
              <Link href="/about" className="btn-ghost">
                About ARACANA
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

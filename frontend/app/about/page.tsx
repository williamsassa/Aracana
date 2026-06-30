import type { Metadata } from "next";
import Link from "next/link";
import { Orb, SectionHeading } from "@/components/Bits";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { ABOUT_VALUES } from "@/lib/content";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "ARACANA AI builds sovereign frontier AI for European states and the expansion of AI across industry, finance and everyday life.",
};

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <Orb className="absolute -right-16 top-0 hidden h-80 w-80 opacity-70 md:block" />
        <div className="container-x py-20 md:py-28">
          <Reveal>
            <div className="eyebrow">About Us</div>
            <h1 className="display-1 mt-4 max-w-4xl">
              A European AI company, sovereign by design.
            </h1>
            <p className="lead mt-6 max-w-2xl">
              ARACANA AI builds frontier artificial intelligence for the
              sovereignty of European states and for the expansion of AI across
              industrial professions, finance and the tasks of everyday life.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Mission */}
      <section className="border-y border-paper-line bg-paper-soft">
        <div className="container-x grid gap-10 py-20 md:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <h2 className="display-2">Our mission</h2>
          </Reveal>
          <Reveal delay={120}>
            <div className="space-y-5 text-lg leading-relaxed text-ink-soft">
              <p>
                The most strategic technology of the century should not be
                something Europe merely rents. We build models that European
                states and enterprises can own, audit, host and govern entirely
                on their own infrastructure.
              </p>
              <p>
                We pair that sovereignty with genuine frontier capability —
                recursive self-improvement, mechanism-informed multimodal
                reasoning — kept measurable, reversible and under human control
                at every step.
              </p>
              <p>
                And we hold ourselves to a simple test: our work is judged by
                the value it creates outside the lab, in industry, in finance,
                and in the everyday.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="container-x py-20 md:py-28">
        <Reveal>
          <SectionHeading eyebrow="Principles" title="What we believe." />
        </Reveal>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-paper-line bg-paper-line md:grid-cols-2">
          {ABOUT_VALUES.map((v, i) => (
            <Reveal key={v.title} delay={(i % 2) * 80}>
              <div className="h-full bg-paper-raised p-8">
                <div className="font-mono text-sm text-accent">0{i + 1}</div>
                <h3 className="mt-4 font-display text-xl text-ink">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {v.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Facts */}
      <section className="border-t border-paper-line bg-ink text-paper">
        <div className="container-x grid gap-8 py-16 md:grid-cols-3">
          {[
            ["Headquarters", SITE.location],
            ["Founded", "2026"],
            ["Focus", "Sovereign frontier AI"],
          ].map(([k, v]) => (
            <Reveal key={k}>
              <div>
                <div className="font-mono text-[11px] uppercase tracking-wide2 text-paper/40">
                  {k}
                </div>
                <div className="mt-2 font-display text-2xl text-paper">{v}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="container-x py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <div>
              <div className="eyebrow">Contact</div>
              <h2 className="display-2 mt-3">Let&apos;s talk.</h2>
              <p className="lead mt-5 max-w-md">
                For partnerships, sovereign deployments or press.
              </p>
              <div className="mt-6 space-y-2 text-sm text-ink-muted">
                <p>
                  <a href={`mailto:${SITE.email}`} className="link-underline">
                    {SITE.email}
                  </a>
                </p>
                <p>{SITE.location}</p>
                <p>
                  <Link href="/careers" className="link-underline">
                    Looking to join? See open roles →
                  </Link>
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}

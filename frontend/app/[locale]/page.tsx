import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HeroWordmark } from "@/components/Logo";
import { SectionHeading, ArrowLink } from "@/components/Bits";
import HeroSignal from "@/components/HeroSignal";
import Reveal from "@/components/Reveal";
import OurModels from "@/components/OurModels";
import { getSolutions, getResearch } from "@/lib/content";
import { TAGLINE } from "@/lib/site";
import type { Locale } from "@/i18n/config";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home" });
  const c = await getTranslations({ locale, namespace: "common" });
  const solutions = getSolutions(locale);
  const research = getResearch(locale);

  return (
    <>
      {/* ───────── Hero ───────── */}
      <section className="relative overflow-hidden">
        <div className="dot-grid absolute inset-0 -z-10 opacity-60" />
        <div className="container-x relative flex min-h-[78vh] flex-col items-center justify-center py-24 text-center">
          <HeroSignal className="absolute inset-0 -z-[1] hidden md:block" />

          <Reveal>
            <HeroWordmark />
          </Reveal>
          <Reveal delay={120}>
            <p className="lead mt-8 max-w-2xl">{TAGLINE[locale]}</p>
          </Reveal>
          <Reveal delay={220}>
            <p className="mt-3 max-w-xl text-sm text-ink-muted">
              {t("heroSubtitle")}
            </p>
          </Reveal>
          <Reveal delay={320}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link href="/products" className="btn-dark">
                {c("exploreProducts")}
              </Link>
              <Link href="/research" className="btn-ghost">
                {c("ourResearch")}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────── Mission strip ───────── */}
      <section className="border-y border-paper-line bg-paper-soft">
        <div className="container-x grid gap-8 py-12 md:grid-cols-3">
          {t.raw("missionItems").map(
            (item: { title: string; desc: string }, i: number) => (
              <Reveal key={item.title} delay={i * 100}>
                <div className="flex gap-4">
                  <span className="font-mono text-sm text-accent">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-lg text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-ink-muted">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            )
          )}
        </div>
      </section>

      {/* ───────── Solutions ───────── */}
      <section className="container-x py-24 md:py-32">
        <Reveal>
          <SectionHeading
            eyebrow={t("solutionsEyebrow")}
            title={t("solutionsTitle")}
            intro={t("solutionsIntro")}
          />
        </Reveal>
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-paper-line bg-paper-line md:grid-cols-2 lg:grid-cols-3">
          {solutions.map((s, i) => (
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
          <ArrowLink href="/solutions">{c("allSolutions")}</ArrowLink>
        </div>
      </section>

      {/* ───────── Our Models (Palantir-style showcase) ───────── */}
      <OurModels locale={locale} />

      {/* ───────── Research ───────── */}
      <section className="container-x py-24 md:py-32">
        <Reveal>
          <SectionHeading
            eyebrow={t("researchEyebrow")}
            title={t("researchTitle")}
            intro={t("researchIntro")}
          />
        </Reveal>
        <div className="mt-14 divide-y divide-paper-line border-y border-paper-line">
          {research.map((r, i) => (
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
            <h2 className="display-2 max-w-2xl">{t("ctaTitle")}</h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="lead max-w-xl">{t("ctaSubtitle")}</p>
          </Reveal>
          <Reveal delay={220}>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/careers" className="btn-dark">
                {c("openRoles")}
              </Link>
              <Link href="/about" className="btn-ghost">
                {c("aboutAracana")}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

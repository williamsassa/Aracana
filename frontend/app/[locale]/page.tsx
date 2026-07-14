import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SectionHeading, ArrowLink } from "@/components/Bits";
import HeroSceneLoader from "@/components/HeroSceneLoader";
import Reveal from "@/components/Reveal";
import OurModels from "@/components/OurModels";
import { getSolutions, getResearch, getAboutValues } from "@/lib/content";
import { TAGLINE } from "@/lib/site";
import { SPECTRUM } from "@/lib/theme-colors";
import type { Locale } from "@/i18n/config";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const c = await getTranslations({ locale, namespace: "common" });
  const solutions = getSolutions(locale);
  const research = getResearch(locale);
  const missionValues = getAboutValues(locale).slice(0, 3);

  return (
    <>
      {/* ───────── Hero ───────── */}
      <section className="relative overflow-hidden">
        <div className="dot-grid absolute inset-0 -z-10 opacity-30" />
        <div className="container-x relative grid min-h-[82vh] items-center gap-12 py-24 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <Reveal>
              <span className="eyebrow inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-spectrum-gradient" aria-hidden />
                {TAGLINE[locale]}
              </span>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="display-hero mx-auto mt-5 max-w-xl lg:mx-0">
                {t("heroTitlePrefix")}{" "}
                <span className="text-spectrum">{t("heroTitleAccent")}</span>
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="lead mx-auto mt-6 max-w-lg lg:mx-0">
                {t("heroSubtitle")}
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <Link href="/products" className="btn-dark">
                  {c("exploreProducts")}
                </Link>
                <Link href="/research" className="btn-ghost">
                  {c("ourResearch")}
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="relative h-[380px] sm:h-[460px] lg:h-[560px]">
            <HeroSceneLoader className="absolute inset-0" />
          </div>
        </div>
      </section>

      {/* ───────── Vision ───────── */}
      <section className="border-y border-paper-line bg-paper-soft">
        <div className="container-x py-12">
          <Reveal>
            <div className="eyebrow">{t("visionEyebrow")}</div>
            <h2 className="display-2 mt-3 max-w-2xl">{t("visionTitle")}</h2>
          </Reveal>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
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

      {/* ───────── Solutions ─────────
          Dynamised: glass cards (was a bare bg-paper-line grid-line trick,
          the same flat "spreadsheet" look flagged elsewhere on the site)
          plus a scoped atmospheric backdrop — brand-coloured blobs behind
          the grid rather than the global BackgroundFX's stale monochrome
          ones, contained so they never leak past this section. */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div
          className="bgfx-blob animate-blob absolute -left-16 top-0 h-[38vw] w-[38vw] opacity-50"
          style={{
            background: `radial-gradient(circle at 40% 40%, ${SPECTRUM.violet}2e, transparent 70%)`,
            mixBlendMode: "screen",
            animationDelay: "-6s",
          }}
        />
        <div
          className="bgfx-blob animate-blob absolute -right-20 bottom-0 h-[34vw] w-[34vw] opacity-40"
          style={{
            background: `radial-gradient(circle at 60% 60%, ${SPECTRUM.cyan}26, transparent 70%)`,
            mixBlendMode: "screen",
            animationDelay: "-16s",
          }}
        />
        <div className="container-x relative">
          <Reveal>
            <SectionHeading
              eyebrow={t("solutionsEyebrow")}
              title={t("solutionsTitle")}
              intro={t("solutionsIntro")}
            />
          </Reveal>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {solutions.map((s, i) => (
              <Reveal key={s.id} delay={(i % 3) * 80}>
                <Link
                  href={`/solutions#${s.id}`}
                  className="glass glass-hover group flex h-full flex-col rounded-2xl p-7"
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
        </div>
      </section>

      {/* ───────── Mission ───────── */}
      <section className="border-t border-paper-line bg-obsidian text-paper-fixed">
        <div className="container-x py-20 md:py-24">
          <Reveal>
            <div className="eyebrow text-paper-fixed/50">
              {t("missionEyebrow")}
            </div>
            <h2 className="display-2 mt-3 text-paper-fixed">
              {t("missionTitle")}
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {missionValues.map((v, i) => (
              <Reveal key={v.title} delay={i * 100}>
                <div>
                  <div className="font-mono text-sm text-accent-soft">
                    0{i + 1}
                  </div>
                  <h3 className="mt-3 font-display text-lg text-paper-fixed">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-paper-fixed/60">
                    {v.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Early Access ───────── */}
      <section id="early-access" className="scroll-mt-28 bg-paper-soft">
        <div className="container-x flex flex-col items-center gap-6 py-24 text-center">
          <Reveal>
            <h2 className="display-2 max-w-2xl">{t("ctaTitle")}</h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="lead max-w-xl">{t("ctaSubtitle")}</p>
          </Reveal>
          <Reveal delay={220}>
            <Link href="/products" className="btn-dark">
              {c("exploreProducts")}
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

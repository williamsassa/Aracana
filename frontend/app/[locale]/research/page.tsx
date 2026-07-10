import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/Bits";
import Reveal from "@/components/Reveal";
import ResearchLoop from "@/components/ResearchLoop";
import { getResearch } from "@/lib/content";
import { buildAlternates } from "@/lib/seo";
import type { Locale } from "@/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "research" });
  return {
    title: t("eyebrow"),
    description: t("lead"),
    alternates: buildAlternates("/research"),
  };
}

export default async function ResearchPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "research" });
  const c = await getTranslations({ locale, namespace: "common" });
  const research = getResearch(locale);

  return (
    <>
      <section className="container-x py-20 md:py-28">
        <Reveal>
          <div className="eyebrow">{t("eyebrow")}</div>
          <h1 className="display-1 mt-4 max-w-4xl">{t("title")}</h1>
          <p className="lead mt-6 max-w-2xl">{t("lead")}</p>
        </Reveal>
      </section>

      <div className="hairline" />

      {research.map((r, i) => (
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
            eyebrow={t("approachEyebrow")}
            title={t("approachTitle")}
            intro={t("approachIntro")}
          />
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-4">
            <div className="eyebrow">{t("loopEyebrow")}</div>
            <h3 className="mt-2 font-display text-xl text-ink">
              {t("loopTitle")}
            </h3>
          </div>
        </Reveal>
        <ResearchLoop locale={locale} />
        <Reveal>
          <div className="mt-10">
            <Link
              href="/products/coding-agent-model#methodology"
              className="btn-dark"
            >
              {c("seeOurApproach")}
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}

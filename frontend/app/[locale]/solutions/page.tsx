import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { StatusBadge } from "@/components/Bits";
import Reveal from "@/components/Reveal";
import SolutionGlyph from "@/components/SolutionGlyph";
import { getSolutions } from "@/lib/content";
import { buildAlternates } from "@/lib/seo";
import type { Locale } from "@/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "solutions" });
  return {
    title: t("eyebrow"),
    description: t("lead"),
    alternates: buildAlternates("/solutions"),
  };
}

export default async function SolutionsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "solutions" });
  const c = await getTranslations({ locale, namespace: "common" });
  const solutions = getSolutions(locale);

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

      {solutions.map((s, i) => (
        <section
          key={s.id}
          id={s.id}
          className={`scroll-mt-28 border-b border-paper-line ${
            i % 2 === 1 ? "bg-paper-soft" : ""
          }`}
        >
          <div
            className={`container-x grid items-start gap-10 py-16 md:py-20 ${
              i % 2 === 1
                ? "md:grid-cols-[1.1fr_0.9fr] md:[&>*:first-child]:order-2"
                : "md:grid-cols-[0.9fr_1.1fr]"
            }`}
          >
            <Reveal>
              <SolutionGlyph id={s.id} />
              <div className="mt-5 flex items-center gap-4">
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
                  {s.capabilities.map((cap) => (
                    <div
                      key={cap}
                      className="flex items-center gap-3 rounded-xl border border-paper-line px-4 py-3"
                    >
                      <span className="font-mono text-xs text-accent">+</span>
                      <span className="text-sm text-ink-soft">{cap}</span>
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
          <h2 className="display-2">{t("ctaTitle")}</h2>
          <div className="mt-8">
            <Link href="/products" className="btn-dark">
              {c("exploreProducts")}
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}

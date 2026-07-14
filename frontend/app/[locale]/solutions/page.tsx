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

      {/* V2.1: dense grid of compact cards replaces the 6 alternating
          full-width rows (owner feedback: too repetitive). */}
      <section className="container-x pb-24 md:pb-32">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((s, i) => (
            <Reveal key={s.id} delay={(i % 3) * 80}>
              <div
                id={s.id}
                className="glass glass-hover scroll-mt-28 flex h-full flex-col rounded-2xl p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <SolutionGlyph id={s.id} />
                  <StatusBadge status={s.status} />
                </div>
                <h2 className="mt-4 font-display text-xl text-ink">
                  {s.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
                  {s.summary}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {s.capabilities.map((cap) => (
                    <span
                      key={cap}
                      className="rounded-full border border-paper-line bg-paper-soft px-2.5 py-1 text-[11px] text-ink-muted"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-paper-line py-20 text-center md:py-28">
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

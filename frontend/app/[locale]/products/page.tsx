import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { StatusBadge } from "@/components/Bits";
import Reveal from "@/components/Reveal";
import { getFrontProducts, getBackgroundProducts } from "@/lib/products";
import { buildAlternates } from "@/lib/seo";
import type { Locale } from "@/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "products" });
  return {
    title: t("eyebrow"),
    description: t("leadPrefix"),
    alternates: buildAlternates("/products"),
  };
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "products" });
  const frontProducts = getFrontProducts(locale);
  const backgroundProducts = getBackgroundProducts(locale);

  return (
    <>
      <section className="container-x py-20 md:py-28">
        <Reveal>
          <div className="eyebrow">{t("eyebrow")}</div>
          <h1 className="display-1 mt-4 max-w-4xl">{t("title")}</h1>
          <p className="lead mt-6 max-w-2xl">
            {t("leadPrefix")} <span className="text-accent">{t("leadSuffix")}</span>.
          </p>
        </Reveal>
      </section>

      {/* Flagship products */}
      <section className="container-x pb-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {frontProducts.map((p, i) => (
            <Reveal key={p.slug} delay={i * 90}>
              <Link
                href={`/products/${p.slug}`}
                className="card group flex h-full flex-col p-8"
              >
                <div className="flex items-center justify-between">
                  <StatusBadge status={p.status} />
                  <span className="text-ink-faint transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>
                <h2 className="mt-10 font-display text-2xl text-ink">
                  {p.name}
                </h2>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-wide2 text-accent">
                  {p.modality}
                </p>
                <p className="mt-5 flex-1 text-sm leading-relaxed text-ink-muted">
                  {p.summary}
                </p>
                <div className="mt-8 font-mono text-[12px] uppercase tracking-wide2 text-ink">
                  {t("viewModel")}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Background / in-development */}
      <section className="container-x py-16 md:py-20">
        <Reveal>
          <div className="hairline mb-10" />
          <div className="eyebrow">{t("alsoEyebrow")}</div>
          <p className="mt-3 max-w-2xl text-ink-muted">{t("alsoLead")}</p>
        </Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {backgroundProducts.map((p, i) => (
            <Reveal key={p.slug} delay={i * 90}>
              <Link
                href={`/products/${p.slug}`}
                className="group flex items-center justify-between gap-6 rounded-2xl border border-dashed border-paper-line bg-paper-soft p-7 transition-colors hover:border-ink/30"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-xl text-ink">{p.name}</h3>
                    <StatusBadge status={p.status} />
                  </div>
                  <p className="mt-2 max-w-md text-sm text-ink-muted">
                    {p.summary}
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

      <section className="border-t border-paper-line bg-obsidian">
        <div className="container-x py-16 text-center text-paper-fixed">
          <p className="font-mono text-[12px] uppercase tracking-wide2 text-paper-fixed/50">
            {t("everyModelDriven")}
          </p>
          <h2 className="display-2 mt-3 text-paper-fixed">
            {t("approachSubtitle")}
          </h2>
          <p className="lead mx-auto mt-4 max-w-xl text-paper-fixed/60">
            {t("approachLead")}
          </p>
        </div>
      </section>
    </>
  );
}

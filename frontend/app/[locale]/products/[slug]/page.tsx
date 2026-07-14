import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { StatusBadge, Orb } from "@/components/Bits";
import Reveal from "@/components/Reveal";
import MethodologySection from "@/components/MethodologySection";
import SpaceOps from "@/components/SpaceOps";
import CodingAgentShowcase from "@/components/showcase/CodingAgentShowcase";
import GenerativeReasoningShowcase from "@/components/showcase/GenerativeReasoningShowcase";
import SwarmShowcase from "@/components/showcase/SwarmShowcase";
import CurieShowcase from "@/components/showcase/CurieShowcase";
import EarlyAccessForm from "@/components/EarlyAccessForm";
import { PRODUCT_SLUGS, getProduct, getProducts } from "@/lib/products";
import { locales, type Locale } from "@/i18n/config";
import { buildAlternates } from "@/lib/seo";

const SHOWCASES: Record<string, React.ComponentType> = {
  "generative-model": GenerativeReasoningShowcase,
  "coding-agent-model": CodingAgentShowcase,
  "state-space-sovereignty-model": SpaceOps,
  "multi-agent-system": SwarmShowcase,
  "ai-scientist": CurieShowcase,
};

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    PRODUCT_SLUGS.map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const p = getProduct(locale, slug);
  if (!p) return { title: "Product" };
  return {
    title: p.name,
    description: p.summary,
    alternates: buildAlternates(`/products/${slug}`),
  };
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const product = getProduct(locale, slug);
  if (!product) notFound();

  const t = await getTranslations({ locale, namespace: "productDetail" });
  const c = await getTranslations({ locale, namespace: "common" });

  const Showcase = SHOWCASES[product.slug];
  const related = getProducts(locale)
    .filter((p) => p.slug !== product.slug)
    .sort((a, b) => Number(a.background) - Number(b.background))
    .slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-paper-line">
        <Orb className="absolute -right-10 -top-10 hidden h-72 w-72 opacity-80 md:block" />
        <div className="container-x py-16 md:py-24">
          <Reveal>
            <Link
              href="/products"
              className="font-mono text-[12px] uppercase tracking-wide2 text-ink-muted hover:text-ink"
            >
              {t("allProductsBack")}
            </Link>
            <div className="mt-8 flex items-center gap-4">
              <StatusBadge status={product.status} />
              <span className="font-mono text-[11px] uppercase tracking-wide2 text-ink-faint">
                {product.modality}
              </span>
            </div>
            <h1 className="display-1 mt-5 max-w-4xl">{product.fullName}</h1>
            <p className="lead mt-6 max-w-2xl">{product.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#methodology" className="btn-dark">
                {c("seeOurApproach")}
              </a>
              <a href="#early-access" className="btn-ghost">
                {t("requestEarlyAccess")}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Overview — condensed lede + specs as inline pills (V2 density pass) */}
      <section className="container-x py-14 md:py-20">
        <Reveal>
          <div className="eyebrow">{t("overview")}</div>
          <div className="mt-5 max-w-3xl space-y-4">
            {product.overview.map((para, i) => (
              <p key={i} className="text-lg leading-relaxed text-ink-soft">
                {para}
              </p>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-2.5">
            {product.specs.map((s) => (
              <div
                key={s.label}
                className="rounded-full border border-paper-line bg-paper-soft px-4 py-2"
              >
                <span className="font-mono text-[10.5px] uppercase tracking-wide2 text-ink-muted">
                  {s.label}
                </span>
                <span className="ml-2 font-mono text-[12px] text-ink">
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Product-specific immersive showcase — promoted ahead of Capabilities:
          the visual explains before the text does. */}
      {Showcase && (
        <section className="border-t border-paper-line bg-obsidian text-paper-fixed">
          <div className="container-x py-16 md:py-24">
            <div className="eyebrow text-paper-fixed/50">
              {t("showcaseEyebrow")}
            </div>
            <h2 className="display-2 mt-3 text-paper-fixed">
              {t("showcaseTitle")}
            </h2>
            <div className="mt-10">
              <Showcase />
            </div>
          </div>
        </section>
      )}

      {/* Capabilities — compact one-line-per-item list */}
      <section className="border-t border-paper-line">
        <div className="container-x py-14 md:py-16">
          <Reveal>
            <div className="eyebrow">{t("capabilitiesEyebrow")}</div>
            <h2 className="display-2 mt-3">{t("capabilitiesTitle")}</h2>
          </Reveal>
          <div className="mt-8 divide-y divide-paper-line border-y border-paper-line">
            {product.capabilities.map((cap, i) => (
              <Reveal key={cap.title} delay={(i % 2) * 60}>
                <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-6">
                  <h3 className="font-display text-base text-ink sm:w-64 sm:shrink-0">
                    {cap.title}
                  </h3>
                  <p className="text-sm text-ink-muted">{cap.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Approach — condensed methodology (see MethodologySection.tsx) */}
      <MethodologySection product={product} locale={locale} />

      {/* Early access */}
      <section
        id="early-access"
        className="scroll-mt-28 border-t border-paper-line"
      >
        <div className="container-x py-20 md:py-28">
          <Reveal>
            <span className="badge-soon">{t("continuouslyImproving")}</span>
            <h2 className="display-2 mt-6 max-w-2xl">{t("wantOnInfra")}</h2>
          </Reveal>
          <div className="mt-10 grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <Reveal delay={120}>
              <Link href="/products" className="btn-ghost">
                {t("otherModels")}
              </Link>
            </Reveal>
            <Reveal delay={160}>
              <EarlyAccessForm product={product} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Related models */}
      <section className="border-t border-paper-line bg-paper-soft">
        <div className="container-x py-14 md:py-16">
          <Reveal>
            <div className="eyebrow">{t("relatedEyebrow")}</div>
            <h2 className="display-2 mt-3">{t("relatedTitle")}</h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {related.map((p, i) => (
              <Reveal key={p.slug} delay={i * 80}>
                <Link
                  href={`/products/${p.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-paper-line bg-paper-raised p-6 transition-colors hover:border-ink/30"
                >
                  <div className="flex items-center justify-between">
                    <StatusBadge status={p.status} />
                    <span className="text-ink-faint transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-lg text-ink">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-sm text-ink-muted">{p.tagline}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

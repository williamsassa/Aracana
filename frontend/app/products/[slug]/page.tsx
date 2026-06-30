import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBadge, Orb } from "@/components/Bits";
import Reveal from "@/components/Reveal";
import MethodologySection from "@/components/MethodologySection";
import SpaceOps from "@/components/SpaceOps";
import { PRODUCTS, getProduct } from "@/lib/products";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const p = getProduct(params.slug);
  if (!p) return { title: "Product" };
  return {
    title: p.name,
    description: p.summary,
  };
}

export default function ProductDetail({
  params,
}: {
  params: { slug: string };
}) {
  const product = getProduct(params.slug);
  if (!product) notFound();

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
              ← All products
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
                See our approach
              </a>
              <a
                href={`mailto:contact@aracana.ai?subject=Access%20request%20—%20${encodeURIComponent(
                  product.name
                )}`}
                className="btn-ghost"
              >
                Request early access
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Overview + specs */}
      <section className="container-x py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_0.6fr]">
          <Reveal>
            <div className="eyebrow">Overview</div>
            <div className="mt-5 space-y-5">
              {product.overview.map((para, i) => (
                <p key={i} className="text-lg leading-relaxed text-ink-soft">
                  {para}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-2xl border border-paper-line bg-paper-soft p-6 lg:sticky lg:top-28">
              <div className="eyebrow">Specifications</div>
              <dl className="mt-4 divide-y divide-paper-line">
                {product.specs.map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <dt className="text-sm text-ink-muted">{s.label}</dt>
                    <dd className="text-right font-mono text-[13px] text-ink">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Capabilities */}
      <section className="border-t border-paper-line">
        <div className="container-x py-16 md:py-20">
          <Reveal>
            <div className="eyebrow">Capabilities</div>
            <h2 className="display-2 mt-3">What it does.</h2>
          </Reveal>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-paper-line bg-paper-line md:grid-cols-2">
            {product.capabilities.map((c, i) => (
              <Reveal key={c.title} delay={(i % 2) * 80}>
                <div className="h-full bg-paper-raised p-7">
                  <div className="font-mono text-sm text-accent">
                    0{i + 1}
                  </div>
                  <h3 className="mt-4 font-display text-xl text-ink">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {c.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Space-ops visual (State Space Sovereignty model only) */}
      {product.slug === "state-space-sovereignty-model" && <SpaceOps />}

      {/* Methodology — Reinforcement Learning × Causality */}
      <MethodologySection product={product} />

      {/* Footer CTA */}
      <section className="border-t border-paper-line">
        <div className="container-x flex flex-col items-center gap-6 py-20 text-center">
          <Reveal>
            <span className="badge-soon">● Continuously improving · Soon</span>
            <h2 className="display-2 mt-6 max-w-2xl">
              Want this model on your infrastructure?
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={`mailto:contact@aracana.ai?subject=Access%20request%20—%20${encodeURIComponent(
                  product.name
                )}`}
                className="btn-dark"
              >
                Request early access
              </a>
              <Link href="/products" className="btn-ghost">
                Other models
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

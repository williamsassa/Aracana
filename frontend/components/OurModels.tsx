"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { StatusBadge } from "./Bits";
import ProductGlyph from "./ProductGlyph";
import { getProducts } from "@/lib/products";
import type { Locale } from "@/i18n/config";

/**
 * "Our Models" — Palantir-software-style showcase.
 * Left: short description + index. Centre: a sticky device preview that
 * swaps to the model currently in view. Right: the model's giant codename.
 */
export default function OurModels({ locale }: { locale: Locale }) {
  const t = useTranslations("common");
  const home = useTranslations("home");
  const PRODUCTS = getProducts(locale);
  const [active, setActive] = useState(0);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = Number((e.target as HTMLElement).dataset.index);
            setActive(i);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    rowRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="border-t border-paper-line bg-paper">
      <div className="container-x pt-20 md:pt-28">
        <div className="eyebrow">{home("ourModelsEyebrow")}</div>
        <h2 className="display-2 mt-3 max-w-3xl">{home("ourModelsTitle")}</h2>
      </div>

      {/* Desktop: sticky centre preview + scrolling rows */}
      <div className="container-x relative mt-10 hidden lg:block">
        <div className="grid grid-cols-[0.82fr_1.05fr_1.13fr]">
          {/* Left column — descriptions */}
          <div>
            {PRODUCTS.map((p, i) => (
              <div
                key={p.slug}
                ref={(el) => {
                  rowRefs.current[i] = el;
                }}
                data-index={i}
                className="flex min-h-[88vh] flex-col justify-center pr-8"
              >
                <div
                  className={`transition-opacity duration-500 ${
                    active === i ? "opacity-100" : "opacity-35"
                  }`}
                >
                  <p className="max-w-xs font-display text-2xl leading-snug text-ink">
                    {p.tagline}
                  </p>
                  <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
                    {p.summary}
                  </p>
                  <div className="mt-6 flex items-center gap-4">
                    <span className="font-mono text-sm text-ink-faint">
                      /0.{i + 1}
                    </span>
                    <StatusBadge status={p.status} />
                  </div>
                  <Link
                    href={`/products/${p.slug}`}
                    className="mt-6 inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-wide2 text-ink hover:text-accent"
                  >
                    {t("explore", { name: p.name })} <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Centre column — sticky preview */}
          <div>
            <div className="sticky top-[16vh] flex h-[68vh] items-center justify-center px-6">
              <DeviceFrame>
                {PRODUCTS.map((p, i) => (
                  <div
                    key={p.slug}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      active === i ? "opacity-100" : "pointer-events-none opacity-0"
                    }`}
                  >
                    <ProductGlyph slug={p.slug} live={active === i} />
                  </div>
                ))}
              </DeviceFrame>
            </div>
          </div>

          {/* Right column — giant codenames */}
          <div>
            {PRODUCTS.map((p, i) => (
              <div
                key={p.slug}
                className="flex min-h-[88vh] flex-col justify-center"
              >
                <div
                  className={`transition-all duration-500 ${
                    active === i
                      ? "translate-y-0 opacity-100"
                      : "translate-y-2 opacity-25"
                  }`}
                >
                  <div
                    className="logo-word leading-[0.9] tracking-tightest text-ink"
                    style={{ fontSize: "clamp(3rem,7vw,6.5rem)" }}
                  >
                    {p.codename}
                  </div>
                  <div className="mt-3 font-mono text-[12px] uppercase tracking-wide2 text-ink-muted">
                    {p.name} · {p.modality}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: stacked cards */}
      <div className="container-x mt-10 space-y-5 lg:hidden">
        {PRODUCTS.map((p, i) => (
          <Link
            key={p.slug}
            href={`/products/${p.slug}`}
            className="glass glass-hover block rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-ink-faint">
                /0.{i + 1}
              </span>
              <StatusBadge status={p.status} />
            </div>
            <div
              className="logo-word mt-5 leading-[0.9] tracking-tightest text-ink"
              style={{ fontSize: "clamp(2.4rem,13vw,4rem)" }}
            >
              {p.codename}
            </div>
            <div className="mt-2 font-mono text-[11px] uppercase tracking-wide2 text-ink-muted">
              {p.name} · {p.modality}
            </div>
            <div className="mt-5 h-44 overflow-hidden rounded-xl">
              <DeviceFrame mobile>
                <ProductGlyph slug={p.slug} live />
              </DeviceFrame>
            </div>
            <p className="mt-4 text-sm text-ink-muted">{p.tagline}</p>
          </Link>
        ))}
      </div>

      <div className="container-x pb-20 pt-12 md:pb-28">
        <Link href="/products" className="btn-dark">
          {home("allModels")}
        </Link>
      </div>
    </section>
  );
}

/* ── A browser/app window frame around a preview ── */
function DeviceFrame({
  children,
  mobile = false,
}: {
  children: React.ReactNode;
  mobile?: boolean;
}) {
  return (
    <div
      // Fixed dark, not theme-reactive .glass: this simulates an actual
      // device/console screen (like the obsidian-band showcases), and its
      // white/* chrome + ProductGlyph preview content assume a dark
      // backdrop — on light .glass (translucent dark tint over a white
      // page) that content nearly disappears.
      className={`relative w-full overflow-hidden rounded-2xl border border-white/10 bg-obsidian shadow-[0_40px_120px_-50px_rgba(0,0,0,0.7)] ${
        mobile ? "h-full" : "aspect-[16/10]"
      }`}
    >
      {/* title bar */}
      <div className="flex h-8 items-center gap-1.5 border-b border-white/8 bg-white/[0.03] px-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent/60" />
        <span className="ml-3 font-mono text-[10px] uppercase tracking-wide2 text-white/30">
          aracana · console
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 top-8">{children}</div>
    </div>
  );
}


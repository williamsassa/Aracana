import { getTranslations } from "next-intl/server";
import Reveal from "./Reveal";
import WeightBar from "./WeightBar";
import type { Product } from "@/lib/products";
import { getMethod } from "@/lib/methodology";
import type { Locale } from "@/i18n/config";

/** Condensed "Approach" band on each product page — the deep-dive on how
 * alignment works (the two pillars, the note) lives once on /research
 * instead of being repeated on every product page (V2 density pass). */
export default async function MethodologySection({
  product,
  locale,
}: {
  product: Product;
  locale: Locale;
}) {
  const METHOD = getMethod(locale);
  const t = await getTranslations({ locale, namespace: "methodology" });
  return (
    <section
      id="methodology"
      className="scroll-mt-28 border-t border-paper-line bg-obsidian text-paper-fixed"
    >
      <div className="container-x py-16 md:py-20">
        <Reveal>
          <div className="eyebrow text-paper-fixed/50">{METHOD.eyebrow}</div>
          <h2 className="display-2 mt-3 text-paper-fixed">{METHOD.subtitle}</h2>
          <p className="lead mt-4 max-w-2xl text-paper-fixed/60">{METHOD.lede}</p>
          <p className="mt-5 max-w-2xl rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 font-mono text-[13px] text-accent-soft">
            {METHOD.formula.display}
          </p>
        </Reveal>

        {/* Compact 3-step loop — icon/number + title only */}
        <Reveal delay={80}>
          <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2">
            {METHOD.loop.map((s, i) => (
              <div key={s.n} className="flex items-center gap-3">
                <span className="flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-4 py-2">
                  <span className="font-mono text-xs text-accent-soft">{s.n}</span>
                  <span className="font-display text-sm text-paper-fixed">
                    {s.title}
                  </span>
                </span>
                {i < METHOD.loop.length - 1 && (
                  <span className="text-paper-fixed/30">→</span>
                )}
              </div>
            ))}
          </div>
        </Reveal>

        {/* Product-specific learning signals */}
        <Reveal delay={140}>
          <div className="mt-14">
            <h3 className="font-display text-xl text-paper-fixed">
              {t("learningSignalsFor", { name: product.name })}
            </h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {product.rewardComponents.map((c) => (
                <WeightBar
                  key={c.signal}
                  label={c.signal}
                  weight={c.weight}
                  desc={c.desc}
                />
              ))}
            </div>

            <p className="mt-8 max-w-3xl rounded-2xl border-l-2 border-accent bg-white/[0.03] px-6 py-5 text-[13px] leading-relaxed text-paper-fixed/75">
              {product.rewardExample}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

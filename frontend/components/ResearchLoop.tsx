import Reveal from "./Reveal";
import { getResearchLoop } from "@/lib/methodology";
import type { Locale } from "@/i18n/config";

/** Circular 5-stage research loop (Propose → Evaluate → Causal Analysis →
 * Reinforce → Iterate), shown on the Research page. Distinct from the
 * compact 3-stage METHOD.loop used by MethodologySection on product pages —
 * this one is the wider research-process view, not the per-product signal. */
export default function ResearchLoop({ locale }: { locale: Locale }) {
  const loop = getResearchLoop(locale);

  return (
    <div className="mt-10">
      <div className="hidden md:block" aria-hidden>
        <svg viewBox="0 0 900 90" className="w-full">
          <path
            d="M 40 45 H 860"
            fill="none"
            stroke="rgb(var(--paper-line))"
            strokeWidth="1"
          />
          <path
            d="M 860 45 C 900 45 900 -25 860 -10 C 780 15 120 15 40 -10 C 0 -25 0 45 40 45"
            fill="none"
            stroke="rgb(var(--accent) / 0.35)"
            strokeWidth="1"
            strokeDasharray="4 4"
            transform="translate(0, 35)"
          />
        </svg>
      </div>

      <div className="grid gap-5 md:grid-cols-5">
        {loop.map((step, i) => (
          <Reveal key={step.n} delay={i * 90}>
            <div className="rounded-2xl border border-paper-line bg-paper-raised p-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-accent">{step.n}</span>
                {i < loop.length - 1 && (
                  <span className="text-ink-faint">→</span>
                )}
              </div>
              <h3 className="mt-3 font-display text-base text-ink">
                {step.title}
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-muted">
                {step.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

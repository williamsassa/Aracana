import Reveal from "./Reveal";
import type { getMethod } from "@/lib/methodology";

/** Renders the explicit objective formula plus the two alignment pillars
 * (Explicit Objective / Verifiable Structure) — the deep-dive that
 * MethodologySection deliberately dropped from every product page (V2
 * density pass) now lives once, here, on /research. */
export default function MathematicalModelViz({
  method,
}: {
  method: ReturnType<typeof getMethod>;
}) {
  return (
    <div className="mt-10">
      <Reveal>
        <p className="rounded-2xl border border-paper-line bg-paper-soft px-6 py-5 text-center font-mono text-base text-ink md:text-lg">
          {method.formula.display}
        </p>
        <p className="mx-auto mt-3 max-w-lg text-center text-sm text-ink-muted">
          {method.formula.caption}
        </p>
      </Reveal>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {method.pillars.map((p, i) => (
          <Reveal key={p.title} delay={i * 100}>
            <div className="h-full rounded-2xl border border-paper-line bg-paper-raised p-7">
              <div className="font-mono text-sm text-accent">{p.tag}</div>
              <h3 className="mt-3 font-display text-xl text-ink">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {p.body}
              </p>
              <ul className="mt-4 space-y-2">
                {p.points.map((pt) => (
                  <li key={pt} className="flex gap-2.5 text-sm text-ink-muted">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

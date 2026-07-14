import Reveal from "./Reveal";

/** Small diagram illustrating "Verifiable Structure": a candidate output
 * fanning out into a handful of checks before it's trusted. Renamed from
 * the brief's "Causal Graph" to stay consistent with the V2 reframe away
 * from causality-specific language (see lib/methodology.*.ts) — the
 * substance (counterfactual/constraint checks) is unchanged. Connector
 * lines reuse the .glyph-draw scroll-reveal already defined for
 * SolutionGlyph; labels are plain DOM (not SVG text) so French copy can
 * wrap without needing per-language font-size tuning. */
export default function ConsistencyGraphViz({
  label,
  checks,
  caption,
}: {
  label: string;
  checks: string[];
  caption: string;
}) {
  return (
    <Reveal>
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-col items-center">
          <div className="rounded-full border border-ink bg-ink px-5 py-2 font-mono text-[11px] uppercase tracking-wide2 text-paper">
            {label}
          </div>
          <svg
            viewBox="0 0 400 40"
            preserveAspectRatio="none"
            className="mt-1 h-8 w-full max-w-md"
            aria-hidden
          >
            {checks.map((_, i) => {
              const x = (400 / (checks.length + 1)) * (i + 1);
              return (
                <path
                  key={i}
                  d={`M 200 0 L ${x} 40`}
                  className="glyph-draw stroke-paper-line"
                  strokeWidth="1"
                  pathLength={1}
                  fill="none"
                />
              );
            })}
          </svg>
          <div
            className="grid w-full gap-3"
            style={{ gridTemplateColumns: `repeat(${checks.length}, minmax(0,1fr))` }}
          >
            {checks.map((c) => (
              <div
                key={c}
                className="rounded-xl border border-paper-line bg-paper-raised px-3 py-3 text-center"
              >
                <span className="font-mono text-[10.5px] uppercase leading-snug tracking-wide2 text-ink-muted">
                  {c}
                </span>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-ink-muted">{caption}</p>
      </div>
    </Reveal>
  );
}

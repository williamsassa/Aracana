import { getProductAccent } from "@/lib/productTheme";

/** Small abstract line glyphs, one per solution domain — kept in the same
 * thin-stroke, monochrome-with-accent vocabulary as Orb (Bits.tsx). Used to
 * break up the Solutions page's repeating text-only row pattern without
 * introducing full illustrations or a new visual language. The accent
 * stroke draws in on scroll (via the parent Reveal's .is-visible class, see
 * globals.css .glyph-draw) and is tinted per-product where a solution id
 * maps onto a product, for cross-page colour coherence with ProductGlyph. */

// Solution ids that correspond 1:1 to a product slug — see lib/productTheme.ts.
const SOLUTION_PRODUCT: Record<string, string> = {
  generative: "generative-model",
  "coding-agent": "coding-agent-model",
  "ai-scientist": "ai-scientist",
  space: "state-space-sovereignty-model",
  "multi-agent": "multi-agent-system",
};

export default function SolutionGlyph({ id }: { id: string }) {
  const accent = SOLUTION_PRODUCT[id]
    ? getProductAccent(SOLUTION_PRODUCT[id])
    : "rgb(var(--accent))";

  const paths: Record<string, React.ReactNode> = {
    generative: (
      <>
        <circle cx="60" cy="60" r="34" className="stroke-ink/25" fill="none" />
        <path
          d="M40 60h40M60 40v40"
          className="glyph-draw"
          stroke={accent}
          strokeWidth="1.5"
          pathLength={1}
        />
      </>
    ),
    "coding-agent": (
      <>
        <path d="M40 45 L25 60 L40 75" className="stroke-ink/25" fill="none" />
        <path d="M80 45 L95 60 L80 75" className="stroke-ink/25" fill="none" />
        <path
          d="M68 38 L52 82"
          className="glyph-draw"
          stroke={accent}
          strokeWidth="1.5"
          pathLength={1}
        />
      </>
    ),
    "ai-scientist": (
      <>
        {[[45, 45], [80, 50], [65, 80], [40, 75]].map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="4"
            fill={i === 1 ? accent : undefined}
            className={i === 1 ? undefined : "fill-ink/40"}
          />
        ))}
        <path
          d="M45 45 L80 50 L65 80 L40 75 Z"
          className="glyph-draw stroke-ink/20"
          fill="none"
          pathLength={1}
        />
      </>
    ),
    space: (
      <>
        <ellipse
          cx="60"
          cy="60"
          rx="36"
          ry="14"
          transform="rotate(-25 60 60)"
          className="glyph-draw stroke-ink/25"
          fill="none"
          pathLength={1}
        />
        <circle cx="60" cy="60" r="10" className="fill-ink/70" />
        <circle cx="88" cy="42" r="3" fill={accent} />
      </>
    ),
    defense: (
      <>
        <path
          d="M60 28 L88 40 V64 C88 82 76 92 60 96 C44 92 32 82 32 64 V40 Z"
          className="stroke-ink/25"
          fill="none"
        />
        <path
          d="M60 44 V78 M48 58 H72"
          className="glyph-draw"
          stroke={accent}
          strokeWidth="1.5"
          pathLength={1}
        />
      </>
    ),
    "multi-agent": (
      <>
        <circle cx="60" cy="60" r="9" fill={accent} />
        {[[30, 35], [90, 35], [30, 85], [90, 85]].map(([x, y], i) => (
          <g key={i}>
            <line
              x1="60"
              y1="60"
              x2={x}
              y2={y}
              className="glyph-draw stroke-ink/20"
              pathLength={1}
            />
            <circle cx={x} cy={y} r="5" className="fill-ink/50" />
          </g>
        ))}
      </>
    ),
  };

  return (
    <svg viewBox="0 0 120 120" className="h-24 w-24" aria-hidden>
      {paths[id] ?? <circle cx="60" cy="60" r="30" className="stroke-ink/25" fill="none" />}
    </svg>
  );
}

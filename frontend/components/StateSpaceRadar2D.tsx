import { getProductAccent } from "@/lib/productTheme";

/**
 * 2D SVG radar scene for the State Space showcase — used as the fallback
 * when 3D isn't appropriate (prefers-reduced-motion, no WebGL, low-end
 * device, or narrow viewport). Extracted unchanged from the original
 * SpaceOps.tsx implementation so it stays an equivalent, not a downgrade.
 * V2.1: flagged-object colour switched from red to the State Space product
 * accent (blue) — red retired everywhere per owner feedback.
 */

const ACCENT = getProductAccent("state-space-sovereignty-model"); // #3B82F6
const ACCENT_RGB = "59,130,246";

const KNOWN = [
  { x: 120, y: 110, id: "EU-734" },
  { x: 300, y: 90, id: "EU-118" },
  { x: 250, y: 250, id: "EU-205" },
  { x: 95, y: 235, id: "OBS-12" },
];
const FLAGGED = { x: 320, y: 200, id: "UNK-09" };

export default function StateSpaceRadar2D({ stage }: { stage: number }) {
  return (
    <svg viewBox="0 0 400 320" className="w-full rounded-xl bg-[#05060a]">
      {/* range rings */}
      {[150, 110, 70, 32].map((r) => (
        <circle
          key={r}
          cx="200"
          cy="160"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.10)"
        />
      ))}
      <line x1="200" y1="10" x2="200" y2="310" stroke="rgba(255,255,255,0.08)" />
      <line x1="50" y1="160" x2="350" y2="160" stroke="rgba(255,255,255,0.08)" />

      {/* rotating sweep */}
      <g className="animate-sweep" style={{ transformOrigin: "200px 160px" }}>
        <defs>
          <linearGradient id="sweep" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={`rgba(${ACCENT_RGB},0)`} />
            <stop offset="100%" stopColor={`rgba(${ACCENT_RGB},0.45)`} />
          </linearGradient>
        </defs>
        <polygon points="200,160 200,10 280,40" fill="url(#sweep)" />
        <line x1="200" y1="160" x2="200" y2="12" stroke={`rgba(${ACCENT_RGB},0.7)`} />
      </g>

      {/* known, catalogued objects */}
      {KNOWN.map((c) => (
        <g key={c.id}>
          <rect x={c.x - 4} y={c.y - 4} width="8" height="8" fill="rgba(255,255,255,0.9)" />
          {stage >= 2 && (
            <text x={c.x + 9} y={c.y + 3} fill="rgba(255,255,255,0.55)" fontSize="9" fontFamily="monospace">
              {c.id} ✓
            </text>
          )}
        </g>
      ))}

      {/* flagged / unclassified object */}
      <g>
        <polygon
          points={`${FLAGGED.x},${FLAGGED.y - 6} ${FLAGGED.x - 6},${FLAGGED.y + 5} ${FLAGGED.x + 6},${FLAGGED.y + 5}`}
          fill={stage >= 4 ? `rgba(${ACCENT_RGB},0.25)` : ACCENT}
        />
        {stage >= 2 && stage < 4 && (
          <text x={FLAGGED.x + 10} y={FLAGGED.y + 3} fill={ACCENT} fontSize="9" fontFamily="monospace">
            {FLAGGED.id} ⚠ FLAGGED
          </text>
        )}
        {stage === 3 && (
          <g className="animate-lock" style={{ transformOrigin: `${FLAGGED.x}px ${FLAGGED.y}px` }}>
            <circle cx={FLAGGED.x} cy={FLAGGED.y} r="16" fill="none" stroke={ACCENT} strokeWidth="1.5" strokeDasharray="6 4" />
            <line x1={FLAGGED.x - 22} y1={FLAGGED.y} x2={FLAGGED.x - 12} y2={FLAGGED.y} stroke={ACCENT} />
            <line x1={FLAGGED.x + 12} y1={FLAGGED.y} x2={FLAGGED.x + 22} y2={FLAGGED.y} stroke={ACCENT} />
            <line x1={FLAGGED.x} y1={FLAGGED.y - 22} x2={FLAGGED.x} y2={FLAGGED.y - 12} stroke={ACCENT} />
            <line x1={FLAGGED.x} y1={FLAGGED.y + 12} x2={FLAGGED.x} y2={FLAGGED.y + 22} stroke={ACCENT} />
          </g>
        )}
        {stage >= 4 && (
          <>
            <line x1={FLAGGED.x - 7} y1={FLAGGED.y - 7} x2={FLAGGED.x + 7} y2={FLAGGED.y + 7} stroke={ACCENT} strokeWidth="1.5" />
            <line x1={FLAGGED.x + 7} y1={FLAGGED.y - 7} x2={FLAGGED.x - 7} y2={FLAGGED.y + 7} stroke={ACCENT} strokeWidth="1.5" />
            <text x={FLAGGED.x + 12} y={FLAGGED.y + 3} fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="monospace">
              REVIEWED
            </text>
          </>
        )}
      </g>
    </svg>
  );
}

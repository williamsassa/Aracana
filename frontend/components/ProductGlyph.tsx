import { getProductAccent } from "@/lib/productTheme";

/** Per-model stylised preview (no real screenshots needed) — extracted from
 * OurModels.tsx so the same vignettes can be reused as small card
 * illustrations on the Products listing, not just inside the home
 * scrollytelling. Each product's preview is tinted with its own accent from
 * lib/productTheme.ts instead of a single flat red, so the catalogue reads
 * as five distinct identities within one system (x.ai/Palantir-style). */
export default function ProductGlyph({
  slug,
  live,
}: {
  slug: string;
  live: boolean;
}) {
  const accent = getProductAccent(slug);
  if (slug === "generative-model")
    return <PreviewGenerative live={live} accent={accent} />;
  if (slug === "coding-agent-model")
    return <PreviewCoding live={live} accent={accent} />;
  if (slug === "state-space-sovereignty-model")
    return <PreviewState live={live} accent={accent} />;
  if (slug === "multi-agent-system")
    return <PreviewAgents live={live} accent={accent} />;
  return <PreviewScientist live={live} accent={accent} />;
}

function PreviewGenerative({ live, accent }: { live: boolean; accent: string }) {
  return (
    <div className="flex h-full gap-3 p-4">
      <div className="flex w-1/2 flex-col gap-2">
        <div className="font-mono text-[9px] uppercase tracking-wide2 text-white/30">
          prompt
        </div>
        {[88, 70, 94, 60].map((w, i) => (
          <div
            key={i}
            className="h-2 rounded bg-white/15"
            style={{
              width: `${w}%`,
              animation: live ? `fade-in .6s ${i * 0.12}s both` : "none",
            }}
          />
        ))}
        <div
          className="mt-2 font-mono text-[9px] uppercase tracking-wide2"
          style={{ color: accent }}
        >
          generating ▍
        </div>
      </div>
      <div className="grid w-1/2 grid-cols-2 gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded bg-gradient-to-br from-white/15 to-white/[0.03]"
            style={{
              animation: live ? `fade-up .6s ${0.2 + i * 0.1}s both` : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function PreviewCoding({ live, accent }: { live: boolean; accent: string }) {
  const lines = [
    ["+", "def solve(graph):", "ok"],
    ["+", "  return bfs(graph)", "ok"],
    ["-", "  return None", "del"],
    ["", "tests: 42 passed", "pass"],
    ["", "build: green", "pass"],
  ];
  return (
    <div className="h-full p-4 font-mono text-[10px] leading-relaxed">
      <div className="mb-2 uppercase tracking-wide2 text-white/30">
        coding-agent · run
      </div>
      {lines.map((l, i) => (
        <div
          key={i}
          className={`flex gap-2 ${
            l[2] === "del" ? "" : l[2] === "pass" ? "text-white/70" : "text-white/55"
          }`}
          style={{
            color: l[2] === "del" ? accent : undefined,
            animation: live ? `fade-in .4s ${i * 0.12}s both` : "none",
          }}
        >
          <span className="w-3 text-white/30">{l[0]}</span>
          <span>{l[1]}</span>
        </div>
      ))}
      <div
        className="mt-3 inline-block rounded px-2 py-1"
        style={{ background: `${accent}26`, color: accent }}
      >
        ✓ patch verified
      </div>
    </div>
  );
}

function PreviewState({ live, accent }: { live: boolean; accent: string }) {
  return (
    <div className="relative h-full">
      <div className="stars opacity-60" />
      <svg viewBox="0 0 320 220" className="relative h-full w-full">
        {[90, 64, 38].map((r) => (
          <circle
            key={r}
            cx="160"
            cy="110"
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
          />
        ))}
        {live && (
          <g className="animate-sweep" style={{ transformOrigin: "160px 110px" }}>
            <line x1="160" y1="110" x2="160" y2="22" stroke={`${accent}B3`} />
          </g>
        )}
        <rect x="100" y="70" width="6" height="6" fill="#fff" />
        <rect x="210" y="130" width="6" height="6" fill="#fff" />
        <rect x="140" y="150" width="6" height="6" fill="#fff" />
        <polygon points="225,86 219,96 231,96" fill={accent} />
        {live && (
          <circle
            cx="225"
            cy="92"
            r="12"
            fill="none"
            stroke={accent}
            strokeDasharray="5 4"
            className="animate-lock"
            style={{ transformOrigin: "225px 92px" }}
          />
        )}
      </svg>
      <div className="absolute bottom-3 left-4 font-mono text-[9px] uppercase tracking-wide2 text-white/40">
        orbital picture · live
      </div>
    </div>
  );
}

function PreviewAgents({ live, accent }: { live: boolean; accent: string }) {
  const nodes = [
    [160, 45],
    [70, 120],
    [250, 120],
    [110, 180],
    [210, 180],
  ];
  return (
    <svg viewBox="0 0 320 220" className="h-full w-full">
      {nodes.slice(1).map((n, i) => (
        <line
          key={i}
          x1="160"
          y1="45"
          x2={n[0]}
          y2={n[1]}
          stroke="rgba(255,255,255,0.18)"
          strokeDasharray="4 4"
          style={{ animation: live ? "dash 1s linear infinite" : "none" }}
        />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle
            cx={n[0]}
            cy={n[1]}
            r={i === 0 ? 14 : 9}
            fill={i === 0 ? accent : "rgba(255,255,255,0.85)"}
            style={{
              animation: live ? `fade-up .5s ${i * 0.1}s both` : "none",
            }}
          />
        </g>
      ))}
      <text x="16" y="208" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">
        orchestrator + 4 agents
      </text>
    </svg>
  );
}

function PreviewScientist({ live, accent }: { live: boolean; accent: string }) {
  const atoms = [
    [120, 90],
    [170, 70],
    [200, 110],
    [160, 140],
    [110, 140],
  ];
  return (
    <div className="relative h-full p-4">
      <svg viewBox="0 0 320 200" className="h-full w-full">
        {atoms.map((a, i) => {
          const b = atoms[(i + 1) % atoms.length];
          return (
            <line
              key={i}
              x1={a[0]}
              y1={a[1]}
              x2={b[0]}
              y2={b[1]}
              stroke="rgba(255,255,255,0.25)"
            />
          );
        })}
        {atoms.map((a, i) => (
          <circle
            key={i}
            cx={a[0]}
            cy={a[1]}
            r="7"
            fill={i === 1 ? accent : "rgba(255,255,255,0.9)"}
            style={{ animation: live ? `fade-up .5s ${i * 0.1}s both` : "none" }}
          />
        ))}
        <g stroke="rgba(255,255,255,0.12)">
          <line x1="20" y1="180" x2="300" y2="180" />
        </g>
        <polyline
          points="20,170 70,150 120,158 170,120 220,128 270,90"
          fill="none"
          stroke={accent}
          strokeWidth="1.5"
          style={{
            strokeDasharray: 400,
            strokeDashoffset: live ? 0 : 400,
            transition: "stroke-dashoffset 1.4s ease",
          }}
        />
      </svg>
      <div className="absolute bottom-3 left-4 font-mono text-[9px] uppercase tracking-wide2 text-white/40">
        candidate · docking score ↑
      </div>
    </div>
  );
}

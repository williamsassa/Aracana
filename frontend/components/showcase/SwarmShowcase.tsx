"use client";

import { Search, Code2, CheckCircle2, Workflow } from "lucide-react";
import { useStageSequencer } from "./useStageSequencer";
import Scene3DLoader from "../Scene3DLoader";
import Mark from "../Mark";
import { getProductAccent } from "@/lib/productTheme";
import { SPECTRUM } from "@/lib/theme-colors";

// Bespoke "lab console" showcase for SWARM — previously a 4-satellite ring
// that rendered essentially blank (the 3D camera sat at y=1.6 with no
// lookAt, so the graph fell outside the frustum — fixed in
// three/SwarmScene.tsx) and, even fixed, said nothing
// about what a multi-agent swarm actually *is*. Rebuilt around two owner
// references: pin.it/6R1i1mSy1 (a dense force-directed network graph on a
// floating dashboard) and pin.it/2e0pFydJ5 (glowing chip stages linked by
// flowing connectors) — the graph shows the coordination topology, the chip
// chain shows the four specialised roles, and a live exchange log gives the
// swarm the same "watch it actually work" personality Coding Agent has.
const ACCENT = getProductAccent("multi-agent-system"); // violet-blue blend

const STAGES = [
  "Central mission",
  "Specialised agents",
  "Parallel tasks",
  "Exchanges",
  "Validation",
  "Consolidated result",
];

const LOG: [number, string][] = [
  [0, "◆ mission   coordinate go-to-market brief across 4 specialists"],
  [1, "→ spawn     research · code · verify · plan"],
  [2, "research →  scanning 3 sources…"],
  [2, "code →      drafting implementation outline…"],
  [3, "research ⇄ verify   cross-checking claims"],
  [3, "code ⇄ plan         aligning scope with roadmap"],
  [4, "verify →    2 checks passed · 1 flagged"],
  [4, "plan →      timeline confirmed"],
  [5, "✓ consensus reached · result consolidated"],
];

const ROLES = [
  { key: "research", label: "Research", icon: Search, color: SPECTRUM.cyan },
  { key: "code", label: "Code", icon: Code2, color: SPECTRUM.blue },
  { key: "verify", label: "Verify", icon: CheckCircle2, color: SPECTRUM.blueCyan },
  { key: "plan", label: "Plan", icon: Workflow, color: SPECTRUM.violet },
];

// Dense organic cluster layout — mirrors three/SwarmScene.tsx's topology
// (hub + 4 primaries, each trailing 6 satellites, plus cross-links between
// clusters) instead of the old symmetric 4-spoke wheel. Coordinates are
// hand-placed rather than Math.random() since this fallback JSX is built
// during SSR too; a random layout would mismatch on hydration.
const CENTER: [number, number] = [230, 150];
const PRIMARY_2D: { pos: [number, number]; color: string }[] = [
  { pos: [326, 170], color: SPECTRUM.cyan },
  { pos: [210, 217], color: SPECTRUM.blue },
  { pos: [131, 160], color: SPECTRUM.blueCyan },
  { pos: [206, 84], color: SPECTRUM.violet },
];
const SUB_2D: { pos: [number, number]; parent: number }[] = [
  { pos: [300, 140], parent: 0 }, { pos: [355, 145], parent: 0 }, { pos: [365, 185], parent: 0 },
  { pos: [340, 205], parent: 0 }, { pos: [295, 195], parent: 0 }, { pos: [310, 155], parent: 0 },
  { pos: [180, 195], parent: 1 }, { pos: [235, 190], parent: 1 }, { pos: [245, 235], parent: 1 },
  { pos: [215, 255], parent: 1 }, { pos: [175, 245], parent: 1 }, { pos: [195, 225], parent: 1 },
  { pos: [95, 135], parent: 2 }, { pos: [150, 130], parent: 2 }, { pos: [160, 170], parent: 2 },
  { pos: [140, 195], parent: 2 }, { pos: [90, 185], parent: 2 }, { pos: [105, 155], parent: 2 },
  { pos: [175, 60], parent: 3 }, { pos: [230, 55], parent: 3 }, { pos: [240, 95], parent: 3 },
  { pos: [210, 110], parent: 3 }, { pos: [170, 95], parent: 3 }, { pos: [190, 70], parent: 3 },
];
// Cross-links between neighbouring clusters — indices into SUB_2D.
const CROSS_2D: [number, number][] = [[0, 7], [6, 13], [12, 19], [18, 1]];

function curvePath(x1: number, y1: number, x2: number, y2: number, bend: number) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  return `M ${x1} ${y1} Q ${mx + nx * bend} ${my + ny * bend} ${x2} ${y2}`;
}

export default function SwarmShowcase() {
  const { ref, stage } = useStageSequencer(STAGES.length, 2000);
  const lines = LOG.filter(([s]) => s <= stage);
  const exchanging = stage >= 3 && stage <= 4;
  const activeRole = stage >= 1 && stage <= 4 ? stage % ROLES.length : -1;
  const percent = Math.round(((stage + 1) / STAGES.length) * 100);

  const fallback = (
    <svg viewBox="0 0 460 300" className="relative z-10 h-[240px] w-full" aria-hidden>
      {PRIMARY_2D.map((p, i) => (
        <path
          key={`spoke-${i}`}
          d={curvePath(CENTER[0], CENTER[1], p.pos[0], p.pos[1], 16)}
          fill="none"
          stroke={exchanging ? p.color : "rgba(255,255,255,0.15)"}
          strokeOpacity={exchanging ? 0.6 : 1}
          strokeWidth="1"
        />
      ))}
      {SUB_2D.map((s, i) => (
        <path
          key={`sub-${i}`}
          d={curvePath(PRIMARY_2D[s.parent].pos[0], PRIMARY_2D[s.parent].pos[1], s.pos[0], s.pos[1], 6)}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
        />
      ))}
      {CROSS_2D.map(([a, b], i) => (
        <path
          key={`cross-${i}`}
          d={curvePath(SUB_2D[a].pos[0], SUB_2D[a].pos[1], SUB_2D[b].pos[0], SUB_2D[b].pos[1], 22)}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
      ))}
      <circle cx={CENTER[0]} cy={CENTER[1]} r="13" fill={ACCENT} />
      {PRIMARY_2D.map((p, i) => (
        <circle key={`p-${i}`} cx={p.pos[0]} cy={p.pos[1]} r={8} fill={p.color} opacity={0.95} />
      ))}
      {SUB_2D.map((s, i) => (
        <circle key={`s-${i}`} cx={s.pos[0]} cy={s.pos[1]} r={3 + (i % 3)} fill={PRIMARY_2D[s.parent].color} opacity={0.6} />
      ))}
    </svg>
  );

  return (
    <div ref={ref}>
      <div
        className="glass relative overflow-hidden rounded-2xl"
        style={{ boxShadow: `0 40px 140px -55px rgba(0,0,0,0.75), 0 0 70px -32px ${ACCENT}40` }}
      >
        {/* Header */}
        <div className="relative flex h-11 items-center gap-2.5 overflow-hidden border-b border-white/10 px-4">
          <div className="noise-overlay" />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(120% 220% at 8% 0%, ${ACCENT}2e, transparent 60%), radial-gradient(90% 180% at 96% 100%, ${SPECTRUM.cyan}22, transparent 65%)`,
            }}
          />
          <span className="relative h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="relative h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="relative h-2.5 w-2.5 rounded-full" style={{ background: `${ACCENT}99` }} />
          <Mark size={16} className="relative ml-2" />
          <span className="relative font-mono text-[11px] uppercase tracking-wide2 text-white/75">
            ARACANA SWARM
          </span>
          <span className="relative ml-auto flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wide2 text-white/40">
            <span
              className="h-1.5 w-1.5 animate-twinkle rounded-full"
              style={{ background: ACCENT, animationDuration: "5s" }}
            />
            4 agents active
          </span>
        </div>

        {/* Network graph */}
        <div className="relative overflow-hidden">
          <div className="noise-overlay" />
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]"
            style={{ background: `${ACCENT}22` }}
          />
          <Scene3DLoader
            loadScene={() => import("../three/SwarmScene")}
            fallback={fallback}
            className="relative z-10 h-[240px] w-full"
            sceneProps={{ stage }}
          />
        </div>

        {/* Role chain — four specialised agents linked by a flowing connector */}
        <div className="relative border-t border-white/8 px-5 py-4">
          <svg viewBox="0 0 400 12" preserveAspectRatio="none" className="absolute inset-x-5 top-1/2 h-6 -translate-y-1/2 opacity-40" aria-hidden>
            <path d="M 30 2 Q 130 20 200 6 T 370 4" fill="none" stroke={ACCENT} strokeWidth="1" />
          </svg>
          <div className="relative flex items-center justify-between gap-2">
            {ROLES.map((r, i) => {
              const Icon = r.icon;
              const active = i === activeRole;
              return (
                <div key={r.key} className="flex flex-col items-center gap-1.5">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-500"
                    style={{
                      borderColor: active ? r.color : "rgba(255,255,255,0.12)",
                      background: active ? `${r.color}1f` : "rgba(255,255,255,0.03)",
                      boxShadow: active ? `0 0 18px -4px ${r.color}` : "none",
                    }}
                  >
                    <Icon size={14} style={{ color: active ? r.color : "rgba(255,255,255,0.4)" }} />
                  </div>
                  <span
                    className="font-mono text-[9px] uppercase tracking-wide2"
                    style={{ color: active ? r.color : "rgba(255,255,255,0.35)" }}
                  >
                    {r.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Exchange log + agent roster */}
        <div className="relative grid border-t border-white/8 md:grid-cols-[1.2fr_0.8fr] md:divide-x md:divide-white/8">
          <div className="h-[170px] overflow-hidden p-4 font-mono text-[12px] leading-relaxed">
            {lines.map(([, line], i) => (
              <div
                key={i}
                className={
                  line.startsWith("◆")
                    ? "text-white/85"
                    : line.startsWith("✓")
                    ? "text-emerald-400"
                    : "text-white/50"
                }
              >
                {line}
              </div>
            ))}
          </div>

          <div className="border-t border-white/8 p-4 md:border-t-0">
            <div className="font-mono text-[10px] uppercase tracking-wide2 text-white/35">
              Agents
            </div>
            <div className="mt-3 space-y-2.5">
              {ROLES.map((r) => {
                const status = stage < 1 ? "Idle" : stage <= 4 ? "Active" : "Done";
                return (
                  <div key={r.key} className="flex items-center justify-between font-mono text-[11px]">
                    <span className="flex items-center gap-2 text-white/70">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: r.color }} />
                      {r.label}
                    </span>
                    <span className={status === "Done" ? "text-emerald-400" : "text-white/40"}>
                      {status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="relative flex items-center gap-3 border-t border-white/8 px-5 py-3.5">
          <span className="font-mono text-[13px] font-semibold" style={{ color: ACCENT }}>
            {percent}%
          </span>
          <span className="flex-1 truncate font-mono text-[12px] text-white/70">
            {STAGES[stage]}
          </span>
          <div className="h-1 w-24 shrink-0 overflow-hidden rounded-full bg-white/10 sm:w-40">
            <div
              className="h-full rounded-full bg-spectrum-gradient transition-all duration-700 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

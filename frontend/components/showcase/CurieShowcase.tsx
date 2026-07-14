"use client";

import { useStageSequencer } from "./useStageSequencer";
import Scene3DLoader from "../Scene3DLoader";
import WeightBar from "../WeightBar";
import Mark from "../Mark";
import { getProductAccent } from "@/lib/productTheme";
import { SPECTRUM } from "@/lib/theme-colors";
import { PRODUCTS_EN } from "@/lib/products.en";

// Bespoke "lab console" showcase for AI Scientist / CURIE, mirroring the
// treatment already built for the other 3 flagship products. Owner
// references: pin.it/13W0WUw2G (a holographic molecule projected in a lab),
// pin.it/5OVzif8cv (a glowing atom — core + tilted orbital rings — used
// explicitly as the motion language), pin.it/1M3PZ2o2P / 49vJ0zzAb (mood
// only: the two show real people/generic stock icons, which the brand doc
// rules out — kept as atmosphere, not copied). The whole visualization is
// now one continuous three.js scene (three/CurieScene.tsx) instead of
// swapping between a flat 2D literature graph and a 3D molecule.
const ACCENT = getProductAccent("ai-scientist"); // blue-cyan blend
const CODENAME = PRODUCTS_EN.find((p) => p.slug === "ai-scientist")?.codename ?? "CURIE";

const STAGES = ["Question", "Literature", "Hypothesis", "Experiment", "Observation", "Critique", "Iteration"];

// 2D fallback (reduced-motion / no WebGL) — same three-part composition as
// the 3D scene: atom core + tilted rings, literature references, candidate
// molecule below.
const CORE: [number, number] = [160, 90];
const REFS_2D: [number, number][] = [[100, 50], [90, 120], [130, 165], [60, 90]];
const MOLECULE_2D: [number, number][] = [[160, 158], [200, 187], [185, 234], [135, 234], [120, 187]];
const MOL_BONDS: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]];
const ACTIVE_ATOM = 1;

export default function CurieShowcase() {
  const { ref, stage } = useStageSequencer(STAGES.length, 1700);
  const surveying = stage <= 1;
  const forming = stage >= 2;
  const showTrace = stage >= 3;
  const showObservation = stage >= 4;
  const showCritique = stage >= 5;
  const percent = Math.round(((stage + 1) / STAGES.length) * 100);

  const fallback = (
    <svg viewBox="0 0 320 260" className="relative z-10 h-[260px] w-full" aria-hidden>
      <g stroke={SPECTRUM.violet} strokeWidth="1" fill="none" opacity="0.4">
        <ellipse cx={CORE[0]} cy={CORE[1]} rx="70" ry="26" transform={`rotate(-15 ${CORE[0]} ${CORE[1]})`} />
      </g>
      <g stroke={SPECTRUM.blue} strokeWidth="1" fill="none" opacity="0.4">
        <ellipse cx={CORE[0]} cy={CORE[1]} rx="70" ry="26" transform={`rotate(35 ${CORE[0]} ${CORE[1]})`} />
      </g>
      <g stroke={SPECTRUM.cyan} strokeWidth="1" fill="none" opacity="0.4">
        <ellipse cx={CORE[0]} cy={CORE[1]} rx="70" ry="26" transform={`rotate(90 ${CORE[0]} ${CORE[1]})`} />
      </g>
      <circle cx={CORE[0]} cy={CORE[1]} r="6" fill="#fff" />

      {REFS_2D.map((r, i) => (
        <g key={i} style={{ opacity: surveying ? 1 : 0.15, transition: "opacity .5s" }}>
          <line x1={CORE[0]} y1={CORE[1]} x2={r[0]} y2={r[1]} stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />
          <circle cx={r[0]} cy={r[1]} r="4" fill="rgba(255,255,255,0.6)" />
        </g>
      ))}

      <g style={{ opacity: forming ? 1 : 0.3, transition: "opacity .6s" }}>
        {MOL_BONDS.map(([a, b], i) => (
          <line
            key={i}
            x1={MOLECULE_2D[a][0]} y1={MOLECULE_2D[a][1]}
            x2={MOLECULE_2D[b][0]} y2={MOLECULE_2D[b][1]}
            stroke="rgba(255,255,255,0.3)"
          />
        ))}
        {MOLECULE_2D.map((a, i) => (
          <circle key={i} cx={a[0]} cy={a[1]} r={i === ACTIVE_ATOM ? 7 : 5} fill={i === ACTIVE_ATOM ? ACCENT : "#e8e6df"} />
        ))}
      </g>
      <text x="20" y="252" fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="monospace">
        {surveying ? "surveying literature" : "candidate molecule"}
      </text>
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
              background: `radial-gradient(120% 220% at 8% 0%, ${ACCENT}2e, transparent 60%), radial-gradient(90% 180% at 96% 100%, ${SPECTRUM.violet}22, transparent 65%)`,
            }}
          />
          <span className="relative h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="relative h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="relative h-2.5 w-2.5 rounded-full" style={{ background: `${ACCENT}99` }} />
          <Mark size={16} className="relative ml-2" />
          <span className="relative font-mono text-[11px] uppercase tracking-wide2 text-white/75">
            ARACANA AI SCIENTIST
          </span>
          <span
            className="relative rounded border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide2"
            style={{ borderColor: `${ACCENT}40`, color: ACCENT }}
          >
            {CODENAME}
          </span>
          <span className="relative ml-auto flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wide2 text-white/40">
            <span
              className="h-1.5 w-1.5 animate-twinkle rounded-full"
              style={{ background: ACCENT, animationDuration: "5s" }}
            />
            Research loop active
          </span>
        </div>

        {/* Visualization — one continuous 3D scene: atom core, literature
            references, candidate molecule. */}
        <div className="relative overflow-hidden">
          <div className="noise-overlay" />
          <Scene3DLoader
            loadScene={() => import("../three/CurieScene")}
            fallback={fallback}
            className="relative z-10 h-[260px] w-full"
            sceneProps={{ stage, stageCount: STAGES.length }}
          />
        </div>

        {/* Docking trace + confidence gauges */}
        <div className="relative grid border-t border-white/8 md:grid-cols-2 md:divide-x md:divide-white/8">
          <div className="p-4">
            <div className="font-mono text-[10px] uppercase tracking-wide2 text-white/35">
              Docking score
            </div>
            <svg viewBox="0 0 260 110" className="mt-2 h-[110px] w-full" aria-hidden>
              <line x1="10" y1="95" x2="250" y2="95" stroke="rgba(255,255,255,0.12)" />
              <polyline
                points="10,85 55,70 100,75 145,45 190,50 235,15"
                fill="none"
                stroke={ACCENT}
                strokeWidth="1.5"
                style={{
                  strokeDasharray: 320,
                  strokeDashoffset: showTrace ? 0 : 320,
                  transition: "stroke-dashoffset 1.2s ease",
                }}
              />
            </svg>
            <div className="font-mono text-[9px] text-white/35">docking score over iterations →</div>
          </div>

          <div className="space-y-3 border-t border-white/8 p-4 md:border-t-0">
            <div
              className="space-y-3"
              style={{ opacity: showObservation ? 1 : 0.25, transition: "opacity .5s" }}
            >
              <WeightBar label="Binding affinity" weight="0.78" desc="Observation: predicted affinity up 18% over baseline." />
              <div style={{ opacity: showCritique ? 1 : 0.3, transition: "opacity .5s" }}>
                <WeightBar label="Synthesis confidence" weight="0.45" desc="Critique: synthesis route uncertain — flagged for review." />
              </div>
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

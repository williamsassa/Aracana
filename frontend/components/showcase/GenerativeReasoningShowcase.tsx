"use client";

import { useEffect, useMemo, useState } from "react";
import { useStageSequencer } from "./useStageSequencer";
import Scene3DLoader from "../Scene3DLoader";
import Mark from "../Mark";
import { useReducedMotion } from "@/lib/reducedMotion";
import { SPECTRUM } from "@/lib/theme-colors";
import { PRODUCTS_EN } from "@/lib/products.en";

// Bespoke "lab console" showcase for the Generative Model. This one
// reads as a live inference session: real pipeline stages, a neural-graph
// visualization tied to those stages, a detection-style HUD overlay (owner
// reference: pin.it/4Fu1WBZuO — bounding-box tags + converging sightlines
// over a glowing particle field), and slowly-drifting telemetry.
const CODENAME = PRODUCTS_EN.find((p) => p.slug === "generative-model")?.codename ?? "GENESIS";

const STAGES = [
  "Tokenizing Input",
  "Encoding Context",
  "Retrieving Knowledge",
  "Attention Layers",
  "Reasoning",
  "Planning",
  "Generating Output",
  "Validation",
  "Complete",
];

// Flattened "neural sphere" for the 2D fallback (reduced-motion / no WebGL)
// — same node-network concept as three/GenerativeScene, one lit node per
// pipeline stage so the fallback still reads as "the model is thinking",
// not a static illustration.
const NODES: [number, number][] = [
  [230, 52], [148, 88], [312, 88],
  [110, 150], [230, 150], [350, 150],
  [148, 212], [312, 212], [230, 248],
];
const EDGES: [number, number][] = [
  [0, 1], [0, 2], [1, 3], [1, 4], [2, 4], [2, 5],
  [3, 6], [4, 6], [4, 7], [5, 7], [6, 8], [7, 8], [3, 4], [4, 5],
];
const NODE_COLOR = (i: number) => [SPECTRUM.violet, SPECTRUM.blue, SPECTRUM.cyan][i % 3];

// Detection-style HUD tags scattered over the visualization, adapted from
// the Pinterest reference's "AI vision" bounding-box overlay. Two tags sit
// past the card's own edge (x<0 / x>100) — a deliberate break from the
// frame, echoing how the reference's boxes run off the composition.
const HUD_TAGS: { x: number; y: number; id: string; delay: number; dur: number }[] = [
  { x: -3, y: 22, id: "042", delay: 0, dur: 13 },
  { x: 91, y: 12, id: "187", delay: 2, dur: 15 },
  { x: 12, y: 78, id: "093", delay: 4, dur: 12 },
  { x: 103, y: 64, id: "215", delay: 1, dur: 16 },
  { x: 47, y: 8, id: "071", delay: 6, dur: 14 },
  { x: 64, y: 86, id: "154", delay: 3, dur: 13.5 },
  { x: 24, y: 46, id: "128", delay: 5, dur: 17 },
];
const HUD_LINES: [number, number, number, number][] = [
  [0, 6, 58, 48],
  [100, 8, 60, 46],
  [3, 96, 55, 52],
  [97, 92, 60, 50],
];

function HudBracket({ color }: { color: string }) {
  const corner = "absolute h-2 w-2 border-[1.5px]";
  return (
    <>
      <span className={`${corner} left-0 top-0 border-b-0 border-r-0`} style={{ borderColor: color }} />
      <span className={`${corner} right-0 top-0 border-b-0 border-l-0`} style={{ borderColor: color }} />
      <span className={`${corner} bottom-0 left-0 border-r-0 border-t-0`} style={{ borderColor: color }} />
      <span className={`${corner} bottom-0 right-0 border-l-0 border-t-0`} style={{ borderColor: color }} />
    </>
  );
}

/** Absolutely-positioned overlay of detection-box tags + converging
 * sightlines. Rendered as a sibling of the (overflow-hidden) glass card, not
 * a descendant, so the two off-edge tags can actually bleed past the card's
 * rounded corners instead of being clipped. */
function DetectionHud({ stage }: { stage: number }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-11 h-[280px] md:h-[320px]" aria-hidden>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gm-hud-line" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={SPECTRUM.violet} stopOpacity="0" />
            <stop offset="50%" stopColor={SPECTRUM.cyan} stopOpacity="0.45" />
            <stop offset="100%" stopColor={SPECTRUM.blue} stopOpacity="0" />
          </linearGradient>
        </defs>
        <g stroke="url(#gm-hud-line)" strokeWidth="0.12">
          {HUD_LINES.map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
          ))}
        </g>
      </svg>
      {HUD_TAGS.map((tag, i) => (
        <div
          key={tag.id}
          className="absolute animate-twinkle"
          style={{ left: `${tag.x}%`, top: `${tag.y}%`, animationDelay: `${tag.delay}s`, animationDuration: `${tag.dur}s` }}
        >
          <div className="relative h-6 w-9">
            <HudBracket color={`${[SPECTRUM.violet, SPECTRUM.blue, SPECTRUM.cyan][i % 3]}55`} />
          </div>
          <span className="mt-1 block font-mono text-[9px] text-white/35">{tag.id}</span>
        </div>
      ))}
    </div>
  );
}

type MetricDef = {
  key: string;
  label: string;
  unit?: string;
  base?: number;
  jitter?: number;
  decimals?: number;
  staticValue?: string;
};

const METRICS: MetricDef[] = [
  { key: "latency", label: "Latency", unit: "ms", base: 34, jitter: 3 },
  { key: "context", label: "Context", staticValue: "128k" },
  { key: "gpu", label: "GPU", unit: "%", base: 97, jitter: 1.2 },
  { key: "tokens", label: "Tokens/s", base: 182, jitter: 8 },
  { key: "memory", label: "Memory", unit: "GB", base: 42, jitter: 1 },
  { key: "depth", label: "Depth", base: 7, jitter: 0.6 },
  { key: "confidence", label: "Confidence", unit: "%", base: 99.4, jitter: 0.15, decimals: 1 },
  { key: "model", label: "Model", staticValue: CODENAME },
];

/** Slowly-drifting telemetry values. Only one metric advances per beat, on a
 * slow rotation through the set — an earlier version updated several at
 * once on a fast interval and read as flicker ("hurts the eyes"); one calm,
 * small change every few seconds reads as ambient telemetry instead. Ticks
 * only while the showcase is on-screen and freezes entirely under
 * reduced-motion. */
function useLiveMetrics(active: boolean) {
  const reducedMotion = useReducedMotion();
  const [ticks, setTicks] = useState<number[]>(() => METRICS.map(() => 0));

  useEffect(() => {
    if (!active || reducedMotion) return;
    let beat = 0;
    const id = setInterval(() => {
      setTicks((prev) => {
        const next = [...prev];
        next[beat % METRICS.length] += 1;
        return next;
      });
      beat += 1;
    }, 2600);
    return () => clearInterval(id);
  }, [active, reducedMotion]);

  return useMemo(
    () =>
      METRICS.map((m, i) => {
        if (m.staticValue) return { key: m.key, label: m.label, display: m.staticValue };
        const base = m.base ?? 0;
        const wobble = reducedMotion ? 0 : Math.sin(ticks[i] * 0.9 + i * 1.7) * (m.jitter ?? 0);
        const raw = base + wobble;
        const display = `${m.decimals ? raw.toFixed(m.decimals) : Math.round(raw)}${m.unit ?? ""}`;
        return { key: m.key, label: m.label, display };
      }),
    [ticks, reducedMotion]
  );
}

export default function GenerativeReasoningShowcase() {
  const { ref, stage, visible } = useStageSequencer(STAGES.length, 1600);
  const metrics = useLiveMetrics(visible);
  const percent = Math.round(((stage + 1) / STAGES.length) * 100);

  const fallback = (
    <svg viewBox="0 0 460 300" className="h-[280px] w-full md:h-[320px]" aria-hidden>
      <defs>
        <linearGradient id="gm-grad" x1="40" y1="30" x2="420" y2="270" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={SPECTRUM.violet} />
          <stop offset="50%" stopColor={SPECTRUM.blue} />
          <stop offset="100%" stopColor={SPECTRUM.cyan} />
        </linearGradient>
      </defs>
      <g stroke="url(#gm-grad)" strokeWidth="1" fill="none" opacity="0.5">
        <circle cx="230" cy="150" r="95" />
        <ellipse cx="230" cy="150" rx="95" ry="34" />
        <ellipse cx="230" cy="150" rx="95" ry="60" transform="rotate(35 230 150)" />
        <ellipse cx="230" cy="150" rx="95" ry="60" transform="rotate(-35 230 150)" />
      </g>
      {EDGES.map(([a, b], i) => {
        const active = a === stage || b === stage;
        return (
          <line
            key={i}
            x1={NODES[a][0]} y1={NODES[a][1]}
            x2={NODES[b][0]} y2={NODES[b][1]}
            stroke={active ? SPECTRUM.blue : "rgba(255,255,255,0.16)"}
            strokeWidth={active ? 1.4 : 1}
            style={{ transition: "stroke .6s ease, stroke-width .6s ease" }}
          />
        );
      })}
      {NODES.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={i === stage ? 6 : 3.5}
          fill={NODE_COLOR(i)}
          style={{ opacity: i === stage ? 1 : 0.5, transition: "all .6s ease" }}
        />
      ))}
    </svg>
  );

  return (
    <div ref={ref} className="relative">
      <div
        className="glass relative overflow-hidden rounded-2xl"
        style={{
          boxShadow: `0 40px 140px -55px rgba(0,0,0,0.75), 0 0 70px -32px ${SPECTRUM.violet}40`,
        }}
      >
        {/* Header — window chrome + brand mark + live badge */}
        <div className="relative flex h-11 items-center gap-2.5 overflow-hidden border-b border-white/10 px-4">
          <div className="noise-overlay" />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(120% 220% at 8% 0%, ${SPECTRUM.violet}2e, transparent 60%), radial-gradient(90% 180% at 96% 100%, ${SPECTRUM.blue}22, transparent 65%)`,
            }}
          />
          <span className="relative h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="relative h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="relative h-2.5 w-2.5 rounded-full" style={{ background: `${SPECTRUM.violet}99` }} />
          <Mark size={16} className="relative ml-2" />
          <span className="relative font-mono text-[11px] uppercase tracking-wide2 text-white/75">
            ARACANA GENERATIVE MODEL
          </span>
          <span className="relative ml-auto flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wide2 text-white/40">
            <span
              className="h-1.5 w-1.5 animate-twinkle rounded-full"
              style={{ background: SPECTRUM.cyan, animationDuration: "5s" }}
            />
            Inference running
          </span>
        </div>

        {/* Visualization */}
        <div className="relative">
          <div className="noise-overlay" />
          <Scene3DLoader
            loadScene={() => import("../three/GenerativeScene")}
            fallback={fallback}
            className="h-[280px] w-full md:h-[320px]"
            sceneProps={{ stage, stageCount: STAGES.length }}
          />
        </div>

        {/* Live telemetry — calm HUD strip: label/value pairs, no grid lines,
            gentle cross-fade on change (remount via key), tabular figures so
            digits never jiggle the layout. */}
        <div className="relative flex flex-wrap items-baseline gap-x-7 gap-y-2.5 border-t border-white/8 px-5 py-3.5">
          {metrics.map((m) => (
            <div key={m.key} className="flex items-baseline gap-1.5">
              <span className="font-mono text-[9px] uppercase tracking-wide2 text-white/35">
                {m.label}
              </span>
              <span
                key={m.display}
                className="animate-fade-in font-mono text-[12px] text-white/85"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {m.display}
              </span>
            </div>
          ))}
        </div>

        {/* Inference progress */}
        <div className="relative flex items-center gap-3 border-t border-white/8 px-5 py-3.5">
          <span className="font-mono text-[13px] font-semibold" style={{ color: SPECTRUM.cyan }}>
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

      <DetectionHud stage={stage} />
    </div>
  );
}

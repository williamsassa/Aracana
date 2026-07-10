"use client";

import { useEffect, useState } from "react";

/**
 * Space-domain awareness demo for the State Space Sovereignty Model.
 * Visualises the pipeline: ingest raw multi-source data → fuse into a clean
 * picture of orbital traffic → classify known vs. unknown objects → flag an
 * anomaly for human review. Pure SVG/CSS, driven by a small stage loop.
 * Deliberately neutral, non-lethal framing — a surveillance/awareness demo,
 * not a targeting sequence (see brief: no political/military framing).
 */

const STAGES = [
  "Ingesting raw telemetry, radar & signals…",
  "Fusing sources into a single scene…",
  "Classifying objects — known or unknown…",
  "Anomaly flagged for review…",
  "Situational picture confirmed.",
];

// Raw data lines that stream up the ingest panel.
const FEED = [
  "RADAR   az=128.4  el=+12.0  rng=842km",
  "TELEM   ΔV=0.41 m/s  spin=2.1°/s",
  "OPTIC   mag=6.2  albedo=0.18",
  "SIGINT  band=X  enc=high  ⚠",
  "XPDR    resp=VALID  id=EU-734",
  "RADAR   az=203.1  el=-04.3  rng=1210km",
  "TELEM   ΔV=1.84 m/s  burn=Y",
  "XPDR    resp=NONE   ⚠ unknown",
  "ORBIT   incl=53.0°  ecc=0.001",
  "SIGINT  band=Ku  enc=high  ⚠",
  "OPTIC   shape=irregular  flag",
  "THERMAL +312K  thruster=hot",
];

// Known, catalogued objects (white) and one flagged/unclassified object (red).
const KNOWN = [
  { x: 120, y: 110, id: "EU-734" },
  { x: 300, y: 90, id: "EU-118" },
  { x: 250, y: 250, id: "EU-205" },
  { x: 95, y: 235, id: "OBS-12" },
];
const FLAGGED = { x: 320, y: 200, id: "UNK-09" };

export default function SpaceOps() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setStage((s) => (s + 1) % STAGES.length),
      2300
    );
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-obsidian text-paper-fixed">
      {/* starfield */}
      <div className="stars" />
      <div className="stars stars-2" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% -10%, rgba(229,18,26,0.10), transparent 60%)",
        }}
      />

      <div className="container-x relative py-20 md:py-28">
        <div className="eyebrow text-paper-fixed/50">Space &amp; Very-High Altitude</div>
        <h2 className="display-2 mt-3 max-w-3xl text-paper-fixed">
          From raw data to a decisive picture of orbit.
        </h2>
        <p className="lead mt-5 max-w-2xl text-paper-fixed/60">
          The model converts every retrievable signal — radar, telemetry,
          optical, RF — into text, fuses it into a clean visual representation
          of orbital traffic, classifies each object as known or unknown, and
          flags anomalies for a human analyst to review.
        </p>

        <div className="mt-12 grid gap-4 lg:grid-cols-[0.78fr_1.22fr]">
          {/* Ingest panel — streaming raw data → text */}
          <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wide2 text-paper-fixed/45">
                01 · Ingest
              </span>
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
            </div>
            <div className="relative mt-4 h-[300px] overflow-hidden [mask-image:linear-gradient(180deg,transparent,#000_12%,#000_85%,transparent)]">
              <div className="animate-marquee space-y-2">
                {[...FEED, ...FEED].map((line, i) => (
                  <div
                    key={i}
                    className={`font-mono text-[11.5px] leading-tight ${
                      line.includes("⚠") || line.includes("NONE")
                        ? "text-accent-soft"
                        : "text-paper-fixed/55"
                    }`}
                  >
                    <span className="text-paper-fixed/25">
                      {String(i).padStart(2, "0")}{" "}
                    </span>
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Radar / scene panel */}
          <div className="relative rounded-2xl border border-white/12 bg-white/[0.02] p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wide2 text-paper-fixed/45">
                02 · Fused orbital picture
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wide2 text-paper-fixed/45">
                STATE-SPACE · live
              </span>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto]">
              <svg
                viewBox="0 0 400 320"
                className="w-full rounded-xl bg-[#05060a]"
              >
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
                <g
                  className="animate-sweep"
                  style={{ transformOrigin: "200px 160px" }}
                >
                  <defs>
                    <linearGradient id="sweep" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="rgba(229,18,26,0)" />
                      <stop offset="100%" stopColor="rgba(229,18,26,0.45)" />
                    </linearGradient>
                  </defs>
                  <polygon points="200,160 200,10 280,40" fill="url(#sweep)" />
                  <line x1="200" y1="160" x2="200" y2="12" stroke="rgba(229,18,26,0.7)" />
                </g>

                {/* known, catalogued objects */}
                {KNOWN.map((c) => (
                  <g key={c.id}>
                    <rect
                      x={c.x - 4}
                      y={c.y - 4}
                      width="8"
                      height="8"
                      fill="rgba(255,255,255,0.9)"
                    />
                    {stage >= 2 && (
                      <text
                        x={c.x + 9}
                        y={c.y + 3}
                        fill="rgba(255,255,255,0.55)"
                        fontSize="9"
                        fontFamily="monospace"
                      >
                        {c.id} ✓
                      </text>
                    )}
                  </g>
                ))}

                {/* flagged / unclassified object */}
                <g>
                  <polygon
                    points={`${FLAGGED.x},${FLAGGED.y - 6} ${FLAGGED.x - 6},${
                      FLAGGED.y + 5
                    } ${FLAGGED.x + 6},${FLAGGED.y + 5}`}
                    fill={stage >= 4 ? "rgba(229,18,26,0.25)" : "#E5121A"}
                  />
                  {stage >= 2 && stage < 4 && (
                    <text
                      x={FLAGGED.x + 10}
                      y={FLAGGED.y + 3}
                      fill="#FF4D4D"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {FLAGGED.id} ⚠ FLAGGED
                    </text>
                  )}
                  {/* flagged-for-review marker */}
                  {stage === 3 && (
                    <g
                      className="animate-lock"
                      style={{ transformOrigin: `${FLAGGED.x}px ${FLAGGED.y}px` }}
                    >
                      <circle
                        cx={FLAGGED.x}
                        cy={FLAGGED.y}
                        r="16"
                        fill="none"
                        stroke="#E5121A"
                        strokeWidth="1.5"
                        strokeDasharray="6 4"
                      />
                      <line x1={FLAGGED.x - 22} y1={FLAGGED.y} x2={FLAGGED.x - 12} y2={FLAGGED.y} stroke="#E5121A" />
                      <line x1={FLAGGED.x + 12} y1={FLAGGED.y} x2={FLAGGED.x + 22} y2={FLAGGED.y} stroke="#E5121A" />
                      <line x1={FLAGGED.x} y1={FLAGGED.y - 22} x2={FLAGGED.x} y2={FLAGGED.y - 12} stroke="#E5121A" />
                      <line x1={FLAGGED.x} y1={FLAGGED.y + 12} x2={FLAGGED.x} y2={FLAGGED.y + 22} stroke="#E5121A" />
                    </g>
                  )}
                  {/* reviewed */}
                  {stage >= 4 && (
                    <>
                      <line x1={FLAGGED.x - 7} y1={FLAGGED.y - 7} x2={FLAGGED.x + 7} y2={FLAGGED.y + 7} stroke="#FF4D4D" strokeWidth="1.5" />
                      <line x1={FLAGGED.x + 7} y1={FLAGGED.y - 7} x2={FLAGGED.x - 7} y2={FLAGGED.y + 7} stroke="#FF4D4D" strokeWidth="1.5" />
                      <text
                        x={FLAGGED.x + 12}
                        y={FLAGGED.y + 3}
                        fill="rgba(255,255,255,0.5)"
                        fontSize="9"
                        fontFamily="monospace"
                      >
                        REVIEWED
                      </text>
                    </>
                  )}
                </g>
              </svg>

              {/* legend */}
              <div className="flex flex-row gap-4 md:flex-col md:gap-3">
                <Legend swatch="white" label="Friendly" />
                <Legend swatch="red" label="Flagged" />
                <Legend swatch="ring" label="Range ring" />
              </div>
            </div>

            {/* stage caption */}
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <span className="font-mono text-[11px] text-accent-soft">
                {String(stage + 1).padStart(2, "0")}/0{STAGES.length}
              </span>
              <span className="font-mono text-[12px] text-paper-fixed/75">
                {STAGES[stage]}
              </span>
            </div>
          </div>
        </div>

        {/* pipeline steps */}
        <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4">
          {[
            ["Convert", "Every retrievable signal → structured text."],
            ["Fuse", "Text → one coherent visual scene of orbit."],
            ["Identify", "Classify each object: known or unknown."],
            ["Decide", "Flag the anomaly; support the call for human review."],
          ].map(([t, d]) => (
            <div key={t} className="bg-obsidian p-5">
              <h4 className="font-display text-base text-paper-fixed">{t}</h4>
              <p className="mt-1 text-[12.5px] leading-snug text-paper-fixed/55">{d}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 font-mono text-[11px] uppercase tracking-wide2 text-paper-fixed/35">
          Illustrative simulation · decision authority always remains with human
          command.
        </p>
      </div>
    </section>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  const dot =
    swatch === "white"
      ? "bg-white"
      : swatch === "red"
      ? "bg-accent"
      : "border border-white/30 bg-transparent";
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-block h-3 w-3 rounded-[2px] ${dot}`} />
      <span className="font-mono text-[10.5px] uppercase tracking-wide2 text-paper-fixed/50">
        {label}
      </span>
    </div>
  );
}

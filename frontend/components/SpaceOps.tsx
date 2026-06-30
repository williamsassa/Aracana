"use client";

import { useEffect, useState } from "react";

/**
 * Space-domain awareness demo for the State Space Sovereignty Model.
 * Visualises the pipeline: ingest raw multi-source data → fuse into a clean
 * picture of military craft in orbit → identify friend vs. threat → lock and
 * neutralise the hostile contact. Pure SVG/CSS, driven by a small stage loop.
 */

const STAGES = [
  "Ingesting raw telemetry, radar & SIGINT…",
  "Fusing sources into a single scene…",
  "Classifying contacts — friend or foe…",
  "Threat identified · target lock…",
  "Hostile neutralised · airspace clear.",
];

// Raw data lines that stream up the ingest panel.
const FEED = [
  "RADAR   az=128.4  el=+12.0  rng=842km",
  "TELEM   ΔV=0.41 m/s  spin=2.1°/s",
  "OPTIC   mag=6.2  albedo=0.18",
  "SIGINT  band=X  enc=high  ⚠",
  "IFF     resp=VALID  id=EU-734",
  "RADAR   az=203.1  el=-04.3  rng=1210km",
  "TELEM   ΔV=1.84 m/s  burn=Y",
  "IFF     resp=NONE   ⚠ unknown",
  "ORBIT   incl=53.0°  ecc=0.001",
  "SIGINT  band=Ku  enc=high  ⚠",
  "OPTIC   shape=irregular  flag",
  "THERMAL +312K  thruster=hot",
];

// Friendly + neutral contacts (white) and one hostile (red).
const FRIENDLY = [
  { x: 120, y: 110, id: "EU-734" },
  { x: 300, y: 90, id: "EU-118" },
  { x: 250, y: 250, id: "EU-205" },
  { x: 95, y: 235, id: "OBS-12" },
];
const HOSTILE = { x: 320, y: 200, id: "UNK-09" };

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
    <section className="relative overflow-hidden border-t border-white/10 bg-ink text-paper">
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
        <div className="eyebrow text-paper/50">Space &amp; Very-High Altitude</div>
        <h2 className="display-2 mt-3 max-w-3xl text-paper">
          From raw data to a decisive picture of orbit.
        </h2>
        <p className="lead mt-5 max-w-2xl text-paper/60">
          The model converts every retrievable signal — radar, telemetry,
          optical, SIGINT — into text, fuses it into a clean visual
          representation of the current situation of military craft in space,
          identifies friend from foe, and supports the decision to neutralise a
          threat.
        </p>

        <div className="mt-12 grid gap-4 lg:grid-cols-[0.78fr_1.22fr]">
          {/* Ingest panel — streaming raw data → text */}
          <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wide2 text-paper/45">
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
                        : "text-paper/55"
                    }`}
                  >
                    <span className="text-paper/25">
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
              <span className="font-mono text-[11px] uppercase tracking-wide2 text-paper/45">
                02 · Fused orbital picture
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wide2 text-paper/45">
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

                {/* friendly contacts */}
                {FRIENDLY.map((c) => (
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

                {/* hostile contact */}
                <g>
                  <polygon
                    points={`${HOSTILE.x},${HOSTILE.y - 6} ${HOSTILE.x - 6},${
                      HOSTILE.y + 5
                    } ${HOSTILE.x + 6},${HOSTILE.y + 5}`}
                    fill={stage >= 4 ? "rgba(229,18,26,0.25)" : "#E5121A"}
                  />
                  {stage >= 2 && stage < 4 && (
                    <text
                      x={HOSTILE.x + 10}
                      y={HOSTILE.y + 3}
                      fill="#FF4D4D"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {HOSTILE.id} ⚠ HOSTILE
                    </text>
                  )}
                  {/* target lock */}
                  {stage === 3 && (
                    <g
                      className="animate-lock"
                      style={{ transformOrigin: `${HOSTILE.x}px ${HOSTILE.y}px` }}
                    >
                      <circle
                        cx={HOSTILE.x}
                        cy={HOSTILE.y}
                        r="16"
                        fill="none"
                        stroke="#E5121A"
                        strokeWidth="1.5"
                        strokeDasharray="6 4"
                      />
                      <line x1={HOSTILE.x - 22} y1={HOSTILE.y} x2={HOSTILE.x - 12} y2={HOSTILE.y} stroke="#E5121A" />
                      <line x1={HOSTILE.x + 12} y1={HOSTILE.y} x2={HOSTILE.x + 22} y2={HOSTILE.y} stroke="#E5121A" />
                      <line x1={HOSTILE.x} y1={HOSTILE.y - 22} x2={HOSTILE.x} y2={HOSTILE.y - 12} stroke="#E5121A" />
                      <line x1={HOSTILE.x} y1={HOSTILE.y + 12} x2={HOSTILE.x} y2={HOSTILE.y + 22} stroke="#E5121A" />
                    </g>
                  )}
                  {/* neutralised */}
                  {stage >= 4 && (
                    <>
                      <line x1={HOSTILE.x - 7} y1={HOSTILE.y - 7} x2={HOSTILE.x + 7} y2={HOSTILE.y + 7} stroke="#FF4D4D" strokeWidth="1.5" />
                      <line x1={HOSTILE.x + 7} y1={HOSTILE.y - 7} x2={HOSTILE.x - 7} y2={HOSTILE.y + 7} stroke="#FF4D4D" strokeWidth="1.5" />
                      <text
                        x={HOSTILE.x + 12}
                        y={HOSTILE.y + 3}
                        fill="rgba(255,255,255,0.5)"
                        fontSize="9"
                        fontFamily="monospace"
                      >
                        NEUTRALISED
                      </text>
                    </>
                  )}
                </g>
              </svg>

              {/* legend */}
              <div className="flex flex-row gap-4 md:flex-col md:gap-3">
                <Legend swatch="white" label="Friendly" />
                <Legend swatch="red" label="Hostile" />
                <Legend swatch="ring" label="Range ring" />
              </div>
            </div>

            {/* stage caption */}
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <span className="font-mono text-[11px] text-accent-soft">
                {String(stage + 1).padStart(2, "0")}/0{STAGES.length}
              </span>
              <span className="font-mono text-[12px] text-paper/75">
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
            ["Identify", "Classify each craft: friend or foe."],
            ["Decide", "Lock the threat; support the call to neutralise."],
          ].map(([t, d]) => (
            <div key={t} className="bg-ink p-5">
              <h4 className="font-display text-base text-paper">{t}</h4>
              <p className="mt-1 text-[12.5px] leading-snug text-paper/55">{d}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 font-mono text-[11px] uppercase tracking-wide2 text-paper/35">
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
      <span className="font-mono text-[10.5px] uppercase tracking-wide2 text-paper/50">
        {label}
      </span>
    </div>
  );
}

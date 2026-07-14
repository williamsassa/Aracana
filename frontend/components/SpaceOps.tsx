"use client";

import { useEffect, useState } from "react";
import StateSpaceSceneLoader from "./StateSpaceSceneLoader";
import { getProductAccent } from "@/lib/productTheme";

const ACCENT = getProductAccent("state-space-sovereignty-model"); // blue

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
            "radial-gradient(120% 80% at 50% -10%, rgba(59,130,246,0.12), transparent 60%)",
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

        <div className="mt-12 grid gap-4 lg:grid-cols-[0.6fr_1.4fr]">
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

          {/* Radar / scene panel — enlarged relative to the ingest panel and
              given its own ambient glow so the 3D scene reads as the
              section's centrepiece, not a small inset (owner feedback:
              State Space needs "a more complete universe", not just a
              validated content block). */}
          <div
            className="relative rounded-2xl border border-white/12 bg-white/[0.02] p-5"
            style={{ boxShadow: `0 0 90px -40px ${ACCENT}66` }}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wide2 text-paper-fixed/45">
                02 · Fused orbital picture
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wide2 text-paper-fixed/45">
                STATE-SPACE · live
              </span>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto]">
              <div
                className="rounded-xl"
                style={{ boxShadow: `inset 0 0 60px -20px ${ACCENT}4d` }}
              >
                <StateSpaceSceneLoader stage={stage} />
              </div>

              {/* legend */}
              <div className="flex flex-row gap-4 md:flex-col md:gap-3">
                <Legend swatch="white" label="Friendly" />
                <Legend swatch="accent" label="Flagged" />
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
      : swatch === "accent"
      ? ""
      : "border border-white/30 bg-transparent";
  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-block h-3 w-3 rounded-[2px] ${dot}`}
        style={swatch === "accent" ? { background: ACCENT } : undefined}
      />
      <span className="font-mono text-[10.5px] uppercase tracking-wide2 text-paper-fixed/50">
        {label}
      </span>
    </div>
  );
}

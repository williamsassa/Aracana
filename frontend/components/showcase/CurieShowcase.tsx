"use client";

import { useStageSequencer } from "./useStageSequencer";
import ShowcaseFrame from "./ShowcaseFrame";

const STAGES = [
  "Question",
  "Literature",
  "Hypothesis",
  "Experiment",
  "Observation",
  "Critique",
  "Iteration",
];

const ATOMS: [number, number][] = [
  [150, 100],
  [210, 75],
  [260, 110],
  [230, 160],
  [165, 160],
];

export default function CurieShowcase() {
  const { ref, stage } = useStageSequencer(STAGES.length, 1700);

  const showMolecule = stage >= 2;
  const showTrace = stage >= 3;
  const showObservation = stage >= 4;
  const showCritique = stage >= 5;

  return (
    <div ref={ref}>
      <ShowcaseFrame label="ai-scientist" stages={STAGES} stage={stage}>
        <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr]">
          <svg viewBox="0 0 320 220" className="h-[220px] w-full" aria-hidden>
            {ATOMS.map((a, i) => {
              const b = ATOMS[(i + 1) % ATOMS.length];
              return (
                <line
                  key={i}
                  x1={a[0]}
                  y1={a[1]}
                  x2={b[0]}
                  y2={b[1]}
                  stroke="rgba(255,255,255,0.22)"
                  style={{ opacity: showMolecule ? 1 : 0, transition: "opacity .5s" }}
                />
              );
            })}
            {ATOMS.map((a, i) => (
              <circle
                key={i}
                cx={a[0]}
                cy={a[1]}
                r={showMolecule ? 7 : 3}
                fill={i === 1 ? "#E5121A" : "rgba(255,255,255,0.85)"}
                style={{ transition: "all .5s", transitionDelay: `${i * 90}ms` }}
              />
            ))}
            <text x="20" y="200" fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="monospace">
              candidate molecule
            </text>
          </svg>

          <div className="flex flex-col justify-between">
            <svg viewBox="0 0 260 120" className="h-[120px] w-full" aria-hidden>
              <line x1="10" y1="105" x2="250" y2="105" stroke="rgba(255,255,255,0.12)" />
              <polyline
                points="10,95 55,80 100,85 145,55 190,60 235,25"
                fill="none"
                stroke="#E5121A"
                strokeWidth="1.5"
                style={{
                  strokeDasharray: 320,
                  strokeDashoffset: showTrace ? 0 : 320,
                  transition: "stroke-dashoffset 1.2s ease",
                }}
              />
              <text x="10" y="118" fill="rgba(255,255,255,0.35)" fontSize="8.5" fontFamily="monospace">
                docking score over iterations →
              </text>
            </svg>

            <div className="mt-3 space-y-1.5 font-mono text-[11px]">
              <div className={showObservation ? "text-white/70" : "text-white/25"}>
                observation: binding affinity ↑ 18%
              </div>
              <div className={showCritique ? "text-accent-soft" : "text-white/25"}>
                critique: synthesis route uncertain — flagged
              </div>
            </div>
          </div>
        </div>
      </ShowcaseFrame>
    </div>
  );
}

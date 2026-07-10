"use client";

import { useStageSequencer } from "./useStageSequencer";
import ShowcaseFrame from "./ShowcaseFrame";

const STAGES = [
  "Input",
  "Decomposition",
  "Reasoning branches",
  "Evaluation",
  "Synthesis",
  "Output",
];

// A small reasoning tree: one root, three branches, each converging back
// into a single synthesised output. Purely conceptual — no terminal/code
// aesthetic, to keep this showcase's personality distinct from Coding Agent.
const ROOT: [number, number] = [230, 40];
const BRANCHES: [number, number][] = [
  [90, 140],
  [230, 150],
  [370, 140],
];
const OUT: [number, number] = [230, 250];

export default function GenerativeReasoningShowcase() {
  const { ref, stage } = useStageSequencer(STAGES.length, 1900);

  const showBranches = stage >= 2;
  const showEval = stage >= 3;
  const showSynthesis = stage >= 4;
  const showOutput = stage >= 5;

  return (
    <div ref={ref}>
      <ShowcaseFrame label="generative" stages={STAGES} stage={stage}>
        <svg viewBox="0 0 460 300" className="h-[260px] w-full" aria-hidden>
          {/* root → branches */}
          {BRANCHES.map(([x, y], i) => (
            <line
              key={i}
              x1={ROOT[0]}
              y1={ROOT[1]}
              x2={x}
              y2={y}
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="1"
              style={{
                strokeDasharray: 200,
                strokeDashoffset: showBranches ? 0 : 200,
                transition: `stroke-dashoffset .8s ease ${i * 0.15}s`,
              }}
            />
          ))}
          {/* branches → output */}
          {BRANCHES.map(([x, y], i) => (
            <line
              key={`o-${i}`}
              x1={x}
              y1={y}
              x2={OUT[0]}
              y2={OUT[1]}
              stroke="rgba(229,18,26,0.35)"
              strokeWidth="1"
              style={{
                strokeDasharray: 200,
                strokeDashoffset: showSynthesis ? 0 : 200,
                transition: `stroke-dashoffset .8s ease ${i * 0.15}s`,
              }}
            />
          ))}

          <circle cx={ROOT[0]} cy={ROOT[1]} r="9" fill="rgba(255,255,255,0.85)" />
          <text x={ROOT[0]} y={ROOT[1] - 16} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">
            input
          </text>

          {BRANCHES.map(([x, y], i) => (
            <g key={`n-${i}`} style={{ opacity: showBranches ? 1 : 0.15, transition: "opacity .5s" }}>
              <circle cx={x} cy={y} r="6" fill="rgba(255,255,255,0.7)" />
              {showEval && (
                <text x={x} y={y + 20} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="monospace">
                  score {(0.62 + i * 0.14).toFixed(2)}
                </text>
              )}
            </g>
          ))}

          <circle
            cx={OUT[0]}
            cy={OUT[1]}
            r={showOutput ? 12 : 8}
            fill={showOutput ? "#E5121A" : "rgba(255,255,255,0.5)"}
            style={{ transition: "all .5s" }}
          />
          <text x={OUT[0]} y={OUT[1] + 24} textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="9" fontFamily="monospace">
            {showOutput ? "output ✓" : "synthesis…"}
          </text>
        </svg>
      </ShowcaseFrame>
    </div>
  );
}

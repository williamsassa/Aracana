"use client";

import { useStageSequencer } from "./useStageSequencer";
import ShowcaseFrame from "./ShowcaseFrame";

const STAGES = [
  "Central mission",
  "Specialised agents",
  "Parallel tasks",
  "Exchanges",
  "Validation",
  "Consolidated result",
];

const CENTER: [number, number] = [230, 150];
const AGENTS: { pos: [number, number]; role: string; color: string }[] = [
  { pos: [90, 70], role: "research", color: "#22D3EE" },
  { pos: [370, 70], role: "code", color: "#28C76F" },
  { pos: [90, 230], role: "verify", color: "#FFC93C" },
  { pos: [370, 230], role: "plan", color: "#8B5CF6" },
];

export default function SwarmShowcase() {
  const { ref, stage } = useStageSequencer(STAGES.length, 2000);

  const showAgents = stage >= 1;
  const showTasks = stage >= 2;
  const showExchange = stage >= 3;
  const showValidate = stage >= 4;
  const showResult = stage >= 5;

  return (
    <div ref={ref}>
      <ShowcaseFrame label="swarm" stages={STAGES} stage={stage}>
        <svg viewBox="0 0 460 300" className="h-[260px] w-full" aria-hidden>
          {AGENTS.map((a, i) => (
            <line
              key={`l-${i}`}
              x1={CENTER[0]}
              y1={CENTER[1]}
              x2={a.pos[0]}
              y2={a.pos[1]}
              stroke={showExchange ? a.color : "rgba(255,255,255,0.15)"}
              strokeOpacity={showExchange ? 0.55 : 1}
              strokeWidth="1"
              strokeDasharray="4 4"
              style={{
                animation: showExchange ? "dash 1.1s linear infinite" : "none",
              }}
            />
          ))}

          <circle cx={CENTER[0]} cy={CENTER[1]} r="15" fill="#E5121A" />
          <text x={CENTER[0]} y={CENTER[1] + 30} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="9" fontFamily="monospace">
            orchestrator
          </text>

          {AGENTS.map((a, i) => (
            <g
              key={`a-${i}`}
              style={{
                opacity: showAgents ? 1 : 0,
                transform: showAgents ? "scale(1)" : "scale(0.5)",
                transformOrigin: `${a.pos[0]}px ${a.pos[1]}px`,
                transition: `all .4s ease ${i * 0.1}s`,
              }}
            >
              <circle
                cx={a.pos[0]}
                cy={a.pos[1]}
                r={showTasks ? 10 : 8}
                fill={showValidate ? a.color : "rgba(255,255,255,0.65)"}
                style={{ transition: "all .4s" }}
              />
              <text
                x={a.pos[0]}
                y={a.pos[1] - 16}
                textAnchor="middle"
                fill="rgba(255,255,255,0.45)"
                fontSize="8.5"
                fontFamily="monospace"
              >
                {a.role}
                {showValidate ? " ✓" : ""}
              </text>
            </g>
          ))}

          {showResult && (
            <text
              x={CENTER[0]}
              y={CENTER[1] + 55}
              textAnchor="middle"
              fill="#E5121A"
              fontSize="10"
              fontFamily="monospace"
            >
              result consolidated
            </text>
          )}
        </svg>
      </ShowcaseFrame>
    </div>
  );
}

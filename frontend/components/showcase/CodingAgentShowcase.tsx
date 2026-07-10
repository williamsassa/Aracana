"use client";

import { useStageSequencer } from "./useStageSequencer";
import ShowcaseFrame from "./ShowcaseFrame";

const STAGES = [
  "Mission received",
  "Analyzing repository",
  "Reading files",
  "Planning",
  "Editing code",
  "Running terminal command",
  "Running tests",
  "Verifying",
  "Result",
];

// Log lines revealed cumulatively as the stage advances — purely
// presentational, no real execution (Phase A demo, not a live agent).
const LOG: [number, string][] = [
  [0, "$ mission: Fix authentication regression"],
  [1, "→ analyze  scanning 247 files…"],
  [1, "→ analyze  dependency graph mapped"],
  [2, "→ read     app/auth/middleware.ts"],
  [2, "→ read     app/auth/token.ts"],
  [3, "→ plan     1. reproduce failure"],
  [3, "→ plan     2. inspect middleware"],
  [3, "→ plan     3. trace token lifecycle"],
  [3, "→ plan     4. apply patch"],
  [3, "→ plan     5. run tests"],
  [4, "→ edit     app/auth/token.ts"],
  [5, "$ pytest tests/auth"],
  [5, "  2 failed"],
  [6, "$ pytest tests/auth"],
  [6, "  18 passed"],
  [7, "→ verify   build green · types clean"],
  [8, "✓ 3 files changed · +42 / -17"],
];

const DIFF = [
  { file: "app/auth/token.ts", added: 24, removed: 9 },
  { file: "app/auth/middleware.ts", added: 15, removed: 6 },
  { file: "tests/auth/test_token.py", added: 3, removed: 2 },
];

export default function CodingAgentShowcase() {
  const { ref, stage } = useStageSequencer(STAGES.length, 1500);
  const lines = LOG.filter(([s]) => s <= stage);

  return (
    <div ref={ref}>
      <ShowcaseFrame label="coding-agent" stages={STAGES} stage={stage}>
        <div className="grid gap-5 md:grid-cols-[1.2fr_0.8fr]">
          <div className="h-[220px] overflow-hidden rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-[12px] leading-relaxed">
            {lines.map(([, line], i) => (
              <div
                key={i}
                className={
                  line.startsWith("$")
                    ? "text-white/85"
                    : line.includes("failed")
                    ? "text-accent-soft"
                    : line.includes("passed") || line.startsWith("✓")
                    ? "text-emerald-400"
                    : "text-white/50"
                }
              >
                {line}
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-white/10 bg-black/40 p-4">
            <div className="font-mono text-[10px] uppercase tracking-wide2 text-white/35">
              Diff
            </div>
            <div className="mt-3 space-y-2.5">
              {DIFF.map((d, i) => (
                <div
                  key={d.file}
                  className={`font-mono text-[11px] transition-opacity duration-500 ${
                    stage >= 8 ? "opacity-100" : "opacity-25"
                  }`}
                  style={{ transitionDelay: `${i * 120}ms` }}
                >
                  <div className="truncate text-white/70">{d.file}</div>
                  <div className="mt-0.5 flex gap-2">
                    <span className="text-emerald-400">+{d.added}</span>
                    <span className="text-accent-soft">-{d.removed}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ShowcaseFrame>
    </div>
  );
}

"use client";

import { Terminal } from "lucide-react";
import { useStageSequencer } from "./useStageSequencer";
import Mark from "../Mark";
import { getProductAccent } from "@/lib/productTheme";
import { SPECTRUM } from "@/lib/theme-colors";
import { PRODUCTS_EN } from "@/lib/products.en";

// Bespoke "lab console" showcase for the Coding Agent, synthesising two
// owner references: pin.it/jV9MUvt7o (corner crosshairs + bracket-tag
// reticle HUD) supplies the framing chrome; pin.it/7zHquuDv9 (a real
// VS-Code-style multi-tab editor with a soft corner glow) supplies the
// actual content. The editor is plain HTML/CSS, not a 3D scene — crisp,
// legible code text is what an IDE reference is about, and rendering that
// as a WebGL texture would blur it and break accessibility/SEO for no
// benefit; the "right framework" for this element is the DOM, the R3F
// stack stays reserved for the genuinely spatial scenes (Hero, Generative).
const ACCENT = getProductAccent("coding-agent-model"); // electric blue
const STRING = "#2ECC71"; // success green, reused for string-literal syntax colour
const CODENAME = PRODUCTS_EN.find((p) => p.slug === "coding-agent-model")?.codename ?? "FORGE";

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

// The three files from DIFF, reopened as editor tabs — same mission, same
// files, so the log / diff / editor all tell one consistent story.
const TABS = [
  { name: "token.ts", badge: "TS", color: SPECTRUM.violet, active: true },
  { name: "middleware.ts", badge: "TS", color: SPECTRUM.blue, active: false },
  { name: "test_token.py", badge: "PY", color: SPECTRUM.cyan, active: false },
];

type Tok = { t: string; c?: string };
const KW = SPECTRUM.violet;
const CALL = SPECTRUM.cyan;
const TYPE = SPECTRUM.blue;
const PLAIN = "rgba(255,255,255,0.78)";
const PUNCT = "rgba(255,255,255,0.4)";

// token.ts, the file actually being patched — hand-tokenised (no highlighter
// dependency) so every colour stays inside the brand's own syntax palette
// instead of a library's default theme. The `fix` lines light up while the
// agent is in its "Editing code" stage, echoing the diff panel's +24/-9.
const CODE_LINES: { tokens: Tok[]; fix?: boolean }[] = [
  { tokens: [{ t: "import ", c: KW }, { t: "{ ", c: PUNCT }, { t: "verify", c: CALL }, { t: " } ", c: PUNCT }, { t: "from ", c: KW }, { t: '"jsonwebtoken"', c: STRING }, { t: ";", c: PUNCT }] },
  { tokens: [{ t: "" }] },
  { tokens: [{ t: "export ", c: KW }, { t: "function ", c: KW }, { t: "verifyToken", c: CALL }, { t: "(token: ", c: PUNCT }, { t: "string", c: TYPE }, { t: ") {", c: PUNCT }] },
  { tokens: [{ t: "  try {", c: KW }] },
  { tokens: [{ t: "    const payload = ", c: KW }, { t: "verify", c: CALL }, { t: "(token, env.JWT_SECRET);", c: PLAIN }] },
  { tokens: [{ t: "    if ", c: KW }, { t: "(!payload.exp || payload.exp < ", c: PLAIN }, { t: "Date", c: TYPE }, { t: ".now() / 1000) {", c: PLAIN }], fix: true },
  { tokens: [{ t: "      throw ", c: KW }, { t: "new ", c: KW }, { t: "Error", c: TYPE }, { t: "(", c: PUNCT }, { t: '"Token expired"', c: STRING }, { t: ");", c: PUNCT }], fix: true },
  { tokens: [{ t: "    }", c: PLAIN }], fix: true },
  { tokens: [{ t: "    return payload;", c: PLAIN }] },
  { tokens: [{ t: "  } catch {", c: KW }] },
  { tokens: [{ t: "    return ", c: KW }, { t: "null", c: KW }, { t: ";", c: PUNCT }] },
  { tokens: [{ t: "  }", c: PLAIN }] },
  { tokens: [{ t: "}", c: PLAIN }] },
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

function Crosshair({ className = "" }: { className?: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" className={className} aria-hidden>
      <path d="M7 0V4M7 10V14M0 7H4M10 7H14" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export default function CodingAgentShowcase() {
  const { ref, stage } = useStageSequencer(STAGES.length, 1500);
  const lines = LOG.filter(([s]) => s <= stage);
  const editing = stage >= 4 && stage <= 7;
  const percent = Math.round(((stage + 1) / STAGES.length) * 100);

  return (
    <div ref={ref}>
      <div
        className="glass relative overflow-hidden rounded-2xl"
        style={{ boxShadow: `0 40px 140px -55px rgba(0,0,0,0.75), 0 0 70px -32px ${ACCENT}40` }}
      >
        {/* Header — window chrome + brand mark + live badge */}
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
            ARACANA CODING AGENT
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
            Agent active
          </span>
        </div>

        {/* Visualization — a real editor window: tabs + syntax-highlighted
            code, framed with corner crosshairs and a bracket-tag reticle. */}
        <div className="relative overflow-hidden">
          <div className="noise-overlay" />
          <div
            className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full blur-[70px]"
            style={{ background: `${SPECTRUM.violet}2e` }}
          />
          <Crosshair className="absolute left-4 top-3 text-white/15" />
          <Crosshair className="absolute right-4 top-3 text-white/15" />

          <div className="relative z-10 flex items-center justify-center gap-2 pt-4 pb-2">
            <div className="relative h-6 w-6">
              <HudBracket color={`${ACCENT}70`} />
              <Terminal size={11} className="absolute inset-0 m-auto" style={{ color: ACCENT }} />
            </div>
            <span className="font-mono text-[9px] uppercase tracking-wide2 text-white/40">
              <span className="text-white/20">[</span> Live agent session <span className="text-white/20">]</span>
            </span>
          </div>

          <div className="relative z-10 flex items-center gap-1 overflow-x-auto border-b border-white/8 px-3">
            {TABS.map((tab) => (
              <div
                key={tab.name}
                className={`flex shrink-0 items-center gap-1.5 rounded-t-md px-3 py-1.5 font-mono text-[11px] ${
                  tab.active ? "bg-white/[0.06] text-white/85" : "text-white/35"
                }`}
              >
                <span
                  className="flex h-3.5 w-3.5 items-center justify-center rounded-[3px] text-[7px] font-bold text-white"
                  style={{ background: tab.color }}
                >
                  {tab.badge}
                </span>
                {tab.name}
              </div>
            ))}
          </div>

          <div className="relative z-10 h-[210px] overflow-hidden px-4 py-3 font-mono text-[11.5px] leading-[1.7]">
            {CODE_LINES.map((line, i) => (
              <div
                key={i}
                className="flex gap-3 rounded transition-colors duration-500"
                style={{ background: editing && line.fix ? `${ACCENT}14` : "transparent" }}
              >
                <span className="w-4 shrink-0 text-right text-white/20">{i + 1}</span>
                <span className="whitespace-pre">
                  {line.tokens.map((tok, j) => (
                    <span key={j} style={{ color: tok.c ?? PLAIN }}>
                      {tok.t}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Terminal + diff */}
        <div className="relative grid border-t border-white/8 md:grid-cols-[1.2fr_0.8fr] md:divide-x md:divide-white/8">
          <div className="h-[200px] overflow-hidden p-4 font-mono text-[12px] leading-relaxed">
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

          <div className="border-t border-white/8 p-4 md:border-t-0">
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

        {/* Mission progress */}
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

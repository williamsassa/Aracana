import type { Config } from "tailwindcss";

const config: Config = {
  // Light/dark toggled via next-themes' `class` strategy — dark stays the
  // brand default (see ThemeProvider), light is an explicit opt-in. Token
  // values live in globals.css :root (light) / .dark (dark).
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Theme-aware tokens — driven by CSS variables (see globals.css :root/.dark)
        // so light/dark can swap without touching component classes.
        ink: {
          DEFAULT: "rgb(var(--ink) / <alpha-value>)",
          soft: "rgb(var(--ink-soft) / <alpha-value>)",
          muted: "rgb(var(--ink-muted) / <alpha-value>)",
          faint: "rgb(var(--ink-faint) / <alpha-value>)",
        },
        paper: {
          DEFAULT: "rgb(var(--paper) / <alpha-value>)",
          soft: "rgb(var(--paper-soft) / <alpha-value>)",
          raised: "rgb(var(--paper-raised) / <alpha-value>)",
          line: "rgb(var(--paper-line) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          soft: "rgb(var(--accent-soft) / <alpha-value>)",
          deep: "rgb(var(--accent-deep) / <alpha-value>)",
        },
        // Fixed, non-theme-aware tokens for sections that stay a deliberately
        // dark "console" band in both light and dark mode (SpaceOps, Methodology).
        // Literal hex (not CSS-var-driven) so Tailwind's opacity modifiers
        // (e.g. text-paper-fixed/60) keep working regardless of active theme.
        obsidian: "#0A0A0B",
        "paper-fixed": "#EFE9DB",
        // Brand spectrum — V3 (README_ARACANA_BRAND.md): strict 3-colour
        // palette (violet/blue/cyan) + 2 derived blends so the 5 products
        // keep distinct identities without introducing hues outside the spec.
        spectrum: {
          violet: "#7B5CFF",
          blue: "#4D9DFF",
          cyan: "#3EE8FF",
          violetBlue: "#6272FF",
          blueCyan: "#45C0FF",
        },
        // Status colours (README §3) — the one legitimate use of red left,
        // reserved for real error states.
        success: "#2ECC71",
        warning: "#FFB547",
        error: "#FF5C75",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        wide2: "0.18em",
      },
      maxWidth: {
        content: "1180px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "spin-rev": {
          "0%": { transform: "rotate(360deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        drift: {
          "0%,100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,-12px,0)" },
        },
        // Background field: slow morph of soft blobs
        blob: {
          "0%,100%": { transform: "translate3d(0,0,0) scale(1)" },
          "33%": { transform: "translate3d(4%,-6%,0) scale(1.08)" },
          "66%": { transform: "translate3d(-5%,4%,0) scale(0.95)" },
        },
        twinkle: {
          "0%,100%": { opacity: "0.15" },
          "50%": { opacity: "1" },
        },
        sweep: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        marquee: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-50%)" },
        },
        dash: {
          to: { strokeDashoffset: "0" },
        },
        lock: {
          "0%,100%": { transform: "scale(1)", opacity: "0.9" },
          "50%": { transform: "scale(1.12)", opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both",
        "fade-in": "fade-in 1s ease both",
        "spin-slow": "spin-slow 28s linear infinite",
        "spin-rev": "spin-rev 36s linear infinite",
        drift: "drift 9s ease-in-out infinite",
        blob: "blob 26s ease-in-out infinite",
        twinkle: "twinkle 4s ease-in-out infinite",
        sweep: "sweep 5s linear infinite",
        scanline: "scanline 3.5s linear infinite",
        marquee: "marquee 16s linear infinite",
        lock: "lock 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

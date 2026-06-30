import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0A0A0B",
          soft: "#16161A",
          muted: "#6A6458",
          faint: "#A39B86",
        },
        // Warm beige paper system (replaces pure white)
        paper: {
          DEFAULT: "#EFE9DB", // base beige background
          soft: "#E6DECC", // deeper beige — alternating sections
          raised: "#F7F2E8", // warm near-white — cards/surfaces
          line: "#D7CDB8", // hairlines / borders
        },
        accent: {
          DEFAULT: "#E5121A",
          soft: "#FF4D4D",
          deep: "#B00C12",
        },
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

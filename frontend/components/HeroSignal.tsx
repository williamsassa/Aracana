"use client";

import { useEffect, useState } from "react";

/** Decorative hero centrepiece: orbital rings + a signal travelling along a
 * flight path between a few "reasoning" nodes. Purely presentational —
 * extends the existing Orb vocabulary (Bits.tsx) rather than inventing a new
 * one. Monochrome in light mode; cycles through the brand spectrum in dark
 * mode only. The travelling signal (SMIL animateMotion) is skipped under
 * prefers-reduced-motion, since that preference can't be honoured via CSS alone. */
export default function HeroSignal({ className = "" }: { className?: string }) {
  const [motionOk, setMotionOk] = useState(false);
  useEffect(() => {
    setMotionOk(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const nodes: [number, number][] = [
    [220, 120],
    [340, 90],
    [420, 210],
    [300, 260],
    [160, 220],
  ];
  const path = `M ${nodes.map(([x, y]) => `${x} ${y}`).join(" L ")} Z`;

  return (
    <div
      aria-hidden
      className={`pointer-events-none select-none ${className}`}
    >
      <svg viewBox="0 0 580 340" className="h-full w-full">
        <g style={{ transformOrigin: "290px 170px" }} className="animate-spin-slow">
          <ellipse
            cx="290"
            cy="170"
            rx="270"
            ry="120"
            transform="rotate(-18 290 170)"
            fill="none"
            className="stroke-ink/10 dark:stroke-paper/10"
            strokeWidth="1"
          />
        </g>
        <g style={{ transformOrigin: "290px 170px" }} className="animate-spin-rev">
          <ellipse
            cx="290"
            cy="170"
            rx="230"
            ry="150"
            transform="rotate(18 290 170)"
            fill="none"
            className="stroke-ink/[0.06] dark:stroke-paper/[0.08]"
            strokeWidth="1"
          />
        </g>

        {/* reasoning-flow lattice */}
        <path
          d={path}
          fill="none"
          className="stroke-ink/15 dark:stroke-spectrum-cyan/25"
          strokeWidth="1"
        />
        {nodes.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i === 0 ? 5 : 3}
            className="fill-ink/25 dark:fill-paper/40"
          />
        ))}

        {/* travelling signal */}
        {motionOk && (
          <circle r="4" className="fill-accent">
            <animateMotion dur="7s" repeatCount="indefinite" path={path} />
          </circle>
        )}

        <circle cx="290" cy="170" r="16" className="fill-ink/80 dark:fill-paper/85" />
      </svg>
    </div>
  );
}

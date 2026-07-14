"use client";

import { useEffect, useState } from "react";

/** Centralised prefers-reduced-motion detection, client-only (defaults to
 * `false` during SSR/first paint, then syncs — mirrors the pattern already
 * used ad-hoc in HeroSignal.tsx / useStageSequencer.ts). */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

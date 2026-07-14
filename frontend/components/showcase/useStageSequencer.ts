"use client";

import { useEffect, useRef, useState } from "react";

/** Cycles through `stageCount` stages on an interval, but only while the
 * element is on-screen and the user hasn't asked for reduced motion —
 * mirrors the guards already used by Reveal.tsx so showcases don't burn
 * cycles off-screen or animate against a stated accessibility preference. */
export function useStageSequencer(stageCount: number, intervalMs = 2300) {
  const ref = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.2,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const t = setInterval(() => setStage((s) => (s + 1) % stageCount), intervalMs);
    return () => clearInterval(t);
  }, [visible, stageCount, intervalMs]);

  return { ref, stage, visible };
}

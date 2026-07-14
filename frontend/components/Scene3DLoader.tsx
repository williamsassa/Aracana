"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/reducedMotion";
import { hasWebGL, isLowEndDevice } from "@/lib/webgl";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SceneModule = { default: React.ComponentType<any> };

/**
 * Shared "pick 3D or fallback" loader — generalises the pattern first built
 * for Hero/State Space (HeroSceneLoader.tsx, StateSpaceSceneLoader.tsx) now
 * that every product page gets its own R3F scene. `loadScene` must always
 * point at a "use client" module with a default export accepting the same
 * props as `sceneProps` plus `className`; it is dynamically imported with
 * `ssr: false` so `<Canvas>` never touches a Server Component render path.
 *
 * The fallback is rendered for prefers-reduced-motion, missing/low-end
 * WebGL, below `minViewport` (if given), AND during the brief window before
 * feature detection resolves on the client — it must always be an
 * equivalent, not a downgrade. `minViewport` matters: CSS-hiding the 3D
 * branch below a breakpoint (e.g. `hidden md:block`) would still pick and
 * mount it whenever WebGL is available, leaving a blank hidden canvas
 * instead of showing the fallback — checking the viewport here instead
 * makes the fallback the one actually rendered on narrow screens.
 */
export default function Scene3DLoader({
  loadScene,
  fallback,
  className,
  sceneProps,
  minViewport,
}: {
  loadScene: () => Promise<SceneModule>;
  fallback: React.ReactNode;
  className?: string;
  sceneProps?: Record<string, unknown>;
  minViewport?: number;
}) {
  const reducedMotion = useReducedMotion();
  const [webglOk, setWebglOk] = useState<boolean | null>(null);
  const [wideEnough, setWideEnough] = useState(minViewport ? false : true);

  useEffect(() => {
    setWebglOk(hasWebGL() && !isLowEndDevice());
  }, []);

  useEffect(() => {
    if (!minViewport) return;
    const mq = window.matchMedia(`(min-width: ${minViewport}px)`);
    setWideEnough(mq.matches);
    const onChange = () => setWideEnough(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [minViewport]);

  if (reducedMotion || webglOk !== true || !wideEnough) {
    return <>{fallback}</>;
  }

  const Scene = dynamic(loadScene, { ssr: false });
  return <Scene className={className} {...sceneProps} />;
}

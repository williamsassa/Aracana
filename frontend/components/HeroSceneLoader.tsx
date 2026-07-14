"use client";

import Scene3DLoader from "./Scene3DLoader";
import HeroSignal from "./HeroSignal";

/**
 * Picks the Hero visual: the holographic 3D scene when the device can
 * comfortably run it AND the viewport is desktop-sized, otherwise the
 * existing 2D SVG (HeroSignal) — an equivalent decorative fallback, not a
 * downgrade. `minViewport` (not a CSS `hidden md:block` on the 3D branch)
 * is what actually renders the fallback on narrow screens — see
 * Scene3DLoader for why the CSS-only approach silently showed nothing.
 */
export default function HeroSceneLoader({
  className = "",
}: {
  className?: string;
}) {
  return (
    <Scene3DLoader
      loadScene={() => import("./three/HeroScene")}
      fallback={<HeroSignal className={className} />}
      className={className}
      minViewport={768}
    />
  );
}

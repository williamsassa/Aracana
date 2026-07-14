"use client";

import * as THREE from "three";

/**
 * Cheap "neon glow" halo for R3F scenes — a slightly larger, additively-blended
 * transparent sphere behind a glowing element. Deliberately not a real
 * post-processing Bloom pass (no @react-three/postprocessing dependency,
 * no extra full-screen shader cost per canvas) — the brief prioritises
 * performance over effects, and this reads convincingly as "glass/neon"
 * for the size of object these scenes use. Composable: drop one behind any
 * mesh that should read as lit-from-within.
 */
export default function Glow({
  color,
  size = 0.3,
  intensity = 0.35,
}: {
  color: string;
  size?: number;
  intensity?: number;
}) {
  return (
    <mesh>
      <sphereGeometry args={[size, 16, 16]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={intensity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

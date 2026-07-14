"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, Html, Stars } from "@react-three/drei";
import type * as THREE from "three";
import { SPECTRUM } from "@/lib/theme-colors";
import { getProductAccent } from "@/lib/productTheme";

const FLAGGED_COLOR = getProductAccent("state-space-sovereignty-model"); // V2.1: blue, not red

/**
 * 3D companion to StateSpaceRadar2D — a schematic (deliberately not
 * photoreal, no external Earth texture available) wireframe globe with a
 * handful of tracked objects on inclined orbits. Same neutrality rules as
 * the 2D version: no political/territorial geography, "flagged for review"
 * vocabulary, never "targeting". Driven by the same `stage` (0-4) the parent
 * SpaceOps component already cycles through.
 */

type Sat = {
  id: string;
  angle: number;
  incl: number;
  radius: number;
  flagged?: boolean;
};

const SATS: Sat[] = [
  { id: "EU-734", angle: 0.2, incl: 0.15, radius: 2.5 },
  { id: "EU-118", angle: 1.6, incl: -0.32, radius: 2.85 },
  { id: "EU-205", angle: 3.0, incl: 0.4, radius: 2.4 },
  { id: "OBS-12", angle: 4.4, incl: -0.12, radius: 3.05 },
  { id: "UNK-09", angle: 5.4, incl: 0.25, radius: 2.65, flagged: true },
];

const RINGS = [
  { radius: 2.5, incl: 0.15 },
  { radius: 2.85, incl: -0.32 },
  { radius: 3.05, incl: -0.12 },
];

function orbitPosition(
  radius: number,
  angle: number,
  incl: number
): [number, number, number] {
  const x = radius * Math.cos(angle);
  const y = -radius * Math.sin(angle) * Math.sin(incl);
  const z = radius * Math.sin(angle) * Math.cos(incl);
  return [x, y, z];
}

function Globe() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.05;
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.4, 2]} />
      <meshBasicMaterial color="#3a4250" wireframe transparent opacity={0.5} />
    </mesh>
  );
}

function OrbitRing({ radius, incl }: { radius: number; incl: number }) {
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 64; i++) {
      pts.push(orbitPosition(radius, (i / 64) * Math.PI * 2, incl));
    }
    return pts;
  }, [radius, incl]);
  return <Line points={points} color="#ffffff" transparent opacity={0.12} lineWidth={1} />;
}

function Satellite({
  sat,
  stage,
  speed,
}: {
  sat: Sat;
  stage: number;
  speed: number;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const angle = sat.angle + state.clock.elapsedTime * speed;
    ref.current.position.set(...orbitPosition(sat.radius, angle, sat.incl));
  });

  const reviewed = !!sat.flagged && stage >= 4;
  const showLabel = stage >= 2;
  const color = sat.flagged ? (reviewed ? "#8a8f98" : FLAGGED_COLOR) : "#e8e6df";

  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {sat.flagged && stage === 3 && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.14, 0.006, 8, 32]} />
          <meshBasicMaterial color={FLAGGED_COLOR} transparent opacity={0.8} />
        </mesh>
      )}
      {showLabel && (
        <Html distanceFactor={8} className="pointer-events-none select-none">
          <div
            className={`whitespace-nowrap font-mono text-[9px] uppercase tracking-wide ${
              sat.flagged ? "text-accent-soft" : "text-white/55"
            }`}
          >
            {sat.id}
            {sat.flagged ? (reviewed ? " · reviewed" : " ⚠ flagged") : " ✓"}
          </div>
        </Html>
      )}
    </group>
  );
}

export default function StateSpaceScene({
  stage,
  className = "",
}: {
  stage: number;
  className?: string;
}) {
  return (
    <div className={className} aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        camera={{ position: [3.2, 1.8, 4.2], fov: 42 }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[4, 3, 2]} intensity={0.6} color={SPECTRUM.cyan} />
        <Stars radius={30} depth={20} count={1500} factor={2} saturation={0} fade speed={0.4} />
        <Globe />
        {RINGS.map((r, i) => (
          <OrbitRing key={i} radius={r.radius} incl={r.incl} />
        ))}
        {SATS.map((sat, i) => (
          <Satellite key={sat.id} sat={sat} stage={stage} speed={0.05 + i * 0.004} />
        ))}
      </Canvas>
    </div>
  );
}

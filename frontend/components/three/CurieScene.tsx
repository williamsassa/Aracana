"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import Glow from "./Glow";
import { getProductAccent } from "@/lib/productTheme";
import { SPECTRUM } from "@/lib/theme-colors";

// One continuous 3D scene instead of the old "2D literature graph OR 3D
// molecule" swap (owner: the whole AI Scientist section should be three.js
// throughout). Owner references: a floating holographic molecule projected
// above a table (pin.it/13W0WUw2G) and a glowing atom — bright core + tilted
// orbital rings with flowing particles (pin.it/5OVzif8cv, requested
// explicitly as the motion language to reuse). The atom stands for CURIE's
// active reasoning and is always present; literature references surround it
// early on; the candidate molecule forms below it once a hypothesis exists.
const ACCENT = getProductAccent("ai-scientist"); // blue-cyan blend
const RING_RADIUS = 0.95;
const RING_COLORS = [SPECTRUM.violet, SPECTRUM.blue, SPECTRUM.cyan];
const RING_TILTS: [number, number, number][] = [
  [0.3, 0, 0],
  [0.15, 0.9, Math.PI / 3],
  [0.9, -0.4, -Math.PI / 4],
];

function ellipsePoints(radius: number, segments = 64): [number, number, number][] {
  const pts: [number, number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    pts.push([Math.cos(a) * radius, Math.sin(a) * radius * 0.4, 0]);
  }
  return pts;
}

function OrbitRing({
  tilt,
  color,
  speed,
}: {
  tilt: [number, number, number];
  color: string;
  speed: number;
}) {
  const points = useMemo(() => ellipsePoints(RING_RADIUS), []);
  const count = 5;
  const particlesRef = useRef<THREE.Points>(null);
  const seeds = useMemo(() => Array.from({ length: count }, (_, i) => (i / count) * Math.PI * 2), []);
  const positions = useMemo(() => new Float32Array(count * 3), []);

  useFrame((state) => {
    const geo = particlesRef.current?.geometry;
    if (!geo) return;
    const t = state.clock.elapsedTime;
    seeds.forEach((s, i) => {
      const a = s + t * speed;
      positions[i * 3] = Math.cos(a) * RING_RADIUS;
      positions[i * 3 + 1] = Math.sin(a) * RING_RADIUS * 0.4;
      positions[i * 3 + 2] = 0;
    });
    (geo.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
  });

  return (
    <group rotation={tilt}>
      <Line points={points} color={color} transparent opacity={0.4} lineWidth={1} />
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color={color} size={0.045} transparent opacity={0.95} sizeAttenuation depthWrite={false} />
      </points>
    </group>
  );
}

function AtomCore({ activity }: { activity: number }) {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.15, 20, 20]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <Glow color={SPECTRUM.violet} size={0.38} intensity={0.32 + activity * 0.15} />
      <Glow color={SPECTRUM.cyan} size={0.68} intensity={0.14} />
      {RING_COLORS.map((c, i) => (
        <OrbitRing key={i} tilt={RING_TILTS[i]} color={c} speed={0.1 + i * 0.045} />
      ))}
    </group>
  );
}

const REF_NODES: [number, number, number][] = [
  [-1.65, 0.5, -0.3],
  [-1.85, -0.35, 0.35],
  [1.7, 0.45, 0.4],
  [1.55, -0.55, -0.35],
];

function LiteratureField({ stage }: { stage: number }) {
  const surveying = stage <= 1;
  return (
    <>
      {REF_NODES.map((p, i) => (
        <group key={i}>
          <Line points={[[0, 0, 0], p]} color="#8b93a8" transparent opacity={surveying ? 0.28 : 0.06} lineWidth={1} />
          <mesh position={p}>
            <sphereGeometry args={[0.045, 10, 10]} />
            <meshBasicMaterial color="#c7cad1" transparent opacity={surveying ? 0.85 : 0.2} />
          </mesh>
        </group>
      ))}
    </>
  );
}

// Ball-and-stick candidate molecule — a pentagon ring, atom 1 is the
// "binding site" the showcase's confidence gauges refer to.
const ATOMS: [number, number, number][] = [
  [0, 1.1, 0],
  [1.05, 0.34, 0.3],
  [0.65, -0.9, -0.2],
  [-0.65, -0.9, 0.2],
  [-1.05, 0.34, -0.3],
];
const BONDS: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 0],
];
const ACTIVE_ATOM = 1;

function Molecule({ stage }: { stage: number }) {
  const group = useRef<THREE.Group>(null);
  const forming = stage >= 2; // Hypothesis onward

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.12;
  });

  return (
    <group ref={group} scale={forming ? 1 : 0.6}>
      {BONDS.map(([a, b], i) => (
        <Line key={i} points={[ATOMS[a], ATOMS[b]]} color="#c7cad1" transparent opacity={forming ? 0.5 : 0.15} lineWidth={1.5} />
      ))}
      {ATOMS.map((pos, i) => {
        const active = i === ACTIVE_ATOM;
        return (
          <group key={i} position={pos}>
            <mesh>
              <sphereGeometry args={[active ? 0.13 : 0.09, 16, 16]} />
              <meshBasicMaterial color={active ? ACCENT : "#e8e6df"} transparent opacity={forming ? 1 : 0.35} />
            </mesh>
            {active && forming && <Glow color={ACCENT} size={0.24} intensity={0.4} />}
          </group>
        );
      })}
    </group>
  );
}

function CameraAim({ target }: { target: [number, number, number] }) {
  useFrame((state) => {
    state.camera.lookAt(...target);
  });
  return null;
}

export default function CurieScene({
  stage = 0,
  stageCount = 7,
  className = "",
}: {
  stage?: number;
  stageCount?: number;
  className?: string;
}) {
  const activity = stageCount > 1 ? stage / (stageCount - 1) : 0;
  return (
    <div className={className} aria-hidden>
      <Canvas dpr={[1, 1.5]} gl={{ antialias: false, alpha: true }} camera={{ position: [0, 0.4, 5.3], fov: 42 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[3, 2, 3]} intensity={0.7} color={SPECTRUM.cyan} />
        <pointLight position={[-3, -1, 2]} intensity={0.5} color={SPECTRUM.violet} />
        <AtomCore activity={activity} />
        <LiteratureField stage={stage} />
        <group position={[0, -1.05, 0.5]} scale={0.7}>
          <Molecule stage={stage} />
        </group>
        <CameraAim target={[0, -0.3, 0]} />
      </Canvas>
    </div>
  );
}

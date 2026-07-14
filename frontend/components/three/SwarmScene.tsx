"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import Glow from "./Glow";
import { getProductAccent } from "@/lib/productTheme";
import { SPECTRUM } from "@/lib/theme-colors";

// A dense organic swarm cluster (owner reference: a force-directed graph of
// many varying-size spheres in soft focus, self-sourced from Pinterest after
// the first pass — 4 satellites in a perfect wheel read as a corporate
// org-chart, not a "swarm"). One orchestrator, 4 specialised primary agents,
// each with 6 small satellite nodes clustered around it, plus a handful of
// cross-links between clusters — closer to how a real multi-agent system
// actually looks: a few coordinating hubs, not a rigid star topology.
// Positions are fixed (computed once) and the whole cluster rotates as one
// rigid body, so the precomputed edges always line up — the previous
// version's independent per-node orbits were also why the graph never read
// as a coherent network. Camera keeps the explicit lookAt fix from the last
// pass (the actual reason it used to render blank).
const ORCHESTRATOR_COLOR = getProductAccent("multi-agent-system"); // violet-blue blend
const SATELLITES_PER_PRIMARY = 6;

const PRIMARY = [
  { angle: 0.3, color: SPECTRUM.cyan },
  { angle: Math.PI / 2 + 0.2, color: SPECTRUM.blue },
  { angle: Math.PI - 0.15, color: SPECTRUM.blueCyan },
  { angle: (3 * Math.PI) / 2 - 0.25, color: SPECTRUM.violet },
];
const PRIMARY_RADIUS = 1.35;

type NodeSeed = { pos: [number, number, number]; size: number; color: string };
type EdgeSeed = [THREE.Vector3Tuple, THREE.Vector3Tuple, string, boolean];

function primaryPos(angle: number): [number, number, number] {
  return [Math.cos(angle) * PRIMARY_RADIUS, Math.sin(angle * 1.7) * 0.3, Math.sin(angle) * PRIMARY_RADIUS];
}

function useSwarmGraph() {
  return useMemo(() => {
    const primaries: NodeSeed[] = PRIMARY.map((p) => ({
      pos: primaryPos(p.angle),
      size: 0.1,
      color: p.color,
    }));

    const satellites: NodeSeed[] = [];
    const satelliteEdges: EdgeSeed[] = [];
    PRIMARY.forEach((p, pi) => {
      const [px, py, pz] = primaryPos(p.angle);
      for (let i = 0; i < SATELLITES_PER_PRIMARY; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = 0.32 + Math.random() * 0.45;
        const pos: [number, number, number] = [
          px + Math.cos(a) * r,
          py + (Math.random() - 0.5) * 0.5,
          pz + Math.sin(a) * r,
        ];
        satellites.push({ pos, size: 0.028 + Math.random() * 0.03, color: p.color });
        satelliteEdges.push([[px, py, pz], pos, p.color, false]);
      }
    });

    // A few cross-links between neighbouring clusters — keeps the topology
    // reading as "networked", not four isolated trees.
    const crossEdges: EdgeSeed[] = [0, 1, 2, 3].map((i) => {
      const from = satellites[i * SATELLITES_PER_PRIMARY];
      const to = satellites[((i + 1) % 4) * SATELLITES_PER_PRIMARY + 1];
      return [from.pos, to.pos, "#5b6270", false];
    });

    const hubEdges: EdgeSeed[] = primaries.map((p, i) => [[0, 0, 0], p.pos, PRIMARY[i].color, true]);

    return { primaries, satellites, edges: [...hubEdges, ...satelliteEdges, ...crossEdges] };
  }, []);
}

function Node({ seed, glow, pulseSpeed }: { seed: NodeSeed; glow?: boolean; pulseSpeed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (!meshRef.current || !pulseSpeed) return;
    const s = 1 + Math.sin(state.clock.elapsedTime * pulseSpeed + phase) * 0.12;
    meshRef.current.scale.setScalar(s);
  });

  return (
    <group position={seed.pos}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[seed.size, 12, 12]} />
        <meshBasicMaterial color={seed.color} transparent opacity={0.9} />
      </mesh>
      {glow && <Glow color={seed.color} size={seed.size * 2.6} intensity={0.3} />}
    </group>
  );
}

function Edge({ seed }: { seed: EdgeSeed }) {
  const [from, to, color, bright] = seed;
  const positions = useMemo(() => new Float32Array([...from, ...to]), [from, to]);
  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={2} array={positions} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial color={color} transparent opacity={bright ? 0.55 : 0.22} />
    </lineSegments>
  );
}

function Hub({ stage }: { stage: number }) {
  const validated = stage >= 4;
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.2, 20, 20]} />
        <meshBasicMaterial color={ORCHESTRATOR_COLOR} />
      </mesh>
      <Glow color={ORCHESTRATOR_COLOR} size={validated ? 0.5 : 0.34} intensity={validated ? 0.45 : 0.25} />
    </group>
  );
}

function SwarmCluster({ stage }: { stage: number }) {
  const group = useRef<THREE.Group>(null);
  const { primaries, satellites, edges } = useSwarmGraph();
  const exchanging = stage >= 3 && stage <= 4;

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.045;
  });

  return (
    <group ref={group} rotation={[0.15, 0, 0]}>
      {edges.map((e, i) => (
        <Edge key={i} seed={exchanging && e[3] ? [e[0], e[1], e[2], true] : e} />
      ))}
      <Hub stage={stage} />
      {primaries.map((p, i) => (
        <Node key={`p-${i}`} seed={p} glow pulseSpeed={0.8 + i * 0.1} />
      ))}
      {satellites.map((s, i) => (
        <Node key={`s-${i}`} seed={s} pulseSpeed={1.2 + (i % 5) * 0.15} />
      ))}
    </group>
  );
}

function CameraAim() {
  useFrame((state) => {
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function SwarmScene({
  stage = 0,
  className = "",
}: {
  stage?: number;
  className?: string;
}) {
  return (
    <div className={className} aria-hidden>
      <Canvas dpr={[1, 1.5]} gl={{ antialias: false, alpha: true }} camera={{ position: [0, 0.7, 5], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <SwarmCluster stage={stage} />
        <CameraAim />
      </Canvas>
    </div>
  );
}

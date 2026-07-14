"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Glow from "./Glow";
import { SPECTRUM } from "@/lib/theme-colors";

// A geodesic "neural sphere" (reasoning graph / dynamic node network) with
// two counter-rotating particle rings (attention flow) and a soft dust
// field — replaces the old cloud/grid/ribbon particle morph with a denser
// visualization that reads as an AI model actually thinking, not an
// abstract decoration. Motion is deliberately slow and ambient (owner
// feedback: an earlier, faster pass "moved too much" and was unpleasant to
// look at) — everything still drifts continuously, just at a contemplative,
// premium-product-page pace rather than an energetic one. No camera motion:
// a moving camera on a small inline card reads as seasick, not futuristic.
const ICO_DETAIL = 1; // 42 nodes — legible as a graph, not a smooth blob
const SPHERE_RADIUS = 1.55;
const OUTER_TOKEN_COUNT = 64;
const INNER_TOKEN_COUNT = 28;
const DUST_COUNT = 160;

function gradientColor(t: number): THREE.Color {
  const violet = new THREE.Color(SPECTRUM.violet);
  const blue = new THREE.Color(SPECTRUM.blue);
  const cyan = new THREE.Color(SPECTRUM.cyan);
  return t < 0.5 ? violet.clone().lerp(blue, t * 2) : blue.clone().lerp(cyan, (t - 0.5) * 2);
}

function NeuralSphere({ activity }: { activity: number }) {
  const group = useRef<THREE.Group>(null);
  const wireRef = useRef<THREE.LineSegments>(null);
  const nodesRef = useRef<THREE.Points>(null);

  const { wireGeo, nodeGeo } = useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(SPHERE_RADIUS, ICO_DETAIL);
    const colorFor = (y: number) => gradientColor(THREE.MathUtils.clamp((y + SPHERE_RADIUS) / (SPHERE_RADIUS * 2), 0, 1));

    const wire = new THREE.WireframeGeometry(ico);
    const wirePos = wire.getAttribute("position") as THREE.BufferAttribute;
    const wireColors = new Float32Array(wirePos.count * 3);
    for (let i = 0; i < wirePos.count; i++) {
      const c = colorFor(wirePos.getY(i));
      wireColors[i * 3] = c.r;
      wireColors[i * 3 + 1] = c.g;
      wireColors[i * 3 + 2] = c.b;
    }
    wire.setAttribute("color", new THREE.BufferAttribute(wireColors, 3));

    const srcPos = ico.getAttribute("position") as THREE.BufferAttribute;
    const seen = new Set<string>();
    const nodePositions: number[] = [];
    const nodeColors: number[] = [];
    for (let i = 0; i < srcPos.count; i++) {
      const x = srcPos.getX(i);
      const y = srcPos.getY(i);
      const z = srcPos.getZ(i);
      const key = `${x.toFixed(3)}|${y.toFixed(3)}|${z.toFixed(3)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      nodePositions.push(x, y, z);
      const c = colorFor(y);
      nodeColors.push(c.r, c.g, c.b);
    }
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", new THREE.Float32BufferAttribute(nodePositions, 3));
    nodeGeo.setAttribute("color", new THREE.Float32BufferAttribute(nodeColors, 3));

    return { wireGeo: wire, nodeGeo };
  }, []);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * (0.05 + activity * 0.04);
      group.current.rotation.x = 0.2 + Math.sin(state.clock.elapsedTime * 0.06) * 0.06;
    }
    const pulse = 0.5 + Math.sin(state.clock.elapsedTime * 0.35) * 0.5;
    if (nodesRef.current) {
      const mat = nodesRef.current.material as THREE.PointsMaterial;
      mat.size = 0.055 + pulse * 0.012 + activity * 0.01;
    }
    if (wireRef.current) {
      const mat = wireRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = 0.32 + pulse * 0.1;
    }
  });

  return (
    <group ref={group} rotation={[0.2, 0.4, 0]}>
      <lineSegments ref={wireRef} geometry={wireGeo}>
        <lineBasicMaterial vertexColors transparent opacity={0.4} />
      </lineSegments>
      <points ref={nodesRef} geometry={nodeGeo}>
        <pointsMaterial vertexColors size={0.065} sizeAttenuation transparent opacity={0.95} depthWrite={false} />
      </points>
    </group>
  );
}

// A ring of particles orbiting the sphere — reads as tokens streaming
// through the attention mechanism. Positions are recomputed every frame
// (same technique as HeroScene's ambient field) since each point follows
// its own orbital phase rather than a single rigid-body rotation.
function TokenRing({
  count,
  radius,
  speed,
  tilt,
  size,
  reverse = false,
}: {
  count: number;
  radius: number;
  speed: number;
  tilt: [number, number, number];
  size: number;
  reverse?: boolean;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const dir = reverse ? -1 : 1;

  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        radius: radius + Math.random() * radius * 0.3,
        angle: (i / count) * Math.PI * 2,
        speedMul: 0.75 + Math.random() * 0.5,
        wobble: 0.3 + Math.random() * 0.55,
      })),
    [count, radius]
  );

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    seeds.forEach((s, i) => {
      pos[i * 3] = Math.cos(s.angle) * s.radius;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = Math.sin(s.angle) * s.radius * 0.55;
      const c = gradientColor(i / count);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    });
    return { positions: pos, colors: col };
  }, [seeds, count]);

  useFrame((state) => {
    const geo = pointsRef.current?.geometry;
    if (!geo) return;
    const t = state.clock.elapsedTime;
    seeds.forEach((s, i) => {
      const a = s.angle + dir * t * speed * s.speedMul;
      positions[i * 3] = Math.cos(a) * s.radius;
      positions[i * 3 + 1] = Math.sin(a * 2) * 0.22 * s.wobble;
      positions[i * 3 + 2] = Math.sin(a) * s.radius * 0.55;
    });
    (geo.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
  });

  return (
    <points ref={pointsRef} rotation={tilt}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial vertexColors size={size} transparent opacity={0.85} sizeAttenuation depthWrite={false} />
    </points>
  );
}

// Sparse, slow-drifting dust filling the depth of the canvas — the bokeh/
// star-particle field that gives the composition depth beyond the sphere.
function DustField() {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(DUST_COUNT * 3);
    for (let i = 0; i < DUST_COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 11;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 7;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.015;
    const mat = pointsRef.current?.material as THREE.PointsMaterial | undefined;
    if (mat) mat.opacity = 0.28 + Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={DUST_COUNT} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color={SPECTRUM.blue} size={0.02} transparent opacity={0.3} sizeAttenuation depthWrite={false} />
    </points>
  );
}

export default function GenerativeScene({
  stage = 0,
  stageCount = 9,
  className = "",
}: {
  stage?: number;
  stageCount?: number;
  className?: string;
}) {
  const activity = stageCount > 1 ? stage / (stageCount - 1) : 0;
  return (
    <div className={className} aria-hidden>
      <Canvas dpr={[1, 1.5]} gl={{ antialias: false, alpha: true }} camera={{ position: [0, 0.3, 5.4], fov: 42 }}>
        <ambientLight intensity={0.55} />
        <pointLight position={[3, 2, 3]} intensity={0.8} color={SPECTRUM.cyan} />
        <pointLight position={[-3, -1, 2]} intensity={0.6} color={SPECTRUM.violet} />
        <Glow color="#ffffff" size={0.32} intensity={0.5} />
        <Glow color={SPECTRUM.violet} size={0.85} intensity={0.26} />
        <Glow color={SPECTRUM.cyan} size={1.5} intensity={0.1} />
        <DustField />
        <NeuralSphere activity={activity} />
        <TokenRing count={OUTER_TOKEN_COUNT} radius={2.05} speed={0.08} tilt={[0.55, 0, 0.15]} size={0.045} />
        <TokenRing count={INNER_TOKEN_COUNT} radius={1.15} speed={0.15} tilt={[0.35, 0, -0.2]} size={0.035} reverse />
      </Canvas>
    </div>
  );
}

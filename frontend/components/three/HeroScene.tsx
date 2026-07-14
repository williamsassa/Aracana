"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, type RootState } from "@react-three/fiber";
import { Points, PointMaterial, Line } from "@react-three/drei";
import { useTheme } from "next-themes";
import * as THREE from "three";
import Glow from "./Glow";
import { SPECTRUM } from "@/lib/theme-colors";

// Matches globals.css :root --ink (light theme foreground) — used only here
// because the light/dark text-colour split below needs the raw value, not
// a CSS var (three.js materials can't read those).
const INK_LIGHT = "#0E0F1A";

/**
 * V6 Hero scene — a fractured glowing orb (owner reference: pin.it/2D0KcKZKA,
 * an asteroid of jagged glass/crystal shards lit from within) with the
 * "ARACANA.AI" wordmark sized and centred to sit against it, plus the
 * converging light-line field behind. Two lessons from the previous two
 * broken passes, both fixed here:
 *  1. ExtrudeGeometry+bevel on a hand-drawn concave "A" silhouette produced
 *     garbled geometry — replaced with TubeGeometry swept along
 *     CatmullRomCurve3 per letter-stroke, which has no such failure mode
 *     (verified with a standalone Node+three script before trusting it).
 *  2. That tube word then rendered near-black: metalness 0.75 with no
 *     environment map means the surface is mostly mirror-black except at
 *     specular hits, so the vertex-colour gradient barely showed. Both the
 *     orb and the word now use low/moderate metalness (diffuse-dominant)
 *     so the violet→blue→cyan gradient is guaranteed visible regardless of
 *     lighting, with point lights + Glow halos providing the shine instead
 *     of relying on reflections.
 * The word is not literally bent onto the sphere's curved surface (that
 * needs custom vertex shaders — too fragile after two geometry failures);
 * instead it's flat, scaled to the orb's footprint, and held in front of
 * it, which is the reliable way to read as "sized to the sphere" without
 * the risk of a third broken attempt.
 */

function gradientColor(t: number): THREE.Color {
  const violet = new THREE.Color(SPECTRUM.violet);
  const blue = new THREE.Color(SPECTRUM.blue);
  const cyan = new THREE.Color(SPECTRUM.cyan);
  return t < 0.5 ? violet.clone().lerp(blue, t * 2) : blue.clone().lerp(cyan, (t - 0.5) * 2);
}

// ───────────────────────── Fractured orb ─────────────────────────
// Smaller, near-spherical and more transparent than the previous pass —
// the earlier jitter (12% of radius) plus a coarse detail=3 subdivision
// made the silhouette read as lumpy rather than round, and the orb's sheer
// on-screen size (radius 1.3 with a 1.7x glow) crowded the whole Hero.
const ORB_RADIUS = 0.85;

function buildOrbGeometry() {
  const geo = new THREE.IcosahedronGeometry(ORB_RADIUS, 4);
  const pos = geo.getAttribute("position") as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  const colors = new Float32Array(pos.count * 3);

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const n = v.clone().normalize();
    // Deterministic (position-based, not index-based) noise so vertices
    // shared between adjacent faces displace identically — keeps the shell
    // watertight instead of splitting into visible cracks. Amplitude kept
    // small relative to radius so this reads as fine surface texture, not
    // a distortion of the overall round silhouette.
    const noise =
      Math.sin(v.x * 3.1 + 7) * Math.cos(v.y * 2.7 + 3) * 0.5 +
      Math.sin(v.z * 4.3 + 1) * Math.cos(v.x * 1.9) * 0.3 +
      Math.sin(v.y * 5.1 + v.z * 2.3) * 0.2;
    const displaced = v.clone().addScaledVector(n, noise * 0.022);
    pos.setXYZ(i, displaced.x, displaced.y, displaced.z);

    const t = THREE.MathUtils.clamp((n.y + 1) / 2 + noise * 0.05, 0, 1);
    const c = gradientColor(t);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  pos.needsUpdate = true;
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  return geo;
}

function FracturedOrb() {
  const group = useRef<THREE.Group>(null);
  const geometry = useMemo(() => buildOrbGeometry(), []);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.07;
  });

  return (
    <group ref={group}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          vertexColors
          flatShading
          transparent
          opacity={0.3}
          depthWrite={false}
          metalness={0.1}
          roughness={0.2}
          emissive={SPECTRUM.violet}
          emissiveIntensity={0.16}
        />
      </mesh>
      <Glow color={SPECTRUM.violet} size={ORB_RADIUS * 1.7} intensity={0.24} />
      <Glow color={SPECTRUM.cyan} size={ORB_RADIUS * 1.1} intensity={0.16} />
    </group>
  );
}

// ───────────────────────── "ARACANA.AI" wordmark ─────────────────────────
// Monoline stroke paths per glyph, normalised to a common baseline
// (y: -0.75..0.75). Only the glyphs the word actually needs. The period is
// a small sphere, not a stroke.
const LETTER_STROKES: Record<string, [number, number, number][][]> = {
  A: [
    [[-0.55, -0.75, 0], [-0.28, 0.15, 0], [0, 0.75, 0], [0.28, 0.15, 0], [0.55, -0.75, 0]],
    [[-0.32, -0.15, 0.06], [0, -0.02, 0.08], [0.32, -0.15, 0.06]],
  ],
  R: [
    [[-0.45, -0.75, 0], [-0.45, 0.75, 0]],
    [[-0.45, 0.75, 0], [0.35, 0.7, 0], [0.45, 0.35, 0], [0.35, 0.02, 0], [-0.45, -0.02, 0]],
    [[-0.15, -0.05, 0], [0.15, -0.4, 0], [0.5, -0.75, 0]],
  ],
  C: [
    [[0.275, 0.624, 0], [-0.275, 0.624, 0], [-0.55, 0, 0], [-0.275, -0.624, 0], [0.275, -0.624, 0]],
  ],
  N: [
    [[-0.5, -0.75, 0], [-0.5, 0.75, 0]],
    [[-0.5, 0.75, 0], [0.5, -0.75, 0]],
    [[0.5, -0.75, 0], [0.5, 0.75, 0]],
  ],
  I: [[[0, -0.75, 0], [0, 0.75, 0]]],
};

const CHAR_WIDTH: Record<string, number> = { A: 1.1, R: 1.0, C: 1.1, N: 1.1, I: 0.28, ".": 0.3 };
const GAP = 0.26;
const WORD_CHARS = "ARACANA.AI".split("");

function layoutWord() {
  let cursor = 0;
  const offsets: number[] = [];
  WORD_CHARS.forEach((ch) => {
    const w = CHAR_WIDTH[ch];
    offsets.push(cursor + w / 2);
    cursor += w + GAP;
  });
  const totalWidth = cursor - GAP;
  return { offsets: offsets.map((o) => o - totalWidth / 2), totalWidth };
}
const { offsets: WORD_OFFSETS, totalWidth: WORD_WIDTH } = layoutWord();
const WORD_HALF_SPAN = WORD_WIDTH / 2;
const STROKE_RADIUS = 0.13;

// The word used the same violet→blue→cyan hues as the glass orb behind it,
// so where they overlapped the two blended into each other — low luminance
// contrast, not just a colour clash. The actual mistake in the previous fix
// was lifting the text toward white unconditionally: that fixed dark mode
// (white pops on a dark page) and silently broke light mode (white text on
// a light page, through a pale glass orb, is close to invisible — visible
// by directly comparing the two theme screenshots side by side). A single
// fixed colour cannot have good contrast against both a near-black and a
// near-white backdrop, so this now branches on the live theme instead of
// picking one compromise colour.
function textColor(t: number, isDark: boolean): THREE.Color {
  const base = gradientColor(t);
  return isDark ? base.lerp(new THREE.Color("#ffffff"), 0.62) : base.lerp(new THREE.Color(INK_LIGHT), 0.7);
}

function strokeGeometry(points: [number, number, number][], xOffset: number, isDark: boolean) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(p[0], p[1], p[2])));
  const geo = new THREE.TubeGeometry(curve, Math.max(16, points.length * 10), STROKE_RADIUS, 8, false);
  const pos = geo.getAttribute("position") as THREE.BufferAttribute;
  const colors = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const worldX = pos.getX(i) + xOffset;
    const t = THREE.MathUtils.clamp((worldX + WORD_HALF_SPAN) / WORD_WIDTH, 0, 1);
    const c = textColor(t, isDark);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geo;
}

function Letter({ char, xOffset, isDark }: { char: string; xOffset: number; isDark: boolean }) {
  const geometries = useMemo(
    () => LETTER_STROKES[char].map((pts) => strokeGeometry(pts, xOffset, isDark)),
    [char, xOffset, isDark]
  );
  return (
    <group position={[xOffset, 0, 0]}>
      {geometries.map((geo, i) => (
        <mesh key={i} geometry={geo}>
          <meshStandardMaterial
            vertexColors
            metalness={0.25}
            roughness={0.25}
            emissive={isDark ? "#ffffff" : "#000000"}
            emissiveIntensity={isDark ? 0.12 : 0}
          />
        </mesh>
      ))}
    </group>
  );
}

function Period({ xOffset, isDark }: { xOffset: number; isDark: boolean }) {
  const color = useMemo(
    () => textColor(THREE.MathUtils.clamp((xOffset + WORD_HALF_SPAN) / WORD_WIDTH, 0, 1), isDark),
    [xOffset, isDark]
  );
  return (
    <mesh position={[xOffset, -0.62, 0]}>
      <sphereGeometry args={[STROKE_RADIUS, 12, 12]} />
      <meshStandardMaterial
        color={color}
        metalness={0.25}
        roughness={0.25}
        emissive={isDark ? "#ffffff" : "#000000"}
        emissiveIntensity={isDark ? 0.12 : 0}
      />
    </mesh>
  );
}

// Sized to the orb's footprint (word width ≈ orb diameter) and held in
// front of it — a gentle sway keeps it legible instead of a full spin,
// which would turn a wide word edge-on and unreadable for most of the loop.
// Colour reacts to the live theme (see textColor above) since this is the
// only client component in the tree that ever needs it — the rest of the
// Hero (orb, lines, particles) reads fine on either background unchanged.
function HoloWordmark() {
  const group = useRef<THREE.Group>(null);
  const { theme } = useTheme();
  const isDark = theme !== "light";
  const scale = (ORB_RADIUS * 2 * 0.86) / WORD_WIDTH;

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = Math.sin(t * 0.15) * 0.14;
  });

  return (
    <group ref={group} position={[0, 0, ORB_RADIUS * 1.08]} scale={scale}>
      {WORD_CHARS.map((ch, i) =>
        ch === "." ? (
          <Period key={i} xOffset={WORD_OFFSETS[i]} isDark={isDark} />
        ) : (
          <Letter key={i} char={ch} xOffset={WORD_OFFSETS[i]} isDark={isDark} />
        )
      )}
    </group>
  );
}

function PlatformRing({ radius, color }: { radius: number; color: string }) {
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      pts.push([Math.cos(a) * radius, 0, Math.sin(a) * radius]);
    }
    return pts;
  }, [radius]);
  return <Line points={points} color={color} transparent opacity={0.4} lineWidth={1} />;
}

/** Sparse ambient particle field behind the orb — depth, not the focal
 * point (kept low-density/low-opacity so the orb stays the one WOW). */
function AmbientField({ count = 260 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 4.5 * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      arr[i * 3 + 2] = r * Math.cos(phi) - 1.5;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.015;
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color={SPECTRUM.blue}
        size={0.014}
        sizeAttenuation
        depthWrite={false}
        opacity={0.35}
      />
    </Points>
  );
}

// Lines converging from a distant vanishing point behind the orb out to a
// wide cone near the viewer, with a small bright pulse travelling each
// line on a loop.
const LINE_COUNT = 10;
const LINE_COLORS = [SPECTRUM.violet, SPECTRUM.blue, SPECTRUM.cyan];
const VANISH_Z = -4;
const VIEWER_Z = 2.5;
const NEAR_RADIUS = 0.15;
const FAR_RADIUS = 7;

function ConvergingLines() {
  const pointsRef = useRef<THREE.Points>(null);

  const lines = useMemo(
    () =>
      Array.from({ length: LINE_COUNT }, (_, i) => {
        const a = (i / LINE_COUNT) * Math.PI * 2 + (i % 2) * 0.15;
        return {
          color: LINE_COLORS[i % LINE_COLORS.length],
          start: [Math.cos(a) * NEAR_RADIUS, Math.sin(a) * NEAR_RADIUS * 0.6, VANISH_Z] as [number, number, number],
          end: [Math.cos(a) * FAR_RADIUS, Math.sin(a) * FAR_RADIUS * 0.6, VIEWER_Z] as [number, number, number],
          phase: (i / LINE_COUNT) * Math.PI * 2,
          speed: 0.16 + (i % 3) * 0.03,
        };
      }),
    []
  );

  const positions = useMemo(() => new Float32Array(lines.length * 3), [lines]);
  const pulseColors = useMemo(() => {
    const arr = new Float32Array(lines.length * 3);
    lines.forEach((l, i) => {
      const c = new THREE.Color(l.color);
      arr[i * 3] = c.r;
      arr[i * 3 + 1] = c.g;
      arr[i * 3 + 2] = c.b;
    });
    return arr;
  }, [lines]);

  useFrame((state) => {
    const geo = pointsRef.current?.geometry;
    if (!geo) return;
    const t = state.clock.elapsedTime;
    lines.forEach((l, i) => {
      const p = (t * l.speed + l.phase / (Math.PI * 2)) % 1;
      positions[i * 3] = l.start[0] + (l.end[0] - l.start[0]) * p;
      positions[i * 3 + 1] = l.start[1] + (l.end[1] - l.start[1]) * p;
      positions[i * 3 + 2] = l.start[2] + (l.end[2] - l.start[2]) * p;
    });
    (geo.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
  });

  return (
    <group>
      {lines.map((l, i) => (
        <Line key={i} points={[l.start, l.end]} color={l.color} transparent opacity={0.1} lineWidth={1} />
      ))}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={lines.length} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={lines.length} array={pulseColors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial vertexColors size={0.08} transparent opacity={0.85} sizeAttenuation depthWrite={false} />
      </points>
    </group>
  );
}

/** Gentle parallax toward the pointer only — decorative, not "playable". */
function PointerRig() {
  useFrame((state: RootState) => {
    state.camera.position.x +=
      (state.mouse.x * 0.35 - state.camera.position.x) * 0.02;
    state.camera.position.y +=
      (0.2 + state.mouse.y * 0.2 - state.camera.position.y) * 0.02;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function HeroScene({ className = "" }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        camera={{ position: [0, 0.2, 5.8], fov: 45 }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[3, 3, 3]} intensity={1} color={SPECTRUM.cyan} />
        <pointLight position={[-3, -2, 2]} intensity={0.6} color={SPECTRUM.violet} />
        <pointLight position={[0, 1, 4]} intensity={0.5} color="#ffffff" />
        <ConvergingLines />
        <AmbientField />
        <FracturedOrb />
        <HoloWordmark />
        <group position={[0, -1.2, 0]}>
          <PlatformRing radius={1.25} color={SPECTRUM.violet} />
          <PlatformRing radius={1.0} color={SPECTRUM.blue} />
          <PlatformRing radius={0.72} color={SPECTRUM.cyan} />
        </group>
        <PointerRig />
      </Canvas>
    </div>
  );
}

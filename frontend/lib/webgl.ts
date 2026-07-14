/** Best-effort feature detection so 3D scenes can fall back to their 2D
 * equivalent rather than crash or run unusably slowly. Client-only. */

export function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

/** Coarse low-end signal: few logical cores or a browser-reported
 * low-memory device. Conservative — false negatives are fine (they just get
 * the 3D scene), false positives on capable hardware are the thing to avoid,
 * so the threshold is deliberately low. */
export function isLowEndDevice(): boolean {
  const cores = navigator.hardwareConcurrency ?? 8;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  return cores <= 2 || memory <= 2;
}

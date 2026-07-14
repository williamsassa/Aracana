/** Single source of truth for the brand spectrum, mirrored from the
 * `spectrum.*` tokens in tailwind.config.ts. Fixed hex (single dark theme,
 * no light/dark switch) so Three.js/GSAP — which can't read Tailwind/CSS
 * vars — stay in sync with the CSS palette without a second place to edit
 * colours.
 * V3 (README_ARACANA_BRAND.md): strict 3-colour brand palette — violet
 * (primary), blue (secondary), cyan (highlight) — plus two derived blends
 * so the 5 products keep distinct identities without inventing hues outside
 * the spec. */
export const SPECTRUM = {
  violet: "#7B5CFF",
  blue: "#4D9DFF",
  cyan: "#3EE8FF",
  violetBlue: "#6272FF",
  blueCyan: "#45C0FF",
} as const;

export const SPECTRUM_ORDER: (keyof typeof SPECTRUM)[] = [
  "violet",
  "blue",
  "cyan",
  "violetBlue",
  "blueCyan",
];

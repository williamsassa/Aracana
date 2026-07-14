import { SPECTRUM } from "./theme-colors";

/** Per-product accent colour, drawn from the fixed brand spectrum — gives
 * each product a distinct identity while staying inside the same palette.
 * Used by ProductGlyph, the OurModels codenames and SolutionGlyph (for the
 * solution ids that map onto a product) to keep Products↔Solutions visually
 * coherent without inventing a second colour system. */
export const PRODUCT_ACCENT: Record<string, string> = {
  "generative-model": SPECTRUM.violet,
  "coding-agent-model": SPECTRUM.blue,
  "state-space-sovereignty-model": SPECTRUM.cyan,
  "multi-agent-system": SPECTRUM.violetBlue,
  "ai-scientist": SPECTRUM.blueCyan,
};

export function getProductAccent(slug: string): string {
  return PRODUCT_ACCENT[slug] ?? SPECTRUM.violet;
}

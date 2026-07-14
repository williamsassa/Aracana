/**
 * ARACANA brand mark — a faceted "A" monogram (owner references:
 * pin.it/2P2RIDo2X for the cut-crystal drama, pin.it/5OVzif8cv for the
 * clean low-facet structure that actually survives at 32px). Replaces the
 * earlier "energy sphere with orbital bands" motif, judged too soft — a
 * bold, unmistakable letterform reads with far more weight at header size.
 * 8 flat triangular facets tile the "A" silhouette (apex, two legs, the
 * triangular negative-space "hole", and the crossbar band beneath it),
 * each a fixed tone lifted from the brand gradient so the shape reads as
 * cut glass catching light rather than a flat icon — brightest facets at
 * the top (the "light hit"), deepening toward the outer edges.
 */
export default function Mark({
  size = 30,
  className = "",
  spin = false,
}: {
  size?: number;
  className?: string;
  spin?: boolean;
}) {
  const glow = "aracana-mark-glow";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden
    >
      <defs>
        <radialGradient id={glow} cx="50%" cy="36%" r="70%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="35%" stopColor="#7B5CFF" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#7B5CFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* soft core glow behind the glyph */}
      <circle cx="32" cy="34" r="30" fill={`url(#${glow})`} />

      {/* faceted "A" — 8 flat triangles, thin dark seams between them for
          the cut-edge look */}
      <g
        className={spin ? "animate-spin-slow" : ""}
        style={{ transformOrigin: "32px 32px" }}
        stroke="#050816"
        strokeWidth="0.6"
        strokeLinejoin="round"
      >
        <polygon points="32,6 18,33 32,25" fill="#F2EEFF" />
        <polygon points="32,6 32,25 46,33" fill="#EAFBFF" />

        <polygon points="18,33 7,58 20,58" fill="#7B5CFF" />
        <polygon points="18,33 20,58 24,45" fill="#5A3CD6" />
        <polygon points="18,33 24,45 32,25" fill="#6B6BFF" />

        <polygon points="46,33 32,25 40,45" fill="#4D9DFF" />
        <polygon points="46,33 40,45 44,58" fill="#3B7FE0" />
        <polygon points="46,33 44,58 57,58" fill="#3EE8FF" />
      </g>
    </svg>
  );
}

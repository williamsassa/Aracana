/**
 * ARACANA brand mark — monochrome, orbital motif (replaces the rainbow orb).
 * A solid core encircled by two tilted orbital rings + a single red node.
 * Premium, geeky, and tonally consistent with the black / beige system.
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
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden
    >
      <circle cx="32" cy="32" r="30" className="fill-ink" />
      <g
        className={spin ? "animate-spin-slow" : ""}
        style={{ transformOrigin: "32px 32px" }}
      >
        <ellipse
          cx="32"
          cy="32"
          rx="26"
          ry="11"
          transform="rotate(-28 32 32)"
          className="stroke-paper-raised"
          strokeWidth="1.4"
          opacity="0.85"
        />
        <ellipse
          cx="32"
          cy="32"
          rx="26"
          ry="11"
          transform="rotate(28 32 32)"
          className="stroke-paper-raised"
          strokeWidth="1.4"
          opacity="0.5"
        />
      </g>
      <circle cx="32" cy="32" r="5.5" className="fill-paper-raised" />
      <circle cx="55" cy="22" r="3.2" className="fill-accent" />
    </svg>
  );
}

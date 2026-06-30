import Link from "next/link";

export function StatusBadge({
  status,
}: {
  status: "soon" | "development" | "available" | "research";
}) {
  if (status === "soon")
    return <span className="badge-soon">● Soon</span>;
  if (status === "development" || status === "research")
    return <span className="badge-dev">In development</span>;
  return <span className="badge-dev">Available</span>;
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="eyebrow">{children}</div>;
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="display-2 mt-3">{title}</h2>
      {intro && <p className="lead mt-5">{intro}</p>}
    </div>
  );
}

export function ArrowLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-wide2 text-ink transition-colors hover:text-accent"
    >
      {children}
      <span className="transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}

/** Decorative monochrome orbital halo (echoes the brand mark). CSS/SVG-only. */
export function Orb({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden>
      <div className="relative h-full w-full animate-drift">
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <g style={{ transformOrigin: "100px 100px" }} className="animate-spin-slow">
            <ellipse
              cx="100"
              cy="100"
              rx="92"
              ry="38"
              transform="rotate(-28 100 100)"
              fill="none"
              stroke="rgba(10,10,11,0.28)"
              strokeWidth="1"
            />
          </g>
          <g style={{ transformOrigin: "100px 100px" }} className="animate-spin-rev">
            <ellipse
              cx="100"
              cy="100"
              rx="92"
              ry="38"
              transform="rotate(28 100 100)"
              fill="none"
              stroke="rgba(10,10,11,0.18)"
              strokeWidth="1"
            />
          </g>
          <circle cx="100" cy="100" r="14" fill="rgba(10,10,11,0.85)" />
          <circle cx="166" cy="62" r="4.5" fill="#E5121A" className="animate-twinkle" />
        </svg>
      </div>
    </div>
  );
}

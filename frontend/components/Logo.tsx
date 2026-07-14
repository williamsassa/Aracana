import { Link } from "@/i18n/navigation";
import Mark from "./Mark";

/**
 * ARACANA brand lockup — V2.1 real identity pass: uppercase, bold
 * (.logo-word is now font-weight 800 + text-transform: uppercase, see
 * globals.css), "ARACANA" in solid ink + ".AI" in the brand spectrum
 * gradient. Dropped the earlier lowercase "embedded ai" pun (tinting a
 * single middle letter) — in uppercase the ".AI" suffix alone already
 * reads clearly as "AI" without it, and a bold identity wants one clean
 * gradient accent, not a scattered one. Red remains retired everywhere
 * (see globals.css); the gradient reuses --spectrum-gradient. Set with
 * --font-signature (Chakra Petch), scoped to the wordmark only — section
 * titles keep --font-display.
 *
 * `mini`: the 8-stop gradient over ".AI" (3 glyphs) reads as a blur at
 * header/footer sizes — `mini` swaps in a tighter 2-stop sweep instead.
 * Large placements (Hero) use the full sweep via `mini={false}`.
 */
export function Wordmark({
  size = "text-2xl",
  className = "",
  mini = true,
}: {
  size?: string;
  className?: string;
  mini?: boolean;
}) {
  const aiClass = mini ? "logo-ai logo-ai--mini" : "logo-ai";
  return (
    <span className={`logo-word ${size} ${className}`} aria-label="ARACANA AI">
      <span className="text-ink">ARACANA</span>
      <span className={aiClass}>.AI</span>
    </span>
  );
}

/**
 * Hero treatment: the giant brand moment — name only (no ".ai" suffix,
 * already established by the smaller lockup elsewhere on the page), the
 * leading letter picked out in the brand gradient as a signature accent.
 */
export function HeroWordmark() {
  return (
    <h1
      className="logo-word tracking-tightest text-ink inline-flex items-start"
      style={{ fontSize: "clamp(3rem, 11vw, 9rem)", lineHeight: 0.9 }}
      aria-label="ARACANA"
    >
      <span className="logo-ai">A</span>
      <span className="text-ink">RACANA</span>
    </h1>
  );
}

export default function Logo({ withIcon = true }: { withIcon?: boolean }) {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2.5"
      aria-label="ARACANA AI — home"
    >
      {withIcon && (
        <Mark
          size={40}
          className="transition-transform duration-500 group-hover:rotate-[18deg]"
        />
      )}
      <Wordmark size="text-[32px]" />
    </Link>
  );
}

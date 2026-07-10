import { Link } from "@/i18n/navigation";
import Mark from "./Mark";

/**
 * ARACANA wordmark.
 * The brand is styled so the eye catches "AI" inside the name: the central
 * letters are tinted with the accent red to read as an embedded "AI",
 * echoing the "aracana.ai" lockup (Sakana-inspired reference).
 *
 * variant:
 *  - "lockup": icon + "aracana" + red ".ai"  (header / footer)
 *  - "wordmark": large ARACANA with embedded red "AI" (hero)
 */
export function Wordmark({
  size = "text-2xl",
  className = "",
}: {
  size?: string;
  className?: string;
}) {
  return (
    <span className={`logo-word ${size} ${className}`} aria-label="ARACANA AI">
      <span className="text-ink">arac</span>
      <span className="logo-ai">a</span>
      <span className="text-ink">na</span>
      <span className="logo-ai">.ai</span>
    </span>
  );
}

/**
 * Hero treatment: the name stays spelled "ARACANA", with the leading "A" picked
 * out in accent red — purely a visual device, the spelling is untouched.
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
          size={30}
          className="transition-transform duration-500 group-hover:rotate-[18deg]"
        />
      )}
      <Wordmark size="text-[22px]" />
    </Link>
  );
}

/** Horizontal label + weight% + description bar — replaces the 3-column
 * reward table in MethodologySection, reused as-is by the Research
 * "Mathematical Model" visualisation and the CURIE showcase confidence gauge. */
export default function WeightBar({
  label,
  weight,
  desc,
  variant = "dark",
}: {
  label: string;
  weight: string;
  desc: string;
  variant?: "dark" | "light";
}) {
  const pct = Math.round(parseFloat(weight.replace(",", ".")) * 100);
  const dark = variant === "dark";

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <span className={`text-sm ${dark ? "text-paper-fixed" : "text-ink"}`}>
          {label}
        </span>
        <span className="font-mono text-xs text-accent">{pct}%</span>
      </div>
      <div
        className={`mt-1.5 h-1.5 w-full overflow-hidden rounded-full ${
          dark ? "bg-white/10" : "bg-paper-line"
        }`}
      >
        <div
          className="h-full rounded-full bg-spectrum-gradient"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p
        className={`mt-1.5 text-[12.5px] leading-snug ${
          dark ? "text-paper-fixed/55" : "text-ink-muted"
        }`}
      >
        {desc}
      </p>
    </div>
  );
}

import type { ReactNode } from "react";

/** Shared "console window" chrome around a product showcase, echoing the
 * device frame used in OurModels.tsx so every product showcase reads as
 * part of the same family while keeping its own internal content. */
export default function ShowcaseFrame({
  label,
  stages,
  stage,
  children,
}: {
  label: string;
  stages: string[];
  stage: number;
  children: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#06070b] shadow-[0_40px_120px_-50px_rgba(0,0,0,0.7)]">
      <div className="flex h-9 items-center gap-1.5 border-b border-white/8 bg-white/[0.03] px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent/60" />
        <span className="ml-3 font-mono text-[10px] uppercase tracking-wide2 text-white/30">
          aracana · {label}
        </span>
      </div>

      <div className="min-h-[280px] p-5 md:p-7">{children}</div>

      <div className="flex items-center gap-3 border-t border-white/8 bg-white/[0.02] px-5 py-3">
        <span className="font-mono text-[11px] text-accent-soft">
          {String(stage + 1).padStart(2, "0")}/0{stages.length}
        </span>
        <span className="font-mono text-[12px] text-white/70">
          {stages[stage]}
        </span>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { StatusBadge } from "./Bits";
import { getProducts } from "@/lib/products";
import type { Locale } from "@/i18n/config";

/**
 * "Our Models" — Palantir-software-style showcase.
 * Left: short description + index. Centre: a sticky device preview that
 * swaps to the model currently in view. Right: the model's giant codename.
 */
export default function OurModels({ locale }: { locale: Locale }) {
  const t = useTranslations("common");
  const home = useTranslations("home");
  const PRODUCTS = getProducts(locale);
  const [active, setActive] = useState(0);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = Number((e.target as HTMLElement).dataset.index);
            setActive(i);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    rowRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="border-t border-paper-line bg-paper">
      <div className="container-x pt-20 md:pt-28">
        <div className="eyebrow">{home("ourModelsEyebrow")}</div>
        <h2 className="display-2 mt-3 max-w-3xl">{home("ourModelsTitle")}</h2>
      </div>

      {/* Desktop: sticky centre preview + scrolling rows */}
      <div className="container-x relative mt-10 hidden lg:block">
        <div className="grid grid-cols-[0.82fr_1.05fr_1.13fr]">
          {/* Left column — descriptions */}
          <div>
            {PRODUCTS.map((p, i) => (
              <div
                key={p.slug}
                ref={(el) => {
                  rowRefs.current[i] = el;
                }}
                data-index={i}
                className="flex min-h-[88vh] flex-col justify-center pr-8"
              >
                <div
                  className={`transition-opacity duration-500 ${
                    active === i ? "opacity-100" : "opacity-35"
                  }`}
                >
                  <p className="max-w-xs font-display text-2xl leading-snug text-ink">
                    {p.tagline}
                  </p>
                  <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
                    {p.summary}
                  </p>
                  <div className="mt-6 flex items-center gap-4">
                    <span className="font-mono text-sm text-ink-faint">
                      /0.{i + 1}
                    </span>
                    <StatusBadge status={p.status} />
                  </div>
                  <Link
                    href={`/products/${p.slug}`}
                    className="mt-6 inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-wide2 text-ink hover:text-accent"
                  >
                    {t("explore", { name: p.name })} <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Centre column — sticky preview */}
          <div>
            <div className="sticky top-[16vh] flex h-[68vh] items-center justify-center px-6">
              <DeviceFrame>
                {PRODUCTS.map((p, i) => (
                  <div
                    key={p.slug}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      active === i ? "opacity-100" : "pointer-events-none opacity-0"
                    }`}
                  >
                    <Preview slug={p.slug} live={active === i} />
                  </div>
                ))}
              </DeviceFrame>
            </div>
          </div>

          {/* Right column — giant codenames */}
          <div>
            {PRODUCTS.map((p, i) => (
              <div
                key={p.slug}
                className="flex min-h-[88vh] flex-col justify-center"
              >
                <div
                  className={`transition-all duration-500 ${
                    active === i
                      ? "translate-y-0 opacity-100"
                      : "translate-y-2 opacity-25"
                  }`}
                >
                  <div
                    className="logo-word leading-[0.9] tracking-tightest text-ink"
                    style={{ fontSize: "clamp(3rem,7vw,6.5rem)" }}
                  >
                    {p.codename}
                  </div>
                  <div className="mt-3 font-mono text-[12px] uppercase tracking-wide2 text-ink-muted">
                    {p.name} · {p.modality}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: stacked cards */}
      <div className="container-x mt-10 space-y-5 lg:hidden">
        {PRODUCTS.map((p, i) => (
          <Link
            key={p.slug}
            href={`/products/${p.slug}`}
            className="block rounded-2xl border border-paper-line bg-paper-raised p-6"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-ink-faint">
                /0.{i + 1}
              </span>
              <StatusBadge status={p.status} />
            </div>
            <div
              className="logo-word mt-5 leading-[0.9] tracking-tightest text-ink"
              style={{ fontSize: "clamp(2.4rem,13vw,4rem)" }}
            >
              {p.codename}
            </div>
            <div className="mt-2 font-mono text-[11px] uppercase tracking-wide2 text-ink-muted">
              {p.name} · {p.modality}
            </div>
            <div className="mt-5 h-44 overflow-hidden rounded-xl">
              <DeviceFrame mobile>
                <Preview slug={p.slug} live />
              </DeviceFrame>
            </div>
            <p className="mt-4 text-sm text-ink-muted">{p.tagline}</p>
          </Link>
        ))}
      </div>

      <div className="container-x pb-20 pt-12 md:pb-28">
        <Link href="/products" className="btn-dark">
          {home("allModels")}
        </Link>
      </div>
    </section>
  );
}

/* ── A browser/app window frame around a preview ── */
function DeviceFrame({
  children,
  mobile = false,
}: {
  children: React.ReactNode;
  mobile?: boolean;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#06070b] shadow-[0_40px_120px_-50px_rgba(0,0,0,0.7)] ${
        mobile ? "h-full" : "aspect-[16/10]"
      }`}
    >
      {/* title bar */}
      <div className="flex h-8 items-center gap-1.5 border-b border-white/8 bg-white/[0.03] px-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent/60" />
        <span className="ml-3 font-mono text-[10px] uppercase tracking-wide2 text-white/30">
          aracana · console
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 top-8">{children}</div>
    </div>
  );
}

/* ── Per-model stylised preview (no real screenshots needed) ── */
function Preview({ slug, live }: { slug: string; live: boolean }) {
  if (slug === "generative-model") return <PreviewGenerative live={live} />;
  if (slug === "coding-agent-model") return <PreviewCoding live={live} />;
  if (slug === "state-space-sovereignty-model")
    return <PreviewState live={live} />;
  if (slug === "multi-agent-system") return <PreviewAgents live={live} />;
  return <PreviewScientist live={live} />;
}

function PreviewGenerative({ live }: { live: boolean }) {
  return (
    <div className="flex h-full gap-3 p-4">
      <div className="flex w-1/2 flex-col gap-2">
        <div className="font-mono text-[9px] uppercase tracking-wide2 text-white/30">
          prompt
        </div>
        {[88, 70, 94, 60].map((w, i) => (
          <div
            key={i}
            className="h-2 rounded bg-white/15"
            style={{
              width: `${w}%`,
              animation: live ? `fade-in .6s ${i * 0.12}s both` : "none",
            }}
          />
        ))}
        <div className="mt-2 font-mono text-[9px] uppercase tracking-wide2 text-accent-soft">
          generating ▍
        </div>
      </div>
      <div className="grid w-1/2 grid-cols-2 gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded bg-gradient-to-br from-white/15 to-white/[0.03]"
            style={{
              animation: live ? `fade-up .6s ${0.2 + i * 0.1}s both` : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function PreviewCoding({ live }: { live: boolean }) {
  const lines = [
    ["+", "def solve(graph):", "ok"],
    ["+", "  return bfs(graph)", "ok"],
    ["-", "  return None", "del"],
    ["", "tests: 42 passed", "pass"],
    ["", "build: green", "pass"],
  ];
  return (
    <div className="h-full p-4 font-mono text-[10px] leading-relaxed">
      <div className="mb-2 uppercase tracking-wide2 text-white/30">
        coding-agent · run
      </div>
      {lines.map((l, i) => (
        <div
          key={i}
          className={`flex gap-2 ${
            l[2] === "del"
              ? "text-accent-soft"
              : l[2] === "pass"
              ? "text-white/70"
              : "text-white/55"
          }`}
          style={{ animation: live ? `fade-in .4s ${i * 0.12}s both` : "none" }}
        >
          <span className="w-3 text-white/30">{l[0]}</span>
          <span>{l[1]}</span>
        </div>
      ))}
      <div className="mt-3 inline-block rounded bg-accent/15 px-2 py-1 text-accent-soft">
        ✓ patch verified
      </div>
    </div>
  );
}

function PreviewState({ live }: { live: boolean }) {
  return (
    <div className="relative h-full">
      <div className="stars opacity-60" />
      <svg viewBox="0 0 320 220" className="relative h-full w-full">
        {[90, 64, 38].map((r) => (
          <circle
            key={r}
            cx="160"
            cy="110"
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
          />
        ))}
        {live && (
          <g className="animate-sweep" style={{ transformOrigin: "160px 110px" }}>
            <line x1="160" y1="110" x2="160" y2="22" stroke="rgba(229,18,26,0.7)" />
          </g>
        )}
        <rect x="100" y="70" width="6" height="6" fill="#fff" />
        <rect x="210" y="130" width="6" height="6" fill="#fff" />
        <rect x="140" y="150" width="6" height="6" fill="#fff" />
        <polygon points="225,86 219,96 231,96" fill="#E5121A" />
        {live && (
          <circle
            cx="225"
            cy="92"
            r="12"
            fill="none"
            stroke="#E5121A"
            strokeDasharray="5 4"
            className="animate-lock"
            style={{ transformOrigin: "225px 92px" }}
          />
        )}
      </svg>
      <div className="absolute bottom-3 left-4 font-mono text-[9px] uppercase tracking-wide2 text-white/40">
        orbital picture · live
      </div>
    </div>
  );
}

function PreviewAgents({ live }: { live: boolean }) {
  const nodes = [
    [160, 45],
    [70, 120],
    [250, 120],
    [110, 180],
    [210, 180],
  ];
  return (
    <svg viewBox="0 0 320 220" className="h-full w-full">
      {nodes.slice(1).map((n, i) => (
        <line
          key={i}
          x1="160"
          y1="45"
          x2={n[0]}
          y2={n[1]}
          stroke="rgba(255,255,255,0.18)"
          strokeDasharray="4 4"
          style={{ animation: live ? "dash 1s linear infinite" : "none" }}
        />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle
            cx={n[0]}
            cy={n[1]}
            r={i === 0 ? 14 : 9}
            fill={i === 0 ? "#E5121A" : "rgba(255,255,255,0.85)"}
            style={{
              animation: live ? `fade-up .5s ${i * 0.1}s both` : "none",
            }}
          />
        </g>
      ))}
      <text
        x="16"
        y="208"
        fill="rgba(255,255,255,0.4)"
        fontSize="9"
        fontFamily="monospace"
      >
        orchestrator + 4 agents
      </text>
    </svg>
  );
}

function PreviewScientist({ live }: { live: boolean }) {
  const atoms = [
    [120, 90],
    [170, 70],
    [200, 110],
    [160, 140],
    [110, 140],
  ];
  return (
    <div className="relative h-full p-4">
      <svg viewBox="0 0 320 200" className="h-full w-full">
        {atoms.map((a, i) => {
          const b = atoms[(i + 1) % atoms.length];
          return (
            <line
              key={i}
              x1={a[0]}
              y1={a[1]}
              x2={b[0]}
              y2={b[1]}
              stroke="rgba(255,255,255,0.25)"
            />
          );
        })}
        {atoms.map((a, i) => (
          <circle
            key={i}
            cx={a[0]}
            cy={a[1]}
            r="7"
            fill={i === 1 ? "#E5121A" : "rgba(255,255,255,0.9)"}
            style={{ animation: live ? `fade-up .5s ${i * 0.1}s both` : "none" }}
          />
        ))}
        <g stroke="rgba(255,255,255,0.12)">
          <line x1="20" y1="180" x2="300" y2="180" />
        </g>
        <polyline
          points="20,170 70,150 120,158 170,120 220,128 270,90"
          fill="none"
          stroke="#E5121A"
          strokeWidth="1.5"
          style={{
            strokeDasharray: 400,
            strokeDashoffset: live ? 0 : 400,
            transition: "stroke-dashoffset 1.4s ease",
          }}
        />
      </svg>
      <div className="absolute bottom-3 left-4 font-mono text-[9px] uppercase tracking-wide2 text-white/40">
        candidate · docking score ↑
      </div>
    </div>
  );
}

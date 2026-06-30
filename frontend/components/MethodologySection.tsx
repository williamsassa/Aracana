import Reveal from "./Reveal";
import type { Product } from "@/lib/products";
import { METHOD } from "@/lib/methodology";

export default function MethodologySection({ product }: { product: Product }) {
  return (
    <section
      id="methodology"
      className="scroll-mt-28 border-t border-paper-line bg-ink text-paper"
    >
      <div className="container-x py-20 md:py-28">
        {/* Header */}
        <Reveal>
          <div className="eyebrow text-paper/50">{METHOD.eyebrow}</div>
          <h2 className="display-2 mt-3 text-paper">{METHOD.title}</h2>
          <p className="mt-2 font-mono text-sm uppercase tracking-wide2 text-accent-soft">
            {METHOD.subtitle}
          </p>
          <p className="lead mt-6 max-w-3xl text-paper/60">{METHOD.lede}</p>
        </Reveal>

        {/* Two pillars */}
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {METHOD.pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 100}>
              <div className="h-full rounded-2xl border border-white/12 bg-white/[0.03] p-8">
                <div className="font-mono text-sm text-accent-soft">{p.tag}</div>
                <h3 className="mt-4 font-display text-2xl text-paper">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-paper/65">
                  {p.body}
                </p>
                <ul className="mt-5 space-y-2.5">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex gap-3 text-sm text-paper/80">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        {/* The loop */}
        <Reveal>
          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">
            {METHOD.loop.map((s) => (
              <div key={s.n} className="bg-ink p-7">
                <div className="font-mono text-sm text-accent-soft">{s.n}</div>
                <h4 className="mt-3 font-display text-lg text-paper">
                  {s.title}
                </h4>
                <p className="mt-1.5 text-sm leading-relaxed text-paper/60">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Product-specific learning signals */}
        <Reveal>
          <div className="mt-16">
            <h3 className="font-display text-2xl text-paper">
              Learning signals for {product.name}
            </h3>
            <p className="mt-3 max-w-3xl text-paper/60">{product.rewardIntro}</p>

            <div className="mt-7 overflow-x-auto rounded-2xl border border-white/12">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/12 text-paper/45">
                    <th className="px-5 py-3 font-mono text-[11px] uppercase tracking-wide2">
                      Signal
                    </th>
                    <th className="px-5 py-3 font-mono text-[11px] uppercase tracking-wide2">
                      Weight
                    </th>
                    <th className="px-5 py-3 font-mono text-[11px] uppercase tracking-wide2">
                      What it rewards
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {product.rewardComponents.map((c) => (
                    <tr
                      key={c.signal}
                      className="border-b border-white/8 last:border-0"
                    >
                      <td className="px-5 py-3 text-paper">{c.signal}</td>
                      <td className="px-5 py-3 font-mono text-accent-soft">
                        {c.weight}
                      </td>
                      <td className="px-5 py-3 text-paper/55">{c.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-6 max-w-3xl rounded-2xl border-l-2 border-accent bg-white/[0.03] px-6 py-5 text-paper/75">
              {product.rewardExample}
            </p>
          </div>
        </Reveal>

        <Reveal>
          <p className="mt-12 font-mono text-[11px] uppercase tracking-wide2 text-paper/35">
            {METHOD.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

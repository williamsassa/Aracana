import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionHeading } from "@/components/Bits";
import Reveal from "@/components/Reveal";
import { getRoles, getTeams } from "@/lib/content";
import { SITE } from "@/lib/site";
import { buildAlternates } from "@/lib/seo";
import type { Locale } from "@/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "careers" });
  return {
    title: t("eyebrow"),
    description: t("lead"),
    alternates: buildAlternates("/careers"),
  };
}

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "careers" });
  const roles = getRoles(locale);
  const teams = getTeams(locale);
  const whyItems = t.raw("whyItems") as { title: string; desc: string }[];

  return (
    <>
      <section className="container-x py-20 md:py-28">
        <Reveal>
          <div className="eyebrow">{t("eyebrow")}</div>
          <h1 className="display-1 mt-4 max-w-4xl">{t("title")}</h1>
          <p className="lead mt-6 max-w-2xl">{t("lead")}</p>
        </Reveal>
      </section>

      {/* Why join */}
      <section className="border-y border-paper-line bg-paper-soft">
        <div className="container-x grid gap-8 py-16 md:grid-cols-3">
          {whyItems.map((item, i) => (
            <Reveal key={item.title} delay={i * 100}>
              <div>
                <div className="font-mono text-sm text-accent">0{i + 1}</div>
                <h3 className="mt-3 font-display text-xl text-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-ink-muted">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Teams */}
      <section className="container-x py-16 md:py-20">
        <Reveal>
          <SectionHeading eyebrow={t("teamsEyebrow")} title={t("teamsTitle")} />
          <div className="mt-8 flex flex-wrap gap-3">
            {teams.map((team) => (
              <span
                key={team}
                className="rounded-full border border-paper-line bg-paper-raised px-5 py-2 font-display text-sm text-ink-soft"
              >
                {team}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Open roles */}
      <section className="container-x pb-24">
        <Reveal>
          <SectionHeading eyebrow={t("rolesEyebrow")} title={t("rolesTitle")} />
        </Reveal>
        <div className="mt-10 overflow-hidden rounded-2xl border border-paper-line">
          {roles.map((r, i) => (
            <Reveal key={r.title} delay={(i % 3) * 60}>
              <a
                href={`mailto:${SITE.email}?subject=${encodeURIComponent(
                  "Application — " + r.title
                )}`}
                className="group grid grid-cols-1 items-center gap-3 border-b border-paper-line bg-paper-raised p-6 transition-colors last:border-0 hover:bg-paper-soft md:grid-cols-[1.6fr_0.9fr_0.7fr_auto]"
              >
                <div className="font-display text-lg text-ink">{r.title}</div>
                <div className="text-sm text-ink-muted">{r.location}</div>
                <div className="font-mono text-[11px] uppercase tracking-wide2 text-ink-faint">
                  {r.team} · {r.type}
                </div>
                <span className="font-mono text-[12px] uppercase tracking-wide2 text-ink transition-transform group-hover:translate-x-1">
                  {t("apply")}
                </span>
              </a>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="mt-8 text-sm text-ink-muted">
            {t("noRolePrompt")}{" "}
            <a
              href={`mailto:${SITE.email}?subject=Open%20application`}
              className="link-underline"
            >
              {t("openApplication")}
            </a>
            .
          </p>
        </Reveal>
      </section>
    </>
  );
}

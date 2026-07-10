import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Orb, SectionHeading } from "@/components/Bits";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { getAboutValues } from "@/lib/content";
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
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("eyebrow"),
    description: t("lead"),
    alternates: buildAlternates("/about"),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });
  const values = getAboutValues(locale);
  const missionParagraphs = t.raw("missionParagraphs") as string[];

  return (
    <>
      <section className="relative overflow-hidden">
        <Orb className="absolute -right-16 top-0 hidden h-80 w-80 opacity-70 md:block" />
        <div className="container-x py-20 md:py-28">
          <Reveal>
            <div className="eyebrow">{t("eyebrow")}</div>
            <h1 className="display-1 mt-4 max-w-4xl">{t("title")}</h1>
            <p className="lead mt-6 max-w-2xl">{t("lead")}</p>
          </Reveal>
        </div>
      </section>

      {/* Mission */}
      <section className="border-y border-paper-line bg-paper-soft">
        <div className="container-x grid gap-10 py-20 md:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <h2 className="display-2">{t("missionTitle")}</h2>
          </Reveal>
          <Reveal delay={120}>
            <div className="space-y-5 text-lg leading-relaxed text-ink-soft">
              {missionParagraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="container-x py-20 md:py-28">
        <Reveal>
          <SectionHeading
            eyebrow={t("principlesEyebrow")}
            title={t("principlesTitle")}
          />
        </Reveal>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-paper-line bg-paper-line md:grid-cols-2">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={(i % 2) * 80}>
              <div className="h-full bg-paper-raised p-8">
                <div className="font-mono text-sm text-accent">0{i + 1}</div>
                <h3 className="mt-4 font-display text-xl text-ink">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {v.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Facts */}
      <section className="border-t border-paper-line bg-obsidian text-paper-fixed">
        <div className="container-x grid gap-8 py-16 md:grid-cols-3">
          {[
            [t("factsHeadquarters"), SITE.location],
            [t("factsFounded"), t("factsFoundedValue")],
            [t("factsFocus"), t("factsFocusValue")],
          ].map(([k, v]) => (
            <Reveal key={k}>
              <div>
                <div className="font-mono text-[11px] uppercase tracking-wide2 text-paper-fixed/40">
                  {k}
                </div>
                <div className="mt-2 font-display text-2xl text-paper-fixed">
                  {v}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="container-x py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <div>
              <div className="eyebrow">{t("contactEyebrow")}</div>
              <h2 className="display-2 mt-3">{t("contactTitle")}</h2>
              <p className="lead mt-5 max-w-md">{t("contactLead")}</p>
              <div className="mt-6 space-y-2 text-sm text-ink-muted">
                <p>
                  <a href={`mailto:${SITE.email}`} className="link-underline">
                    {SITE.email}
                  </a>
                </p>
                <p>{SITE.location}</p>
                <p>
                  <Link href="/careers" className="link-underline">
                    {t("joinPrompt")}
                  </Link>
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}

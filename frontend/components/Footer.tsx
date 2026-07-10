import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Wordmark } from "./Logo";
import { SITE, TAGLINE, getNav } from "@/lib/site";
import type { Locale } from "@/i18n/config";

export default async function Footer() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations({ locale, namespace: "footer" });
  const NAV = getNav(locale);

  return (
    <footer className="border-t border-paper-line bg-paper-soft">
      <div className="container-x py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Wordmark size="text-2xl" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
              {TAGLINE[locale]}. {t("taglineSuffix")}
            </p>
          </div>

          {NAV.slice(0, 3).map((col) => (
            <div key={col.label}>
              <div className="eyebrow mb-4">{col.label}</div>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    href={col.href}
                    className="text-sm text-ink-soft transition-colors hover:text-accent"
                  >
                    {t("overview")}
                  </Link>
                </li>
                {col.children?.map((c) => (
                  <li key={c.label}>
                    <Link
                      href={c.href}
                      className="text-sm text-ink-soft transition-colors hover:text-accent"
                    >
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-paper-line pt-6 text-sm text-ink-muted md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>
              © {SITE.year} {SITE.legalName}
            </span>
            <Link href="/careers" className="hover:text-ink">
              {t("careers")}
            </Link>
            <Link href="/about" className="hover:text-ink">
              {t("about")}
            </Link>
            <a href={`mailto:${SITE.email}`} className="hover:text-ink">
              {SITE.email}
            </a>
          </div>
          <div className="font-mono text-[11px] uppercase tracking-wide2">
            {SITE.location}
          </div>
        </div>
      </div>
    </footer>
  );
}

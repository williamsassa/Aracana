import { locales, defaultLocale, type Locale } from "@/i18n/config";

const SITE_URL = "https://aracana.ai";

/** Builds the `alternates` metadata object (hreflang + x-default) for a
 * locale-invariant path such as "/products/generative-model" or "/research". */
export function buildAlternates(pathWithoutLocale: string) {
  const path = pathWithoutLocale === "/" ? "" : pathWithoutLocale;
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = `${SITE_URL}/${locale}${path}`;
  }
  languages["x-default"] = `${SITE_URL}/${defaultLocale}${path}`;
  return {
    canonical: `${SITE_URL}/${defaultLocale}${path}`,
    languages,
  };
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

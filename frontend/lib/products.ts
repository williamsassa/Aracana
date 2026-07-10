/* Locale-aware product catalogue dispatcher.
   Slugs, codenames and status are invariant across locales (see products.en.ts /
   products.fr.ts) — only display copy changes. */

import type { Locale } from "@/i18n/config";
import { PRODUCTS_EN } from "./products.en";
import { PRODUCTS_FR } from "./products.fr";

export type { Product, ProductStatus, RewardComponent } from "./products.en";

export const PRODUCT_SLUGS = PRODUCTS_EN.map((p) => p.slug);

export function getProducts(locale: Locale) {
  return locale === "fr" ? PRODUCTS_FR : PRODUCTS_EN;
}

export function getFrontProducts(locale: Locale) {
  return getProducts(locale).filter((p) => !p.background);
}

export function getBackgroundProducts(locale: Locale) {
  return getProducts(locale).filter((p) => p.background);
}

export function getProduct(locale: Locale, slug: string) {
  return getProducts(locale).find((p) => p.slug === slug);
}

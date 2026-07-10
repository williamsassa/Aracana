import type { Locale } from "@/i18n/config";
import { getProducts, type ProductStatus } from "./products";
import { getResearch, getSolutions } from "./content";

export const SITE = {
  name: "ARACANA AI",
  legalName: "ARACANA AI S.A.S.",
  location: "Paris · Brussels · Europe",
  email: "contact@aracana.ai",
  year: 2026,
};

export const TAGLINE: Record<Locale, string> = {
  en: "Building Sovereign Frontier AI in Europe",
  fr: "Construire une IA de pointe souveraine en Europe",
};

export type NavItem = {
  label: string;
  href: string;
  children?: {
    label: string;
    href: string;
    desc?: string;
    status?: ProductStatus;
  }[];
};

const NAV_LABELS: Record<Locale, Record<"research" | "solutions" | "products" | "careers" | "about", string>> = {
  en: {
    research: "Research",
    solutions: "Solutions",
    products: "Products",
    careers: "Careers",
    about: "About Us",
  },
  fr: {
    research: "Recherche",
    solutions: "Solutions",
    products: "Produits",
    careers: "Carrières",
    about: "À Propos",
  },
};

export function getNav(locale: Locale): NavItem[] {
  const labels = NAV_LABELS[locale];
  return [
    {
      label: labels.research,
      href: "/research",
      children: getResearch(locale).map((axis) => ({
        label: axis.title,
        href: `/research#${axis.id}`,
        desc: axis.navBlurb,
      })),
    },
    {
      label: labels.solutions,
      href: "/solutions",
      children: getSolutions(locale).map((s) => ({
        label: s.title,
        href: `/solutions#${s.id}`,
      })),
    },
    {
      label: labels.products,
      href: "/products",
      children: getProducts(locale).map((p) => ({
        label: p.name,
        href: `/products/${p.slug}`,
        desc: p.tagline,
        status: p.status,
      })),
    },
    { label: labels.careers, href: "/careers" },
    { label: labels.about, href: "/about" },
  ];
}

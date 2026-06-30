export const SITE = {
  name: "ARACANA AI",
  legalName: "ARACANA AI S.A.S.",
  tagline: "Building Sovereign Frontier AI in Europe",
  location: "Paris · Brussels · Europe",
  email: "contact@aracana.ai",
  year: 2026,
};

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; desc?: string }[];
};

export const NAV: NavItem[] = [
  {
    label: "Research",
    href: "/research",
    children: [
      {
        label: "Recursive Self-Improvement",
        href: "/research#recursive-self-improvement",
        desc: "Systems that refine their own training loops.",
      },
      {
        label: "Mechanism-Informed Multimodal AI",
        href: "/research#mechanism-informed",
        desc: "Models grounded in physical mechanisms.",
      },
      {
        label: "State Integrity & Sovereignty",
        href: "/research#state-integrity",
        desc: "AI aligned with national & European sovereignty.",
      },
    ],
  },
  {
    label: "Solutions",
    href: "/solutions",
    children: [
      { label: "Generative AI", href: "/solutions#generative" },
      { label: "Coding Agent", href: "/solutions#coding-agent" },
      { label: "AI Scientist", href: "/solutions#ai-scientist" },
      { label: "Space & Very-High Altitude", href: "/solutions#space" },
      { label: "State Defense", href: "/solutions#defense" },
      { label: "Multi-Agent Systems", href: "/solutions#multi-agent" },
    ],
  },
  {
    label: "Products",
    href: "/products",
    children: [
      { label: "Generative Model", href: "/products/generative-model" },
      { label: "Coding Agent Model", href: "/products/coding-agent-model" },
      {
        label: "State Space Sovereignty Model",
        href: "/products/state-space-sovereignty-model",
      },
    ],
  },
  { label: "Careers", href: "/careers" },
  { label: "About Us", href: "/about" },
];

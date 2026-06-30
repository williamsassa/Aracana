import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackgroundFX from "@/components/BackgroundFX";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ARACANA AI — Sovereign Frontier AI for Europe",
    template: "%s — ARACANA AI",
  },
  description:
    "ARACANA AI builds frontier artificial intelligence for European sovereignty and the expansion of AI across industry, finance and everyday life.",
  keywords: [
    "ARACANA AI",
    "sovereign AI",
    "European AI",
    "frontier AI",
    "generative AI",
    "coding agent",
    "AI scientist",
    "state defense AI",
    "multi-agent systems",
    "reinforcement learning",
    "causality",
  ],
  metadataBase: new URL("https://aracana.ai"),
  openGraph: {
    title: "ARACANA AI — Sovereign Frontier AI for Europe",
    description:
      "Frontier AI for European sovereignty across industry, finance and everyday life.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrains.variable}`}
    >
      <body className="min-h-screen bg-paper font-sans antialiased">
        <BackgroundFX />
        <Header />
        <main className="pt-[72px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

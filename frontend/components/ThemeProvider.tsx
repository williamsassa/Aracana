"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/** Dark stays the brand's default, primary experience — light is an
 * explicit opt-in via the header toggle, not inherited from the OS
 * (`enableSystem={false}`), so first-time visitors always land on the
 * intended dark identity regardless of their system preference. */
export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      storageKey="aracana-theme"
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}

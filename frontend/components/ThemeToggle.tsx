"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";

/** Simple two-state toggle (dark/light, no "system" option — see
 * ThemeProvider). Renders the dark-mode icon until mounted so the SSR
 * markup matches the site's dark-by-default first paint. */
export default function ThemeToggle() {
  const t = useTranslations("header");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted ? theme !== "light" : true;

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={t("themeToggle")}
      title={t("themeToggle")}
      className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-colors hover:text-ink"
    >
      {isDark ? <Moon size={17} strokeWidth={1.75} /> : <Sun size={17} strokeWidth={1.75} />}
    </button>
  );
}

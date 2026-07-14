"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import Logo from "./Logo";
import { getNav } from "@/lib/site";
import { StatusBadge } from "./Bits";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import type { Locale } from "@/i18n/config";

function isItemActive(pathname: string, href: string) {
  const path = href.split("#")[0];
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}

export default function Header() {
  const locale = useLocale() as Locale;
  const t = useTranslations("header");
  const NAV = getNav(locale);
  const [open, setOpen] = useState(false); // mobile menu
  const [active, setActive] = useState<string | null>(null); // desktop dropdown
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "glass border-b" : "border-b border-transparent"
      }`}
    >
      <div className="container-x flex h-[72px] items-center justify-between">
        <Logo />

        {/* Desktop nav */}
        <nav
          className="hidden items-center gap-1 md:flex"
          onMouseLeave={() => setActive(null)}
        >
          {NAV.map((item) => {
            const isActive = isItemActive(pathname, item.href);
            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setActive(item.children ? item.label : null)}
                onFocus={() => setActive(item.children ? item.label : null)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setActive(null);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setActive(null);
                }}
              >
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-1 rounded-full px-4 py-2 font-display text-[15px] transition-colors hover:text-ink ${
                    isActive ? "text-ink" : "text-ink-soft"
                  }`}
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown
                      size={14}
                      strokeWidth={1.75}
                      className={`mt-0.5 transition-transform ${
                        active === item.label ? "rotate-180" : ""
                      }`}
                    />
                  )}
                  {isActive && (
                    <span
                      aria-hidden
                      className="absolute inset-x-4 -bottom-[1px] h-[2px] rounded-full bg-spectrum-gradient"
                    />
                  )}
                </Link>

                {item.children && active === item.label && (
                  <div className="absolute left-0 top-full w-[320px] pt-2">
                    <div className="glass overflow-hidden rounded-2xl p-2 shadow-[0_24px_70px_-30px_rgba(0,0,0,0.6)]">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block rounded-xl px-4 py-3 transition-colors hover:bg-paper-soft"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="font-display text-[14px] text-ink">
                              {child.label}
                            </div>
                            {child.status && <StatusBadge status={child.status} />}
                          </div>
                          {child.desc && (
                            <div className="mt-0.5 text-[12.5px] leading-snug text-ink-muted">
                              {child.desc}
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="hidden items-center gap-1 md:flex">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>

        {/* Mobile toggle */}
        <button
          aria-label={t("menuToggle")}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center md:hidden"
        >
          {open ? (
            <X size={20} strokeWidth={1.75} className="text-ink" />
          ) : (
            <Menu size={20} strokeWidth={1.75} className="text-ink" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="glass border-t md:hidden">
          <nav className="container-x flex flex-col py-4">
            {NAV.map((item) => {
              const isActive = isItemActive(pathname, item.href);
              return (
                <div key={item.label} className="border-b border-paper-line/70 py-1">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`block py-2.5 font-display text-lg ${
                      isActive ? "text-spectrum" : "text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="pb-2 pl-3">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-between gap-2 py-1.5 text-[14px] text-ink-muted"
                        >
                          {child.label}
                          {child.status && <StatusBadge status={child.status} />}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div className="mt-3 flex items-center gap-3 pt-3">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

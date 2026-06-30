"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import { NAV } from "@/lib/site";

export default function Header() {
  const [open, setOpen] = useState(false); // mobile menu
  const [active, setActive] = useState<string | null>(null); // desktop dropdown

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-paper-line/70 bg-paper/80 backdrop-blur-md">
      <div className="container-x flex h-[72px] items-center justify-between">
        <Logo />

        {/* Desktop nav */}
        <nav
          className="hidden items-center gap-1 md:flex"
          onMouseLeave={() => setActive(null)}
        >
          {NAV.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => setActive(item.children ? item.label : null)}
            >
              <Link
                href={item.href}
                className="flex items-center gap-1 rounded-full px-4 py-2 font-display text-[15px] text-ink-soft transition-colors hover:text-ink"
              >
                {item.label}
                {item.children && (
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    className={`mt-0.5 transition-transform ${
                      active === item.label ? "rotate-180" : ""
                    }`}
                  >
                    <path
                      d="M1 3l4 4 4-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.3"
                    />
                  </svg>
                )}
              </Link>

              {item.children && active === item.label && (
                <div className="absolute left-0 top-full w-[320px] pt-2">
                  <div className="card overflow-hidden p-2 shadow-[0_24px_70px_-30px_rgba(0,0,0,0.4)]">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block rounded-xl px-4 py-3 transition-colors hover:bg-paper-soft"
                      >
                        <div className="font-display text-[14px] text-ink">
                          {child.label}
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
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center md:hidden"
        >
          <div className="space-y-[5px]">
            <span
              className={`block h-px w-6 bg-ink transition-transform ${
                open ? "translate-y-[6px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px w-6 bg-ink transition-opacity ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-px w-6 bg-ink transition-transform ${
                open ? "-translate-y-[6px] -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-paper-line bg-paper-raised md:hidden">
          <nav className="container-x flex flex-col py-4">
            {NAV.map((item) => (
              <div key={item.label} className="border-b border-paper-line/70 py-1">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-2.5 font-display text-lg text-ink"
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
                        className="block py-1.5 text-[14px] text-ink-muted"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

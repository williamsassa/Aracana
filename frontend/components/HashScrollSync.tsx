"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";
import { getLenis } from "./SmoothScroll";

// Fixed header is 72px tall; leave a little extra breathing room above the target.
const HEADER_OFFSET = 88;

function scrollToHash(hash: string) {
  if (!hash) return;
  let el: Element | null = null;
  try {
    el = document.querySelector(hash);
  } catch {
    return;
  }
  if (!el) return;

  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(el as HTMLElement, { offset: -HEADER_OFFSET });
  } else {
    (el as HTMLElement).scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/**
 * Keeps in-page `#id` anchors (Header dropdown links, product-page CTAs like
 * `#methodology`/`#early-access`) working correctly once Lenis owns the
 * scroll: intercepts same-page hash clicks and routes them through
 * `lenis.scrollTo()` instead of the browser's instant native jump, which
 * would otherwise desync Lenis's virtual scroll position.
 */
export default function HashScrollSync() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.location.hash) {
      requestAnimationFrame(() => scrollToHash(window.location.hash));
    }

    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a[href*='#']") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";
      const url = new URL(href, window.location.href);
      if (url.pathname !== window.location.pathname || !url.hash) return;

      e.preventDefault();
      history.pushState(null, "", url.hash);
      scrollToHash(url.hash);
    }

    function onHashChange() {
      scrollToHash(window.location.hash);
    }

    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", onHashChange);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [pathname]);

  return null;
}

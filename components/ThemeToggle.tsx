"use client";

/* ---------------------------------------------------------------------
   ThemeToggle — single icon button in the SiteFrame header.

   Visual: a 24px square typewriter chrome button, ember-on-hover, no
   background. SVG carries two glyphs (sun + moon); they cross-fade and
   counter-rotate based on theme so the click reads as a small flip
   rather than a swap. The opposite of the current theme is shown — in
   dark mode you see the sun (action: "switch to light") and vice
   versa. Reduced motion is handled globally by the prefers-reduced-
   motion rule in globals.css which clamps every transition to 0.01ms.

   Hydration: initial state is always "dark" so server and client first
   render are byte-identical (no warning). useEffect runs after
   hydration, reads the theme that ThemeScript wrote to <html
   data-theme>, and syncs state. There's a single-frame window where
   the button icon could lag the page palette; that's invisible in
   practice and far cheaper than the alternative (lazy-init from
   document, which would mismatch SSR).
   --------------------------------------------------------------------- */

import { useEffect, useState } from "react";

type Theme = "light" | "dark";
const STORAGE_KEY = "museum-theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const initial = document.documentElement.dataset.theme;
    if (initial === "light" || initial === "dark") {
      setTheme(initial);
    }
  }, []);

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* localStorage may be unavailable (Safari private) */
    }
    setTheme(next);
  };

  const isLight = theme === "light";
  const label = isLight ? "Switch to dark mode" : "Switch to light mode";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      aria-pressed={isLight}
      title={label}
      className="press pointer-events-auto inline-flex h-6 w-6 items-center justify-center text-ink-500 transition-colors duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:text-ember"
    >
      <svg
        viewBox="0 0 24 24"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        style={{ overflow: "visible" }}
      >
        {/* Sun — visible in dark mode (action: switch to light) */}
        <g
          style={{
            opacity: isLight ? 0 : 1,
            transformOrigin: "12px 12px",
            transform: isLight
              ? "rotate(-60deg) scale(0.6)"
              : "rotate(0deg) scale(1)",
            transition: "opacity 220ms ease, transform 220ms ease",
          }}
        >
          <circle cx="12" cy="12" r="3.4" />
          <path d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" />
        </g>
        {/* Moon — visible in light mode (action: switch to dark) */}
        <g
          style={{
            opacity: isLight ? 1 : 0,
            transformOrigin: "12px 12px",
            transform: isLight
              ? "rotate(0deg) scale(1)"
              : "rotate(60deg) scale(0.6)",
            transition: "opacity 220ms ease, transform 220ms ease",
          }}
        >
          <path d="M19 14.5A8 8 0 0 1 9.5 5a7 7 0 1 0 9.5 9.5z" />
        </g>
      </svg>
    </button>
  );
}

import Link from "next/link";

import { Atmosphere } from "./Atmosphere";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Site chrome. A small typewriter wordmark in the top-left, the
 * theme toggle and an /index link in the top-right, and the single
 * mounted instance of <Atmosphere /> that paints the grain, bloom,
 * and vignette across the whole vault. The ember dot is the one
 * specimen of pigment in the chrome itself.
 */
export function SiteFrame() {
  return (
    <>
      <Atmosphere />
      <header
        className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-between px-6 py-5 text-ink-700 backdrop-blur-md sm:px-10"
        style={{
          backgroundColor:
            "color-mix(in oklch, var(--color-vault) 82%, transparent)",
          borderBottom: "1px solid color-mix(in oklch, var(--color-rule-strong) 60%, transparent)",
        }}
        aria-label="Site frame"
      >
        <Link
          href="/"
          className="press pointer-events-auto group inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.16em] text-ink-700"
        >
          <span
            aria-hidden
            className="relative inline-flex h-[7px] w-[7px] items-center justify-center"
          >
            <span
              className="absolute inset-0 rounded-full bg-ember"
              style={{
                animation: "cherry-pulse 4.5s ease-in-out infinite",
                boxShadow:
                  "0 0 12px 1px color-mix(in oklch, var(--color-ember-glow) 45%, transparent)",
              }}
            />
          </span>
          <span className="text-ink-on-dark">A&nbsp;Museum of Notetaking</span>
        </Link>

        <div className="pointer-events-auto flex items-center gap-3">
          <ThemeToggle />
          <span aria-hidden className="text-ink-300">·</span>
          <Link
            href="/system"
            className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.16em] text-ink-500 transition-colors duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:text-ink-on-dark"
          >
            <span aria-hidden className="text-ink-300">[</span>
            Design&nbsp;System
            <span aria-hidden className="text-ink-300">]</span>
          </Link>
        </div>
      </header>
    </>
  );
}

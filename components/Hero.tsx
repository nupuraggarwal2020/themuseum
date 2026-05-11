"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Hero. Full viewport. The arrival plate of the archive.
 * Opens with a personal pull-in paragraph that pulls the reader into
 * the title. A faint thumbprint sits in the lower-right corner.
 */
export function Hero() {
  const reduce = useReducedMotion();

  return (
    <div
      id="hero"
      className="relative flex min-h-[100dvh] w-full flex-col justify-between overflow-hidden px-6 pb-12 pt-24 sm:px-10 sm:pt-32"
    >
      <HorizonGradient />
      <Thumbprint />

      {/* Empty top spacer so justify-between distributes correctly. */}
      <div aria-hidden />

      <div className="relative z-10 mx-auto flex w-full max-w-[80rem] flex-col gap-8 sm:gap-10">
        <motion.div
          className="flex max-w-[58ch] flex-col gap-3"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.9,
            ease: [0.2, 0.8, 0.2, 1],
            delay: 0.1,
          }}
        >
          <p className="t-lede text-ink-on-dark">
            What do you do when you&rsquo;ve got multiple threads open
            in your head, notes spewn across tools, and a tool comes
            along that changes all that? A decade at Canva, twelve
            notetaking systems, none of them quite stuck. This site
            is what I learned along the way. I call it&hellip;
          </p>
        </motion.div>

        <motion.h1
          className="t-display-caps text-balance text-ink-on-dark"
          initial={reduce ? false : { opacity: 0, y: 10, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 1.1,
            ease: [0.2, 0.8, 0.2, 1],
            delay: 0.45,
          }}
        >
          A&nbsp;Museum of <em className="not-italic">Notetaking</em>.
        </motion.h1>
      </div>

      <div className="relative z-10 flex items-end justify-end">
        <p className="t-typewriter text-right text-ink-on-dark">
          ARCHIVIST: NUPUR&nbsp;AGGARWAL
          <br />
          INTAKE DATE: 2024 / 05 / 07
        </p>
      </div>

    </div>
  );
}

/**
 * Vertical horizon gradient — hero only. The site-wide Atmosphere
 * supplies the ember constellation, the mist band, the crushed bloom
 * and the grain; this layer is the "sky" that sits over them and the
 * "dark foreground" that anchors the floor.
 *
 * The middle of the gradient is INTENTIONALLY transparent so the
 * Atmosphere's herd of ember bodies shows through right where the
 * horizon lives. If you make this opaque the night-drive composition
 * collapses — you'll just see the linear gradient and the herd will
 * be hidden behind it.
 *
 * Stops, top → bottom:
 *   0%   vault-teal                      (sky — slightly cooler)
 *   18%  mix(vault-teal, vault, 35%)     (sky settles into vault)
 *   32%  vault                           (mid-air)
 *   55%  vault                           (held)
 *   62%  transparent                     (Atmosphere takes over here)
 *   85%  transparent                     (herd zone is visible)
 *   95%  rgba(vault-deep, 0.7)           (anchor begins to fade in)
 *   100% vault-deep                      (dark foreground silhouette)
 *
 * The teal-undertone at the top is intentional but subtle — only the
 * hero gets it. Site chrome and the rest of the rooms stay on the
 * warm vault canvas.
 */
function HorizonGradient() {
  return (
    <div
      aria-hidden
      className="horizon-gradient pointer-events-none absolute inset-0 z-0"
    />
  );
}

/** A faint hand-built thumbprint mark in the lower-right corner. */
function Thumbprint() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute -right-12 bottom-12 z-0 h-72 w-72 text-ink-300 opacity-[0.06] sm:right-8 sm:bottom-24 sm:h-96 sm:w-96"
      viewBox="0 0 200 240"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.7"
    >
      {Array.from({ length: 22 }).map((_, i) => {
        const r = 18 + i * 4.2;
        return (
          <ellipse
            key={i}
            cx="100"
            cy="120"
            rx={r}
            ry={r * 1.18}
            transform={`rotate(${(i % 2 === 0 ? -3 : 4)} 100 120)`}
          />
        );
      })}
      <path d="M 36 120 Q 100 70 168 120" />
      <path d="M 40 145 Q 100 100 162 148" />
      <path d="M 50 175 Q 100 145 152 178" />
    </svg>
  );
}

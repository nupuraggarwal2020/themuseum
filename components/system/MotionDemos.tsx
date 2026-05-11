"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { motionTokens, durationTokens } from "@/lib/tokens";

const EASE_CSS: Record<string, [number, number, number, number]> = {
  "ease-settle": [0.2, 0.8, 0.2, 1],
  "ease-snap": [0.32, 0.08, 0.24, 1],
  "ease-glide": [0.65, 0, 0.35, 1],
};

export function MotionDemos() {
  const reduce = useReducedMotion();
  const [pulse, setPulse] = useState(0);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-[3px] border border-rule bg-paper p-5">
        <p className="t-typewriter mb-1 text-ink-900">SPECIMEN · EASINGS</p>
        <p className="t-typewriter-sm mb-5 text-ink-500">
          MEASUREMENT MARKS · 0 · 25 · 50 · 75 · 100
        </p>
        <ul className="space-y-5">
          {motionTokens.map((t) => (
            <li key={t.name} className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-900">
                  {t.name}
                </span>
                <span className="font-mono text-[10px] text-ink-400">
                  var(--{t.cssVar})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPulse((p) => p + 1)}
                aria-label={`Replay ${t.name} easing demo`}
                className="press relative block h-2.5 overflow-hidden bg-bone-100"
              >
                {/* Measurement ticks */}
                <span aria-hidden className="pointer-events-none absolute inset-0">
                  {[0, 25, 50, 75, 100].map((p) => (
                    <span
                      key={p}
                      className="absolute top-0 block h-full w-px bg-ink-200"
                      style={{ left: `${p}%` }}
                    />
                  ))}
                </span>
                <motion.span
                  key={`${t.cssVar}-${pulse}`}
                  initial={reduce ? false : { width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 1.1,
                    ease: EASE_CSS[t.cssVar] ?? [0.2, 0.8, 0.2, 1],
                  }}
                  className="absolute inset-y-0 left-0 block bg-cherry-600"
                />
              </button>
              <p className="text-[12px] text-ink-500">{t.role}</p>
            </li>
          ))}
        </ul>
        <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-500">
          Click any strip to replay all three.
        </p>
      </div>

      <div className="rounded-[3px] border border-rule bg-paper p-5">
        <p className="t-typewriter mb-1 text-ink-900">SPECIMEN · DURATIONS</p>
        <p className="t-typewriter-sm mb-5 text-ink-500">
          STAMPED IN MS · KEEP THE LIST SHORT
        </p>
        <ul className="space-y-4">
          {durationTokens.map((t) => (
            <li
              key={t.name}
              className="flex items-baseline justify-between gap-4 border-b border-rule/60 pb-3 last:border-0"
            >
              <div className="flex flex-col">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-900">
                  {t.name}
                </span>
                <span className="font-mono text-[10px] text-ink-400">
                  var(--{t.cssVar})
                </span>
              </div>
              <p className="text-right text-[12px] text-ink-500">{t.role}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-500">
          Beyond 800ms is reserved for room transitions, never UI controls.
        </p>
      </div>
    </div>
  );
}

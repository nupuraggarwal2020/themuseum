"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * A small static-ish bar visualisation. When `playing` is true the bars
 * pulse softly, suggesting a passage of audio without ever playing one.
 */
export function Waveform({
  bars = 48,
  playing = false,
  color = "oklch(0.55 0.012 65)",
  height = 28,
  className = "",
}: {
  bars?: number;
  playing?: boolean;
  color?: string;
  height?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const heights = makeHeights(bars);
  return (
    <div
      className={`flex items-center gap-[2px] ${className}`}
      style={{ height }}
      aria-hidden
    >
      {heights.map((h, i) => (
        <motion.span
          key={i}
          className="block w-[2px] rounded-sm"
          style={{ background: color }}
          initial={{ height: `${h * 100}%`, opacity: 0.45 }}
          animate={
            reduce || !playing
              ? { height: `${h * 100}%`, opacity: 0.6 }
              : {
                  height: [
                    `${h * 100}%`,
                    `${Math.max(20, h * 100 + 10)}%`,
                    `${h * 100}%`,
                  ],
                  opacity: [0.6, 0.95, 0.6],
                }
          }
          transition={
            reduce || !playing
              ? { duration: 0 }
              : {
                  repeat: Infinity,
                  duration: 1.2 + (i % 7) * 0.08,
                  ease: [0.65, 0, 0.35, 1],
                  delay: (i % 9) * 0.06,
                }
          }
        />
      ))}
    </div>
  );
}

/** Generate a calm asymmetric envelope so the waveform reads as speech. */
function makeHeights(bars: number) {
  const out: number[] = [];
  for (let i = 0; i < bars; i++) {
    const t = i / bars;
    // Two sine waves of different frequency, both mild.
    const v =
      0.55 +
      0.25 * Math.sin(t * 9.7) +
      0.15 * Math.sin(t * 21.4 + 0.7) +
      0.08 * Math.sin(t * 41 + 1.3);
    out.push(Math.max(0.18, Math.min(0.92, v)));
  }
  return out;
}

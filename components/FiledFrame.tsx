"use client";

/* ---------------------------------------------------------------------
   FiledFrame — the wrapper that gives each prototype its forensic
   "filed evidence" presentation. The frame opens in monochrome with
   a typewriter strip across the top reading FILED 2024 — STATUS:
   REOPENED. The first interaction restores color over 800ms.

   Dark-vault edition:
   - Outer chrome (typewriter strip + caption) reads ink-on-dark.
   - Inner "evidence case" surface flips to .surface-lit so the
     prototype lives like a museum exhibit case under glass on a dark
     vault wall.
   - Restoration tinted ember (warmer than the original cherry).

   The render-prop API is unchanged.
   --------------------------------------------------------------------- */

import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

type Props = {
  caseNo: string;
  prototypeName: string;
  filedYear: string;
  /** Render-prop: receives a callback to mark first interaction */
  children: (onInteract: () => void, restored: boolean) => ReactNode;
};

export function FiledFrame({
  caseNo,
  prototypeName,
  filedYear,
  children,
}: Props) {
  const reduce = useReducedMotion();
  const [restored, setRestored] = useState(false);

  const onInteract = () => {
    if (restored) return;
    setRestored(true);
  };

  return (
    <div className="mx-auto w-full max-w-[80rem] px-4 sm:px-10">
      {/* Typewriter strip across the top — sits on the vault, not the case. */}
      <FiledStrip
        caseNo={caseNo}
        prototypeName={prototypeName}
        filedYear={filedYear}
        restored={restored}
      />

      {/* Lit display case wrapper. The .surface-lit scope restores the
          warm-bone palette inside; the case itself is intentionally
          flat — a single 1px hairline outline replaces the old drop-
          shadow + ember glow so the prototype reads as a clean
          drafting surface rather than a lit shelf. The `proto-flat`
          class neutralises --shadow-card / --shadow-lift / --shadow-pin
          for every descendant so every card, button and shard sitting
          inside the prototype is flat too, in both light and dark
          modes. */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        className={`surface-lit proto-flat ${restored ? "restored" : "filed"}`}
        style={{
          borderRadius: "6px",
          boxShadow: "0 0 0 1px var(--color-rule-strong)",
        }}
      >
        {children(onInteract, restored)}
      </motion.div>

      <p className="mt-3 px-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
        {restored ? (
          <>
            <span className="text-ember">●</span>&nbsp;LIVE · color
            returned the moment you intervened.
          </>
        ) : (
          <>
            <span className="text-ink-300">●</span>&nbsp;FILED · interact to
            reopen the case. Color returns on contact.
          </>
        )}
      </p>
    </div>
  );
}

function FiledStrip({
  caseNo,
  prototypeName,
  filedYear,
  restored,
}: {
  caseNo: string;
  prototypeName: string;
  filedYear: string;
  restored: boolean;
}) {
  return (
    <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-rule pb-2">
      <p className="t-typewriter text-ink-on-dark">
        CASE No.&nbsp;{caseNo} · {prototypeName}
      </p>
      <p className="t-typewriter-sm text-ink-500">
        FILED&nbsp;{filedYear} · STATUS:{" "}
        <span
          className={
            restored
              ? "text-ember"
              : "text-ink-700 line-through decoration-ember/70 decoration-[1.5px]"
          }
        >
          {restored ? "REOPENED" : "FILED"}
        </span>
        {restored ? null : (
          <>
            {" "}
            →&nbsp;<span className="text-ink-700">REOPENED</span>
          </>
        )}
      </p>
    </div>
  );
}

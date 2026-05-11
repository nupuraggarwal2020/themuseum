"use client";

/* ---------------------------------------------------------------------
   DetailCard — manila file-folder view for a single artifact.

   Triggered when the visitor clicks (or focuses + Enters) a drawer in
   the wall, or taps an artifact on the intake flatlay. The folder
   lands on a dimmed backdrop. There is no chrome: no back button, no
   expand affordance, no kebab, no prev / next arrows, no metadata
   strip. Each file is a moment by itself. Click anywhere outside the
   folder to close, or press Esc.

   Visual:
   - A manila tan body with a soft warm paper grain (low-opacity
     feTurbulence noise, multiply-blended).
   - One tab cut out of the top-left third of the cardstock, engraved
     with the artifact's exhibit code and content-type, e.g.
     EXHIBIT B · LEDGER. The tab shares the manila colour and bottom
     edge with the body so it reads as one cut shape.
   - A faint horizontal fold-line shadow across the middle, suggesting
     the closed-fold of the folder (visible at rest, fades on open).
   - Inside the folder, a slightly lighter "paper insert" carries the
     artifact content with its own soft shadow, like a sheet resting in
     the folder. About 32–40 px of manila padding around it.

   Animation (Emil Kowalski vocabulary, transform + opacity only):
   - Backdrop opacity 0 → 0.7, 220 ms ease-out.
   - Folder enter: scale(0.94) opacity(.85) translateY(8px) → rest,
     320 ms cubic-bezier(0.2, 0.8, 0.2, 1). The folder being lifted
     onto the desk.
   - Content opacity 0 → 1 starting 80 ms after the folder lands, 220 ms.
     Folder lands → contents reveal, sequentially.
   - Exit: 200 ms reverse, ease-in-out.
   - prefers-reduced-motion: opacity-only, ≤ 120 ms.

   Accessibility:
   - role="dialog", aria-modal="true", aria-labelledby points at a
     screen-reader title built from the artifact, plus an explicit
     aria-label that includes content-type / year for context.
   - Esc closes; backdrop click closes (the folder absorbs clicks).
   - Focus moves into the folder on open and is trapped via Tab; on
     close, focus is restored to the trigger that opened the modal
     (typically the drawer face button).
   --------------------------------------------------------------------- */

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  type ReactNode,
  useEffect,
  useId,
  useRef,
} from "react";

import type { Artifact } from "../evidence/artifacts";

type Props = {
  artifact: Artifact | null;
  onClose: () => void;
  renderArtifact: (artifact: Artifact) => ReactNode;
};

/* ----- Paper grain (encoded once at module scope) ----- */

const FOLDER_NOISE_SVG =
  `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'>` +
  `<filter id='n'>` +
  `<feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch' seed='7'/>` +
  `</filter>` +
  `<rect width='100%' height='100%' filter='url(#n)'/>` +
  `</svg>`;

const FOLDER_NOISE_URL = `url("data:image/svg+xml;utf8,${encodeURIComponent(FOLDER_NOISE_SVG)}")`;

function exhibitLetter(exhibit: string) {
  const m = exhibit.match(/EXHIBIT\s+([A-Z])/i);
  return m ? m[1].toUpperCase() : exhibit;
}

function extractYear(meta: string) {
  const m = meta.match(/(\d{4})/);
  return m ? m[1] : null;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function DetailCard({ artifact, onClose, renderArtifact }: Props) {
  const reduce = useReducedMotion();
  const folderRef = useRef<HTMLDivElement | null>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  // Esc closes. Arrow keys do nothing here — each file is its own moment.
  useEffect(() => {
    if (!artifact) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [artifact, onClose]);

  // Move focus into the folder on open, restore it to the trigger on close.
  useEffect(() => {
    if (!artifact) return;
    restoreRef.current = (document.activeElement as HTMLElement | null) ?? null;
    const t = window.setTimeout(() => folderRef.current?.focus(), 80);
    return () => {
      window.clearTimeout(t);
      const el = restoreRef.current;
      if (el && document.body.contains(el)) {
        try {
          el.focus({ preventScroll: true });
        } catch {
          /* ignore — element may have lost focus capability */
        }
      }
    };
  }, [artifact]);

  // Trap Tab inside the folder while the modal is open.
  useEffect(() => {
    if (!artifact) return;
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      const root = folderRef.current;
      if (!root) return;
      const focusables = Array.from(
        root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => el.offsetParent !== null);
      if (focusables.length === 0) {
        e.preventDefault();
        root.focus();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (active === first || !root.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last || !root.contains(active)) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [artifact]);

  const exhibit = artifact ? exhibitLetter(artifact.exhibit) : "";
  const type = artifact?.type ?? "";
  const year = artifact ? extractYear(artifact.meta) : null;
  const ariaLabel = artifact
    ? `Exhibit ${exhibit}: ${artifact.label}${year ? `, filed ${year}` : ""}${type ? `, filed as ${type.toLowerCase()}` : ""}`
    : "";

  const easeSettle = [0.2, 0.8, 0.2, 1] as const;
  const easeExit = [0.4, 0, 0.6, 1] as const;
  const enterDuration = reduce ? 0.12 : 0.32;
  const exitDuration = reduce ? 0.12 : 0.20;

  return (
    <AnimatePresence>
      {artifact ? (
        <motion.div
          key="folder-overlay"
          className="bloom-quiet-active fixed inset-0 z-[60] flex items-center justify-center px-4 py-10 sm:px-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: easeSettle }}
        >
          {/* Backdrop — clicking anywhere closes. The folder absorbs
              clicks so users can scroll, drag scrubbers, etc. without
              dismissing. cursor-zoom-out hints at dismissibility. */}
          <button
            type="button"
            aria-label="Close exhibit"
            onClick={onClose}
            className="absolute inset-0 cursor-zoom-out"
            style={{ background: "oklch(0 0 0 / 0.7)" }}
          />

          <motion.div
            ref={folderRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-label={ariaLabel}
            onClick={(e) => e.stopPropagation()}
            initial={
              reduce
                ? { opacity: 0 }
                : { opacity: 0.85, scale: 0.94, y: 8 }
            }
            animate={
              reduce
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            exit={
              reduce
                ? { opacity: 0, transition: { duration: exitDuration, ease: easeExit } }
                : {
                    opacity: 0,
                    scale: 0.97,
                    y: 4,
                    transition: { duration: exitDuration, ease: easeExit },
                  }
            }
            transition={{ duration: enterDuration, ease: easeSettle }}
            className="relative z-10 w-full max-w-[760px] outline-none"
            style={{
              transformOrigin: "center center",
              paddingTop: 24,
            }}
          >
            <span id={titleId} className="sr-only">
              Exhibit {exhibit}: {artifact.label}
            </span>

            {/* TAB — the protruding label, integral to the folder
                shape. Manila on manila so the tab and body read as
                one cut piece of cardstock. Sits in the top-left
                third per the brief. */}
            <div
              aria-hidden
              className="absolute"
              style={{
                top: 0,
                left: "min(56px, 8%)",
                height: 30,
                paddingLeft: 16,
                paddingRight: 18,
                display: "inline-flex",
                alignItems: "center",
                background: "var(--color-manila)",
                borderTop: "1px solid var(--color-manila-edge)",
                borderLeft: "1px solid var(--color-manila-edge)",
                borderRight: "1px solid var(--color-manila-edge)",
                borderTopLeftRadius: 9,
                borderTopRightRadius: 14,
                boxShadow:
                  "inset 0 1px 0 var(--color-manila-rim)," +
                  " 0 -2px 6px -3px oklch(0 0 0 / 0.22)",
                zIndex: 2,
              }}
            >
              <span
                className="font-mono text-[10px] font-bold uppercase"
                style={{
                  color: "var(--color-manila-ink)",
                  letterSpacing: "0.18em",
                  textShadow: "0 1px 0 var(--color-manila-rim)",
                }}
              >
                EXHIBIT&nbsp;{exhibit}
                <span
                  className="mx-2"
                  aria-hidden
                  style={{ opacity: 0.55 }}
                >
                  ·
                </span>
                {type}
              </span>
            </div>

            {/* FOLDER BODY — the cardstock. */}
            <div
              className="relative overflow-hidden"
              style={{
                background: "var(--color-manila)",
                border: "1px solid var(--color-manila-edge)",
                borderRadius: 10,
                boxShadow:
                  "inset 0 1px 0 var(--color-manila-rim)," +
                  " inset 0 0 0 1px oklch(0 0 0 / 0.04)," +
                  " 0 28px 60px -28px oklch(0 0 0 / 0.55)," +
                  " 0 6px 16px -6px oklch(0 0 0 / 0.32)",
                padding: "clamp(28px, 4vw, 40px)",
                paddingTop: "clamp(34px, 4.5vw, 44px)",
                maxHeight: "min(86vh, 880px)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Paper grain — multiply over the manila body. Static. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage: FOLDER_NOISE_URL,
                  backgroundSize: "220px 220px",
                  backgroundRepeat: "repeat",
                  opacity: 0.05,
                  mixBlendMode: "multiply",
                }}
              />

              {/* Fold-line — a faint horizontal shadow across the middle,
                  reads as the closed fold of the folder cardstock. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-6 top-1/2 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, oklch(0 0 0 / 0.10) 50%, transparent 100%)",
                  opacity: reduce ? 0 : 0.45,
                  transform: "translateY(-0.5px)",
                }}
              />

              {/* PAPER INSERT — the sheet resting in the folder. Lighter
                  than the manila so the folder reads as the container
                  and the paper as the content surface. Inherits
                  surface-lit so the artifact renderers keep their
                  warm-bone palette. */}
              <motion.div
                key={artifact.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: reduce ? 0.12 : 0.22,
                  delay: reduce ? 0 : 0.08,
                  ease: easeSettle,
                }}
                className="surface-lit relative z-10 flex-1 overflow-hidden rounded-[6px]"
                style={{
                  background: "var(--color-manila-paper)",
                  border: "1px solid oklch(0.86 0.012 80)",
                  boxShadow:
                    "inset 0 1px 0 oklch(1 0 0 / 0.55)," +
                    " 0 1px 2px oklch(0 0 0 / 0.08)," +
                    " 0 14px 28px -18px oklch(0 0 0 / 0.22)",
                  minHeight: "clamp(340px, 42vh, 460px)",
                }}
              >
                <div className="h-full max-h-[min(70vh,720px)] overflow-y-auto px-5 py-6 sm:px-7 sm:py-8">
                  {renderArtifact(artifact)}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

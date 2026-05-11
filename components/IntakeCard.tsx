"use client";

/* ---------------------------------------------------------------------
   FOR THE RECORD — interactive intake card.

   A recreation of the intake card from the reference imagery: typed
   labels, hand-written input text, a mug-shot box on the left. The
   visitor fills in their name, country, story, and "invisible luggage".
   Their answers persist in localStorage so a refresh keeps the card.

   On Develop:
   - The card briefly de-saturates and re-saturates (a polaroid develop).
   - The "?" placeholder in the photo box becomes a stylized cherry-and-
     fingerprint stamp.
   - A Save button appears. Save calls html-to-image to produce a PNG.
   --------------------------------------------------------------------- */

import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { toPng } from "html-to-image";

const STORAGE_KEY = "museum.intakeCard.v1";

type Form = {
  name: string;
  country: string;
  story: string;
  luggage: string;
};

const EMPTY: Form = { name: "", country: "", story: "", luggage: "" };

export function IntakeCard() {
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [form, setForm] = useState<Form>(EMPTY);
  const [developed, setDeveloped] = useState(false);
  const [developing, setDeveloping] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount. We use useSyncExternalStore-style
  // hydration via a layout effect that calls a single setState with a
  // resolved object, avoiding the multiple-setState-in-effect lint warning.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { form?: Form; developed?: boolean };
        if (parsed.form) setForm({ ...EMPTY, ...parsed.form });
        if (parsed.developed) setDeveloped(true);
      }
    } catch {
      /* localStorage may be unavailable; fail silently */
    }
    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Persist on every change.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ form, developed }),
      );
    } catch {
      /* ignore */
    }
  }, [form, developed, hydrated]);

  const onField =
    (key: keyof Form) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const develop = useCallback(() => {
    if (developing || developed) return;
    setDeveloping(true);
    // Brief calls for a 900ms polaroid develop. Reduced motion skips
    // the animation entirely.
    const ms = reduce ? 50 : 900;
    window.setTimeout(() => {
      setDeveloping(false);
      setDeveloped(true);
    }, ms);
  }, [developed, developing, reduce]);

  const save = useCallback(async () => {
    if (!cardRef.current || saving) return;
    setSaving(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        /* sRGB approximation of oklch(0.955 0.003 80) — same neutral
           grey-beige used for --color-paper inside the card so the
           exported PNG matches what the visitor sees on screen. */
        backgroundColor: "#f0efed",
        // Filter out anything we don't want exported.
        filter: (n) => {
          if (!(n instanceof Element)) return true;
          return !n.classList.contains("no-export");
        },
      });
      const link = document.createElement("a");
      const slug = (form.name || "exhibit")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      link.download = `museum-of-notetaking--${slug || "exhibit"}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      /* swallow — user can try again */
    } finally {
      setSaving(false);
    }
  }, [form.name, saving]);

  const reset = () => {
    setForm(EMPTY);
    setDeveloped(false);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="mx-auto w-full max-w-[40rem]">
      {/* surface-lit so the card body, perforation, fields, footer all
          read as a lit museum-paper display under glass. Flat treatment:
          a single 1px hairline replaces the old drop-shadow + ember glow
          so the card reads as a clean drafting surface in both light
          and dark modes. proto-flat neutralises --shadow-card /
          --shadow-lift / --shadow-pin for every descendant. */}
      <motion.div
        className="surface-lit proto-flat relative"
        style={{
          padding: "12px",
          borderRadius: "8px",
          background: "oklch(0 0 0 / 0)",
          boxShadow: "0 0 0 1px var(--color-rule-strong)",
        }}
        animate={
          reduce
            ? {}
            : developing
              ? {
                  filter: [
                    "saturate(0) blur(0px)",
                    "saturate(0.4) blur(1.5px)",
                    "saturate(1) blur(0px)",
                  ],
                  scale: [1, 1.005, 1],
                }
              : { filter: "saturate(1) blur(0px)", scale: 1 }
        }
        transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div
          ref={cardRef}
          className="relative rounded-[3px] border border-rule bg-paper px-5 pb-5 pt-6 sm:px-7 sm:pb-7"
          style={{
            /* Override --color-paper / --color-bone-50 locally so any
               `bg-paper` or `bg-bone-50` surface inside the card resolves
               to the same neutral grey-beige the forensic prototypes
               show (their `.filed` filter desaturates the warmer
               surface-lit default). Same lightness, near-zero chroma so
               there is no yellow cast. Photo box, perforation strip,
               field underlines all keep their ink contrast because the
               ink tokens are unchanged. */
            ["--color-paper" as string]: "oklch(0.955 0.003 80)",
            ["--color-bone-50" as string]: "oklch(0.955 0.003 80)",
          }}
        >
          {/* Perforation strip on the left */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-3 left-3 hidden w-1.5 sm:block"
            style={{
              backgroundImage:
                "radial-gradient(circle at center, var(--color-rule) 1px, transparent 1.5px)",
              backgroundSize: "6px 10px",
              backgroundRepeat: "repeat-y",
            }}
          />

          {/* Header */}
          <div className="flex items-baseline justify-between border-b border-rule pb-2">
            <p className="t-typewriter text-ink-900">FOR THE RECORD</p>
            <p className="t-typewriter-sm text-ink-500">
              EXHIBIT · VISITOR · CARD No.&nbsp;{currentCardNo()}
            </p>
          </div>

          {/* Body grid */}
          <div className="mt-5 grid grid-cols-[110px_1fr] gap-x-5 gap-y-4 sm:grid-cols-[120px_1fr] sm:gap-x-6">
            <div className="col-start-1 row-span-2">
              <PhotoBox developed={developed} />
            </div>

            <Field
              label="NAME"
              value={form.name}
              onChange={onField("name")}
              placeholder=""
              autoComplete="name"
              ariaLabel="Your name"
            />

            <Field
              label="COUNTRY"
              value={form.country}
              onChange={onField("country")}
              placeholder=""
              autoComplete="country-name"
              ariaLabel="Your country"
            />

            <div className="col-span-2">
              <Field
                label="TELL ME A BORING FACT"
                value={form.story}
                onChange={onField("story")}
                multiline
                rows={2}
                ariaLabel="A short story about you"
              />
            </div>

            <div className="col-span-2">
              <Field
                label="WHAT'S YOUR INVISIBLE LUGGAGE"
                value={form.luggage}
                onChange={onField("luggage")}
                multiline
                rows={2}
                ariaLabel="Your invisible luggage"
              />
            </div>
          </div>

          {/* Footer label always present in the export */}
          <div className="mt-6 flex items-center justify-between border-t border-rule pt-3">
            <p className="t-typewriter-sm text-ink-500">
              EXHIBIT FILED · A MUSEUM OF NOTETAKING
            </p>
            <p className="t-typewriter-sm text-ink-500">
              {/* {{ REPLACE: yourdomain.com }} */}
              NUPUR.WORKS
            </p>
          </div>
        </div>
      </motion.div>

      {/* Controls — kept outside cardRef export by .no-export class */}
      <div className="no-export mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-ink-500">
          <p className="t-typewriter-sm">
            {developed
              ? "DEVELOPED · YOUR EXHIBIT IS READY"
              : "FILL IN, THEN PRESS DEVELOP"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {!developed ? (
            <DevelopButton
              onClick={develop}
              disabled={developing || allEmpty(form)}
            >
              {developing ? "Developing…" : "Develop"}
            </DevelopButton>
          ) : (
            <>
              <SaveButton onClick={save} disabled={saving}>
                {saving ? "Saving…" : "Save as PNG"}
              </SaveButton>
              <button
                type="button"
                onClick={reset}
                className="press font-mono text-[11px] uppercase tracking-[0.14em] text-ink-500 hover:text-ink-900"
              >
                Reset card
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================ helpers ============================ */

function allEmpty(f: Form) {
  return !f.name && !f.country && !f.story && !f.luggage;
}

function currentCardNo() {
  // A small thoughtful detail: the card number is today's MMDD.
  // It's stable per page load, doesn't depend on state.
  const d = new Date();
  return `${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/* ============================ field ============================ */

function Field({
  label,
  value,
  onChange,
  multiline,
  rows = 1,
  placeholder = "",
  ariaLabel,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  ariaLabel?: string;
  autoComplete?: string;
}) {
  const id = `field-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-700"
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          rows={rows}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-label={ariaLabel}
          className="font-hand italic block w-full resize-none border-0 border-b border-ink-300 bg-transparent pb-1 text-[1.2rem] leading-[1.4] text-ink-900 outline-none focus:border-cherry-700"
          style={{ caretColor: "var(--color-cherry-600)" }}
        />
      ) : (
        <input
          id={id}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-label={ariaLabel}
          autoComplete={autoComplete}
          className="font-hand italic block w-full border-0 border-b border-ink-300 bg-transparent pb-1 text-[1.3rem] leading-[1.4] text-ink-900 outline-none focus:border-cherry-700"
          style={{ caretColor: "var(--color-cherry-600)" }}
        />
      )}
    </div>
  );
}

/* ============================ photo box ============================ */

function PhotoBox({ developed }: { developed: boolean }) {
  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden border border-ink-300 bg-bone-50">
      <AnimatePresence mode="wait" initial={false}>
        {!developed ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-ink-400"
          >
            <SilhouetteSketch />
            <p className="font-mono text-[9px] uppercase tracking-[0.18em]">
              ?
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="developed"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <CherryStamp />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SilhouetteSketch() {
  return (
    <svg
      viewBox="0 0 60 80"
      className="h-3/5 w-auto text-ink-300"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
      aria-hidden
    >
      <circle cx="30" cy="22" r="11" />
      <path d="M 8 78 Q 8 50 30 50 Q 52 50 52 78" />
    </svg>
  );
}

function CherryStamp() {
  return (
    <div className="relative h-3/4 w-3/4">
      {/* Faint thumbprint behind */}
      <svg
        viewBox="0 0 100 130"
        className="absolute inset-0 h-full w-full text-ink-400 opacity-50"
        stroke="currentColor"
        strokeWidth="0.45"
        fill="none"
        aria-hidden
      >
        {Array.from({ length: 12 }).map((_, i) => {
          const r = 12 + i * 3.4;
          return (
            <ellipse
              key={i}
              cx="50"
              cy="65"
              rx={r}
              ry={r * 1.18}
              transform={`rotate(${i % 2 === 0 ? -2 : 3} 50 65)`}
            />
          );
        })}
      </svg>
      {/* Cherry on top */}
      <svg
        viewBox="0 0 60 80"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <path
          d="M 30 18 Q 36 6 46 8"
          stroke="oklch(0.32 0.05 100)"
          strokeWidth="1.3"
          fill="none"
          strokeLinecap="round"
        />
        <ellipse
          cx="30"
          cy="48"
          rx="14"
          ry="15.5"
          fill="oklch(0.5 0.21 25)"
        />
        <ellipse
          cx="26"
          cy="44"
          rx="3.5"
          ry="2"
          fill="oklch(0.85 0.05 25 / 0.6)"
        />
      </svg>
    </div>
  );
}

/* ============================ buttons ============================ */

function DevelopButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="press relative inline-flex items-center gap-2 border border-ink-900 bg-ink-900 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-bone-50 transition-colors hover:bg-ink-700 disabled:cursor-not-allowed disabled:opacity-40"
      style={{
        clipPath:
          "polygon(2% 0, 100% 0, 98% 100%, 0 100%)",
      }}
    >
      <span aria-hidden className="text-cherry-300">●</span>
      {children}
    </button>
  );
}

function SaveButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="press inline-flex items-center gap-2 border border-cherry-700 bg-cherry-100 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-cherry-700 transition-colors hover:bg-cherry-100/80 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <svg width="11" height="11" viewBox="0 0 11 11" aria-hidden>
        <path
          d="M5.5 1 L5.5 8 M2.5 5 L5.5 8 L8.5 5 M1.5 10 L9.5 10"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      {children}
    </button>
  );
}

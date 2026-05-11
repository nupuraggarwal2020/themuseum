"use client";

/* ---------------------------------------------------------------------
   Scroll Back — the bookmark-the-thing-that-just-happened prototype.

   A simulated transcript types itself out word by word. At any time you
   can press Space (or hit "Wait, what?") and the most recently completed
   sentence detaches from the running line, arcs up and to the right, and
   settles into a saved card. The motion is the showpiece.

   Audio is intentionally not used — the prototype simulates playback.
   When a real recording is wired in, hook the timer to audio.currentTime
   and replace the cadence math with sentence start/end timestamps.

   Keyboard parity: Space captures, P plays/pauses, R resets.
   --------------------------------------------------------------------- */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import {
  DEFAULT_GAP_MS,
  MS_PER_CHAR,
  sentences,
  speakers,
  type Sentence,
  type Speaker,
} from "./script";
import { Waveform } from "./Waveform";

const speakerById = new Map<string, Speaker>(speakers.map((s) => [s.id, s]));

type SavedCard = {
  id: string;
  sentence: Sentence;
  capturedAt: number;
};

type FlightCard = {
  id: string;
  sentence: Sentence;
  /** Trigger position relative to the prototype frame. */
  fromX: number;
  fromY: number;
};

type ScrollBackProps = {
  /** Optional notifier called the first time the visitor takes an action. */
  onInteract?: () => void;
};

export function ScrollBack({ onInteract }: ScrollBackProps = {}) {
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [saved, setSaved] = useState<SavedCard[]>([]);
  const [flights, setFlights] = useState<FlightCard[]>([]);
  const [pulseId, setPulseId] = useState<string | null>(null);

  const frameRef = useRef<HTMLDivElement | null>(null);
  const transcriptRef = useRef<HTMLDivElement | null>(null);
  const cardSlotRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number | null>(null);

  // ---------- timeline ----------

  const timeline = useMemo(() => buildTimeline(sentences), []);
  const fullTextLen = timeline[timeline.length - 1]?.endMs ?? 0;

  /** Find the most recently completed sentence at the current elapsed ms. */
  const mostRecentCompleted = useCallback(
    (atMs: number): Sentence | null => {
      let best: Sentence | null = null;
      for (const seg of timeline) {
        if (seg.endMs <= atMs) best = seg.sentence;
      }
      return best;
    },
    [timeline],
  );

  /** The currently visible character count for each sentence at this moment. */
  const visibleByIndex = useMemo(() => {
    return timeline.map((seg) => {
      if (elapsed <= seg.startMs) return 0;
      if (elapsed >= seg.endMs) return seg.sentence.text.length;
      const t = (elapsed - seg.startMs) / (seg.endMs - seg.startMs);
      return Math.floor(seg.sentence.text.length * t);
    });
  }, [elapsed, timeline]);

  const isFinished = elapsed >= fullTextLen;

  // ---------- animation loop ----------

  useEffect(() => {
    if (!playing) {
      lastFrameRef.current = null;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      return;
    }
    function tick(now: number) {
      if (lastFrameRef.current == null) lastFrameRef.current = now;
      const dt = now - lastFrameRef.current;
      lastFrameRef.current = now;
      setElapsed((e) => {
        const next = Math.min(fullTextLen, e + dt);
        if (next >= fullTextLen) {
          setPlaying(false);
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, fullTextLen]);

  // ---------- auto-scroll transcript ----------

  useEffect(() => {
    const el = transcriptRef.current;
    if (!el) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: reduce ? "auto" : "smooth",
    });
  }, [elapsed, reduce]);

  // ---------- capture ----------

  const capture = useCallback(() => {
    const sentence = mostRecentCompleted(elapsed);
    if (!sentence) return;
    if (saved.some((s) => s.sentence.id === sentence.id)) return;
    onInteract?.();
    // ^ tracked: onInteract is stable per Letter render

    const frameRect = frameRef.current?.getBoundingClientRect();
    const fromRect = transcriptRef.current?.getBoundingClientRect();
    if (!frameRect || !fromRect) {
      setSaved((prev) => [...prev, makeCard(sentence)]);
      return;
    }
    const id = `flight-${sentence.id}-${Date.now()}`;
    setFlights((prev) => [
      ...prev,
      {
        id,
        sentence,
        fromX:
          fromRect.left - frameRect.left + fromRect.width / 2 - 120,
        fromY: fromRect.bottom - frameRect.top - 80,
      },
    ]);
  }, [elapsed, mostRecentCompleted, saved, onInteract]);

  const finishFlight = useCallback((flightId: string, sentence: Sentence) => {
    setFlights((prev) => prev.filter((f) => f.id !== flightId));
    setSaved((prev) => {
      if (prev.some((s) => s.sentence.id === sentence.id)) return prev;
      return [...prev, makeCard(sentence)];
    });
  }, []);

  // ---------- keyboard ----------

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      // Only listen when the prototype is in view.
      const frame = frameRef.current;
      if (!frame) return;
      const rect = frame.getBoundingClientRect();
      const inView =
        rect.top < window.innerHeight * 0.85 &&
        rect.bottom > window.innerHeight * 0.15;
      if (!inView) return;

      if (e.code === "Space") {
        e.preventDefault();
        capture();
      } else if (e.code === "KeyP") {
        e.preventDefault();
        if (isFinished) reset();
        else setPlaying((p) => !p);
      } else if (e.code === "KeyR") {
        e.preventDefault();
        reset();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [capture, isFinished]);

  function reset() {
    setPlaying(false);
    setElapsed(0);
    setSaved([]);
    setFlights([]);
    setPulseId(null);
  }

  function togglePlay() {
    onInteract?.();
    if (isFinished) {
      setElapsed(0);
      setPlaying(true);
    } else {
      setPlaying((p) => !p);
    }
  }

  return (
    <div className="w-full">
      <div
        ref={frameRef}
        className="relative overflow-hidden rounded-[3px] border border-rule bg-paper"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-rule px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="t-typewriter-sm">EXHIBIT 02 / A</span>
            <h3 className="whitespace-nowrap font-serif text-[1.05rem] text-ink-900">
              Scroll Back
            </h3>
            <span className="hidden text-ink-400 lg:inline">·</span>
            <p className="hidden text-[13px] text-ink-500 lg:block">
              Bookmark the sentence you noticed four seconds late.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <PlayButton
              playing={playing}
              finished={isFinished}
              onClick={togglePlay}
            />
            <CaptureButton onClick={capture} disabled={elapsed === 0} />
            <button
              type="button"
              onClick={reset}
              className="press font-mono text-[11px] uppercase tracking-[0.14em] text-ink-500 hover:text-ink-900"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_minmax(260px,320px)]">
          {/* Live transcript */}
          <div className="relative border-b border-rule md:border-b-0 md:border-r">
            {/* Top scrubber */}
            <div className="flex items-center gap-4 border-b border-rule/60 px-5 py-3">
              <span className="font-mono text-[11px] tracking-[0.06em] text-ink-500">
                {formatMs(elapsed)} <span className="text-ink-300">/</span>{" "}
                {formatMs(fullTextLen)}
              </span>
              <div className="relative flex-1">
                <div className="absolute inset-y-1/2 h-px w-full -translate-y-1/2 bg-rule" />
                <div
                  className="absolute inset-y-1/2 h-px -translate-y-1/2 bg-cherry-600"
                  style={{
                    width: `${(elapsed / Math.max(1, fullTextLen)) * 100}%`,
                  }}
                />
                <Waveform
                  bars={64}
                  playing={playing}
                  height={28}
                  color="oklch(0.55 0.012 65)"
                />
              </div>
            </div>

            {/* Scrolling transcript */}
            <div
              ref={transcriptRef}
              className="no-scrollbar relative max-h-[460px] overflow-y-auto px-6 py-7"
              role="log"
              aria-live="polite"
              aria-label="Live transcript"
            >
              <ol className="space-y-5">
                {timeline.map((seg, i) => {
                  const visible = visibleByIndex[i];
                  if (visible <= 0 && elapsed < seg.startMs) return null;
                  const speaker = speakerById.get(seg.sentence.speakerId)!;
                  const isCaptured = saved.some(
                    (s) => s.sentence.id === seg.sentence.id,
                  );
                  return (
                    <li key={seg.sentence.id}>
                      <div className="mb-1 flex items-baseline gap-2 text-ink-500">
                        <span
                          aria-hidden
                          className="inline-block h-2 w-2 rounded-full"
                          style={{ background: speaker.color }}
                        />
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-700">
                          {speaker.name}
                        </span>
                        <span className="font-mono text-[10px] text-ink-400">
                          {seg.sentence.time}
                        </span>
                      </div>
                      <p
                        className={`font-serif text-[17px] leading-[1.55] text-ink-900 transition-opacity duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                          isCaptured ? "opacity-50" : ""
                        }`}
                      >
                        {seg.sentence.text.slice(0, visible)}
                        {visible < seg.sentence.text.length ? (
                          <Caret />
                        ) : null}
                      </p>
                    </li>
                  );
                })}
              </ol>

              {/* Hint floating near the live cursor */}
              {playing && elapsed > 1200 && saved.length === 0 ? (
                <p
                  className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] text-ink-500"
                  aria-hidden
                >
                  Press
                  <kbd className="rounded border border-rule bg-bone-50 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-ink-700">
                    Space
                  </kbd>
                  to bookmark the last sentence.
                </p>
              ) : null}
            </div>

            {/* Flight cards */}
            <AnimatePresence>
              {flights.map((flight) => (
                <FlightCardView
                  key={flight.id}
                  flight={flight}
                  targetRef={cardSlotRef}
                  frameRef={frameRef}
                  onArrive={() =>
                    finishFlight(flight.id, flight.sentence)
                  }
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Saved card stack */}
          <aside
            className="relative bg-bone-100/60 px-5 pb-6 pt-3"
            aria-label="Saved bookmarks"
          >
            <header className="flex items-baseline justify-between border-b border-rule/60 pb-3">
              <p className="t-eyebrow">Saved</p>
              <p className="t-meta">{saved.length}</p>
            </header>

            <div ref={cardSlotRef} className="mt-4 space-y-3">
              {saved.length === 0 ? (
                <EmptyStack reduce={!!reduce} />
              ) : (
                saved.map((card) => (
                  <SavedCardView
                    key={card.id}
                    card={card}
                    speaker={speakerById.get(card.sentence.speakerId)!}
                    pulsing={pulseId === card.id}
                    onClick={() => {
                      setPulseId(card.id);
                      setTimeout(() => setPulseId(null), 900);
                    }}
                  />
                ))
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- helpers ---------------------------- */

function buildTimeline(list: Sentence[]) {
  let cursor = 0;
  return list.map((s) => {
    const gap = s.gapMs ?? DEFAULT_GAP_MS;
    cursor += gap;
    const startMs = cursor;
    const endMs = cursor + s.text.length * MS_PER_CHAR;
    cursor = endMs;
    return { sentence: s, startMs, endMs };
  });
}

function formatMs(ms: number) {
  const sec = Math.floor(ms / 1000);
  return `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
}

function makeCard(sentence: Sentence): SavedCard {
  return {
    id: `card-${sentence.id}-${Date.now()}`,
    sentence,
    capturedAt: Date.now(),
  };
}

/* ----------------------------- visuals ---------------------------- */

function Caret() {
  return (
    <span
      aria-hidden
      className="ml-[1px] inline-block h-[1em] w-[2px] -mb-[0.1em] translate-y-[0.12em] bg-cherry-600 align-middle"
      style={{
        animation: "caret-blink 1s steps(2) infinite",
      }}
    />
  );
}

function PlayButton({
  playing,
  finished,
  onClick,
}: {
  playing: boolean;
  finished: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="press inline-flex items-center gap-2 rounded-sm border border-ink-900 bg-ink-900 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-bone-50 transition-colors hover:bg-ink-700"
      aria-label={
        finished ? "Replay" : playing ? "Pause playback" : "Start playback"
      }
    >
      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
        {finished ? (
          <path
            d="M2 1 V9 M5 5 L9 1 L9 9 Z"
            fill="currentColor"
            stroke="none"
          />
        ) : playing ? (
          <>
            <rect x="2" y="1" width="2" height="8" fill="currentColor" />
            <rect x="6" y="1" width="2" height="8" fill="currentColor" />
          </>
        ) : (
          <path d="M2 1 L9 5 L2 9 Z" fill="currentColor" />
        )}
      </svg>
      {finished ? "Replay" : playing ? "Pause" : "Play"}
    </button>
  );
}

function CaptureButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="press inline-flex items-center gap-2 rounded-sm border border-cherry-700 bg-cherry-100 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-cherry-700 transition-colors hover:bg-cherry-100/80 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
        <path
          d="M5 1 L5 9 M2 5 L8 5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
      Wait, what?
    </button>
  );
}

function EmptyStack({ reduce }: { reduce: boolean }) {
  return (
    <motion.p
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
      className="font-serif italic text-ink-400"
      style={{ fontSize: "0.95rem", lineHeight: 1.5 }}
    >
      Sentences you bookmark land here.
    </motion.p>
  );
}

function SavedCardView({
  card,
  speaker,
  pulsing,
  onClick,
}: {
  card: SavedCard;
  speaker: Speaker;
  pulsing: boolean;
  onClick: () => void;
}) {
  /* No entry animation here — the FlightCardView is the entry. Doubling
     it (flight + spring) made the saved card appear to re-pop right
     after it landed. Once the flight arrives, the saved card simply IS
     here, at rest. */
  return (
    <button
      type="button"
      onClick={onClick}
      className="press w-full rounded-md border border-rule bg-paper p-4 text-left text-ink-900 transition-shadow duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:[box-shadow:var(--shadow-lift)]"
      style={{ boxShadow: "var(--shadow-card)" }}
      aria-label={`Saved bookmark from ${speaker.name} at ${card.sentence.time}`}
    >
      <div className="mb-2 flex items-baseline justify-between text-ink-500">
        <div className="flex items-baseline gap-2">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: speaker.color }}
          />
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-700">
            {speaker.name}
          </span>
        </div>
        <span className="font-mono text-[10px] text-ink-400">
          {card.sentence.time}
        </span>
      </div>
      <p
        className="font-serif text-[15px] font-medium leading-[1.45] text-ink-900"
        style={{ letterSpacing: "-0.005em" }}
      >
        {card.sentence.text}
      </p>
      <div className="mt-3 flex items-center justify-between">
        <Waveform
          bars={36}
          playing={pulsing}
          height={20}
          color={speaker.color}
        />
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
          {pulsing ? "playing" : "tap to play"}
        </span>
      </div>
    </button>
  );
}

function FlightCardView({
  flight,
  targetRef,
  frameRef,
  onArrive,
}: {
  flight: FlightCard;
  targetRef: React.RefObject<HTMLDivElement | null>;
  frameRef: React.RefObject<HTMLDivElement | null>;
  onArrive: () => void;
}) {
  const reduce = useReducedMotion();
  const [target, setTarget] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const t = targetRef.current;
    const f = frameRef.current;
    if (!t || !f) {
      onArrive();
      return;
    }
    const tr = t.getBoundingClientRect();
    const fr = f.getBoundingClientRect();
    setTarget({
      x: tr.left - fr.left,
      y: tr.top - fr.top + 4,
    });
    if (reduce) {
      const id = setTimeout(onArrive, 40);
      return () => clearTimeout(id);
    }
  }, [targetRef, frameRef, onArrive, reduce]);

  if (!target) return null;

  const dx = target.x - flight.fromX;
  const dy = target.y - flight.fromY;

  /* Per Emil's framework:
     - Single transition, not a 5-keyframe arc — interruptible, GPU-eligible.
     - `transform` string (translate3d + scale) instead of motion shorthand
       props — hardware-accelerated, doesn't fall off main thread under load.
     - 280ms with strong ease-out (cubic-bezier(0.23, 1, 0.32, 1)) — entering
       elements take strong ease-out, not in-out, and UI animation stays
       under 300ms.
     - opacity goes 0.6 → 1, never invisible. The captured card is being
       promoted, not summoned from nothing.
     - Scale arrives at 1, not 0.82 — the card lands at its resting size. */
  return (
    <motion.div
      key={flight.id}
      className="pointer-events-none absolute z-30 w-[240px] rounded-md border border-rule bg-paper p-3 text-ink-900"
      style={{
        left: flight.fromX,
        top: flight.fromY,
        boxShadow: "var(--shadow-card)",
      }}
      initial={{
        opacity: 0.6,
        transform: "translate3d(0px, 8px, 0) scale(0.96)",
      }}
      animate={{
        opacity: 1,
        transform: `translate3d(${dx}px, ${dy}px, 0) scale(1)`,
      }}
      transition={{
        duration: 0.28,
        ease: [0.23, 1, 0.32, 1],
      }}
      onAnimationComplete={onArrive}
    >
      <p
        className="font-serif text-[14px] leading-[1.45]"
        style={{ letterSpacing: "-0.005em" }}
      >
        {flight.sentence.text}
      </p>
    </motion.div>
  );
}

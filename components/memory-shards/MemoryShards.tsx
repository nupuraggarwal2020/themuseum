"use client";

/* ---------------------------------------------------------------------
   Memory Shards · the centerpiece prototype.

   Two panels. Drag a phrase out of the transcript on the left and it
   peels off the page into a shard on the spatial canvas on the right.
   Drag from a card's connect handle to another card to draw a thread.
   "Suggest" highlights pre-tagged thematic clusters with a soft glow.

   Keyboard parity: Tab to focus a phrase, press Enter to shard it. Tab
   to focus a shard on the canvas, arrow keys to nudge it.

   The transcript-to-canvas drag is implemented as a portal-mounted
   floating preview. The transcript panel has overflow-y-auto, so a
   normal in-place drag would clip at the panel edge and never visibly
   reach the canvas. Pointer events on the row capture into a fixed-
   positioned preview at document.body, transform-translated by direct
   DOM writes (no React state on pointermove) so the card stays glued
   to the cursor at 60fps under load.

   {{ REPLACE: customise transcript.ts with your own real brainstorm }}
   --------------------------------------------------------------------- */

import {
  forwardRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { phrases, speakers, type Phrase, type Speaker } from "./transcript";
import type { Connection, Shard, ShardId } from "./types";

const speakerById = new Map<string, Speaker>(speakers.map((s) => [s.id, s]));

/* Shared release-flight knobs. Match the FlightCardView in Room 2
   (Scroll Back). Per Emil's framework: single transition, transform
   string, strong ease-out, under 300ms. Snappy, not draggy. */
const FLIGHT_DURATION_MS = 280;
const FLIGHT_EASE = "cubic-bezier(0.23, 1, 0.32, 1)";
const DRAG_THRESHOLD_PX = 5;
const PREVIEW_W = 240;
const SHARD_W = 240;
const SHARD_H = 140;

/* Canvas margin: the largest the front-most card (scale 1.04 while
   grabbed) can extend past its top-left position is ~5px on each
   side. 16px gives breathing room AND keeps the connect handle
   (which sits 12px past the right edge) visible. */
const CANVAS_MARGIN = 16;

/* Depth model: how far a back-most card recedes. Tuned subtle so
   8+ cards remain readable. */
const DEPTH_SCALE_MIN = 0.86;
const DEPTH_OPACITY_MIN = 0.7;
/* Cap how many "depth steps" we use even with many shards. After
   roughly this many older cards, the rest sit at the back-most plane
   together. Prevents the model from going off the rails. */
const DEPTH_DISTANCE_CAP = 6;

type MemoryShardsProps = {
  /** Optional notifier called the first time the visitor takes an action. */
  onInteract?: () => void;
};

type DragState = {
  phrase: Phrase;
  pointerId: number;
  rowEl: HTMLLIElement;
  /** Snapshot of row rect at drag start, used as snap-back fallback. */
  originRect: { left: number; top: number; width: number; height: number };
  /** Latest pointer position, in viewport coords. */
  currentX: number;
  currentY: number;
  /** Pointer offset from the preview's top-left at grab-time. */
  offsetX: number;
  offsetY: number;
};

type Landing = {
  /** Final canvas-relative position for the shard. */
  canvasX: number;
  canvasY: number;
  /** Viewport-coord top-left of the shard at landing, used as the
      transform target so the preview meets the shard exactly. */
  viewportX: number;
  viewportY: number;
};

export function MemoryShards({ onInteract }: MemoryShardsProps = {}) {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [shards, setShards] = useState<Shard[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [showClusters, setShowClusters] = useState(false);
  const [activePhraseId, setActivePhraseId] = useState<string | null>(null);
  const [pendingConnect, setPendingConnect] = useState<{
    from: ShardId;
    pos: { x: number; y: number };
  } | null>(null);
  /* Which shard (if any) is being dragged on the canvas right now.
     Used to disable the depth transition for that card so the drag
     stays glued to the cursor at 60fps. */
  const [draggingId, setDraggingId] = useState<ShardId | null>(null);
  const orderRef = useRef(0);
  /* Live shard reference for the drag handlers. We reach into this
     during pointermove so we don't have to bring shards into the
     useCallback closure (which would invalidate listeners on every
     state change). */
  const shardsRef = useRef<Shard[]>(shards);
  shardsRef.current = shards;

  /* Drag-from-transcript controller. Pointer-tracking writes transform
     directly to the preview's DOM node, never via React state, so the
     card stays glued to the cursor at 60fps under load. State changes
     happen only at start, on landing, and on snap-back. */
  const [drag, setDrag] = useState<DragState | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const phaseRef = useRef<"idle" | "pointer" | "flight">("idle");

  const shardedPhraseIds = useMemo(
    () => new Set(shards.map((s) => s.phrase.id)),
    [shards],
  );

  const computeLanding = useCallback(
    (clientX: number, clientY: number): Landing | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        return null;
      }
      const canvasX = Math.max(
        16,
        Math.min(rect.width - SHARD_W - 16, clientX - rect.left - SHARD_W / 2),
      );
      const canvasY = Math.max(
        16,
        Math.min(rect.height - SHARD_H - 16, clientY - rect.top - SHARD_H / 2),
      );
      return {
        canvasX,
        canvasY,
        viewportX: rect.left + canvasX,
        viewportY: rect.top + canvasY,
      };
    },
    [],
  );

  const commitShardAt = useCallback(
    (phrase: Phrase, canvasX: number, canvasY: number, instant: boolean) => {
      const shardId = `s-${phrase.id}` as ShardId;
      orderRef.current += 1;
      onInteract?.();
      setShards((prev) => {
        if (prev.some((s) => s.phrase.id === phrase.id)) return prev;
        return [
          ...prev,
          {
            id: shardId,
            phrase,
            x: canvasX,
            y: canvasY,
            order: orderRef.current,
            instantMount: instant,
          },
        ];
      });
    },
    [onInteract],
  );

  /* Keyboard / fallback path: drop into the next free slot in a calm
     4-column grid. Always uses the polished entry animation since the
     keyboard path has no drag preview to do the work. */
  const addShardAuto = useCallback(
    (phrase: Phrase) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const padding = 24;
      const cols = Math.max(
        1,
        Math.floor((rect.width - padding * 2) / (SHARD_W + padding)),
      );
      const idx = shards.length;
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = padding + col * (SHARD_W + padding) + (row % 2) * 24;
      const y = padding + row * (SHARD_H + padding);
      commitShardAt(phrase, x, y, false);
    },
    [shards.length, commitShardAt],
  );

  const clampToCanvas = useCallback(
    (x: number, y: number): { x: number; y: number } => {
      const canvas = canvasRef.current;
      if (!canvas) return { x, y };
      const rect = canvas.getBoundingClientRect();
      return {
        x: Math.max(
          CANVAS_MARGIN,
          Math.min(rect.width - SHARD_W - CANVAS_MARGIN, x),
        ),
        y: Math.max(
          CANVAS_MARGIN,
          Math.min(rect.height - SHARD_H - CANVAS_MARGIN, y),
        ),
      };
    },
    [],
  );

  const moveShard = useCallback(
    (id: ShardId, x: number, y: number) => {
      const c = clampToCanvas(x, y);
      setShards((prev) =>
        prev.map((s) => (s.id === id ? { ...s, x: c.x, y: c.y } : s)),
      );
    },
    [clampToCanvas],
  );

  /* Bumps a shard's `order` to the highest, which moves it to the
     front of the depth stack (largest scale, full opacity, top
     z-index). Used on every meaningful interaction with a card. */
  const promoteToFront = useCallback((id: ShardId) => {
    orderRef.current += 1;
    const newOrder = orderRef.current;
    setShards((prev) =>
      prev.map((s) => (s.id === id ? { ...s, order: newOrder } : s)),
    );
  }, []);

  /* Combined: commit a new position AND promote to front in a single
     React batch, so the released card lands at scale 1.0 in one
     smooth transition, not two. */
  const moveAndPromote = useCallback(
    (id: ShardId, x: number, y: number) => {
      const c = clampToCanvas(x, y);
      orderRef.current += 1;
      const newOrder = orderRef.current;
      setShards((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, x: c.x, y: c.y, order: newOrder } : s,
        ),
      );
    },
    [clampToCanvas],
  );

  const removeShard = useCallback((id: ShardId) => {
    setShards((prev) => prev.filter((s) => s.id !== id));
    setConnections((prev) =>
      prev.filter((c) => c.from !== id && c.to !== id),
    );
  }, []);

  const addConnection = useCallback((from: ShardId, to: ShardId) => {
    if (from === to) return;
    setConnections((prev) => {
      if (prev.some((c) => c.from === from && c.to === to)) return prev;
      if (prev.some((c) => c.from === to && c.to === from)) return prev;
      return [
        ...prev,
        {
          id: `c-${from}-${to}-${prev.length}`,
          from,
          to,
          curve: (Math.random() - 0.5) * 40,
        },
      ];
    });
  }, []);

  /* Two-step click model:
       1. Click the connect handle on card A → enters "connecting from
          A" mode (rubber-band line follows cursor).
       2. Click anywhere on card B's body → completes A→B.
       3. Click empty canvas OR press Escape → cancels.
     The previous implementation auto-cancelled on the very next
     mouseup (which was the same mouseup that started the connection),
     so connections were impossible to land. Cursor tracking happens
     here via mousemove only — cancellation is explicit. */
  useEffect(() => {
    if (!pendingConnect) return;
    function onMove(e: MouseEvent) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      setPendingConnect((prev) =>
        prev
          ? {
              ...prev,
              pos: {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
              },
            }
          : prev,
      );
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setPendingConnect(null);
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("keydown", onKey);
    };
  }, [pendingConnect]);

  const startConnect = useCallback(
    (id: ShardId, e: ReactMouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      setPendingConnect({
        from: id,
        pos: { x: e.clientX - rect.left, y: e.clientY - rect.top },
      });
    },
    [],
  );

  /* Stable refs so the per-card props (which become useCallback deps)
     don't churn every time pendingConnect changes (which is once per
     mousemove while connecting). Without this, ShardCard would
     re-render constantly during rubber-band tracking. */
  const pendingConnectRef = useRef(pendingConnect);
  pendingConnectRef.current = pendingConnect;

  const completeConnect = useCallback(
    (toId: ShardId) => {
      const pc = pendingConnectRef.current;
      if (!pc) return;
      if (pc.from === toId) {
        setPendingConnect(null);
        return;
      }
      addConnection(pc.from, toId);
      setPendingConnect(null);
      promoteToFront(toId);
    },
    [addConnection, promoteToFront],
  );

  const cancelConnect = useCallback(() => setPendingConnect(null), []);

  /* On-canvas shard drag.

     Pointer-down on a card body starts a drag using a single pointer-
     to-card offset captured at grab time (in canvas-local coords).
     We never let go of that offset, so the card never jumps when the
     pointer enters the canvas's transformed space. Pointer position
     is clamped on every move so the card cannot escape the canvas.
     During the drag we write transform directly to the DOM (no React
     state), so the card stays glued to the cursor at 60fps. The
     dragging-id flag suppresses the depth transition for that card
     so the drag is 1:1 with the cursor — the transition reattaches
     on release for a smooth land.

     Click-on-handle and click-on-card-as-completion-target both flow
     through React's synthetic onClick on the same card. Native
     browser semantics suppress click after drag movement, so a
     dragged card does not also fire its completion click. */
  const startCanvasDrag = useCallback(
    (id: ShardId, e: ReactPointerEvent<HTMLDivElement>) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      const target = e.target as HTMLElement;
      if (target.closest("[data-connect-handle='true']")) return;
      if (target.closest("button")) return;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const shard = shardsRef.current.find((s) => s.id === id);
      if (!shard) return;

      /* Cancel any in-flight connection so the rubber-band doesn't
         visually fight the moving card. */
      setPendingConnect(null);

      const node = e.currentTarget;
      try {
        node.setPointerCapture(e.pointerId);
      } catch {
        /* pointer capture can fail if the element is detached. */
      }

      const canvasRect = canvas.getBoundingClientRect();
      const offsetX = e.clientX - canvasRect.left - shard.x;
      const offsetY = e.clientY - canvasRect.top - shard.y;

      const startClientX = e.clientX;
      const startClientY = e.clientY;
      let moved = false;
      let lastX = shard.x;
      let lastY = shard.y;
      const pointerId = e.pointerId;

      setDraggingId(id);

      const onMove = (ev: PointerEvent) => {
        if (ev.pointerId !== pointerId) return;
        const dx = ev.clientX - startClientX;
        const dy = ev.clientY - startClientY;
        if (!moved && dx * dx + dy * dy > DRAG_THRESHOLD_PX * DRAG_THRESHOLD_PX) {
          moved = true;
        }
        if (!moved) return;

        const rect = canvas.getBoundingClientRect();
        const px = ev.clientX - rect.left - offsetX;
        const py = ev.clientY - rect.top - offsetY;
        const cx = Math.max(
          CANVAS_MARGIN,
          Math.min(rect.width - SHARD_W - CANVAS_MARGIN, px),
        );
        const cy = Math.max(
          CANVAS_MARGIN,
          Math.min(rect.height - SHARD_H - CANVAS_MARGIN, py),
        );
        lastX = cx;
        lastY = cy;
        /* Direct DOM writes — bypass React, stay at 60fps. The
           dragging-id flag also sets transition to 'none' via the
           card's inline style; we re-assert it here as a defensive
           measure in case React's commit and our first pointermove
           land in an unlucky order. Scale 1.04 is the lift-into-grab
           cue (replaces the framer-motion whileDrag scale we removed). */
        node.style.transition = "none";
        node.style.transform =
          `translate3d(${cx}px, ${cy}px, 0) scale(1.04)`;
      };

      const detach = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onCancel);
      };

      const onUp = (ev: PointerEvent) => {
        if (ev.pointerId !== pointerId) return;
        detach();
        setDraggingId(null);
        if (moved) {
          /* Commit final position AND promote to front in one batch.
             React re-renders with the new transform (scale=1.0 because
             promoted), the depth transition fires, and the card
             gracefully settles from scale 1.04 → 1.0 over 280ms. */
          moveAndPromote(id, lastX, lastY);
          onInteract?.();
        }
      };

      const onCancel = (ev: PointerEvent) => {
        if (ev.pointerId !== pointerId) return;
        detach();
        setDraggingId(null);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onCancel);
    },
    [moveAndPromote, onInteract],
  );

  const reset = useCallback(() => {
    setShards([]);
    setConnections([]);
    setShowClusters(false);
    orderRef.current = 0;
  }, []);

  const seed = useCallback(() => {
    onInteract?.();
    reset();
    /* A calm pre-built canvas for first-run delight + screenshot demo.
       Two columns at any width so the canvas reads as spatial. Right
       column is clamped so the card stays fully inside. */
    const canvas = canvasRef.current;
    const w = canvas?.clientWidth ?? 600;
    const h = Math.max(canvas?.clientHeight ?? 0, 560);
    const padX = 20;
    const padY = 24;
    const colA = padX;
    const colB = Math.max(colA + Math.round(SHARD_W * 0.55), w - SHARD_W - padX);
    const rowGap = Math.max(28, (h - SHARD_H * 3 - padY * 2) / 2);
    const rowH = SHARD_H + rowGap;
    const seeds: { phraseId: string; x: number; y: number }[] = [
      { phraseId: "p2", x: colA, y: padY },
      { phraseId: "p3", x: colB, y: padY + rowH * 0.22 },
      { phraseId: "p4", x: colA + 6, y: padY + rowH * 0.9 },
      { phraseId: "p9", x: colB - 8, y: padY + rowH * 1.1 },
      { phraseId: "p13", x: colA, y: padY + rowH * 1.75 },
      { phraseId: "p16", x: colB + 4, y: padY + rowH * 1.95 },
    ];
    let order = 0;
    const next: Shard[] = [];
    for (const s of seeds) {
      const ph = phrases.find((p) => p.id === s.phraseId);
      if (!ph) continue;
      order += 1;
      next.push({ id: `s-${ph.id}`, phrase: ph, x: s.x, y: s.y, order });
    }
    orderRef.current = order;
    setShards(next);
    setConnections([
      { id: "c-seed-1", from: "s-p2", to: "s-p3", curve: -22 },
      { id: "c-seed-2", from: "s-p3", to: "s-p4", curve: 18 },
      { id: "c-seed-3", from: "s-p9", to: "s-p16", curve: -14 },
    ]);
  }, [reset, onInteract]);

  /* ---- drag-from-transcript: release flight + snap-back ---- */

  const finalizeDrag = useCallback(() => {
    phaseRef.current = "idle";
    dragRef.current = null;
    setDrag(null);
  }, []);

  const playReleaseFlight = useCallback(
    (clientX: number, clientY: number, forceSnapBack: boolean) => {
      const d = dragRef.current;
      const node = previewRef.current;
      if (!d || !node) {
        finalizeDrag();
        return;
      }

      phaseRef.current = "flight";

      const landing = forceSnapBack ? null : computeLanding(clientX, clientY);

      let targetX: number;
      let targetY: number;
      let onArrive: () => void;

      if (landing) {
        targetX = landing.viewportX;
        targetY = landing.viewportY;
        onArrive = () => {
          /* The preview lands at the exact slot. Commit the real shard
             at that slot with instantMount so its own mount is invisible.
             The flight IS the entry. */
          commitShardAt(d.phrase, landing.canvasX, landing.canvasY, true);
          finalizeDrag();
        };
      } else {
        /* Snap back to the row's CURRENT rect (in case the transcript
           scrolled mid-drag), with the captured snapshot as fallback. */
        const live = d.rowEl?.getBoundingClientRect();
        targetX = live?.left ?? d.originRect.left;
        targetY = live?.top ?? d.originRect.top;
        onArrive = () => {
          finalizeDrag();
        };
      }

      if (reduce) {
        // Reduced motion: skip the visible flight, just commit/dismiss.
        onArrive();
        return;
      }

      /* Single transition, transform string, strong ease-out, matching
         the curve and duration of Scroll Back's FlightCardView. The
         release is always snappy, even if the press was deliberate. */
      node.style.transition =
        `transform ${FLIGHT_DURATION_MS}ms ${FLIGHT_EASE}, ` +
        `box-shadow ${FLIGHT_DURATION_MS}ms ${FLIGHT_EASE}`;
      node.style.boxShadow = "var(--shadow-card)";

      let arrived = false;
      const arriveOnce = () => {
        if (arrived) return;
        arrived = true;
        node.removeEventListener("transitionend", onTransitionEnd);
        onArrive();
      };
      const onTransitionEnd = (e: TransitionEvent) => {
        if (e.target !== node) return;
        if (e.propertyName !== "transform") return;
        arriveOnce();
      };
      node.addEventListener("transitionend", onTransitionEnd);
      // Safety: in case transitionend doesn't fire (page hidden, etc.).
      window.setTimeout(arriveOnce, FLIGHT_DURATION_MS + 80);

      /* Kick the transition on the next frame so the browser commits
         the new transition declaration before the transform change. */
      requestAnimationFrame(() => {
        node.style.transform =
          `translate3d(${targetX}px, ${targetY}px, 0) rotate(0deg)`;
      });
    },
    [computeLanding, commitShardAt, finalizeDrag, reduce],
  );

  const beginDrag = useCallback(
    (phrase: Phrase, e: ReactPointerEvent<HTMLLIElement>) => {
      if (reduce) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (phaseRef.current !== "idle") return;
      if (shardedPhraseIds.has(phrase.id)) return;

      const rowEl = e.currentTarget;
      const startX = e.clientX;
      const startY = e.clientY;
      const startPointerId = e.pointerId;

      let escalated = false;

      function escalate(moveEvent: PointerEvent) {
        const rect = rowEl.getBoundingClientRect();
        try {
          rowEl.setPointerCapture?.(moveEvent.pointerId);
        } catch {
          /* setPointerCapture can fail if the element is detached. */
        }
        const next: DragState = {
          phrase,
          pointerId: moveEvent.pointerId,
          rowEl,
          originRect: {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
          },
          currentX: moveEvent.clientX,
          currentY: moveEvent.clientY,
          offsetX: startX - rect.left,
          offsetY: startY - rect.top,
        };
        dragRef.current = next;
        phaseRef.current = "pointer";
        escalated = true;
        setDrag(next);
      }

      function onMove(moveEvent: PointerEvent) {
        if (moveEvent.pointerId !== startPointerId) return;
        if (!escalated) {
          const dx = moveEvent.clientX - startX;
          const dy = moveEvent.clientY - startY;
          if (dx * dx + dy * dy < DRAG_THRESHOLD_PX * DRAG_THRESHOLD_PX) {
            return;
          }
          /* We're committing to a drag. preventDefault here stops the
             browser from scrolling the transcript on touch. */
          if (moveEvent.cancelable) moveEvent.preventDefault();
          escalate(moveEvent);
          return;
        }
        if (phaseRef.current !== "pointer") return;
        const d = dragRef.current;
        if (!d) return;
        d.currentX = moveEvent.clientX;
        d.currentY = moveEvent.clientY;
        const node = previewRef.current;
        if (node) {
          /* Direct transform write, no React state, no rAF batching.
             This is the hot path; it must stay below 1ms per frame. */
          node.style.transform =
            `translate3d(${moveEvent.clientX - d.offsetX}px, ` +
            `${moveEvent.clientY - d.offsetY}px, 0) rotate(2.5deg)`;
        }
      }

      function detach() {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onCancel);
      }

      function onUp(upEvent: PointerEvent) {
        if (upEvent.pointerId !== startPointerId) return;
        detach();
        if (escalated) {
          playReleaseFlight(upEvent.clientX, upEvent.clientY, false);
        }
      }

      function onCancel(cancelEvent: PointerEvent) {
        if (cancelEvent.pointerId !== startPointerId) return;
        detach();
        if (escalated) {
          const d = dragRef.current;
          playReleaseFlight(
            d?.currentX ?? cancelEvent.clientX,
            d?.currentY ?? cancelEvent.clientY,
            true,
          );
        }
      }

      /* pointermove is non-passive so we can preventDefault once we
         cross the threshold (which stops touch from scrolling). */
      window.addEventListener("pointermove", onMove, { passive: false });
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onCancel);
    },
    [reduce, shardedPhraseIds, playReleaseFlight],
  );

  const liftedPhraseId = drag?.phrase.id ?? null;

  /* Depth map keyed by shard id. The most-recently-interacted card
     sits at depthIndex 0 (front, scale 1.0, full opacity, on top).
     Older cards recede along a linear ramp. Cap the distance so the
     7th-oldest card is at the same plane as the 8th — readability
     beats fidelity past the cap. */
  const depthMap = useMemo(() => {
    const map = new Map<
      ShardId,
      {
        depthIndex: number;
        scale: number;
        opacity: number;
      }
    >();
    if (shards.length === 0) return map;
    const sorted = [...shards].sort((a, b) => b.order - a.order);
    sorted.forEach((s, i) => {
      const di = Math.min(i / DEPTH_DISTANCE_CAP, 1);
      map.set(s.id, {
        depthIndex: di,
        scale: 1 - di * (1 - DEPTH_SCALE_MIN),
        opacity: 1 - di * (1 - DEPTH_OPACITY_MIN),
      });
    });
    return map;
  }, [shards]);

  return (
    <div className="w-full">
      <Frame
        title="Memory Shards"
        subtitle="A spatial canvas for the parts of a meeting that mattered."
        toolbar={
          <div className="flex flex-wrap items-center gap-2">
            <ToolbarButton
              onClick={() => setShowClusters((v) => !v)}
              pressed={showClusters}
              disabled={shards.length === 0}
            >
              Suggest clusters
            </ToolbarButton>
            <ToolbarButton onClick={seed}>Seed an example</ToolbarButton>
            <ToolbarButton onClick={reset} disabled={shards.length === 0}>
              Clear canvas
            </ToolbarButton>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-[minmax(280px,320px)_1fr]">
          <TranscriptPanel
            shardedIds={shardedPhraseIds}
            activePhraseId={activePhraseId}
            liftedPhraseId={liftedPhraseId}
            onActiveChange={setActivePhraseId}
            onPhraseShard={(phrase) => addShardAuto(phrase)}
            onPhrasePointerDown={beginDrag}
          />

          <ShardCanvas
            ref={canvasRef}
            shards={shards}
            connections={connections}
            showClusters={showClusters}
            pendingConnect={pendingConnect}
            depthMap={depthMap}
            draggingId={draggingId}
            onMoveShard={moveShard}
            onRemoveShard={removeShard}
            onStartConnect={startConnect}
            onCompleteConnect={completeConnect}
            onCancelConnect={cancelConnect}
            onCanvasDragStart={startCanvasDrag}
            onPromote={promoteToFront}
          />
        </div>
      </Frame>

      {drag ? <DragPreview drag={drag} previewRef={previewRef} /> : null}
    </div>
  );
}

/* ----------------------------- Frame ------------------------------- */

function Frame({
  title,
  subtitle,
  toolbar,
  children,
}: {
  title: string;
  subtitle: string;
  toolbar: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className="overflow-hidden rounded-[3px] border border-rule bg-paper"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex flex-col gap-3 border-b border-rule px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="t-typewriter-sm">EXHIBIT 03 / A</span>
          <h3 className="whitespace-nowrap font-serif text-[1.05rem] text-ink-900">
            {title}
          </h3>
          <span className="hidden text-ink-400 lg:inline">·</span>
          <p className="hidden text-[13px] text-ink-500 lg:block">{subtitle}</p>
        </div>
        {toolbar}
      </div>
      {children}
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  pressed,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  pressed?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={pressed}
      className={`press inline-flex items-center gap-1.5 rounded-sm border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] ${
        pressed
          ? "border-cherry-700 bg-cherry-100 text-cherry-700"
          : "border-rule bg-bone-50 text-ink-700 hover:border-ink-300 hover:text-ink-900"
      } disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {children}
    </button>
  );
}

/* --------------------------- Drag preview -------------------------- */

function DragPreview({
  drag,
  previewRef,
}: {
  drag: DragState;
  previewRef: React.RefObject<HTMLDivElement | null>;
}) {
  const speaker = speakerById.get(drag.phrase.speakerId)!;
  const initialLeft = drag.currentX - drag.offsetX;
  const initialTop = drag.currentY - drag.offsetY;

  /* Mounting position is set imperatively in the same paint as the
     portal append so we never flash at (0, 0). The pointermove handler
     keeps writing transform from this point on. */
  useLayoutEffect(() => {
    const node = previewRef.current;
    if (!node) return;
    node.style.willChange = "transform, box-shadow";
    node.style.transform =
      `translate3d(${initialLeft}px, ${initialTop}px, 0) rotate(2.5deg)`;
    return () => {
      node.style.willChange = "";
    };
    /* This effect must only run once on mount with the start position;
       pointermove updates transform directly and must not re-run it. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (typeof document === "undefined") return null;

  return createPortal(
    /* The portal lives at document.body, outside the FiledFrame's
       .surface-lit scope, so we re-apply that scope here so the preview
       inherits the same warm-paper variables (bg-paper, ink-*,
       --shadow-*) as the rest of the prototype. */
    <div
      className="surface-lit proto-flat pointer-events-none fixed left-0 top-0 z-[120]"
      style={{ width: PREVIEW_W, top: 0, left: 0 }}
    >
      <div
        ref={previewRef}
        aria-hidden
        className="select-none rounded-md border border-rule bg-paper px-3 py-2.5 text-[14px] leading-snug text-ink-800"
        style={{
          width: PREVIEW_W,
          /* Held-paper outline — flat mode swaps the previous
             --shadow-lift for a 1px hairline so the in-flight row
             still reads as detached without re-introducing depth. */
          boxShadow: "0 0 0 1px var(--color-rule-strong)",
        }}
      >
        <div className="flex items-baseline justify-between gap-3 pb-1">
          <div className="flex items-baseline gap-2">
            <span
              aria-hidden
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: speaker.color }}
            />
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-700">
              {speaker.name}
            </span>
          </div>
          <span className="font-mono text-[10px] tracking-[0.06em] text-ink-400">
            {drag.phrase.time}
          </span>
        </div>
        <p>{drag.phrase.text}</p>
      </div>
    </div>,
    document.body,
  );
}

/* ------------------------ Transcript panel ------------------------- */

function TranscriptPanel({
  shardedIds,
  activePhraseId,
  liftedPhraseId,
  onActiveChange,
  onPhraseShard,
  onPhrasePointerDown,
}: {
  shardedIds: Set<string>;
  activePhraseId: string | null;
  liftedPhraseId: string | null;
  onActiveChange: (id: string | null) => void;
  onPhraseShard: (phrase: Phrase) => void;
  onPhrasePointerDown: (
    phrase: Phrase,
    e: ReactPointerEvent<HTMLLIElement>,
  ) => void;
}) {
  return (
    <aside
      className="border-b border-rule md:border-b-0 md:border-r"
      aria-label="Transcript"
    >
      <header className="flex items-center justify-between px-5 py-3 text-ink-500">
        <p className="t-eyebrow">Transcript</p>
        <p className="t-meta">Voca, kickoff · 04:18</p>
      </header>
      <div className="max-h-[560px] overflow-y-auto px-5 pb-6 pt-1">
        <ol className="space-y-3">
          {phrases.map((p) => (
            <PhraseRow
              key={p.id}
              phrase={p}
              speaker={speakerById.get(p.speakerId)!}
              isSharded={shardedIds.has(p.id)}
              isActive={activePhraseId === p.id}
              isLifted={liftedPhraseId === p.id}
              onFocus={() => onActiveChange(p.id)}
              onBlur={() => onActiveChange(null)}
              onShard={() => onPhraseShard(p)}
              onPointerDown={(e) => onPhrasePointerDown(p, e)}
            />
          ))}
        </ol>
      </div>
    </aside>
  );
}

function PhraseRow({
  phrase,
  speaker,
  isSharded,
  isActive,
  isLifted,
  onFocus,
  onBlur,
  onShard,
  onPointerDown,
}: {
  phrase: Phrase;
  speaker: Speaker;
  isSharded: boolean;
  isActive: boolean;
  isLifted: boolean;
  onFocus: () => void;
  onBlur: () => void;
  onShard: () => void;
  onPointerDown: (e: ReactPointerEvent<HTMLLIElement>) => void;
}) {
  const handleKey = (e: ReactKeyboardEvent<HTMLLIElement>) => {
    if ((e.key === "Enter" || e.key === " ") && !isSharded) {
      e.preventDefault();
      onShard();
    }
  };

  return (
    <li
      tabIndex={0}
      role="button"
      aria-label={`${speaker.name} at ${phrase.time}: ${phrase.text}. Press enter to send to canvas.`}
      aria-disabled={isSharded}
      aria-grabbed={isLifted}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={handleKey}
      onPointerDown={isSharded ? undefined : onPointerDown}
      className={`group relative cursor-grab select-none rounded-md border bg-paper px-3 py-2.5 text-[14px] leading-snug text-ink-800 outline-none transition-[opacity,filter,border-color,background-color] duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] active:cursor-grabbing ${
        isSharded
          ? "cursor-not-allowed border-transparent bg-transparent text-ink-400"
          : isActive
            ? "border-cherry-300/70"
            : "border-transparent hover:border-rule"
      }`}
      style={{
        touchAction: "none",
        ...(isLifted
          ? { opacity: 0.35, filter: "saturate(0.55)" }
          : null),
      }}
    >
      <div className="flex items-baseline justify-between gap-3 pb-1">
        <div className="flex items-baseline gap-2">
          <span
            aria-hidden
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: speaker.color }}
          />
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-700">
            {speaker.name}
          </span>
        </div>
        <span className="relative inline-flex items-baseline">
          <span
            className={`font-mono text-[10px] tracking-[0.06em] text-ink-400 transition-opacity duration-200 ${
              isSharded
                ? ""
                : "group-hover:opacity-0 group-focus-visible:opacity-0"
            }`}
          >
            {phrase.time}
          </span>
          {!isSharded ? (
            <span
              aria-hidden
              className="pointer-events-none absolute right-0 top-0 text-[10px] uppercase tracking-[0.18em] text-ink-700 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
            >
              drag · ↵
            </span>
          ) : null}
        </span>
      </div>
      <p className={isSharded ? "line-through" : ""}>{phrase.text}</p>
    </li>
  );
}

/* --------------------------- Canvas -------------------------------- */

type ShardCanvasProps = {
  shards: Shard[];
  connections: Connection[];
  showClusters: boolean;
  pendingConnect: {
    from: ShardId;
    pos: { x: number; y: number };
  } | null;
  depthMap: Map<
    ShardId,
    { depthIndex: number; scale: number; opacity: number }
  >;
  draggingId: ShardId | null;
  onMoveShard: (id: ShardId, x: number, y: number) => void;
  onRemoveShard: (id: ShardId) => void;
  onStartConnect: (id: ShardId, e: ReactMouseEvent<HTMLButtonElement>) => void;
  onCompleteConnect: (id: ShardId) => void;
  onCancelConnect: () => void;
  onCanvasDragStart: (
    id: ShardId,
    e: ReactPointerEvent<HTMLDivElement>,
  ) => void;
  onPromote: (id: ShardId) => void;
};

const ShardCanvas = forwardRef<HTMLDivElement, ShardCanvasProps>(
  function ShardCanvasImpl(
    {
      shards,
      connections,
      showClusters,
      pendingConnect,
      depthMap,
      draggingId,
      onMoveShard,
      onRemoveShard,
      onStartConnect,
      onCompleteConnect,
      onCancelConnect,
      onCanvasDragStart,
      onPromote,
    },
    ref,
  ) {
    const reduce = useReducedMotion();

    /* Click on the canvas surface (not on a card or its connect
       handle) cancels any pending connection. We use the pointerdown
       phase via onMouseDown on the canvas root with a target check;
       this fires before pointer-driven drags steal focus. */
    const handleCanvasMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
      if (!pendingConnect) return;
      const t = e.target as HTMLElement;
      /* If the click landed inside a shard card or the connect
         handle, defer to the card-level handlers. */
      if (t.closest("[data-shard='true']")) return;
      if (t.closest("[data-connect-handle='true']")) return;
      onCancelConnect();
    };

    return (
      <div
        ref={ref}
        className="relative min-h-[560px] overflow-hidden"
        style={{
          /* Deep vault interior. The dot grid is gone — a soft radial
             vignette in the upper-mid plus a faint floor shadow at
             the bottom hint at depth without competing with the
             cards. The cards' own shadows do the spatial work. */
          backgroundColor: "oklch(0.13 0.01 60)",
          backgroundImage: [
            "radial-gradient(ellipse 78% 62% at 50% 38%, oklch(0.20 0.013 60 / 0.55), transparent 72%)",
            "linear-gradient(to bottom, transparent 60%, oklch(0.06 0.01 60 / 0.55) 100%)",
          ].join(", "),
          /* Flat canvas — depth cues come from the radial gradient
             alone; the previous inset vignette read as a shadow. The
             1px border on the wrapper already draws the hairline
             frame in both light and dark mode. */
          boxShadow: "none",
        }}
        role="application"
        aria-label="Spatial canvas. Shards from the transcript appear here."
        onMouseDown={handleCanvasMouseDown}
      >
        <AnimatePresence>
          {shards.length === 0 ? (
            <motion.p
              key="empty"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
              className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center font-serif italic"
              style={{
                fontSize: "1.05rem",
                color: "oklch(0.62 0.01 60)",
              }}
            >
              Drag a phrase from the left, or press Enter on a focused phrase.
            </motion.p>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {showClusters ? <ClusterGlow shards={shards} /> : null}
        </AnimatePresence>

        <ConnectionLayer
          shards={shards}
          connections={connections}
          pendingConnect={pendingConnect}
          depthMap={depthMap}
        />

        {shards.map((shard) => (
          <ShardCard
            key={shard.id}
            shard={shard}
            speaker={speakerById.get(shard.phrase.speakerId)!}
            depth={
              depthMap.get(shard.id) ?? {
                depthIndex: 0,
                scale: 1,
                opacity: 1,
              }
            }
            isDragging={draggingId === shard.id}
            isConnectTarget={
              !!pendingConnect && pendingConnect.from !== shard.id
            }
            onMove={onMoveShard}
            onRemove={onRemoveShard}
            onStartConnect={onStartConnect}
            onCompleteConnect={onCompleteConnect}
            onCanvasDragStart={onCanvasDragStart}
            onPromote={onPromote}
          />
        ))}
      </div>
    );
  },
);

/* ----------------------- Connection layer -------------------------- */

function ConnectionLayer({
  shards,
  connections,
  pendingConnect,
  depthMap,
}: {
  shards: Shard[];
  connections: Connection[];
  pendingConnect: {
    from: ShardId;
    pos: { x: number; y: number };
  } | null;
  depthMap: Map<
    ShardId,
    { depthIndex: number; scale: number; opacity: number }
  >;
}) {
  const cardW = SHARD_W;
  const cardH = SHARD_H;
  const center = (s: Shard) => ({
    x: s.x + cardW / 2,
    y: s.y + cardH / 2,
  });
  const findShard = (id: ShardId) => shards.find((s) => s.id === id);

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{
        /* Sit just under the front-most shard so connection lines feel
           anchored to the front of the stack. Z-stacking with cards
           is approximate (cards range 10..10+order); putting the SVG
           between the field of cards is impossible with one layer, so
           per-line opacity carries the depth feel instead. */
        zIndex: 9,
      }}
      aria-hidden
    >
      <defs>
        <filter id="hand-jitter" x="-2%" y="-2%" width="104%" height="104%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            seed="3"
          />
          <feDisplacementMap in="SourceGraphic" scale="1.4" />
        </filter>
      </defs>
      {connections.map((c) => {
        const a = findShard(c.from);
        const b = findShard(c.to);
        if (!a || !b) return null;
        const pa = center(a);
        const pb = center(b);
        const mx = (pa.x + pb.x) / 2;
        const my = (pa.y + pb.y) / 2 + c.curve;
        const d = `M ${pa.x} ${pa.y} Q ${mx} ${my} ${pb.x} ${pb.y}`;
        /* Lean lines into space: a connection touching a back card
           dims slightly so it reads as receding with that card. */
        const da = depthMap.get(c.from)?.depthIndex ?? 0;
        const db = depthMap.get(c.to)?.depthIndex ?? 0;
        const back = Math.max(da, db);
        const lineAlpha = (0.42 - back * 0.18).toFixed(3);
        const dotAlpha = (0.72 - back * 0.28).toFixed(3);
        return (
          <g key={c.id}>
            <path
              d={d}
              fill="none"
              stroke={`oklch(0.62 0.18 45 / ${lineAlpha})`}
              strokeWidth={1.6}
              strokeLinecap="round"
              filter="url(#hand-jitter)"
            />
            <circle
              cx={pa.x}
              cy={pa.y}
              r={2.6}
              fill={`oklch(0.62 0.18 45 / ${dotAlpha})`}
            />
            <circle
              cx={pb.x}
              cy={pb.y}
              r={2.6}
              fill={`oklch(0.62 0.18 45 / ${dotAlpha})`}
            />
          </g>
        );
      })}

      {pendingConnect ? (() => {
        const a = findShard(pendingConnect.from);
        if (!a) return null;
        const pa = center(a);
        const pb = pendingConnect.pos;
        const mx = (pa.x + pb.x) / 2;
        const my = (pa.y + pb.y) / 2;
        const d = `M ${pa.x} ${pa.y} Q ${mx} ${my} ${pb.x} ${pb.y}`;
        return (
          <path
            d={d}
            fill="none"
            stroke="oklch(0.78 0.16 50 / 0.6)"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeDasharray="4 4"
          />
        );
      })() : null}
    </svg>
  );
}

/* --------------------------- Shard card ---------------------------- */

type ShardCardProps = {
  shard: Shard;
  speaker: Speaker;
  depth: { depthIndex: number; scale: number; opacity: number };
  isDragging: boolean;
  isConnectTarget: boolean;
  onMove: (id: ShardId, x: number, y: number) => void;
  onRemove: (id: ShardId) => void;
  onStartConnect: (id: ShardId, e: ReactMouseEvent<HTMLButtonElement>) => void;
  onCompleteConnect: (id: ShardId) => void;
  onCanvasDragStart: (
    id: ShardId,
    e: ReactPointerEvent<HTMLDivElement>,
  ) => void;
  onPromote: (id: ShardId) => void;
};

const ShardCard = function ShardCardImpl({
  shard,
  speaker,
  depth,
  isDragging,
  isConnectTarget,
  onMove,
  onRemove,
  onStartConnect,
  onCompleteConnect,
  onCanvasDragStart,
  onPromote,
}: ShardCardProps) {
  const reduce = useReducedMotion();
  const instantMount = shard.instantMount === true;

  /* Mount-entry. Plain CSS via two-frame switch — first paint at
     scale(0.96) opacity 0.6, then promote to the steady-state on the
     next animation frame so the same depth-transition that promotes
     interacted cards also handles entry. instantMount skips the
     entry entirely (used when the drag-flight already animated in). */
  const [appeared, setAppeared] = useState(instantMount);
  useLayoutEffect(() => {
    if (appeared) return;
    const id = requestAnimationFrame(() => setAppeared(true));
    return () => cancelAnimationFrame(id);
  }, [appeared]);

  const handleKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 32 : 8;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      onMove(shard.id, shard.x - step, shard.y);
      onPromote(shard.id);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      onMove(shard.id, shard.x + step, shard.y);
      onPromote(shard.id);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      onMove(shard.id, shard.x, shard.y - step);
      onPromote(shard.id);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      onMove(shard.id, shard.x, shard.y + step);
      onPromote(shard.id);
    } else if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      onRemove(shard.id);
    }
  };

  const handleClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    /* The connect handle has its own onClick; ignore clicks bubbling
       up from buttons. */
    const t = e.target as HTMLElement;
    if (t.closest("button")) return;

    if (isConnectTarget) {
      onCompleteConnect(shard.id);
      return;
    }
    onPromote(shard.id);
  };

  /* Steady-state visual. During drag we override transform/transition
     via direct DOM writes from the parent's pointermove handler; on
     release we set isDragging=false and the depth transition takes
     the card to its committed position smoothly. While dragging, we
     pin opacity to 1 and shadow to lift so the lifted card always
     reads as the front-most plane regardless of its depth pre-grab. */
  const baseScale = appeared ? depth.scale : depth.scale * 0.96;
  const baseOpacity = isDragging ? 1 : appeared ? depth.opacity : 0.6;
  const transform = isDragging
    ? `translate3d(${shard.x}px, ${shard.y}px, 0) scale(1.04)`
    : `translate3d(${shard.x}px, ${shard.y}px, 0) scale(${baseScale})`;

  /* Shadow is a discrete swap (per Emil's framework: don't animate
     box-shadow). Front cards get the lifted paper-shadow, deeper
     cards the resting one. The dragged card is always lifted so
     it visually reads as front while you carry it. */
  const shadow =
    isDragging || depth.depthIndex < 0.4
      ? "var(--shadow-lift)"
      : "var(--shadow-card)";

  /* Reduced motion: keep the static depth, drop transform-based
     promotion animation. Opacity transitions still aid comprehension. */
  const transition = isDragging
    ? "none"
    : reduce
      ? "opacity 280ms ease-out"
      : "transform 280ms cubic-bezier(0.23, 1, 0.32, 1), opacity 280ms cubic-bezier(0.23, 1, 0.32, 1)";

  return (
    <div
      data-shard="true"
      role="group"
      tabIndex={0}
      onKeyDown={handleKey}
      onPointerDown={(e) => onCanvasDragStart(shard.id, e)}
      onClick={handleClick}
      aria-label={`${speaker.name} at ${shard.phrase.time}: ${shard.phrase.text}. Use arrow keys to move, backspace to remove.`}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: SHARD_W,
        transformOrigin: "center",
        transform,
        opacity: baseOpacity,
        /* Dragged card is pinned above all others so a deep card
           being dragged still reads as the lifted layer. Otherwise
           layer by recency. */
        zIndex: isDragging ? 9999 : 10 + shard.order,
        boxShadow: shadow,
        transition,
        willChange: "transform",
        touchAction: "none",
      }}
      className={`group cursor-grab rounded-[3px] border bg-paper outline-none focus-visible:outline-cherry-600 ${
        isConnectTarget
          ? "border-cherry-300 ring-2 ring-cherry-300"
          : "border-rule"
      }`}
    >
      <div className="flex items-center justify-between border-b border-rule/60 px-3 py-1.5">
        <div className="flex items-baseline gap-2">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: speaker.color }}
          />
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-700">
            {speaker.name}
          </span>
          <span className="font-mono text-[10px] text-ink-400">
            {shard.phrase.time}
          </span>
        </div>
        <Waveform
          values={shard.phrase.wave ?? [0.4, 0.6, 0.8, 0.5, 0.3]}
          color={speaker.color}
        />
      </div>
      <p
        className="px-3 py-2.5 font-serif text-[14px] leading-snug text-ink-900"
        style={{ minHeight: SHARD_H - 32 }}
      >
        {shard.phrase.text}
      </p>
      <button
        data-connect-handle="true"
        type="button"
        aria-label="Click here, then click another shard to draw a thread between them"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => onStartConnect(shard.id, e)}
        className="absolute -right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-rule bg-paper text-ink-500 opacity-0 transition-opacity duration-200 hover:text-ink-900 group-hover:opacity-100 focus-visible:opacity-100"
        style={{ boxShadow: "var(--shadow-card)", cursor: "crosshair" }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
          <path
            d="M2 5 L8 5 M5 2 L5 8"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
};

function Waveform({
  values,
  color,
}: {
  values: number[];
  color: string;
}) {
  return (
    <div className="flex items-end gap-[2px]" aria-hidden>
      {values.map((v, i) => (
        <span
          key={i}
          className="block w-[2px] rounded-sm"
          style={{
            height: `${4 + v * 12}px`,
            background: color,
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------- Cluster glows --------------------------- */

function ClusterGlow({ shards }: { shards: Shard[] }) {
  const id = useId();
  const cardW = SHARD_W;
  const cardH = SHARD_H;
  const groups = new Map<string, Shard[]>();
  for (const s of shards) {
    if (!s.phrase.cluster) continue;
    const arr = groups.get(s.phrase.cluster) ?? [];
    arr.push(s);
    groups.set(s.phrase.cluster, arr);
  }
  const blobs: { cx: number; cy: number; rx: number; ry: number; tone: string }[] =
    [];
  for (const [cluster, members] of groups) {
    if (members.length < 2) continue;
    const xs = members.map((m) => m.x);
    const ys = members.map((m) => m.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs) + cardW;
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys) + cardH;
    blobs.push({
      cx: (minX + maxX) / 2,
      cy: (minY + maxY) / 2,
      rx: (maxX - minX) / 2 + 56,
      ry: (maxY - minY) / 2 + 48,
      tone:
        cluster === "what-breaks"
          ? "oklch(0.78 0.16 50 / 0.32)"
          : cluster === "small-wins"
            ? "oklch(0.66 0.14 60 / 0.26)"
            : "oklch(0.62 0.18 42 / 0.30)",
    });
  }
  return (
    <motion.svg
      key="clusters"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    >
      <defs>
        <filter id={`blur-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
      </defs>
      <g filter={`url(#blur-${id})`}>
        {blobs.map((b, i) => (
          <ellipse
            key={i}
            cx={b.cx}
            cy={b.cy}
            rx={b.rx}
            ry={b.ry}
            fill={b.tone}
          />
        ))}
      </g>
    </motion.svg>
  );
}

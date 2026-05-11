"use client";

/* ---------------------------------------------------------------------
   Flatlay — the intake spread.
   Room 1 / Case 01's "wall of unfiled thoughts," now staged as an
   open manila case file lying flat on a black desk. Two folder halves
   spread side-by-side, tabs visible at the top, contents strewn across
   them: a paperclipped museum poster, a vertical "EVIDENCE LOG" strip
   taped to the spine, a handwritten design-notes page with route
   thumbnails, a yellow Post-it, two photo prints, and a curated subset
   of the museum's twelve typographic artifacts repositioned as papers.

   ---- Two stages, one section ----

   On lg+ the section renders <FlatlayManilaStage /> — the manila open-
   folder spread on a deep-vault backdrop. This is the new "wall of
   unfiled thoughts." Six of the twelve artifacts are shown here,
   curated to feel like the things a real designer/Nupur would have
   pulled into an active case folder (snacks, polaroid, recipe, ledger,
   torn quote, questions). The remaining six stay filed in the
   DrawerWall below.

   Below lg the section renders <FlatlayStackedStage /> — the original
   narrow-viewport wrap of all twelve artifacts on the warm lit panel.
   Untouched, so phones still get the full set.

   ---- Revert path ----

   <FlatlayCollageStageLegacy /> is preserved at the bottom of this
   file. It is the previous lg+ collage (12 typographic artifacts +
   3 reference photos on a wood/cork desk panel with binder rings).
   To revert to it: switch <FlatlayManilaStage /> back to
   <FlatlayCollageStageLegacy /> in the lg+ branch of Flatlay(), and
   wrap that branch in the warm `surface-lit` panel chrome below
   (`LegacyDeskPanel` is provided as a single helper for that swap).

   ---- Accessibility ----
   - Each kept artifact is `role="button" tabIndex={0}` (Enter / Space)
     and opens the shared DetailCard via `onOpen`.
   - Decorative pieces (poster, vertical strip, sketch page, Post-it,
     photo prints, paperclips, tape, folder chrome) are aria-hidden
     and not focusable — they are atmosphere, not navigation.
   - prefers-reduced-motion suppresses entrance translates and rotation
     interpolation; tilts and shadows are CSS transforms / box-shadow
     so they remain.

   ---- Performance ----
   - Each piece renders at most one box-shadow + one transform; no
     filter: drop-shadow on long-lived elements.
   - Folder paper grain is a single rasterised feTurbulence SVG (data:
     URI) shared across both halves.
   - `will-change: transform` is applied only to elements with
     active rotation/lift transforms.
   --------------------------------------------------------------------- */

import { motion, useMotionValue, useReducedMotion } from "motion/react";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

import type { Artifact } from "./artifacts";
import {
  IndexCardDistilled,
  IndexCardPortrait,
  NapkinSketchFlow,
  PolaroidTownHall,
  PostItAsk,
} from "./UnfiledNotes";

/* ============================================================
   Shared types
   ============================================================ */

type Spot = {
  left: string;
  top: string;
  width: string;
  aspect?: string;
  rotate: number;
  z: number;
};

type Props = {
  artifacts: Artifact[];
  renderArtifact: (artifact: Artifact) => ReactNode;
  onOpen: (artifact: Artifact) => void;
};

/* ============================================================
   Paper grain — encoded once at module scope. Shared by the two
   manila folder halves and the cream museum poster. Same baseFrequency
   as DetailCard so the grain reads consistent across rooms.
   ============================================================ */

const PAPER_NOISE_SVG =
  `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'>` +
  `<filter id='n'>` +
  `<feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch' seed='9'/>` +
  `</filter>` +
  `<rect width='100%' height='100%' filter='url(#n)'/>` +
  `</svg>`;

const PAPER_NOISE_URL = `url("data:image/svg+xml;utf8,${encodeURIComponent(PAPER_NOISE_SVG)}")`;

/* ============================================================
   Manila layout. Each kept artifact has a spot on the spread.
   Left half spans roughly 2%–48% of the stage; right half 52%–98%.
   Rotations stay inside ±5° per the "no aggressive tilts" brief.
   The six entries below are the curated subset; the other six
   artifacts (anniversary, dashboard, blister, cassette, fingerprint,
   tag) are left filed in the DrawerWall.
   ============================================================ */

const MANILA_LAYOUT: Record<string, Spot> = {
  /* LEFT HALF — recipe Keep card slots between the poster and the
     vertical EVIDENCE LOG strip with its tab peeking above the strip's
     top edge; snacks Keep card sits mid-folder over the silhouette
     card (z above silhouette so the "Snack" title is never occluded). */
  recipe: { left: "33%", top: "10%", width: "13%", aspect: "3/5",   rotate:  4.0, z: 8 },
  /* z=30 deliberately exceeds every decorative & artifact baseline in
     this stage so the Snack Keep card stays *on top of* the silhouette
     card it overlaps — otherwise the "Snack" title is hidden beneath
     the TALK/TAKEAWAY paper body. Bump together with any future
     decorative whose z passes 25. */
  snacks: { left: "23.5%", top: "43.5%", width: "14%", aspect: "3/3.6", rotate:  2.0, z: 30 },

  /* RIGHT HALF — performance review Keep card at the upper-left of
     the right folder, ledger Keep card below the routes page, torn
     quote across the lower-right quadrant, Day 1 questions card
     peeking the bottom-right edge. */
  polaroid:  { left: "53%", top: "17%", width: "12%", aspect: "3/5.4", rotate: -4.0, z: 10 },
  ledger:    { left: "53%", top: "62%", width: "12%", aspect: "3/4.8", rotate: -3.0, z: 13 },
  torn:      { left: "58%", top: "74%", width: "29%", aspect: "16/9",  rotate:  2.0, z: 15 },
  questions: { left: "86.5%", top: "76.5%", width: "13%", aspect: "3/3.6", rotate: -4.0, z: 12 },
};

/* ============================================================
   Reference photo prints. Two prints stay in the manila spread —
   the personal-Keep printout (left half, near the poster) and the
   Canva-easel polaroid (left half, lower edge). The dashboard
   printout from the legacy collage is dropped here; its 16:10 frame
   does not read as "paper in a folder."
   ============================================================ */

type PhotoProp = {
  id: string;
  src: string;
  alt: string;
  spot: Spot;
  /** Visual treatment. */
  kind: "print" | "polaroid";
};

const MANILA_PHOTOS: PhotoProp[] = [
  {
    id: "ref-keep-personal",
    src: "/references/ref-keep-personal.jpg",
    alt: "",
    kind: "print",
    spot: { left: "3%", top: "55%", width: "20%", aspect: "4/3", rotate: -5.2, z: 7 },
  },
  {
    id: "ref-canva-easel",
    src: "/references/ref-canva-easel-driver.jpg",
    alt: "",
    kind: "polaroid",
    spot: { left: "3%", top: "12%", width: "10%", aspect: "3/4.2", rotate: -4.4, z: 6 },
  },
];

/* ============================================================
   Decorative pieces strewn across the manila spread.
   Four "anchored" papers (museum poster, vertical strip,
   design-notes page, post-it) plus six curated unfiled thoughts
   pulled from UnfiledNotes. All ten are draggable in the manila
   stage; rotations stay inside ±8° per the "no aggressive tilts"
   brief.

   Previously we staged twelve unfiled notes on top of the four
   anchors. The spread read as cluttered: the bottom-edge
   `decisionReceipt` flowed off the stage on lg+, the right-edge
   `moodScrap` / `carbonCopyMemo` got cropped, `tapeAnnotationTodo`
   sat above the folder tabs, and `transcriptHighlight` /
   `wireframeRoute04` largely duplicated copy already present on
   the design-notes page. Trimming to six curated notes gives every
   remaining piece room to breathe and keeps the spread inside the
   stage on every viewport.
   ============================================================ */

type DecorativeSpec = {
  id: string;
  Component: () => ReactNode;
  xPct: number;
  yPct: number;
  widthPct: number;
  rotate: number;
  z: number;
};

/* Default-state collage — these coordinates were authored visually
   by dragging pieces into place on the live stage and then captured
   as the canonical opening composition. Treat this map as the
   "frozen first-pass" — change values only when you want to retune
   the default; the runtime drag handlers continue to override on a
   per-piece basis at interact time. */
const MANILA_DECORATIVE: DecorativeSpec[] = [
  /* Anchored — the four big shapes that establish the spread.
     Coordinates measured from the user-authored collage screenshot:
     museum poster anchors the upper-left, vertical strip taped to the
     left folder's right edge, design-notes page filling the upper
     half of the right folder, post-it pinned over the right folder's
     top tab. */
  { id: "museumPoster",       Component: MuseumPoster,        xPct:  3.5, yPct:  4, widthPct: 23, rotate: -2.0, z: 11 },
  { id: "verticalStrip",      Component: VerticalStrip,       xPct: 43,   yPct: 19, widthPct:  4, rotate:  1.0, z: 16 },
  { id: "designNotesPage",    Component: DesignNotesPage,     xPct: 65,   yPct: 13, widthPct: 34, rotate:  1.4, z: 11 },
  { id: "postIt",             Component: PostIt,              xPct: 80.5, yPct:  1, widthPct: 14, rotate:  6.0, z: 22 },
  /* Curated unfiled notes — sized and placed to match the user-authored
     collage. The silhouette card sits *under* the snacks Keep card so
     the Keep card's title stays visible — see MANILA_LAYOUT.snacks for
     the matched z. */
  { id: "indexCardPortrait",  Component: IndexCardPortrait,   xPct: 24.5, yPct: 40, widthPct: 12, rotate: -3.0, z: 15 },
  { id: "postItAsk",          Component: PostItAsk,           xPct: 26,   yPct: 72.5, widthPct: 13, rotate: -5.0, z: 18 },
  { id: "polaroidTownHall",   Component: PolaroidTownHall,    xPct:  3.5, yPct: 49, widthPct: 13, rotate: -3.0, z: 17 },
  { id: "napkinSketchFlow",   Component: NapkinSketchFlow,    xPct:  1,   yPct: 74, widthPct: 20, rotate:  2.0, z: 13 },
  { id: "indexCardDistilled", Component: IndexCardDistilled,  xPct: 75.5, yPct: 56, widthPct: 24, rotate:  2.5, z: 14 },
];

/* ============================================================
   Section root.
   The lg+ branch is a black-vault stage holding the manila spread.
   The <lg branch keeps the original warm-bone panel + stacked artifacts
   (decoupled, so the legacy lg+ collage can be reinstated by swapping
   FlatlayManilaStage → FlatlayCollageStageLegacy and wrapping it in
   <LegacyDeskPanel>).
   ============================================================ */

/* `artifacts` / `renderArtifact` / `onOpen` are no longer consumed by
   the lg+ path (the new <FlatlayPhotoCollage /> is a static photographic
   spread) or the <lg fallback. They are kept on the props type so the
   legacy <FlatlayManilaStage /> revert path keeps working without a
   section-level signature change. To switch back to the typographic
   manila stage, replace <FlatlayPhotoCollage /> below with
   <FlatlayManilaStage artifacts={artifacts} renderArtifact={renderArtifact} onOpen={onOpen} />
   and remove the <FlatlayPhotoCollageFallback /> branch. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Flatlay({ artifacts, renderArtifact, onOpen }: Props) {
  return (
    <section
      aria-label="Open case file · unfiled thoughts spread across the desk"
      className="relative mx-auto w-full max-w-[80rem] px-4 sm:px-10"
    >
      {/* DESKTOP — photographic collage on a cream paper backdrop.
          The cream wash replaces the previous vault-black backdrop so the
          manila folder image's natural drop-shadow can breathe without a
          dark halo around it. */}
      <div className="hidden lg:block">
        <FlatlayPhotoCollage />
      </div>

      {/* SMALL VIEWPORTS — single static fallback image of the same
          collage. The collage is photographic enough that the cleanest
          mobile/tablet treatment is to ship the rendered image rather
          than re-pack the 13 layered PNGs into a narrow column. The
          stacked artifact wall + LegacyDeskPanel is preserved at the
          bottom of this file (FlatlayStackedStage / LegacyDeskPanel)
          and can be reinstated here if a more interactive small-screen
          experience is needed later. */}
      <div className="lg:hidden">
        <FlatlayPhotoCollageFallback />
      </div>

      {/* Editorial pivot — closes the spread, opens the wall. */}
      <h3 className="t-headline mx-auto mt-20 max-w-[58ch] text-balance px-6 text-center text-ink-on-dark sm:mt-24">
        After Granola: neatly <em className="italic">filed</em>,
        collected, and answerable.
      </h3>
      <p className="t-body mx-auto mt-6 max-w-[58ch] px-6 text-ink-on-dark/85 sm:mt-7">
        Granola is my new filing system. I can be fully present, while
        being assured that all the important stuff is filed and easy
        to query. Granola sits quietly through the meeting and lets
        the noticing happen after while I can enjoy just being
        present.
      </p>

      {/* BELOW transition strip */}
      <p className="mt-12 px-1 text-center font-mono text-[14px] font-bold uppercase tracking-[0.22em] text-ink-on-dark sm:mt-14 sm:text-[16px]">
        ↓ FILED INTO THE DRAWERS BELOW
      </p>
      <p className="mt-2 px-1 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500 sm:text-[12px]">
        Click any open drawer to inspect what&rsquo;s inside
      </p>
    </section>
  );
}

/* ============================================================
   FlatlayPhotoCollage — the active lg+ composition.

   A photographic, scrapbook-style collage authored from 13 source
   PNGs in /public/collage/. The manila folder image (collage/7.png)
   is the base; 12 other pieces (red folder, Mac Finder, design-jam
   sticky, grocery receipt, sample-sale yellow, Relevance tab, push
   pin, color swatches, "NOT DECORATION, DIRECTION." tape, NOISE
   REDUCTION index card, January calendar with binder clip) are
   absolutely positioned on top to match the user-authored reference
   composition saved at /collage/fallback.jpg.

   ---- Background ----
   The old lg+ stage rendered on a deep vault-black backdrop. The new
   collage instead sits on a warm cream paper wash (`bg-collage`)
   so the photographic manila folder image's natural drop-shadow
   reads on paper, not on a dark halo. The rest of the page (heading
   "After Granola…" and the BELOW transition strip) still sits on
   the vault — only the collage rectangle is light.

   ---- Coordinates ----
   Every piece is positioned as percentages of the cream stage
   (left/top of the unrotated bounding box, width as % of stage
   width, rotate in degrees, z for stacking). Coordinates were
   measured against the reference collage screenshot which was a
   1024 × 583 image (~1.756 : 1 aspect ratio). The stage container
   below preserves that aspect ratio at every viewport so the layout
   doesn't reflow.

   ---- Responsive ----
   This component renders only on `lg+`. Below `lg`, <Flatlay /> swaps
   in <FlatlayPhotoCollageFallback /> which is a single <img> of the
   pre-composited reference at /collage/fallback.jpg.

   ---- Revert path ----
   The previous typographic spread (<FlatlayManilaStage />) is
   preserved below in this file. To revert, swap <FlatlayPhotoCollage />
   for <FlatlayManilaStage … /> in <Flatlay />.
   ============================================================ */

type CollagePiece = {
  id: string;
  src: string;
  alt: string;
  /** % from the left edge of the stage to the piece's unrotated bbox. */
  leftPct: number;
  /** % from the top edge of the stage to the piece's unrotated bbox. */
  topPct: number;
  /** % of stage width. Height resolves from each PNG's intrinsic ratio. */
  widthPct: number;
  rotate: number;
  z: number;
};

const COLLAGE_PIECES: CollagePiece[] = [
  /* LEFT HALF
     -------------------------------------------------------------
     red folder (16) — the chunky red file card sits left-of-centre
     in the left manila half, rotated slightly counter-clockwise.
     It establishes the left "stack" the rest of the left-side
     pieces clip into. */
  { id: "redFolder",   src: "/collage/16.png", alt: "Red file folder",
    leftPct: 2.71, topPct: 4.69, widthPct: 22, rotate: -5, z: 3 },

  /* Mac Finder screenshot (18) — peeks out from behind the red
     folder's right edge so the photo-grid is partly hidden. Z
     deliberately below the red folder so it reads as filed
     behind it. */
  { id: "macFinder",   src: "/collage/18.png", alt: "macOS Finder window of recent photos",
    leftPct: 22.83, topPct: 6.49, widthPct: 22, rotate: -2, z: 2 },

  /* "NOT DECORATION, DIRECTION." crumpled tape (9) — banner
     across the top-left corner, just above the red folder. The
     source PNG already includes its torn paper grain + drop
     shadow. */
  { id: "directionTape", src: "/collage/9.png", alt: "Strip of tape reading: not decoration, direction",
    leftPct: 43.51, topPct: 58.48, widthPct: 26.33, rotate: -3, z: 7 },

  /* Color swatch stack (17) — five tonal dots stacked vertically
     on the left margin, tucked under the tape and over the red
     folder's left edge. Size bumped from the first pass so the
     swatches actually read at small viewports (the source PNG has
     a lot of empty canvas around the dots). */
  { id: "swatches",    src: "/collage/17.png", alt: "Color swatch stack",
    leftPct: 5.33, topPct: 12.93, widthPct: 3.14, rotate:  0, z: 6 },

  /* "design jam time — Eco design" taped sticky (8) — sits in
     the mid-left, slightly below the red folder's lower edge. */
  { id: "designJam",   src: "/collage/8.png",  alt: "Sticky note: design jam time — Eco design",
    leftPct: 7.69, topPct: 34.68, widthPct: 19, rotate: -2, z: 5 },

  /* NOISE REDUCTION lined index card (15) — handwritten music
     tracklist anchoring the bottom-left of the spread. Pulled
     up a few percent from the first pass so the bottom of the
     card body fits inside the cream stage instead of being
     clipped at the corner. */
  { id: "tracklist",   src: "/collage/15.png", alt: "Index card with handwritten music tracklist",
    leftPct: 4.07, topPct: 60.12, widthPct: 27, rotate: -3, z: 5 },

  /* CENTRE / SPINE
     -------------------------------------------------------------
     Grocery cash receipt (10) — a long vertical receipt spanning
     from mid-top almost to the bottom, sitting partly over the
     fold between the two folder halves. Width nudged up so the
     "Green Chillies / 6.50" detail rows are legible. */
  { id: "groceryReceipt", src: "/collage/10.png", alt: "Grocery cash receipt",
    leftPct: 32.72, topPct: 27.29, widthPct: 15, rotate:  0, z: 5 },

  /* RIGHT HALF
     -------------------------------------------------------------
     Relevance folder tab (13) — blue card with the three "why /
     what / who" questions, slipped behind the right folder tab
     at the top of the right half. */
  { id: "relevance",   src: "/collage/13.png", alt: "Blue folder tab labelled Relevance with three questions",
    leftPct: 49.67, topPct: 3.54, widthPct: 19, rotate: -2, z: 4 },

  /* Push pin (14) — silver thumbtack pressed into the top edge of
     the Relevance tab. */
  { id: "pushPin",     src: "/collage/14.png", alt: "Silver push pin",
    leftPct: 41, topPct: 0, widthPct: 6, rotate: 0, z: 8 },

  /* SAMPLE SALE yellow note (11) — small yellow form on the
     upper-right of the right folder, slightly tilted. */
  { id: "sampleSale",  src: "/collage/11.png", alt: "Yellow Sample Sale note",
    leftPct: 72.77, topPct: 1.21, widthPct: 17, rotate:  3, z: 6 },

  /* January calendar with binder clip (19) — the largest single
     piece on the spread, bottom-right. Carries its own binder
     clip rendered into the PNG at the top edge. Width reduced
     from the first pass so the "28 29 30 31 / Always too soon to
     Quit" footer row stays inside the cream stage instead of
     being clipped at the bottom. */
  { id: "calendar",    src: "/collage/19.png", alt: "January calendar clipped with a binder clip",
    leftPct: 58.79, topPct: 18.58, widthPct: 26, rotate:  0, z: 5 },
];

/* ============================================================
   Editable collage — persistence + bounds.

   The collage is a live, editable composition. Every overlay
   piece can be dragged and resized; the user's arrangement is
   persisted to localStorage so it survives page reloads. The
   small EXPORT LAYOUT control in the bottom-left writes the
   current layout to the clipboard as JSON for baking back into
   COLLAGE_PIECES as the new default.

   - Storage key is versioned (`COLLAGE_STORAGE_KEY`); bumping
     the version invalidates any saved layout from an older
     piece set without throwing.
   - Hydration runs only client-side in a `useEffect` to avoid
     SSR/CSR mismatch — the first paint uses COLLAGE_PIECES
     defaults, then snaps to stored values once mounted.
   - Resize is min 3% / max 60% of the container's width so a
     piece can't collapse to nothing or eat the whole stage.
   ============================================================ */

const COLLAGE_STORAGE_KEY = "museum-collage-layout-v2";
const COLLAGE_MIN_WIDTH_PCT = 3;
const COLLAGE_MAX_WIDTH_PCT = 60;

type StoredCollagePiece = {
  id: string;
  leftPct: number;
  topPct: number;
  widthPct: number;
  rotate: number;
};

function roundPct(n: number): number {
  return Math.round(n * 100) / 100;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function FlatlayPhotoCollage() {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pieces, setPieces] = useState<CollagePiece[]>(COLLAGE_PIECES);

  /* Hydrate from localStorage on mount. Reconcile stored ids
     against the current COLLAGE_PIECES set so adding/removing a
     piece in code doesn't break older saved layouts. One-shot
     setState inside an effect is the standard hydration pattern
     (same as <IntakeCard />), so the lint rule is locally muted. */
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(COLLAGE_STORAGE_KEY);
      if (!raw) return;
      const stored = JSON.parse(raw) as StoredCollagePiece[];
      if (!Array.isArray(stored)) return;
      setPieces((prev) =>
        prev.map((p) => {
          const match = stored.find((s) => s.id === p.id);
          if (!match) return p;
          return {
            ...p,
            leftPct:
              typeof match.leftPct === "number" ? match.leftPct : p.leftPct,
            topPct:
              typeof match.topPct === "number" ? match.topPct : p.topPct,
            widthPct:
              typeof match.widthPct === "number"
                ? clamp(match.widthPct, COLLAGE_MIN_WIDTH_PCT, COLLAGE_MAX_WIDTH_PCT)
                : p.widthPct,
            rotate:
              typeof match.rotate === "number" ? match.rotate : p.rotate,
          };
        }),
      );
    } catch {
      /* localStorage may be unavailable (privacy mode, etc.); fall back to defaults */
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const persist = useCallback((next: CollagePiece[]) => {
    try {
      const payload: StoredCollagePiece[] = next.map((p) => ({
        id: p.id,
        leftPct: roundPct(p.leftPct),
        topPct: roundPct(p.topPct),
        widthPct: roundPct(p.widthPct),
        rotate: roundPct(p.rotate),
      }));
      window.localStorage.setItem(COLLAGE_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* storage quota / blocked — silent */
    }
  }, []);

  const commitPiece = useCallback(
    (id: string, updates: Partial<CollagePiece>) => {
      setPieces((prev) => {
        const next = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const handleReset = useCallback(() => {
    try {
      window.localStorage.removeItem(COLLAGE_STORAGE_KEY);
    } catch {
      /* noop */
    }
    setPieces(COLLAGE_PIECES);
  }, []);

  return (
    /* Transparent stage. aspectRatio matches the reference collage
       (1024 × 583) so the percentage-based piece coordinates
       resolve identically at every viewport width. No background
       wash — the collage floats on whatever surface the section
       provides, so the page bg shows through in both light and
       dark mode. */
    <div
      ref={containerRef}
      className="relative mx-auto w-full overflow-hidden"
      style={{
        aspectRatio: "1024 / 583",
        background: "transparent",
      }}
    >
      {/* Base manila folder image. object-contain keeps the folder's
          intrinsic aspect (the source PNG has a slight margin around
          the folder + a soft drop shadow built in). The base is the
          stage — not draggable, not pointer-interactive. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/collage/7.png"
        alt=""
        aria-hidden
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain"
        style={{ zIndex: 1 }}
      />

      {/* Overlay pieces — each draggable + resizable. Rendered in a
          stable order; per-piece z bumps to 999 only during its own
          interaction so it never slips behind a neighbour mid-drag. */}
      {pieces.map((piece, i) => (
        <EditableCollagePiece
          key={piece.id}
          piece={piece}
          index={i}
          containerRef={containerRef}
          onCommit={commitPiece}
          reduce={!!reduce}
        />
      ))}

      {/* Layout controls — unobtrusive, bottom-left. */}
      <CollageControls pieces={pieces} onReset={handleReset} />
    </div>
  );
}

/* ============================================================
   EditableCollagePiece — one overlay piece.

   Two-layer node tree, intentionally:

     OUTER  motion.div  ← drag wrapper. Owns x/y motion values
                          ONLY. No rotate, no whileHover, no
                          whileInView. Pure translate. This
                          guarantees framer's drag axes stay in
                          screen space (no rotation drift) and
                          that nothing else writes to the same
                          motion values mid-drag.
     INNER  motion.div  ← visual wrapper. Owns rotate, the
                          entrance animation, and the hover sway.
                          Sized 100%/auto so the OUTER's auto
                          height tracks the inner / image's
                          intrinsic ratio.

   Why split? The previous single-node implementation put drag
   (x/y motion values) on the SAME node as `rotate: piece.rotate`,
   `whileInView={{ y: 0, rotate: ... }}`, and
   `whileHover={{ y: -2, rotate: [...] }}`. Three different
   sources were animating the `y` motion value the drag system
   was trying to control, and the dragged node's own rotation
   tilted the drag axes — together this caused the "drag feels
   broken / drifts / snaps" symptom the user reported.

   Resize uses native pointer capture on the handle button so
   the gesture survives the cursor leaving the 14px grip. The
   delta is taken in screen-space x only — predictable, no
   rotation math to get sign-flipped. Width clamps to
   [3%, 60%] only at commit time so the live update is jitter-
   free; the visual width follows the cursor 1:1 during the
   gesture and is snapped to the clamp at release.

   Hover affordance (inner only):
   - Idle: cursor: grab; subtle continuous ±0.6° rotational
     sway (framer keyframe loop) so the piece reads as movable.
   - Dragging: cursor: grabbing; sway suppressed; z lifted to 999.
   - Reduced motion: sway dropped, static 2px lift only.
   ============================================================ */

type EditableCollagePieceProps = {
  piece: CollagePiece;
  index: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onCommit: (id: string, updates: Partial<CollagePiece>) => void;
  reduce: boolean;
};

function EditableCollagePiece({
  piece,
  index,
  containerRef,
  onCommit,
  reduce,
}: EditableCollagePieceProps) {
  /* x/y are the live drag offset (in px) layered on top of the
     committed left%/top%. We reset both to 0 after drag-end and
     bake the new offset into left%/top% via onCommit. These are
     the OUTER node's only animated channels — nothing else
     writes to them. */
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  /* `interacting` covers both drag and resize. While true:
     - z-index is lifted above all other pieces
     - hover sway is suppressed (the inner's whileHover is unset)
     - cursor is grab/grabbing/resize as appropriate */
  const [interacting, setInteracting] = useState(false);

  /* Live width override during a resize gesture. While non-null
     it wins over piece.widthPct so the piece visibly tracks the
     cursor 1:1. Clamping is applied only at commit. */
  const [livePct, setLivePct] = useState<number | null>(null);

  const handleDragStart = useCallback(() => {
    setInteracting(true);
  }, []);

  const handleDragEnd = useCallback(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) {
      x.set(0);
      y.set(0);
      setInteracting(false);
      return;
    }
    const dx = x.get();
    const dy = y.get();
    const newLeftPct = piece.leftPct + (dx / rect.width) * 100;
    const newTopPct = piece.topPct + (dy / rect.height) * 100;
    /* Reset the live offset to 0 in the same tick as the commit
       so when React re-renders with the new left%/top% the
       motion-value translate doesn't double-apply and visibly
       jump. */
    x.set(0);
    y.set(0);
    setInteracting(false);
    onCommit(piece.id, { leftPct: newLeftPct, topPct: newTopPct });
  }, [containerRef, onCommit, piece.id, piece.leftPct, piece.topPct, x, y]);

  /* ---- resize ----
     Pointer capture is taken on the handle element itself so
     the gesture survives the cursor leaving the 14px grip.
     stopPropagation + preventDefault stop framer-motion's drag
     from also picking up the same pointerdown. */
  const handleResizeDown = useCallback(
    (e: ReactPointerEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const startClientX = e.clientX;
      const startWidthPct = piece.widthPct;
      const handleEl = e.currentTarget;

      try {
        handleEl.setPointerCapture(e.pointerId);
      } catch {
        /* setPointerCapture can throw on stale pointer ids */
      }

      setInteracting(true);

      /* `current` mirrors the React state without waiting for a
         re-render so handleUp can read the final value
         synchronously and decide whether to commit. */
      let current = startWidthPct;

      const handleMove = (ev: PointerEvent) => {
        if (ev.pointerId !== e.pointerId) return;
        const dxScreen = ev.clientX - startClientX;
        const deltaPct = (dxScreen / rect.width) * 100;
        current = startWidthPct + deltaPct;
        setLivePct(current);
      };

      const handleUp = (ev: PointerEvent) => {
        if (ev.pointerId !== e.pointerId) return;
        handleEl.removeEventListener("pointermove", handleMove);
        handleEl.removeEventListener("pointerup", handleUp);
        handleEl.removeEventListener("pointercancel", handleUp);
        try {
          handleEl.releasePointerCapture(e.pointerId);
        } catch {
          /* pointer capture may already be released */
        }
        setInteracting(false);
        setLivePct(null);
        const final = clamp(
          current,
          COLLAGE_MIN_WIDTH_PCT,
          COLLAGE_MAX_WIDTH_PCT,
        );
        if (final !== startWidthPct) {
          onCommit(piece.id, { widthPct: final });
        }
      };

      handleEl.addEventListener("pointermove", handleMove);
      handleEl.addEventListener("pointerup", handleUp);
      handleEl.addEventListener("pointercancel", handleUp);
    },
    [containerRef, onCommit, piece.id, piece.widthPct],
  );

  const displayWidthPct = livePct ?? piece.widthPct;

  /* Hover oscillation — INNER node only, only when not currently
     interacting and reduced-motion is not requested. Resting
     rotation is the committed `piece.rotate`; the keyframes sweep
     ±0.6° around it. Putting this on the inner means it can
     never touch the outer's drag motion values. */
  const innerHoverState =
    interacting
      ? undefined
      : reduce
        ? { y: -2 }
        : {
            y: -2,
            rotate: [
              piece.rotate - 0.6,
              piece.rotate + 0.6,
              piece.rotate - 0.6,
            ],
            transition: {
              rotate: {
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut" as const,
              },
              y: { duration: 0.25 },
            },
          };

  return (
    <motion.div
      drag
      /* No dragConstraints — pieces are allowed to travel anywhere,
         including off the cream stage. The container has
         `overflow: hidden`, so any overhang is clipped at the edge
         the way a real desk object would slip off the page. The
         stored leftPct/topPct may go outside [0, 100] and round-
         trip through localStorage unchanged. */
      dragMomentum={false}
      dragElastic={0}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{
        position: "absolute",
        left: `${piece.leftPct}%`,
        top: `${piece.topPct}%`,
        width: `${displayWidthPct}%`,
        height: "auto",
        zIndex: interacting ? 999 : piece.z,
        /* Outer is a pure translate — no rotate here. */
        x,
        y,
        cursor: interacting ? "grabbing" : "grab",
        userSelect: "none",
        touchAction: "none",
        WebkitUserSelect: "none",
      }}
    >
      <motion.div
        initial={
          reduce
            ? false
            : { opacity: 0, y: 10, rotate: piece.rotate * 0.4 }
        }
        whileInView={{ opacity: 1, y: 0, rotate: piece.rotate }}
        viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
        whileHover={innerHoverState}
        transition={{
          duration: 0.7,
          ease: [0.2, 0.8, 0.2, 1],
          delay: Math.min(0.05 * index, 0.4),
        }}
        style={{
          position: "relative",
          width: "100%",
          height: "auto",
          rotate: piece.rotate,
          transformOrigin: "center center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={piece.src}
          alt={piece.alt}
          draggable={false}
          className="block h-auto w-full select-none"
          style={{ pointerEvents: "none" }}
        />
        <CollageResizeHandle onPointerDown={handleResizeDown} />
      </motion.div>
    </motion.div>
  );
}

/* ============================================================
   CollageResizeHandle — bottom-right corner grip.

   Hairline 14px square with a small chevron mark. Opacity is
   0.35 at rest so it reads as "barely there," lifts to 1 on
   hover/focus or when the parent piece is hovered. Cursor is
   `nwse-resize` so the OS pointer signals what the grip does.
   ============================================================ */

function CollageResizeHandle({
  onPointerDown,
}: {
  onPointerDown: (e: ReactPointerEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      type="button"
      aria-label="Resize piece"
      tabIndex={-1}
      onPointerDown={onPointerDown}
      onClick={(e) => e.preventDefault()}
      className="collage-resize-handle"
      style={{
        position: "absolute",
        right: "-1px",
        bottom: "-1px",
        width: 14,
        height: 14,
        padding: 0,
        margin: 0,
        background: "oklch(0.97 0.012 80 / 0.85)",
        border: "1px solid var(--color-rule-strong)",
        borderRadius: 1,
        color: "var(--color-ink-on-light)",
        opacity: 0.35,
        cursor: "nwse-resize",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 160ms ease, background 160ms ease",
        touchAction: "none",
      }}
    >
      <svg width="8" height="8" viewBox="0 0 10 10" aria-hidden>
        <path
          d="M2 8 L8 2 M5 8 L8 5"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <style>{`
        /* The handle ramps to full opacity on its own hover/focus and
           on the parent piece's hover/focus so it's discoverable
           without flagging itself as the primary interaction. */
        .collage-resize-handle:hover,
        .collage-resize-handle:focus-visible,
        *:hover > .collage-resize-handle {
          opacity: 1 !important;
        }
      `}</style>
    </button>
  );
}

/* ============================================================
   CollageControls — EXPORT LAYOUT + RESET cluster.

   - EXPORT LAYOUT writes the current layout to the clipboard as
     JSON in the same shape as `COLLAGE_PIECES`. Paste it back
     into this file (as the new `COLLAGE_PIECES`) to bake an
     authored composition as the new default.
   - RESET clears the localStorage key and reverts to the
     in-code defaults. It asks for a second-click confirmation
     so a stray click doesn't wipe a layout in progress.
   - Both controls are unobtrusive at rest (low opacity, hairline
     border) and brighten on hover.
   ============================================================ */

function CollageControls({
  pieces,
  onReset,
}: {
  pieces: CollagePiece[];
  onReset: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const confirmTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (confirmTimer.current) clearTimeout(confirmTimer.current);
    };
  }, []);

  const handleExport = useCallback(async () => {
    const payload = pieces.map((p) => ({
      id: p.id,
      leftPct: roundPct(p.leftPct),
      topPct: roundPct(p.topPct),
      widthPct: roundPct(p.widthPct),
      rotate: roundPct(p.rotate),
    }));
    const json = JSON.stringify(payload, null, 2);
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* Clipboard blocked (insecure context, denied permission).
         Fall back to logging so the user can still grab it from
         devtools rather than losing the export. */
      console.warn("[collage] clipboard write failed — layout:\n" + json);
    }
  }, [pieces]);

  const handleResetClick = useCallback(() => {
    if (!confirming) {
      setConfirming(true);
      if (confirmTimer.current) clearTimeout(confirmTimer.current);
      confirmTimer.current = setTimeout(() => setConfirming(false), 2500);
      return;
    }
    if (confirmTimer.current) {
      clearTimeout(confirmTimer.current);
      confirmTimer.current = null;
    }
    setConfirming(false);
    onReset();
  }, [confirming, onReset]);

  const buttonBase: React.CSSProperties = {
    fontFamily:
      "var(--font-mono), ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: 10,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "var(--color-ink-on-light)",
    background: "oklch(0.97 0.012 80 / 0.75)",
    border: "1px solid var(--color-rule-strong)",
    borderRadius: 2,
    padding: "5px 9px",
    cursor: "pointer",
    transition: "background 160ms ease, color 160ms ease",
    userSelect: "none",
  };

  return (
    <div
      className="collage-controls"
      style={{
        position: "absolute",
        left: 12,
        bottom: 12,
        zIndex: 1000,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        opacity: 0.55,
        transition: "opacity 200ms ease",
      }}
    >
      <button
        type="button"
        onClick={handleExport}
        className="collage-control-button"
        style={buttonBase}
      >
        Export layout
      </button>
      <button
        type="button"
        onClick={handleResetClick}
        className="collage-control-button"
        style={{
          ...buttonBase,
          color: confirming ? "oklch(0.42 0.18 28)" : buttonBase.color,
          borderColor: confirming
            ? "oklch(0.42 0.18 28 / 0.7)"
            : (buttonBase.border as string),
        }}
      >
        {confirming ? "Reset?" : "Reset"}
      </button>
      {copied ? (
        <span
          aria-live="polite"
          style={{
            fontFamily:
              "var(--font-mono), ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 10,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--color-ink-on-light)",
            opacity: 0.85,
          }}
        >
          copied ✓
        </span>
      ) : null}
      <style>{`
        .collage-controls:hover { opacity: 1; }
        .collage-control-button:hover {
          background: oklch(0.97 0.012 80 / 1);
          color: var(--color-ink-on-light);
        }
      `}</style>
    </div>
  );
}

/* ============================================================
   FlatlayPhotoCollageFallback — <lg fallback.

   The photographic collage is too dense to rebuild cleanly in a
   narrow column, so for sm / md viewports we ship a single
   pre-composited image of the same layout (/collage/fallback.jpg).
   The image keeps its full aspect ratio; mobile readers see the
   complete spread, just smaller.
   ============================================================ */

function FlatlayPhotoCollageFallback() {
  return (
    <div
      className="relative mx-auto w-full overflow-hidden"
      style={{ background: "transparent" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/collage/fallback.jpg"
        alt="Scrapbook collage: manila folder spread with a red file, Mac Finder window, sticky notes, receipts, a Relevance folder tab pinned with a thumbtack, a Sample Sale yellow note, and a January calendar clipped with a binder clip."
        draggable={false}
        className="block h-auto w-full select-none"
      />
    </div>
  );
}

/* ============================================================
   FlatlayManilaStage — legacy lg+ composition.
   Two manila folder halves on a deep-vault backdrop, with the
   curated artifacts and decorative pieces strewn across them.

   Every piece on stage is draggable: 4 large anchored
   decoratives (museum poster, vertical strip, design-notes
   page, post-it), 12 curated UnfiledNotes, and the 6 kept
   artifacts. Kept artifacts still open via tap — drag wins
   over click only after a 5px movement threshold.

   Drag is implemented with native pointer events (not the
   Framer Motion `drag` prop) for full control over hit
   testing, off-stage release, and z-promotion. During drag we
   write the live transform directly to the DOM (no React
   state on the hot path); on release we imperatively write
   the resolved values back BEFORE setPieces, which works
   around React's reconciler skipping unchanged transform
   diffs (the bug that previously caused pieces to snap back
   on commit).

   Pieces overhang the stage freely while dragging — there is
   no clamp. Only a fully-off-stage release (zero-pixel
   overlap) removes the piece. The two reference photos at
   MANILA_PHOTOS are atmospheric, not part of the unfiled
   spread, and stay static.
   ============================================================ */

const DRAG_THRESHOLD_PX = 5;
const LIFT_SCALE = 1.04;

type ManilaPiece = {
  id: string;
  kind: "decorative" | "artifact";
  /* mutable visual state */
  xPct: number;
  yPct: number;
  rotate: number;
  z: number;
  /* bumped on each drag — promotes the piece above siblings */
  order: number;
  /* fixed shape */
  widthPct: number;
  aspect?: string;
  /* payload */
  Component?: () => ReactNode;
  artifactId?: string;
};

/** @deprecated Preserved for revert. The active lg+ stage is FlatlayPhotoCollage. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function FlatlayManilaStage({ artifacts, renderArtifact, onOpen }: Props) {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement | null>(null);
  const nodeMap = useRef<Map<string, HTMLDivElement>>(new Map());
  const justDraggedRef = useRef<Set<string>>(new Set());
  const nextOrderRef = useRef(1);
  const dragRef = useRef<{
    id: string;
    pointerId: number;
    startClientX: number;
    startClientY: number;
    pointerOffsetX: number;
    pointerOffsetY: number;
    originalLeftPx: number;
    originalTopPx: number;
    rotate: number;
    z: number;
    order: number;
    dragging: boolean;
    didDrag: boolean;
    lastXpx: number;
    lastYpx: number;
  } | null>(null);

  const [pieces, setPieces] = useState<ManilaPiece[]>(() => {
    const list: ManilaPiece[] = [];
    for (const d of MANILA_DECORATIVE) {
      list.push({
        id: d.id,
        kind: "decorative",
        Component: d.Component,
        xPct: d.xPct,
        yPct: d.yPct,
        widthPct: d.widthPct,
        rotate: d.rotate,
        z: d.z,
        order: 0,
      });
    }
    for (const a of artifacts) {
      const spot = MANILA_LAYOUT[a.id];
      if (!spot) continue;
      list.push({
        id: `artifact-${a.id}`,
        kind: "artifact",
        artifactId: a.id,
        xPct: parseFloat(spot.left),
        yPct: parseFloat(spot.top),
        widthPct: parseFloat(spot.width),
        aspect: spot.aspect,
        rotate: spot.rotate,
        z: spot.z,
        order: 0,
      });
    }
    return list;
  });

  const detach = () => {
    const d = dragRef.current;
    if (!d) return;
    const node = nodeMap.current.get(d.id);
    if (node) {
      try {
        node.releasePointerCapture(d.pointerId);
      } catch {
        /* pointer already released */
      }
    }
    dragRef.current = null;
  };

  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    piece: ManilaPiece,
  ) => {
    /* Ignore extra pointers while a drag is in flight. */
    if (dragRef.current) return;
    e.stopPropagation();
    const stage = stageRef.current;
    const node = nodeMap.current.get(piece.id);
    if (!stage || !node) return;
    const stageRect = stage.getBoundingClientRect();
    const originalLeftPx = (piece.xPct / 100) * stageRect.width;
    const originalTopPx = (piece.yPct / 100) * stageRect.height;
    const newOrder = nextOrderRef.current++;
    dragRef.current = {
      id: piece.id,
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      pointerOffsetX: e.clientX - stageRect.left - originalLeftPx,
      pointerOffsetY: e.clientY - stageRect.top - originalTopPx,
      originalLeftPx,
      originalTopPx,
      rotate: piece.rotate,
      z: piece.z,
      order: newOrder,
      dragging: false,
      didDrag: false,
      lastXpx: originalLeftPx,
      lastYpx: originalTopPx,
    };
    try {
      node.setPointerCapture(e.pointerId);
    } catch {
      /* setPointerCapture occasionally throws on synthetic events */
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d || e.pointerId !== d.pointerId) return;
    const dx = e.clientX - d.startClientX;
    const dy = e.clientY - d.startClientY;
    if (!d.dragging) {
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return;
      d.dragging = true;
      d.didDrag = true;
      const node = nodeMap.current.get(d.id);
      if (node) {
        node.style.zIndex = String(1000 + d.order);
        node.style.cursor = "grabbing";
      }
    }
    const stage = stageRef.current;
    const node = nodeMap.current.get(d.id);
    if (!stage || !node) return;
    const stageRect = stage.getBoundingClientRect();
    const desiredX = e.clientX - stageRect.left - d.pointerOffsetX;
    const desiredY = e.clientY - stageRect.top - d.pointerOffsetY;
    d.lastXpx = desiredX;
    d.lastYpx = desiredY;
    const tdx = desiredX - d.originalLeftPx;
    const tdy = desiredY - d.originalTopPx;
    const scale = reduce ? 1 : LIFT_SCALE;
    node.style.transform = `translate3d(${tdx}px, ${tdy}px, 0) rotate(${d.rotate}deg) scale(${scale})`;
    node.style.boxShadow =
      "0 28px 60px -18px oklch(0 0 0 / 0.65), 0 10px 22px -6px oklch(0 0 0 / 0.5), 0 0 0 1px oklch(0 0 0 / 0.08)";
  };

  const handlePointerUp = (
    e: React.PointerEvent<HTMLDivElement>,
    piece: ManilaPiece,
  ) => {
    const d = dragRef.current;
    if (!d || e.pointerId !== d.pointerId) return;
    const node = nodeMap.current.get(d.id);
    const stage = stageRef.current;

    /* Tap (no drag past threshold) — let the inner ArtifactTile's
       onClick fire naturally for kept artifacts. Decorative pieces
       are aria-hidden and have no click target. */
    if (!d.didDrag) {
      detach();
      return;
    }

    /* Drag completion — block the synthetic click that fires after
       pointerup on the same element from re-opening the modal. */
    justDraggedRef.current.add(piece.id);
    setTimeout(() => {
      justDraggedRef.current.delete(piece.id);
    }, 0);

    if (!stage || !node) {
      detach();
      return;
    }

    const stageRect = stage.getBoundingClientRect();
    const w = node.offsetWidth;
    const h = node.offsetHeight;
    /* Off-stage check uses the unrotated bounding box in stage-local
       pixels. Zero overlap on any axis means the piece is fully off
       the stage and gets removed. */
    const offStage =
      d.lastXpx + w <= 0 ||
      d.lastXpx >= stageRect.width ||
      d.lastYpx + h <= 0 ||
      d.lastYpx >= stageRect.height;

    if (offStage) {
      detach();
      setPieces((prev) => prev.filter((p) => p.id !== piece.id));
      return;
    }

    const newXPct = (d.lastXpx / stageRect.width) * 100;
    const newYPct = (d.lastYpx / stageRect.height) * 100;
    const newOrder = d.order;

    /* Imperative writeback BEFORE setPieces. React's style reconciler
       skips assignments where the diff is unchanged — without this
       the live transform="translate3d(..)" lingers on the node and
       the piece appears to fly back to its original spot on commit. */
    node.style.left = `${newXPct}%`;
    node.style.top = `${newYPct}%`;
    node.style.transform = `rotate(${d.rotate}deg)`;
    node.style.boxShadow = "";
    node.style.cursor = "grab";
    node.style.zIndex = String(1000 + newOrder);

    detach();
    setPieces((prev) =>
      prev.map((p) =>
        p.id === piece.id
          ? { ...p, xPct: newXPct, yPct: newYPct, order: newOrder }
          : p,
      ),
    );
  };

  const handlePointerCancel = (
    e: React.PointerEvent<HTMLDivElement>,
    piece: ManilaPiece,
  ) => {
    const d = dragRef.current;
    if (!d || e.pointerId !== d.pointerId) return;
    const node = nodeMap.current.get(d.id);
    if (node) {
      /* Restore to last-committed (xPct, yPct, rotate). */
      node.style.transform = `rotate(${d.rotate}deg)`;
      node.style.boxShadow = "";
      node.style.cursor = "grab";
      node.style.zIndex = String(piece.order > 0 ? 1000 + piece.order : piece.z);
    }
    detach();
  };

  const handleClickCapture = (
    e: React.MouseEvent<HTMLDivElement>,
    piece: ManilaPiece,
  ) => {
    if (justDraggedRef.current.has(piece.id)) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return (
    <div
      ref={stageRef}
      className="relative"
      style={{
        aspectRatio: "5 / 4",
        maxHeight: "min(86vh, 880px)",
        minHeight: 620,
        background: "oklch(0.07 0.005 60)",
        borderRadius: 6,
        boxShadow:
          "0 0 0 1px oklch(0.18 0.008 60), 0 50px 120px -50px oklch(0 0 0 / 0.85)",
      }}
    >
      {/* Two manila folder halves + their tabs. */}
      <ManilaFolders />

      {/* Reference photos — aria-hidden, not draggable. */}
      {MANILA_PHOTOS.map((p, i) => (
        <motion.div
          key={p.id}
          aria-hidden
          initial={
            reduce ? false : { opacity: 0, y: 10, rotate: p.spot.rotate * 0.4 }
          }
          whileInView={{ opacity: 1, y: 0, rotate: p.spot.rotate }}
          viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
          transition={{
            duration: 0.7,
            ease: [0.2, 0.8, 0.2, 1],
            delay: 0.06 * i,
          }}
          style={{
            position: "absolute",
            left: p.spot.left,
            top: p.spot.top,
            width: p.spot.width,
            zIndex: p.spot.z,
            transform: `rotate(${p.spot.rotate}deg)`,
            willChange: "transform",
          }}
        >
          <PhotoPrint prop={p} />
        </motion.div>
      ))}

      {/* All draggable pieces — anchored decoratives, unfiled notes,
          and kept artifacts. Unified render loop so they share the
          same drag system, hit-testing, and z-promotion. */}
      {pieces.map((piece, idx) => {
        const isArtifact = piece.kind === "artifact";
        const artifact =
          isArtifact && piece.artifactId
            ? artifacts.find((a) => a.id === piece.artifactId) ?? null
            : null;
        const baseZ = piece.order > 0 ? 1000 + piece.order : piece.z;
        const baseShadow = isArtifact
          ? `0 ${Math.round(Math.abs(piece.rotate) * 0.8 + 8)}px ${Math.round(Math.abs(piece.rotate) * 1.6 + 18)}px -${Math.round(Math.abs(piece.rotate) * 0.4 + 8)}px oklch(0 0 0 / 0.45)`
          : undefined;
        return (
          <motion.div
            key={piece.id}
            ref={(el: HTMLDivElement | null) => {
              if (el) nodeMap.current.set(piece.id, el);
              else nodeMap.current.delete(piece.id);
            }}
            aria-hidden={isArtifact ? undefined : true}
            onPointerDown={(e) => handlePointerDown(e, piece)}
            onPointerMove={handlePointerMove}
            onPointerUp={(e) => handlePointerUp(e, piece)}
            onPointerCancel={(e) => handlePointerCancel(e, piece)}
            onClickCapture={(e) => handleClickCapture(e, piece)}
            initial={
              reduce
                ? false
                : { opacity: 0, y: 14, rotate: piece.rotate * 0.4 }
            }
            whileInView={{ opacity: 1, y: 0, rotate: piece.rotate }}
            viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
            transition={{
              duration: 0.7,
              ease: [0.2, 0.8, 0.2, 1],
              delay: Math.min(idx * 0.035 + 0.05, 0.55),
            }}
            style={{
              position: "absolute",
              left: `${piece.xPct}%`,
              top: `${piece.yPct}%`,
              width: `${piece.widthPct}%`,
              aspectRatio: piece.aspect,
              zIndex: baseZ,
              transform: `rotate(${piece.rotate}deg)`,
              boxShadow: baseShadow,
              borderRadius: 4,
              willChange: "transform",
              cursor: "grab",
              touchAction: "none",
              userSelect: "none",
              /* Establish a container query context so each paper's
                 `cqw`-scaled fonts resolve against the paper's own
                 width, not the viewport. Without this, fonts pinned
                 to `clamp(min, Ncqw, max)` always rendered at the
                 viewport-derived value and ran past the paper edge
                 on the manila spread. */
              containerType: "inline-size",
              /* Clip any remaining content overflow to the paper
                 boundary so text never visibly escapes the card. */
              overflow: "hidden",
            }}
          >
            {piece.kind === "decorative" && piece.Component ? (
              <piece.Component />
            ) : artifact ? (
              <ArtifactTile
                artifact={artifact}
                onOpen={onOpen}
                reduce={!!reduce}
                tilt={piece.rotate}
              >
                {renderArtifact(artifact)}
              </ArtifactTile>
            ) : null}
          </motion.div>
        );
      })}

      {/* Subtle hint — only the manila stage renders on lg+, so the
          hint is implicitly desktop-only. */}
      <p
        aria-hidden
        className="pointer-events-none absolute font-mono uppercase"
        style={{
          right: 16,
          bottom: 12,
          fontSize: 11,
          letterSpacing: "0.18em",
          color: "oklch(0.55 0.012 65)",
          opacity: 0.7,
        }}
      >
        DRAG ANY PAPER · TO REARRANGE
      </p>
    </div>
  );
}

/* ============================================================
   ManilaFolders — two folder halves (left + right) and their
   tabs, drawn as flat manila cardstock with a subtle paper grain
   and a soft inner-fold shadow at the spine.
   ============================================================ */

function ManilaFolders() {
  const folderShadow =
    "0 1px 0 oklch(1 0 0 / 0.04) inset, 0 -1px 0 oklch(0 0 0 / 0.18) inset, 0 30px 60px -30px oklch(0 0 0 / 0.65)";

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {/* LEFT HALF body */}
      <div
        className="absolute"
        style={{
          left: "1.5%",
          top: "8%",
          width: "47%",
          height: "88%",
          background:
            "linear-gradient(180deg, var(--color-manila-rim) 0%, var(--color-manila) 18%, var(--color-manila) 80%, var(--color-manila-edge) 100%)",
          borderRadius: "5px 4px 6px 5px",
          boxShadow: folderShadow,
        }}
      >
        {/* Paper grain on the left folder. */}
        <span
          className="absolute inset-0"
          style={{
            backgroundImage: PAPER_NOISE_URL,
            backgroundSize: "220px 220px",
            opacity: 0.18,
            mixBlendMode: "multiply",
            borderRadius: "inherit",
          }}
        />
        {/* Faint warm light from the upper-left corner. */}
        <span
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 25% 18%, oklch(1 0 0 / 0.10) 0%, transparent 65%)",
            borderRadius: "inherit",
          }}
        />
        {/* Folder fold-line shadow at the right edge (spine). */}
        <span
          className="absolute inset-y-0 right-0"
          style={{
            width: "10%",
            background:
              "linear-gradient(90deg, transparent 0%, oklch(0 0 0 / 0.08) 70%, oklch(0 0 0 / 0.18) 100%)",
            borderRadius: "0 4px 6px 0",
          }}
        />
      </div>

      {/* LEFT TAB — a chunkier rectangle attached to the top edge. */}
      <div
        className="absolute"
        style={{
          left: "13%",
          top: "3.4%",
          width: "16%",
          height: "5.6%",
          background:
            "linear-gradient(180deg, var(--color-manila-rim) 0%, var(--color-manila) 80%)",
          borderRadius: "5px 5px 1px 1px",
          boxShadow:
            "0 -1px 0 oklch(1 0 0 / 0.05) inset, 0 -8px 14px -10px oklch(0 0 0 / 0.45)",
        }}
      >
        <span
          className="absolute inset-0"
          style={{
            backgroundImage: PAPER_NOISE_URL,
            backgroundSize: "220px 220px",
            opacity: 0.16,
            mixBlendMode: "multiply",
            borderRadius: "inherit",
          }}
        />
      </div>

      {/* RIGHT HALF body */}
      <div
        className="absolute"
        style={{
          left: "51.5%",
          top: "8%",
          width: "47%",
          height: "88%",
          background:
            "linear-gradient(180deg, var(--color-manila-rim) 0%, var(--color-manila) 18%, var(--color-manila) 80%, var(--color-manila-edge) 100%)",
          borderRadius: "4px 5px 5px 6px",
          boxShadow: folderShadow,
        }}
      >
        <span
          className="absolute inset-0"
          style={{
            backgroundImage: PAPER_NOISE_URL,
            backgroundSize: "220px 220px",
            opacity: 0.18,
            mixBlendMode: "multiply",
            borderRadius: "inherit",
          }}
        />
        <span
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 75% 18%, oklch(1 0 0 / 0.08) 0%, transparent 65%)",
            borderRadius: "inherit",
          }}
        />
        {/* Folder fold-line shadow at the left edge (spine). */}
        <span
          className="absolute inset-y-0 left-0"
          style={{
            width: "10%",
            background:
              "linear-gradient(270deg, transparent 0%, oklch(0 0 0 / 0.08) 70%, oklch(0 0 0 / 0.18) 100%)",
            borderRadius: "4px 0 0 6px",
          }}
        />
      </div>

      {/* RIGHT TAB — mirrored to the right side of the right folder. */}
      <div
        className="absolute"
        style={{
          left: "71%",
          top: "3.4%",
          width: "16%",
          height: "5.6%",
          background:
            "linear-gradient(180deg, var(--color-manila-rim) 0%, var(--color-manila) 80%)",
          borderRadius: "5px 5px 1px 1px",
          boxShadow:
            "0 -1px 0 oklch(1 0 0 / 0.05) inset, 0 -8px 14px -10px oklch(0 0 0 / 0.45)",
        }}
      >
        <span
          className="absolute inset-0"
          style={{
            backgroundImage: PAPER_NOISE_URL,
            backgroundSize: "220px 220px",
            opacity: 0.16,
            mixBlendMode: "multiply",
            borderRadius: "inherit",
          }}
        />
      </div>
    </div>
  );
}

/* ============================================================
   MuseumPoster — cream paper, big editorial caps, small filing-
   cabinet emblem, paperclip on the top-left corner. The "cover
   sheet" of the case file (parallel to the reference's red PARALIA
   poster).
   ============================================================ */

function MuseumPoster() {
  return (
    <div className="relative" style={{ aspectRatio: "3 / 4" }}>
      {/* Paper body. */}
      <div
        className="surface-lit absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.96 0.012 80) 0%, oklch(0.92 0.014 78) 100%)",
          borderRadius: 2,
          boxShadow:
            "0 18px 36px -22px oklch(0 0 0 / 0.55), 0 4px 10px -4px oklch(0 0 0 / 0.35), 0 0 0 1px oklch(0 0 0 / 0.05)",
        }}
      >
        <span
          className="absolute inset-0"
          style={{
            backgroundImage: PAPER_NOISE_URL,
            backgroundSize: "220px 220px",
            opacity: 0.14,
            mixBlendMode: "multiply",
            borderRadius: "inherit",
          }}
        />
        {/* Eyebrow */}
        <p
          className="absolute font-mono uppercase"
          style={{
            top: "9%",
            left: "8%",
            right: "8%",
            fontSize: "clamp(7px, 0.7vw, 10px)",
            fontWeight: 700,
            letterSpacing: "0.22em",
            color: "oklch(0.32 0.012 60)",
          }}
        >
          A MUSEUM OF
        </p>

        {/* Big display caps — "NOTE / TAKING" stacked. */}
        <div
          className="absolute"
          style={{ top: "18%", left: "8%", right: "8%" }}
        >
          <p
            className="font-serif"
            style={{
              fontSize: "clamp(20px, 3.4vw, 56px)",
              fontWeight: 900,
              lineHeight: 0.86,
              letterSpacing: "-0.02em",
              color: "oklch(0.16 0.008 60)",
            }}
          >
            NOTE&shy;<br />TAKING.
          </p>
        </div>

        {/* Emblem — a small filing-drawer line drawing, centred.
            Sits between the display caps and the bottom case-file
            small print so neither layer collides with the other. */}
        <div
          className="absolute"
          style={{ top: "40%", left: "36%", right: "36%" }}
        >
          <FilingEmblem />
        </div>

        {/* Bottom matter — case file index, like the bottom of a
            poster's small print. */}
        <div
          className="absolute font-mono uppercase"
          style={{
            bottom: "9%",
            left: "8%",
            right: "8%",
            fontSize: "clamp(6px, 0.55vw, 8.5px)",
            letterSpacing: "0.2em",
            color: "oklch(0.32 0.012 60)",
            lineHeight: 1.6,
          }}
        >
          <p style={{ fontWeight: 700 }}>CASE FILE 01 — 04</p>
          <p style={{ opacity: 0.78 }}>PERSONAL · MESSY · FILED, NEVER FORGOTTEN.</p>
        </div>
      </div>

      {/* Paperclip on the top-left, holding the poster down. */}
      <span
        aria-hidden
        className="absolute"
        style={{ top: "-3%", left: "12%", transform: "rotate(-12deg)", zIndex: 5 }}
      >
        <Paperclip />
      </span>
    </div>
  );
}

function FilingEmblem() {
  /* A 3-tier filing cabinet drawn in thin lines, with one drawer
     pulled out a touch. Reads as the museum's quiet brand mark. */
  return (
    <svg
      viewBox="0 0 80 100"
      className="block w-full"
      fill="none"
      stroke="oklch(0.16 0.008 60)"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="12" y="6" width="56" height="88" rx="2" />
      <line x1="12" y1="34" x2="68" y2="34" />
      <line x1="12" y1="62" x2="68" y2="62" />
      <circle cx="40" cy="20" r="1.6" fill="oklch(0.16 0.008 60)" />
      <circle cx="40" cy="48" r="1.6" fill="oklch(0.16 0.008 60)" />
      <circle cx="40" cy="78" r="1.6" fill="oklch(0.16 0.008 60)" />
      {/* Pulled-out drawer at the bottom. */}
      <rect x="6" y="64" width="68" height="28" rx="2" fill="oklch(0.96 0.012 80)" />
      <circle cx="40" cy="78" r="1.6" fill="oklch(0.16 0.008 60)" />
    </svg>
  );
}

/* ============================================================
   VerticalStrip — narrow paper strip taped to the spine area.
   Mono caps, vertically rotated. Two translucent tape rectangles
   hold it down at top and bottom.
   ============================================================ */

function VerticalStrip() {
  return (
    <div className="relative" style={{ aspectRatio: "1 / 6" }}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.97 0.008 85) 0%, oklch(0.93 0.012 82) 100%)",
          borderRadius: 1,
          boxShadow:
            "0 8px 18px -10px oklch(0 0 0 / 0.4), 0 0 0 1px oklch(0 0 0 / 0.05)",
        }}
      >
        <span
          className="absolute inset-0"
          style={{
            backgroundImage: PAPER_NOISE_URL,
            backgroundSize: "220px 220px",
            opacity: 0.12,
            mixBlendMode: "multiply",
          }}
        />
        {/* Mono caps text, vertically rotated. */}
        <p
          className="absolute left-1/2 top-1/2 origin-center font-mono uppercase"
          style={{
            transform: "translate(-50%, -50%) rotate(-90deg)",
            whiteSpace: "nowrap",
            fontSize: "clamp(8px, 0.85vw, 11px)",
            fontWeight: 700,
            letterSpacing: "0.42em",
            color: "oklch(0.18 0.008 60)",
          }}
        >
          EVIDENCE LOG · 2014—2026
        </p>
        {/* Small registry number at the bottom. */}
        <p
          className="absolute bottom-[3%] left-1/2 -translate-x-1/2 font-mono uppercase"
          style={{
            fontSize: "8px",
            letterSpacing: "0.16em",
            color: "oklch(0.45 0.012 60)",
          }}
        >
          R—01
        </p>
      </div>

      {/* Top tape strip. */}
      <Tape position="top" />
      {/* Bottom tape strip. */}
      <Tape position="bottom" />
    </div>
  );
}

function Tape({ position }: { position: "top" | "bottom" }) {
  const styleByPos =
    position === "top"
      ? { top: "-3%", transform: "rotate(-7deg)" }
      : { bottom: "-3%", transform: "rotate(6deg)" };
  return (
    <span
      aria-hidden
      className="absolute left-1/2 -translate-x-1/2"
      style={{
        ...styleByPos,
        width: "140%",
        height: "9%",
        background:
          "linear-gradient(180deg, oklch(1 0 0 / 0.22) 0%, oklch(1 0 0 / 0.14) 100%)",
        borderLeft: "1px solid oklch(1 0 0 / 0.18)",
        borderRight: "1px solid oklch(1 0 0 / 0.18)",
      }}
    />
  );
}

/* ============================================================
   DesignNotesPage — handwritten case-study working notes.
   Header in mono caps, body in Caveat, three small numbered route
   thumbnails at the bottom. Renders the design moves Nupur made
   on the museum itself (drawer wall vs manila folder, type system,
   atmosphere).
   ============================================================ */

function DesignNotesPage() {
  const handFont = "var(--font-caveat), 'Caveat', 'Bradley Hand', cursive";
  return (
    <div className="relative" style={{ aspectRatio: "5 / 5.6" }}>
      <div
        className="absolute inset-0 surface-lit"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.97 0.012 84) 0%, oklch(0.93 0.014 82) 100%)",
          borderRadius: 2,
          boxShadow:
            "0 22px 44px -22px oklch(0 0 0 / 0.55), 0 4px 10px -4px oklch(0 0 0 / 0.32), 0 0 0 1px oklch(0 0 0 / 0.05)",
        }}
      >
        <span
          className="absolute inset-0"
          style={{
            backgroundImage: PAPER_NOISE_URL,
            backgroundSize: "220px 220px",
            opacity: 0.13,
            mixBlendMode: "multiply",
            borderRadius: "inherit",
          }}
        />

        {/* Header bar — the "ROUTES" title boxed at the top. */}
        <div
          className="absolute font-mono uppercase"
          style={{
            top: "5.5%",
            left: "8%",
            fontSize: "clamp(8px, 0.85vw, 11px)",
            letterSpacing: "0.18em",
            color: "oklch(0.18 0.008 60)",
            border: "1px solid oklch(0.18 0.008 60 / 0.7)",
            padding: "5px 10px",
            fontWeight: 700,
          }}
        >
          ROUTES — MUSEUM
        </div>
        <p
          className="absolute font-mono uppercase"
          style={{
            top: "5.5%",
            right: "8%",
            fontSize: "clamp(7px, 0.65vw, 9px)",
            letterSpacing: "0.18em",
            color: "oklch(0.45 0.012 60)",
            paddingTop: 7,
          }}
        >
          PG. 1 / 3
        </p>

        {/* Body — handwritten bullet list. */}
        <div
          className="absolute"
          style={{
            top: "14%",
            left: "8%",
            right: "8%",
            fontFamily: handFont,
            color: "oklch(0.16 0.008 60)",
            fontSize: "clamp(13px, 1.45vw, 22px)",
            lineHeight: 1.45,
          }}
        >
          <p style={{ marginBottom: "0.4em" }}>three routes,</p>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            <li>· LOGOMARK — filing cabinet, restrained</li>
            <li>· VOICE — forensic, dry, slow</li>
            <li>· TYPE — Kobe display, mono chrome</li>
            <li>· ATMOSPHERE — vault haze, ember bloom</li>
            <li>· COPY — case-file, not pitch deck</li>
          </ul>

          <p style={{ marginTop: "0.7em", marginBottom: "0.3em" }}>
            <strong style={{ fontWeight: 600 }}>1.</strong> drawer wall —
            12 closed steel drawers, click to file out
          </p>
          <p style={{ marginBottom: "0.3em" }}>
            <strong style={{ fontWeight: 600 }}>2.</strong> open folder —
            spread of papers, pre-filing
          </p>
          <p style={{ marginBottom: "0.3em" }}>
            <strong style={{ fontWeight: 600 }}>3.</strong> shards — restoring
            colour by tapping the timeline
          </p>
          <p style={{ marginTop: "0.6em", fontStyle: "italic", opacity: 0.78 }}>
            (route 02 is what the team is looking at now)
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PostIt — yellow square, soft ambient drop shadow with a stronger
   shadow on the top edge so it reads as adhesive holding it down.
   Caveat-handwritten copy in two short stacked lines.
   ============================================================ */

function PostIt() {
  const handFont = "var(--font-caveat), 'Caveat', 'Bradley Hand', cursive";
  return (
    <div className="relative" style={{ aspectRatio: "1 / 1.05" }}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(165deg, oklch(0.95 0.13 95) 0%, oklch(0.91 0.16 92) 100%)",
          /* The slight curve in the bottom-right is implied by an
             inset shadow that darkens the corner; we keep the box
             rectangular for performance. */
          boxShadow:
            "0 1px 0 oklch(1 0 0 / 0.4) inset, 0 -2px 0 oklch(0 0 0 / 0.06) inset, 0 14px 26px -14px oklch(0 0 0 / 0.45), 0 4px 8px -4px oklch(0 0 0 / 0.32)",
        }}
      >
        <div
          className="flex h-full w-full flex-col justify-center"
          style={{
            padding: "16% 14%",
            fontFamily: handFont,
            color: "oklch(0.18 0.008 60)",
          }}
        >
          <p
            style={{
              fontSize: "clamp(14px, 1.6vw, 26px)",
              lineHeight: 1.05,
              fontWeight: 700,
              letterSpacing: "-0.005em",
            }}
          >
            FOR REVIEW.
          </p>
          <p
            style={{
              fontSize: "clamp(13px, 1.4vw, 22px)",
              lineHeight: 1.05,
              marginTop: "0.35em",
            }}
          >
            case file 01.
          </p>
          <p
            style={{
              fontSize: "clamp(10px, 1vw, 14px)",
              lineHeight: 1.1,
              marginTop: "0.6em",
              opacity: 0.75,
            }}
          >
            — N.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PhotoPrint — a single photo treated either as a flat print or
   a polaroid card. Sits inside the manila folder as a working
   reference photo. Decorative.
   ============================================================ */

function PhotoPrint({ prop }: { prop: PhotoProp }) {
  const baseShadow =
    "0 16px 32px -18px oklch(0 0 0 / 0.55), 0 4px 8px -4px oklch(0 0 0 / 0.32), 0 0 0 1px oklch(0 0 0 / 0.06)";

  if (prop.kind === "polaroid") {
    return (
      <div
        className="relative w-full"
        style={{
          background: "oklch(0.97 0.005 85)",
          padding: "6px 6px 22px",
          borderRadius: 2,
          boxShadow: baseShadow,
        }}
      >
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: prop.spot.aspect, borderRadius: 1 }}
        >
          <Image
            src={prop.src}
            alt={prop.alt}
            fill
            sizes="(min-width: 1024px) 12vw, 30vw"
            className="object-cover"
            style={{ objectPosition: "center 35%" }}
            loading="lazy"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        aspectRatio: prop.spot.aspect,
        borderRadius: 2,
        boxShadow: baseShadow,
      }}
    >
      <Image
        src={prop.src}
        alt={prop.alt}
        fill
        sizes="(min-width: 1024px) 22vw, 70vw"
        className="object-cover"
        loading="lazy"
      />
      {/* Faint glare across the photo so it reads as glossy paper. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, oklch(1 0 0 / 0.14) 0%, transparent 40%, transparent 70%, oklch(0 0 0 / 0.08) 100%)",
        }}
      />
    </div>
  );
}

/* ============================================================
   Paperclip — silver wireframe, used by the museum poster and
   reused if the kept artifacts ever need clip chrome.
   ============================================================ */

function Paperclip() {
  return (
    <svg width="32" height="46" viewBox="0 0 34 48" fill="none" aria-hidden>
      <defs>
        <linearGradient id="manila-clip-metal" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.86 0.008 80)" />
          <stop offset="50%" stopColor="oklch(0.62 0.008 80)" />
          <stop offset="100%" stopColor="oklch(0.38 0.012 80)" />
        </linearGradient>
      </defs>
      <path
        d="M 12 4 L 26 4 Q 30 4 30 8 L 30 38 Q 30 42 26 42 L 14 42 Q 10 42 10 38 L 10 14 Q 10 10 14 10 L 22 10 Q 26 10 26 14 L 26 32"
        stroke="url(#manila-clip-metal)"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/* ============================================================
   ArtifactTile — interactive wrapper. Same DetailCard handler as
   the drawer wall. On hover/focus, lifts 4px and strengthens the
   shadow; reduced-motion suppresses the lift.

   Used by both the new manila stage and the legacy collage stage.
   The tile itself is presentation-agnostic — it just needs an
   artifact, the renderer's children, and the open callback.
   ============================================================ */

function ArtifactTile({
  artifact,
  onOpen,
  reduce,
  tilt,
  children,
}: {
  artifact: Artifact;
  onOpen: (artifact: Artifact) => void;
  reduce: boolean;
  tilt: number;
  children: ReactNode;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Open exhibit ${artifact.exhibit} · ${artifact.label}`}
      onClick={() => onOpen(artifact)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(artifact);
        }
      }}
      className={`flatlay-tile relative h-full w-full ${reduce ? "" : "transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-1 focus-visible:-translate-y-1"}`}
      style={{ outlineOffset: 4 }}
      data-tilt={tilt}
    >
      <div className="h-full w-full">{children}</div>
      {/* Hover annotation strip — exhibit + label, same as before. */}
      <span
        aria-hidden
        className="flatlay-annotation pointer-events-none absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.18em] text-ink-700 opacity-0 transition-opacity duration-200"
        style={{ background: "oklch(0.96 0.012 80 / 0.92)", padding: "2px 6px" }}
      >
        {artifact.exhibit} · {artifact.label}
      </span>
      <style>{`
        .flatlay-tile:hover .flatlay-annotation,
        .flatlay-tile:focus-visible .flatlay-annotation {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}

/* ============================================================
   FlatlayStackedStage — narrow viewport composition (<lg).
   Untouched. Forgiving wrap of all twelve artifacts on the warm
   surface-lit panel. Reference photos are not shown here; the
   typographic recreations carry the same content.
   ============================================================ */

/** @deprecated Preserved for revert. The active <lg fallback is FlatlayPhotoCollageFallback. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function FlatlayStackedStage({ artifacts, renderArtifact, onOpen }: Props) {
  const reduce = useReducedMotion();
  return (
    <div className="flex flex-wrap gap-5 px-4 py-6 sm:gap-6 sm:px-6 sm:py-8 lg:hidden">
      {artifacts.map((artifact, idx) => {
        const spot = LEGACY_FLATLAY_LAYOUT[artifact.id] ?? {
          left: "0",
          top: "0",
          width: "100%",
          aspect: "3/4",
          rotate: 0,
          z: 1,
        };
        const shadowDepth = Math.abs(spot.rotate) * 1.2 + 10;
        return (
          <motion.div
            key={artifact.id}
            initial={
              reduce ? false : { opacity: 0, y: 12, rotate: spot.rotate * 0.4 }
            }
            whileInView={{ opacity: 1, y: 0, rotate: spot.rotate }}
            viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
            transition={{
              duration: 0.6,
              ease: [0.2, 0.8, 0.2, 1],
              delay: 0.04 * idx,
            }}
            style={{
              flex: "1 1 240px",
              maxWidth: "min(100%, 360px)",
              aspectRatio: spot.aspect,
              transform: `rotate(${spot.rotate}deg)`,
              boxShadow: `0 ${Math.round(shadowDepth * 0.4)}px ${shadowDepth}px -${Math.round(shadowDepth * 0.2)}px oklch(0.18 0.01 80 / 0.28)`,
              borderRadius: 4,
              willChange: "transform",
            }}
          >
            <ArtifactTile
              artifact={artifact}
              onOpen={onOpen}
              reduce={!!reduce}
              tilt={spot.rotate}
            >
              {renderArtifact(artifact)}
            </ArtifactTile>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ============================================================
   LegacyDeskPanel — the warm `surface-lit` panel that used to wrap
   FlatlayCollageStage on lg+ and still wraps FlatlayStackedStage
   on <lg. Kept as a self-contained helper so reverting the lg+
   experience to the legacy collage is a one-line swap inside
   <Flatlay /> (replace the manila branch with `<LegacyDeskPanel>
   <FlatlayCollageStageLegacy ... /></LegacyDeskPanel>`).
   ============================================================ */

/** @deprecated Preserved for revert. Wraps the legacy stacked / collage stages. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function LegacyDeskPanel({ children }: { children: ReactNode }) {
  return (
    <div
      className="surface-lit relative overflow-hidden"
      style={{
        borderRadius: "10px",
        background:
          "linear-gradient(180deg, var(--color-paper-lit) 0%, oklch(0.88 0.02 78) 100%)",
        boxShadow:
          "0 0 0 1px oklch(0.30 0.01 60), 0 40px 80px -40px oklch(0 0 0 / 0.7), 0 0 80px -10px oklch(0.78 0.16 50 / 0.18)",
      }}
    >
      {/* Subtle paper texture. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(0deg, oklch(0.18 0.01 80 / 0.018) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, oklch(0.18 0.01 80 / 0.012) 0 1px, transparent 1px 4px)",
          mixBlendMode: "multiply",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 30% 20%, oklch(1 0 0 / 0.20) 0%, transparent 60%)",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(102deg, oklch(0.78 0.04 60 / 0.04) 0 2px, transparent 2px 9px)",
          mixBlendMode: "multiply",
          opacity: 0.7,
        }}
      />
      {children}
    </div>
  );
}

/* ============================================================
   ============================================================
   LEGACY — preserved for revert.
   ============================================================
   FlatlayCollageStageLegacy and its supporting layout map / props /
   chrome are the previous lg+ "wood-cork desk panel" composition:
   twelve typographic artifacts + three reference photos + binder
   rings/spine + a pencil-shadow prop. Nothing below is wired into
   <Flatlay /> on lg+ anymore. To reinstate it:

     1. In <Flatlay />, swap <FlatlayManilaStage ... /> for
        <LegacyDeskPanel><LegacyDeskChrome />
          <FlatlayCollageStageLegacy ... />
        </LegacyDeskPanel>
     2. Optionally also reinstate the lg+ binder spine/rings via
        <LegacyDeskChrome /> below.

   No external components depend on these symbols.
   ============================================================
   ============================================================ */

const LEGACY_FLATLAY_LAYOUT: Record<string, Spot> = {
  snacks:      { left: "20%", top: "11%", width: "15%", aspect: "3/3.4", rotate:  6.5, z: 14 },
  ledger:      { left: "32%", top: "1%",  width: "15%", aspect: "3/3.6", rotate: -3.5, z: 13 },
  anniversary: { left: "45%", top: "11%", width: "17%", aspect: "4/3.2", rotate:  2.6, z: 11 },
  recipe:      { left: "59%", top: "1%",  width: "17%", aspect: "3/4",   rotate: -5.0, z: 12 },
  blister:     { left: "76%", top: "10%", width: "23%", aspect: "5/4.4", rotate:  4.5, z: 13 },

  dashboard:   { left: "6%",  top: "32%", width: "32%", aspect: "16/10", rotate: -1.4, z: 15 },
  polaroid:    { left: "59%", top: "37%", width: "18%", aspect: "3/4.2", rotate:  4.5, z: 18 },
  cassette:    { left: "78%", top: "37%", width: "20%", aspect: "5/4",   rotate: -3.5, z: 14 },
  fingerprint: { left: "0%",  top: "60%", width: "13%", aspect: "3/4",   rotate: -7.0, z: 13 },

  torn:        { left: "14%", top: "76%", width: "30%", aspect: "16/8",  rotate:  2.4, z: 16 },
  questions:   { left: "53%", top: "60%", width: "15%", aspect: "3/3.6", rotate:  5.5, z: 19 },
  tag:         { left: "62%", top: "84%", width: "35%", aspect: "8/3",   rotate: -7.0, z: 12 },
};

type LegacyPhotoProp = {
  id: string;
  src: string;
  alt: string;
  kind: "keep-printout" | "folded-printout" | "polaroid";
  spot: Spot;
  caption?: string;
  chrome?: Array<"tape-tl" | "tape-tr" | "tape-bl" | "tape-br" | "paperclip" | "index-01">;
};

const LEGACY_PHOTO_PROPS: LegacyPhotoProp[] = [
  {
    id: "ref-keep-personal",
    src: "/references/ref-keep-personal.jpg",
    alt: "",
    kind: "keep-printout",
    spot: { left: "-1%", top: "0%", width: "31%", aspect: "4/3", rotate: -3.6, z: 7 },
    chrome: ["tape-tl", "tape-tr", "index-01"],
  },
  {
    id: "ref-productivity-dashboard",
    src: "/references/ref-productivity-dashboard.jpg",
    alt: "",
    kind: "folded-printout",
    spot: { left: "30%", top: "26%", width: "26%", aspect: "4/3", rotate: 3.6, z: 10 },
    chrome: ["paperclip"],
  },
  {
    id: "ref-canva-easel",
    src: "/references/ref-canva-easel-driver.jpg",
    alt: "",
    kind: "polaroid",
    spot: { left: "39%", top: "58%", width: "17%", aspect: "3/4.2", rotate: -8.0, z: 17 },
    caption: "performance review (the original)",
    chrome: ["tape-tl"],
  },
];

/** @deprecated Preserved for revert. The active lg+ stage is FlatlayManilaStage. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function FlatlayCollageStageLegacy({ artifacts, renderArtifact, onOpen }: Props) {
  const reduce = useReducedMotion();
  return (
    <div
      className="relative hidden lg:block"
      style={{
        aspectRatio: "5 / 4",
        maxHeight: "min(86vh, 880px)",
        minHeight: 620,
      }}
    >
      <LegacyPencilShadow />
      {LEGACY_PHOTO_PROPS.map((p, i) => (
        <motion.div
          key={p.id}
          aria-hidden
          initial={
            reduce ? false : { opacity: 0, y: 10, rotate: p.spot.rotate * 0.4 }
          }
          whileInView={{ opacity: 1, y: 0, rotate: p.spot.rotate }}
          viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
          transition={{
            duration: 0.7,
            ease: [0.2, 0.8, 0.2, 1],
            delay: 0.06 * i,
          }}
          style={{
            position: "absolute",
            left: p.spot.left,
            top: p.spot.top,
            width: p.spot.width,
            zIndex: p.spot.z,
            transform: `rotate(${p.spot.rotate}deg)`,
            willChange: "transform",
          }}
        >
          <LegacyPhotoTile prop={p} />
        </motion.div>
      ))}
      {artifacts.map((artifact, idx) => {
        const spot = LEGACY_FLATLAY_LAYOUT[artifact.id];
        if (!spot) return null;
        return (
          <motion.div
            key={artifact.id}
            initial={
              reduce ? false : { opacity: 0, y: 14, rotate: spot.rotate * 0.4 }
            }
            whileInView={{ opacity: 1, y: 0, rotate: spot.rotate }}
            viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
            transition={{
              duration: 0.7,
              ease: [0.2, 0.8, 0.2, 1],
              delay: 0.04 * idx + 0.2,
            }}
            style={{
              position: "absolute",
              left: spot.left,
              top: spot.top,
              width: spot.width,
              aspectRatio: spot.aspect,
              zIndex: spot.z,
              transform: `rotate(${spot.rotate}deg)`,
              boxShadow: `0 ${Math.round(Math.abs(spot.rotate) * 0.8 + 6)}px ${Math.round(Math.abs(spot.rotate) * 1.6 + 16)}px -${Math.round(Math.abs(spot.rotate) * 0.5 + 6)}px oklch(0.18 0.01 80 / 0.34)`,
              borderRadius: 4,
              willChange: "transform",
            }}
          >
            <ArtifactTile
              artifact={artifact}
              onOpen={onOpen}
              reduce={!!reduce}
              tilt={spot.rotate}
            >
              {renderArtifact(artifact)}
            </ArtifactTile>
          </motion.div>
        );
      })}
    </div>
  );
}

function LegacyPhotoTile({ prop }: { prop: LegacyPhotoProp }) {
  const baseShadow =
    "0 18px 36px -18px oklch(0.18 0.01 80 / 0.45), 0 4px 8px -4px oklch(0.18 0.01 80 / 0.28), 0 0 0 1px oklch(0.18 0.01 80 / 0.06)";

  if (prop.kind === "polaroid") {
    return (
      <div
        className="relative w-full"
        style={{
          background: "oklch(0.985 0.005 85)",
          padding: "8px 8px 32px",
          borderRadius: 3,
          boxShadow: baseShadow,
        }}
      >
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: prop.spot.aspect, borderRadius: 1 }}
        >
          <Image
            src={prop.src}
            alt={prop.alt}
            fill
            sizes="(min-width: 1024px) 18vw, 60vw"
            className="object-cover"
            style={{ objectPosition: "center 35%" }}
            loading="lazy"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, oklch(1 0 0 / 0.18) 0%, transparent 35%, transparent 70%, oklch(0 0 0 / 0.06) 100%)",
            }}
          />
        </div>
        {prop.caption ? (
          <p
            className="font-hand mt-2 text-center leading-tight text-ink-700"
            style={{ fontSize: "0.95rem" }}
          >
            {prop.caption}
          </p>
        ) : null}
        {legacyRenderChrome(prop.chrome)}
      </div>
    );
  }

  if (prop.kind === "folded-printout") {
    return (
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: prop.spot.aspect,
          borderRadius: 2,
          boxShadow: baseShadow,
        }}
      >
        <Image
          src={prop.src}
          alt={prop.alt}
          fill
          sizes="(min-width: 1024px) 22vw, 70vw"
          className="object-cover"
          loading="lazy"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0"
          style={{
            left: "44%",
            width: "14%",
            background:
              "linear-gradient(90deg, oklch(0 0 0 / 0) 0%, oklch(0 0 0 / 0.16) 50%, oklch(0 0 0 / 0) 100%)",
          }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(1 0 0 / 0.12) 0%, transparent 40%, transparent 65%, oklch(0 0 0 / 0.08) 100%)",
            mixBlendMode: "soft-light",
          }}
        />
        {legacyRenderChrome(prop.chrome)}
      </div>
    );
  }

  return (
    <div
      className="relative w-full"
      style={{
        background: "oklch(0.985 0.005 85)",
        padding: "6px",
        borderRadius: 2,
        boxShadow: baseShadow,
      }}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: prop.spot.aspect, borderRadius: 1 }}
      >
        <Image
          src={prop.src}
          alt={prop.alt}
          fill
          sizes="(min-width: 1024px) 26vw, 90vw"
          className="object-cover"
          style={{ objectPosition: "55% 45%" }}
          loading="lazy"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(1 0 0 / 0.14) 0%, transparent 40%, transparent 70%, oklch(0 0 0 / 0.08) 100%)",
          }}
        />
      </div>
      {legacyRenderChrome(prop.chrome)}
    </div>
  );
}

function legacyRenderChrome(chrome?: LegacyPhotoProp["chrome"]) {
  if (!chrome || chrome.length === 0) return null;
  return (
    <>
      {chrome.includes("tape-tl") ? <LegacyTapeStripDark side="tl" /> : null}
      {chrome.includes("tape-tr") ? <LegacyTapeStripDark side="tr" /> : null}
      {chrome.includes("tape-bl") ? <LegacyTapeStripDark side="bl" /> : null}
      {chrome.includes("tape-br") ? <LegacyTapeStripDark side="br" /> : null}
      {chrome.includes("paperclip") ? <LegacyPaperClip /> : null}
      {chrome.includes("index-01") ? <LegacyIndexCircle text="01" /> : null}
    </>
  );
}

function LegacyTapeStripDark({ side }: { side: "tl" | "tr" | "bl" | "br" }) {
  const pos = {
    tl: "left-[14%] -top-2 -rotate-[8deg]",
    tr: "right-[14%] -top-2 rotate-[10deg]",
    bl: "left-[14%] -bottom-2 rotate-[8deg]",
    br: "right-[14%] -bottom-2 -rotate-[10deg]",
  }[side];
  return (
    <span
      aria-hidden
      className={`absolute z-10 h-[14px] w-[44px] ${pos}`}
      style={{
        background:
          "linear-gradient(180deg, oklch(0.42 0.012 78 / 0.78) 0%, oklch(0.32 0.012 78 / 0.85) 100%)",
        boxShadow:
          "0 1px 0 oklch(0.18 0.01 80 / 0.18), inset 0 0 0 0.5px oklch(0.18 0.01 80 / 0.18)",
        opacity: 0.9,
      }}
    />
  );
}

function LegacyPaperClip() {
  return (
    <span
      aria-hidden
      className="absolute z-20"
      style={{ top: -10, left: 8, transform: "rotate(-14deg)" }}
    >
      <svg width="34" height="48" viewBox="0 0 34 48" fill="none" aria-hidden>
        <defs>
          <linearGradient id="legacy-clip-metal" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.85 0.01 80)" />
            <stop offset="50%" stopColor="oklch(0.62 0.01 80)" />
            <stop offset="100%" stopColor="oklch(0.4 0.012 80)" />
          </linearGradient>
        </defs>
        <path
          d="M 12 4 L 26 4 Q 30 4 30 8 L 30 38 Q 30 42 26 42 L 14 42 Q 10 42 10 38 L 10 14 Q 10 10 14 10 L 22 10 Q 26 10 26 14 L 26 32"
          stroke="url(#legacy-clip-metal)"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </span>
  );
}

function LegacyIndexCircle({ text }: { text: string }) {
  return (
    <span
      aria-hidden
      className="absolute z-30 flex items-center justify-center rounded-full font-mono text-[11px] font-semibold tracking-[0.04em]"
      style={{
        top: -14,
        right: -14,
        width: 38,
        height: 38,
        background: "oklch(0.18 0.01 80)",
        color: "oklch(0.96 0.012 80)",
        boxShadow:
          "0 4px 10px -2px oklch(0.18 0.01 80 / 0.5), inset 0 0 0 1px oklch(0.32 0.01 80)",
      }}
    >
      {text}
    </span>
  );
}

function LegacyPencilShadow() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute"
      style={{ left: "0%", top: "84%", width: "20%", opacity: 0.7 }}
      viewBox="0 0 220 32"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="legacy-pencil-body" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="oklch(0.45 0.012 70)" />
          <stop offset="50%" stopColor="oklch(0.30 0.012 70)" />
          <stop offset="100%" stopColor="oklch(0.20 0.01 70)" />
        </linearGradient>
      </defs>
      <ellipse cx="110" cy="26" rx="98" ry="3.2" fill="oklch(0.18 0.01 80 / 0.22)" />
      <g transform="rotate(-7 110 16)">
        <rect x="20" y="10" width="160" height="12" fill="url(#legacy-pencil-body)" rx="1.4" />
        <rect x="180" y="10" width="14" height="12" fill="oklch(0.62 0.04 80)" />
        <rect x="194" y="10" width="14" height="12" fill="oklch(0.62 0.18 38)" rx="1.4" />
        <path d="M 0 16 L 20 10 L 20 22 Z" fill="oklch(0.86 0.014 80)" />
        <path d="M 0 16 L 12 12 L 12 20 Z" fill="oklch(0.18 0.01 70)" />
      </g>
    </svg>
  );
}

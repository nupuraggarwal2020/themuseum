"use client";

/* ---------------------------------------------------------------------
   DrawerWall — the showpiece of Room 1.

   A uniform 8×6 grid of dark steel drawers hangs on the vault wall.
   Twelve specific cells correspond to the twelve artifacts in
   evidence/artifacts.ts and are scattered across the grid so the wall
   reads as a working cabinet, not a chart; the remaining 36 cells stay
   closed and provide rhythm. Each filed drawer wears a small
   content-type marker on its face (see Drawer.tsx · markerLabel) so a
   visitor can tell at a glance what kind of thing is inside before
   pulling. The wall is pinned for the duration of the room. As the
   visitor scrolls, drawers open and close in three acts — small
   clusters at a time, never more than ~6 protruding simultaneously. By
   the end of the third act all twelve will have been seen at least
   once.

   Visual precedents:
     - vault-01-museum.png         — wall of drawers, half-lit pulls
     - vault-02-imperial-war-museum.png — protrusion at random heights
     - vault-03-escobar-soap-drawers.png — placards next to open drawers

   Reduced motion: scroll choreography is replaced with a
   stagger-fade as the wall enters the viewport. Same artifacts
   revealed, no z-axis motion.

   Click on any open drawer (or focused + Enter / Space) opens the
   detail card. Closed drawers are not interactive.
   --------------------------------------------------------------------- */

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

import { Drawer } from "./Drawer";
import { ARTIFACTS, type Artifact } from "../evidence/artifacts";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ----- 8 columns × 6 rows = 48 cells ----- */
const COLS = 8;
const ROWS = 6;

/**
 * Grid positions for the twelve artifact drawers, keyed by artifact.id.
 * Two filed drawers per row, scattered across columns for rhythm so no
 * row reads as a tidy stripe. The order in ARTIFACTS still drives the
 * three-act scroll choreography (acts of 4 by index); positions here
 * only control where each artifact lives on the wall, not when it
 * opens. The act-cadence reads roughly top-to-bottom as you scroll —
 * by the end you've swept the whole cabinet.
 */
const ARTIFACT_POSITIONS: Record<string, { row: number; col: number }> = {
  // Act 1 (top of the cabinet)
  snacks:      { row: 0, col: 1 },
  ledger:      { row: 0, col: 4 },
  anniversary: { row: 1, col: 6 },
  polaroid:    { row: 1, col: 2 },
  // Act 2 (middle)
  dashboard:   { row: 2, col: 5 },
  recipe:      { row: 2, col: 0 },
  blister:     { row: 3, col: 3 },
  cassette:    { row: 3, col: 7 },
  // Act 3 (bottom)
  fingerprint: { row: 4, col: 1 },
  torn:        { row: 4, col: 5 },
  questions:   { row: 5, col: 2 },
  tag:         { row: 5, col: 7 },
};

const MAX_TZ = 124; // pixels — fully-extended drawer

type Props = {
  /** Inner content for each artifact cell — the existing Artifacts.tsx
      renderer, kept unchanged so the recreations live inside the lit
      pocket without retoning. */
  renderArtifact: (artifact: Artifact) => ReactNode;
  /** Click handler for an artifact drawer. */
  onOpen: (artifact: Artifact) => void;
};

export function DrawerWall({ renderArtifact, onOpen }: Props) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const wallRef = useRef<HTMLDivElement | null>(null);
  const drawerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const reduceRef = useRef<boolean>(false);

  // Detect reduced motion before mount; useGSAP runs after.
  useEffect(() => {
    if (typeof window === "undefined") return;
    reduceRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  /** Per-drawer scroll window. The 12 artifacts are split into 3 acts
      of 4 drawers each. Within an act the drawers stagger by 4%. Drawers
      in acts 1 & 2 close before the next act starts; act 3 drawers stay
      open at the end. */
  const windows = useMemo(() => {
    const w: Record<string, { openAt: number; peakAt: number; closeAt: number }> =
      {};
    ARTIFACTS.forEach((a, idx) => {
      const act = Math.floor(idx / 4); // 0,1,2
      const actStart = act / 3;
      const actEnd = (act + 1) / 3;
      const offset = (idx % 4) * 0.04;
      const openAt = actStart + offset;
      const peakAt = openAt + 0.08;
      const closeAt =
        act === 2 ? 1.6 /* never closes */ : actEnd - 0.02;
      w[a.id] = { openAt, peakAt, closeAt };
    });
    return w;
  }, []);

  // Compute tz for one drawer at a given progress.
  const computeTz = useCallback(
    (id: string, p: number) => {
      const win = windows[id];
      if (!win) return 0;
      // Before opening
      if (p < win.openAt) return 0;
      // After closing
      if (p >= win.closeAt) return 0;
      // Ramp-up phase
      if (p < win.peakAt) {
        const t = (p - win.openAt) / Math.max(0.0001, win.peakAt - win.openAt);
        return MAX_TZ * easeOutCubic(clamp01(t));
      }
      // Hold + ramp-down phase
      const closeStart = Math.max(win.peakAt, win.closeAt - 0.07);
      if (p < closeStart) return MAX_TZ;
      const t = (p - closeStart) / Math.max(0.0001, win.closeAt - closeStart);
      return MAX_TZ * (1 - easeInCubic(clamp01(t)));
    },
    [windows],
  );

  useGSAP(
    () => {
      if (typeof window === "undefined") return;
      if (!stageRef.current || !wallRef.current) return;
      if (reduceRef.current) {
        // Reduced-motion: stagger-fade the artifact drawers into a
        // visible "open" state as the wall enters view, no scrolling.
        gsap.set(Object.values(drawerRefs.current), { opacity: 1 });
        ARTIFACTS.forEach((a, idx) => {
          const el = drawerRefs.current[a.id];
          if (!el) return;
          el.style.setProperty("--tz", `${MAX_TZ}px`);
          el.style.transform = `translate3d(0, 0, ${MAX_TZ}px)`;
          el.style.opacity = "0";
          gsap.to(el, {
            opacity: 1,
            duration: 0.6,
            delay: 0.05 * idx,
            ease: "power2.out",
            scrollTrigger: {
              trigger: stageRef.current!,
              start: "top 80%",
              once: true,
            },
          });
        });
        return;
      }

      const trigger = ScrollTrigger.create({
        trigger: stageRef.current!,
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          for (const a of ARTIFACTS) {
            const el = drawerRefs.current[a.id];
            if (!el) continue;
            const tz = computeTz(a.id, p);
            el.style.setProperty("--tz", `${tz.toFixed(1)}px`);
            el.style.transform = `translate3d(0, 0, ${tz.toFixed(1)}px)`;
            // Update aria-expanded once a drawer is past 30% open so
            // screen readers track the open state.
            if (tz > MAX_TZ * 0.3) {
              if (el.getAttribute("aria-expanded") !== "true") {
                el.setAttribute("aria-expanded", "true");
              }
            } else if (el.getAttribute("aria-expanded") !== "false") {
              el.setAttribute("aria-expanded", "false");
            }
          }
        },
      });

      return () => {
        trigger.kill();
      };
    },
    { scope: stageRef },
  );

  return (
    <div
      ref={stageRef}
      className="drawer-wall-stage relative h-screen w-full overflow-hidden"
      style={{
        // The vault sits behind a deeper well, so the wall reads as a
        // recess in the background. Both stops flow through the
        // --drawer-wall-bg-* tokens so the wall retones to a neutral
        // bone palette in light mode without touching the component.
        background:
          "radial-gradient(ellipse at center, var(--drawer-wall-bg-inner) 0%, var(--drawer-wall-bg-outer) 80%)",
      }}
    >
      {/* Soft warm overhead pool — a far light source, like vault-01. In
          dark mode this reads as a warm cattle-light pool; in light mode
          --drawer-wall-pool is dialed down to a near-invisible warm wash
          so it doesn't bloom against the bone background. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1/3"
        style={{
          background:
            "radial-gradient(ellipse 50vw 24vh at 50% -10%, var(--drawer-wall-pool) 0%, transparent 75%)",
        }}
      />

      <div
        ref={wallRef}
        className="drawer-wall relative mx-auto flex h-full w-full max-w-[80rem] items-center justify-center px-6 py-10 sm:px-10"
        style={{ perspective: "2200px", perspectiveOrigin: "50% 45%" }}
      >
        <div
          className="grid h-full max-h-[78vh] w-full"
          style={{
            gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
            gap: "10px",
            transformStyle: "preserve-3d",
          }}
        >
          {Array.from({ length: ROWS * COLS }).map((_, idx) => {
            const row = Math.floor(idx / COLS);
            const col = idx % COLS;
            const artifact = findArtifactAt(row, col);
            if (!artifact) {
              return <ClosedCell key={`cell-${idx}`} />;
            }
            return (
              <ArtifactCell
                key={`cell-${idx}`}
                artifact={artifact}
                onOpen={onOpen}
                refSetter={(el) => {
                  drawerRefs.current[artifact.id] = el;
                }}
              >
                {renderArtifact(artifact)}
              </ArtifactCell>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ----- Cell renderers ----- */

function ClosedCell() {
  return (
    <div
      aria-hidden
      className="relative tex-drawer-face"
      style={{
        border: "1px solid var(--drawer-border)",
        boxShadow:
          "inset 0 1px 0 var(--drawer-edge-highlight), inset 0 -1px 0 var(--drawer-edge-shadow)",
      }}
    >
      {/* Lip line */}
      <span
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "var(--drawer-lip)" }}
      />
      {/* Handle */}
      <span
        className="pointer-events-none absolute top-[12%] left-1/2 -translate-x-1/2"
        style={{
          width: "26%",
          height: "12%",
          borderRadius: "999px",
          background:
            "radial-gradient(ellipse at 50% 30%, var(--drawer-handle-bright) 0%, var(--drawer-handle-mid) 65%, var(--drawer-handle-dim) 100%)",
          boxShadow:
            "inset 0 1px 0 var(--drawer-handle-edge-light), inset 0 -1px 0 var(--drawer-handle-edge-dark)",
        }}
      />
    </div>
  );
}

function ArtifactCell({
  artifact,
  onOpen,
  refSetter,
  children,
}: {
  artifact: Artifact;
  onOpen: (artifact: Artifact) => void;
  refSetter: (el: HTMLDivElement | null) => void;
  children: ReactNode;
}) {
  const placard = artifactPlacard(artifact);
  return (
    <div
      className="relative"
      style={{ transformStyle: "preserve-3d", zIndex: 5 }}
    >
      <Drawer
        ref={refSetter}
        tz={0}
        lit
        interactive
        onClick={() => onOpen(artifact)}
        ariaLabel={`Open exhibit ${artifact.exhibit} · ${artifact.label}`}
        placard={placard}
        markerLabel={artifact.type}
        className="absolute inset-0"
      >
        <div className="h-full w-full p-1">{children}</div>
      </Drawer>
    </div>
  );
}

/* ----- helpers ----- */

function findArtifactAt(row: number, col: number): Artifact | null {
  for (const a of ARTIFACTS) {
    const pos = ARTIFACT_POSITIONS[a.id];
    if (pos && pos.row === row && pos.col === col) return a;
  }
  return null;
}

function artifactPlacard(a: Artifact) {
  // The placard is pulled from the artifact metadata: type word from
  // kind, plus the year picked off the meta string when available.
  const yearMatch = a.meta.match(/(\d{4})/);
  const type = TYPE_LABEL[a.kind];
  return {
    exhibit: a.exhibit,
    type,
    year: yearMatch ? `FILED ${yearMatch[1]}` : "ON FILE",
  };
}

const TYPE_LABEL: Record<Artifact["kind"], string> = {
  keep: "KEEP NOTE",
  polaroid: "DESIGN BOARD",
  device: "DASHBOARD",
  recipe: "RECIPE",
  blister: "MEDICAL CARD",
  cassette: "VOICE MEMOS",
  fingerprint: "INTAKE PRINT",
  torn: "TORN PAGE",
  questions: "QUESTIONS",
  tag: "EXHIBIT TAG",
};

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}
function easeInCubic(t: number) {
  return t * t * t;
}

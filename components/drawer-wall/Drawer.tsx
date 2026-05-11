"use client";

/* ---------------------------------------------------------------------
   A single file drawer. Two purposes:
   1. Static decoration (the half-lit drawer at the foot of the hero).
   2. Cell of the DrawerWall — opening / closing on scroll.

   The drawer is a CSS box with a steel-coloured face, a small round
   handle, an inner "pocket" that becomes visible as the drawer pulls
   forward, and an optional placard rendered to the side once the
   drawer protrudes past a threshold. All transformation is driven by
   the --tz custom property (in pixels). The parent sets perspective.
   --------------------------------------------------------------------- */

import {
  forwardRef,
  type CSSProperties,
  type ReactNode,
} from "react";

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export type DrawerHandleProps = {
  /** Pixels of forward translation. 0 = flush, ~120 = fully out. */
  tz?: number;
  /** Optional content rendered inside the open pocket. */
  children?: ReactNode;
  /** Optional placard. Sits to the right of the open drawer. */
  placard?: {
    exhibit: string; // EXHIBIT 01
    type: string;    // KEEP NOTE / DEVICE / etc
    year: string;    // FILED 2018
  };
  /** When true, the drawer body lights up internally with an ember halo. */
  lit?: boolean;
  /** Extra Tailwind/className passthrough for parent sizing. */
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
  /** Click handler (turns the drawer into a button). */
  onClick?: () => void;
  /** Tab order opt-in for keyboard. */
  tabIndex?: number;
  /** Whether the drawer should announce as a button. */
  interactive?: boolean;
  /** Disable the handle hover tilt — used by the static hero drawer. */
  staticHandle?: boolean;
  /**
   * Tiny content-type marker engraved into the top-left of the drawer
   * face — a one-word indicator of what's filed inside (LIST · LEDGER ·
   * SESSION …). Visible at rest; the lit pocket overlays it as the
   * drawer opens. Optional; closed/empty cells leave it blank.
   */
  markerLabel?: string;
};

export const Drawer = forwardRef<HTMLDivElement, DrawerHandleProps>(
  function DrawerImpl(
    {
      tz = 0,
      children,
      placard,
      lit = false,
      className = "",
      style,
      ariaLabel,
      onClick,
      tabIndex,
      interactive = false,
      staticHandle = false,
      markerLabel,
    },
    ref,
  ) {
    const isOpen = tz > 6;

    // Y-axis shadow grows with tz: closed drawers cast nothing, open
    // drawers cast a long pool below them.
    const dropShadow =
      tz > 1
        ? `0 ${Math.round(tz * 0.18) + 2}px ${Math.round(tz * 0.55) + 14}px -${Math.round(tz * 0.2) + 8}px oklch(0 0 0 / 0.85)`
        : "none";

    // --shine: a 0..1 scalar driving the volumetric halo, the inner
    // pocket glow, and the forward light shaft. It scales with --tz
    // (so partly-open drawers leak less). Designers can override it
    // globally by setting --shine on a parent.
    const shine = clamp01(tz / 124);

    // Inner pocket lighting — only visible when open.
    const pocketLight = isOpen ? 1 : 0;

    // Halated outer bloom around an open drawer. The first shadow is the
    // wide volumetric halo (large blur, low opacity). The second is a
    // tighter warm edge — the bit that reads as a hot rim. Both fade
    // with shine, so closed drawers stay matte. The drop-shadow filter
    // above contributes the long pool beneath the protruding face.
    const halo =
      isOpen
        ? [
            `0 0 ${Math.round(80 + shine * 40)}px oklch(0.62 0.18 45 / ${(0.12 * shine).toFixed(3)})`,
            `0 0 ${Math.round(28 + shine * 18)}px oklch(0.62 0.18 45 / ${(0.30 * shine).toFixed(3)})`,
          ].join(", ")
        : "none";

    return (
      <div
        ref={ref}
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? (tabIndex ?? 0) : undefined}
        aria-label={ariaLabel}
        onClick={interactive ? onClick : undefined}
        onKeyDown={
          interactive
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick?.();
                }
              }
            : undefined
        }
        className={`drawer ${interactive ? "drawer--interactive" : ""} ${className}`}
        style={{
          ...style,
          // Move the entire drawer forward on Z. The parent provides
          // perspective; the drawer transforms in 3D.
          transform: `translate3d(0, 0, var(--tz, ${tz}px))`,
          ["--tz" as string]: `${tz}px`,
          ["--shine" as string]: shine.toFixed(3),
          transformStyle: "preserve-3d",
          willChange: "transform",
          filter: dropShadow !== "none" ? `drop-shadow(${dropShadow})` : undefined,
        }}
      >
        {/* Forward light shaft — projects from the drawer mouth toward
            the viewer. A vertical soft-light gradient blurred ~40px,
            scaled with --shine so partly-open drawers leak less. The
            shaft sits BEHIND the drawer body in stacking but FORWARD on
            Z so it reads as warmth spilling into the room. */}
        {isOpen ? (
          <span
            aria-hidden
            className="drawer__shaft pointer-events-none absolute left-1/2 top-full -translate-x-1/2"
            style={{
              width: `${110 + shine * 35}%`,
              height: `${50 + shine * 60}%`,
              transform: `translate3d(-50%, -10%, ${(tz * 0.4).toFixed(1)}px)`,
              background:
                "radial-gradient(ellipse 50% 60% at 50% 0%, oklch(0.78 0.16 50 / 0.55) 0%, oklch(0.62 0.18 45 / 0.18) 35%, transparent 75%)",
              filter: "blur(40px)",
              opacity: (0.6 * shine).toFixed(3),
              mixBlendMode: "screen",
              willChange: "opacity, transform",
            }}
          />
        ) : null}

        {/* The drawer body: face + side walls implied by inner shadow.
            Open drawers carry the volumetric halo via box-shadow; closed
            drawers stay matte. All face / edge / inset colours flow
            through the --drawer-* tokens so the wall retones per theme
            without touching the component (the ember halo stays warm
            in both modes because the open-drawer light is a warm bulb
            independent of the cabinet finish). */}
        <div
          className="relative h-full w-full overflow-hidden tex-drawer-face"
          style={{
            border: "1px solid var(--drawer-border)",
            boxShadow: isOpen
              ? `inset 0 1px 0 var(--drawer-edge-highlight-open), inset 0 -2px 0 var(--drawer-edge-shadow-open), inset 0 0 0 1px var(--drawer-edge-deep-open), ${halo}`
              : "inset 0 1px 0 var(--drawer-edge-highlight), inset 0 -1px 0 var(--drawer-edge-shadow)",
            transition: "box-shadow 240ms var(--ease-settle)",
          }}
        >
          {/* Content-type marker — small engraved sticker centred on
              the steel face, just below the handle. Mono uppercase,
              hairline scale, so it reads like a real cabinet label
              rather than a UI badge. Sits BEFORE the lit pocket in
              source order: when the drawer pulls forward and the
              pocket lights up, the marker is gently overlaid by the
              warm interior, the way a real drawer label disappears
              behind the file you've just pulled. Hidden below sm:
              the wall already crowds at phone widths; the marker
              would only add noise. */}
          {markerLabel ? (
            <span
              aria-hidden
              className="drawer__marker pointer-events-none absolute hidden -translate-x-1/2 font-mono uppercase sm:inline-block"
              style={{
                top: "26%",
                left: "50%",
                fontSize: 9,
                lineHeight: 1,
                letterSpacing: "0.18em",
                color: "var(--color-ink-500)",
                textShadow: "var(--drawer-marker-shadow)",
                whiteSpace: "nowrap",
              }}
            >
              {markerLabel}
            </span>
          ) : null}

          {/* The pocket — a lit warm interior visible only when open.
              The brightness ramps with tz so the reveal feels physical. */}
          <span
            aria-hidden
            className="absolute inset-[3px] block"
            style={{
              background:
                "linear-gradient(180deg, oklch(0.92 0.02 80) 0%, oklch(0.86 0.025 75) 100%)",
              opacity: pocketLight,
              transition: "opacity 240ms var(--ease-settle)",
            }}
          />

          {/* Lip — a thin band along the top so the closed drawer reads
              as a real face rather than a flat tile. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{ background: "var(--drawer-lip)" }}
          />

          {/* Handle — a small round depression near the top centre. */}
          <span
            aria-hidden
            className={`pointer-events-none absolute top-[10%] left-1/2 -translate-x-1/2 ${
              staticHandle ? "" : "transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
            }`}
            style={{
              width: "18%",
              height: "10%",
              borderRadius: "999px",
              background:
                "radial-gradient(ellipse at 50% 30%, var(--drawer-handle-bright) 0%, var(--drawer-handle-mid) 65%, var(--drawer-handle-dim) 100%)",
              boxShadow:
                "inset 0 1px 0 var(--drawer-handle-edge-light), inset 0 -1px 0 var(--drawer-handle-edge-dark)",
            }}
          />

          {/* Inner light leak — soft ember-glow radial biased toward
              the front edge (the bit facing the viewer). Sits OVER the
              pocket but BELOW the children in source order so artifact
              text still reads. Mix-blend-mode: screen makes it tint the
              warm pocket without flattening it. Scales with --shine so
              partly-open drawers leak less. */}
          {lit ? (
            <span
              aria-hidden
              className="drawer__leak pointer-events-none absolute inset-[3px]"
              style={{
                background:
                  "radial-gradient(ellipse 95% 80% at 50% 105%, oklch(0.78 0.16 50 / 0.45) 0%, oklch(0.78 0.16 50 / 0.18) 35%, transparent 75%)",
                opacity: (0.22 * (isOpen ? 1 : 0) * (0.6 + shine * 0.4)).toFixed(
                  3,
                ),
                mixBlendMode: "screen",
                transition: "opacity 240ms var(--ease-settle)",
              }}
            />
          ) : null}

          {/* Children land inside the open pocket. The DrawerWall slots
              the artifact recreation into here. The pocket is .surface-lit
              so the artifact reads against warm paper. Sits on top of
              the inner leak, so the typographic recreations stay crisp. */}
          {children ? (
            <div
              className="surface-lit absolute inset-[4px] z-[2] flex items-center justify-center overflow-hidden"
              style={{
                opacity: pocketLight,
                transition: "opacity 240ms var(--ease-settle)",
              }}
            >
              {children}
            </div>
          ) : null}
        </div>

        {/* Placard — sits to the right of the open drawer.
            Precedent: vault-03-escobar-soap-drawers.png */}
        {placard ? (
          <div
            aria-hidden
            className="pointer-events-none absolute left-full top-1/2 ml-3 hidden -translate-y-1/2 sm:block"
            style={{
              opacity: isOpen ? 1 : 0,
              transition: "opacity 280ms var(--ease-settle)",
              transform: "translate3d(0, -50%, 12px)",
            }}
          >
            <div
              className="surface-lit min-w-[140px] border border-rule bg-paper px-3 py-2"
              style={{ boxShadow: "var(--shadow-pin)" }}
            >
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-900">
                {placard.exhibit}
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-700">
                {placard.type}
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-500">
                {placard.year}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    );
  },
);

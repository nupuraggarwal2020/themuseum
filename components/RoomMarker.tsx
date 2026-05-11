"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

type Room = { id: string; label: string; index: string };

const ROOMS: Room[] = [
  { id: "hero", label: "Front desk", index: "00" },
  { id: "room-1", label: "Evidence log", index: "01" },
  { id: "room-2", label: "Idea: Scroll back", index: "02" },
  { id: "room-3", label: "Idea: Meeting shards", index: "03" },
  { id: "letter", label: "For the record", index: "04" },
];

/**
 * A vertical sliver of case-file tabs on the right edge. Hover for the
 * room name. Click to jump. Highlights the room in view via IO. The
 * current room reads as a lit ember dot; the others are faint vault
 * dashes.
 *
 * The nav stays idle (faint, click-through) at all times — even while
 * scrolling — and only reveals on pointer-hover over the right-edge
 * hot zone or on keyboard focus-within. The scroll-driven reveal was
 * removed because it was distracting and reintroduced the
 * accidental-click problem during normal page scrolling.
 */
export function RoomMarker() {
  const [active, setActive] = useState<string>("hero");
  const [isHovered, setIsHovered] = useState(false);
  const [isFocusWithin, setIsFocusWithin] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const els = ROOMS.map((r) => document.getElementById(r.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (els.length === 0) return;
    // "Section whose top has crossed the viewport midpoint wins."
    // Shrinking the root by 50% on top and bottom collapses it to a
    // single horizontal line at the viewport center; a section
    // intersects that line iff its top is above center AND its bottom
    // is below center. With threshold 0 the observer fires the moment
    // a section's edge crosses the midpoint, regardless of how tall
    // the section is. The previous "highest intersectionRatio" rule
    // broke for the rooms because their pinned scroll experiences
    // (DrawerWall, ScrollBack, MemoryShards) make each room many
    // viewports tall, so its ratio against the (then-60vh) root
    // never crossed the lowest threshold of 0.2 — leaving the hero
    // stuck as the active marker.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { threshold: 0, rootMargin: "-50% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const visible = isHovered || isFocusWithin;
  const transition = reduce ? "none" : "opacity 140ms ease";

  return (
    <>
      {/* Hover hot zone. The nav itself is pointer-events: none while
          idle (so clicks fall through to the page underneath), which
          would otherwise also defeat hover-to-summon. This slim strip
          on the right edge stays interactive purely to catch the
          inbound pointer and flip the nav into its visible state. */}
      <div
        aria-hidden
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        className="fixed right-0 top-1/2 z-30 hidden h-64 w-12 -translate-y-1/2 lg:block"
      />
      <nav
        aria-label="Case files"
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocusWithin(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            setIsFocusWithin(false);
          }
        }}
        style={{
          opacity: visible ? 1 : 0.25,
          pointerEvents: visible ? "auto" : "none",
          transition,
        }}
        className="fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 lg:block"
      >
        <ol className="flex flex-col gap-3">
          {ROOMS.map((r) => {
            const isActive = active === r.id;
            return (
              <li key={r.id}>
                <a
                  href={`#${r.id}`}
                  aria-current={isActive ? "location" : undefined}
                  className="group flex items-center justify-end gap-3"
                >
                  <span
                    className={`pointer-events-none font-mono text-[10px] uppercase tracking-[0.16em] text-ink-700 transition-opacity duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                      visible
                        ? isActive
                          ? "opacity-100"
                          : "opacity-70"
                        : "opacity-0"
                    }`}
                  >
                    <span className="text-ink-400">{r.index}</span>
                    <span className="ml-2">{r.label}</span>
                  </span>
                  {isActive ? (
                    <span
                      aria-hidden
                      className="block h-2 w-2 rounded-full bg-ember"
                      style={{
                        boxShadow:
                          "0 0 10px 1px color-mix(in oklch, var(--color-ember-glow) 55%, transparent)",
                      }}
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="block h-[2px] w-4 origin-right bg-ink-300 transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:w-6 group-hover:bg-ink-on-dark"
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

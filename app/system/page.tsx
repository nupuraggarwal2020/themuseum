import type { Metadata } from "next";
import Link from "next/link";

import { SiteFrame } from "@/components/SiteFrame";
import { FieldNotes } from "@/components/system/FieldNotes";
import { MotionDemos } from "@/components/system/MotionDemos";
import { SwatchGrid } from "@/components/system/SwatchGrid";
import { drawerTokens, fontTokens, typeRamp } from "@/lib/tokens";

export const metadata: Metadata = {
  title: "System",
  description:
    "Tokens, type, and motion that hold the museum together. Read directly from the stylesheet.",
};

export default function SystemPage() {
  return (
    <>
      <SiteFrame />
      <main
        id="main"
        className="relative z-10 mx-auto max-w-[68rem] px-6 pb-32 pt-32 sm:px-10 sm:pt-44"
      >
        <header className="border-b border-rule pb-12">
          <div className="flex items-baseline gap-4 text-ink-500">
            <span className="font-mono text-[11px] tracking-[0.18em]">/SYSTEM</span>
            <span className="h-px flex-1 bg-rule" aria-hidden />
          </div>
          <h1 className="t-headline mt-6 text-ink-on-dark">
            The pieces underneath.
          </h1>
          <p className="t-lede mt-5 max-w-[60ch]">
            One serif, one sans, one accent, three easings. Every choice on the
            site reads from this page. Change a token here, the museum moves
            with it.
          </p>
        </header>

        <Block title="Color" eyebrow="01">
          <p className="t-body max-w-[60ch] text-ink-700">
            A deep matte vault, near-white ink-on-dark, and a single halated
            ember. Every token name from the warm-bone build is preserved
            and retargeted; values are still OKLCH so the brightness curves
            at the extremes hold up.
          </p>
          <div className="surface-lit mt-10 rounded-md border border-rule bg-paper p-5 sm:p-7">
            <SwatchGrid />
          </div>
        </Block>

        <Block title="Typography" eyebrow="02">
          <p className="t-body max-w-[60ch] text-ink-700">
            One editorial serif for narrative weight, one geometric sans for
            interface. The display sizes use{" "}
            <code className="font-mono text-[14px] text-ink-on-dark">clamp()</code>{" "}
            so the type ramp scales down honestly on small screens instead of
            collapsing to body.
          </p>
          <ul className="surface-lit mt-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {fontTokens.map((f) => (
              <li
                key={f.cssVar}
                className="rounded-md border border-rule bg-paper p-5"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-700">
                  {f.name}
                </p>
                <p className="mt-2 font-mono text-[10px] text-ink-400">
                  var(--{f.cssVar})
                </p>
                <p className="mt-3 text-[13px] text-ink-700">{f.role}</p>
                {f.substituteNote ? (
                  <p className="mt-3 border-t border-rule pt-3 font-serif italic text-[13px] text-ink-500">
                    {f.substituteNote}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>

          <div className="surface-lit mt-12 rounded-md border border-rule bg-paper p-5 sm:p-7">
            <p className="t-eyebrow mb-6 text-ink-500">Type ramp</p>
            <ul className="space-y-10">
              {typeRamp.map((t) => (
                <li
                  key={t.name}
                  className="grid grid-cols-1 gap-3 lg:grid-cols-[140px_1fr]"
                >
                  <div className="flex flex-col gap-1 lg:pt-2">
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-700">
                      {t.name}
                    </span>
                    <span className="font-mono text-[10px] text-ink-400">
                      {t.spec}
                    </span>
                  </div>
                  <div className={t.cls + " text-balance text-ink-900"}>
                    {t.sample}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Block>

        <Block title="Motion" eyebrow="03">
          <p className="t-body max-w-[60ch] text-ink-700">
            Three eases, three durations. Anything that wants more is asking
            to be a different surface.
          </p>
          <div className="surface-lit mt-10 rounded-md border border-rule bg-paper p-5 sm:p-7">
            <MotionDemos />
          </div>
        </Block>

        <Block title="Drawer cabinet" eyebrow="04">
          <p className="t-body max-w-[60ch] text-ink-700">
            The 8×6 wall in Room 1 used to hardcode its face / handle / lip
            / inset colours inline. They now flow through{" "}
            <code className="font-mono text-[14px] text-ink-on-dark">
              --drawer-*
            </code>{" "}
            custom properties so the cabinet can be retoned per theme
            without touching <code className="font-mono">Drawer.tsx</code> or{" "}
            <code className="font-mono">DrawerWall.tsx</code>. Light mode
            retones the same geometry from dark steel to pale-bone;
            interactions, GSAP choreography, and the{" "}
            <code className="font-mono">--tz</code> mechanic are untouched.
          </p>
          <div className="surface-lit mt-10 rounded-md border border-rule bg-paper p-5 sm:p-7">
            <SwatchGrid tokens={drawerTokens} />
          </div>
        </Block>

        <Block title="Field notes" eyebrow="05">
          <p className="t-body max-w-[60ch] text-ink-700">
            Decisions taken while building this. Filed in four cases:
            direction, strategy, maturity, taste. Each entry is one
            decision and a sentence of reasoning. Read these instead of
            a feature list.
          </p>
          <FieldNotes />
        </Block>

        <Block title="Notes & deviations" eyebrow="06">
          <ul className="surface-lit t-body grid grid-cols-1 gap-5 text-ink-700 lg:grid-cols-2">
            <li className="rounded-md border border-rule bg-paper p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-700">
                Serif substitution
              </p>
              <p className="mt-3 text-[14px]">
                Söhne Serif / Tiempos / Lyon Text were the ideal targets. We
                ship Newsreader (Google Fonts, free, self-hosted via
                next/font) so the site ships without licensing friction. Swap
                in a paid serif by changing one font import.
              </p>
            </li>
            <li className="rounded-md border border-rule bg-paper p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-700">
                Audio in Scroll Back
              </p>
              <p className="mt-3 text-[14px]">
                The prototype simulates playback via a JS timer keyed to a
                cadence per character. To wire real audio, replace the rAF
                loop with <code className="font-mono">audio.currentTime</code>{" "}
                and the cadence math with sentence start/end timestamps.
              </p>
            </li>
            <li className="rounded-md border border-rule bg-paper p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-700">
                Reduced motion
              </p>
              <p className="mt-3 text-[14px]">
                Both prototypes degrade cleanly when the user prefers reduced
                motion: drag is replaced by Enter to shard, the Scroll Back
                flight animation skips its arc and the card appears in place,
                the DrawerWall loses its scroll choreography in favour of a
                stagger-fade, the IntakeCard skips the polaroid develop, and
                the ember bloom in the Atmosphere layer pauses.
              </p>
            </li>
            <li className="rounded-md border border-rule bg-paper p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-700">
                Where the placeholders live
              </p>
              <p className="mt-3 text-[14px]">
                Every personal copy block is marked with{" "}
                <code className="font-mono">{"{{ REPLACE: ... }}"}</code> in
                the source. Search the repo for that string to see the full
                set in one pass.
              </p>
            </li>
            <li className="rounded-md border border-rule bg-paper p-5 lg:col-span-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-700">
                Dark-vault retheme
              </p>
              <p className="mt-3 text-[14px]">
                The site reads as a dark vault with one halated ember accent.
                The original warm-bone palette is preserved as a scope
                (<code className="font-mono">.surface-lit</code>) so anything
                that lives inside a lit drawer, a paper card, the Vision-Pro
                detail surface, or the FOR THE RECORD intake card keeps its
                dark-on-warm legibility. Tokens did not rename; only their
                values flipped. The grain, ember bloom, and vignette all
                live in a single fixed-position{" "}
                <code className="font-mono">&lt;Atmosphere /&gt;</code> layer
                rendered once by{" "}
                <code className="font-mono">SiteFrame</code>; per-component
                grain duplicates are forbidden.
              </p>
            </li>
            <li className="rounded-md border border-rule bg-paper p-5 lg:col-span-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-700">
                Flatlay collage
              </p>
              <p className="mt-3 text-[14px]">
                Room 1&rsquo;s open case file is now a photographic
                scrapbook. On{" "}
                <code className="font-mono">lg+</code>{" "}
                <code className="font-mono">&lt;Flatlay /&gt;</code> renders{" "}
                <code className="font-mono">FlatlayPhotoCollage</code> — a
                manila folder base (<code className="font-mono">collage/7.png</code>)
                plus twelve overlay pieces from{" "}
                <code className="font-mono">public/collage/</code>,
                absolutely positioned over a cream stage at{" "}
                <code className="font-mono">aspectRatio: 1024/583</code>{" "}
                with no black backdrop or wrapping{" "}
                <code className="font-mono">boxShadow</code>. Below{" "}
                <code className="font-mono">lg</code> a single{" "}
                <code className="font-mono">FlatlayPhotoCollageFallback</code>{" "}
                ships the pre-composited{" "}
                <code className="font-mono">/collage/fallback.jpg</code>{" "}
                instead of re-packing thirteen layers into a narrow column.
                Every overlay is drag-and-resize editable in place: framer
                handles drag, a bottom-right grip handles resize (cursor
                delta projected onto the piece&rsquo;s local axis so
                tilted pieces still feel anchored). The layout persists to{" "}
                <code className="font-mono">localStorage</code> under{" "}
                <code className="font-mono">museum-collage-layout-v1</code>;
                the bottom-left{" "}
                <em className="italic">Export layout / Reset</em> cluster
                writes the current arrangement to the clipboard as JSON
                to bake back into{" "}
                <code className="font-mono">COLLAGE_PIECES</code> as the
                new default. The previous typographic spread
                (<code className="font-mono">FlatlayManilaStage</code>),
                its stacked fallback
                (<code className="font-mono">FlatlayStackedStage</code>)
                and the warm panel wrapper
                (<code className="font-mono">LegacyDeskPanel</code>) are
                kept in-file as{" "}
                <code className="font-mono">@deprecated</code> revert
                paths.
              </p>
            </li>
            <li className="rounded-md border border-rule bg-paper p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-700">
                Prototype flatness
              </p>
              <p className="mt-3 text-[14px]">
                The forensic prototypes drop drop-shadows. The{" "}
                <code className="font-mono">FiledFrame</code> wrapper
                now paints a single{" "}
                <code className="font-mono">
                  boxShadow: 0 0 0 1px var(--color-rule-strong)
                </code>{" "}
                hairline instead of the old{" "}
                <code className="font-mono">--shadow-card</code> stack,
                and applies a new{" "}
                <code className="font-mono">.proto-flat</code> utility
                that neutralises{" "}
                <code className="font-mono">--shadow-card</code>,{" "}
                <code className="font-mono">--shadow-lift</code> and{" "}
                <code className="font-mono">--shadow-pin</code> for
                every descendant. Cards, buttons, shards and the spatial
                canvas inside any prototype that opts in render without
                depth cues in both light and dark mode.{" "}
                <code className="font-mono">MemoryShards</code> in
                particular no longer hardcodes its own{" "}
                <code className="font-mono">boxShadow</code> on the
                spatial canvas — the structure now reads through
                hairlines alone.
              </p>
            </li>
            <li className="rounded-md border border-rule bg-paper p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-700">
                IntakeCard surface
              </p>
              <p className="mt-3 text-[14px]">
                The FOR THE RECORD card opts in to{" "}
                <code className="font-mono">.proto-flat</code> so its
                wrapper carries the same 1px hairline as every other
                prototype. Inside the card we locally override{" "}
                <code className="font-mono">--color-paper</code> and{" "}
                <code className="font-mono">--color-bone-50</code> to{" "}
                <code className="font-mono">oklch(0.955 0.003 80)</code>
                {" "}— same lightness as the warm{" "}
                <code className="font-mono">surface-lit</code> paper,
                near-zero chroma so the inner sheet reads as neutral
                grey-beige instead of pale yellow. The{" "}
                <em className="italic">Save as PNG</em> exporter writes
                the same swatch (<code className="font-mono">#f0efed</code>)
                as the canvas background so the saved exhibit matches
                the on-screen card.
              </p>
            </li>
          </ul>
        </Block>

        <footer className="mt-24 flex items-baseline justify-between border-t border-rule pt-8 text-ink-500">
          <Link
            href="/"
            className="press inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] text-ink-700 hover:text-ink-on-dark"
          >
            <span aria-hidden>←</span> Back to the museum
          </Link>
          <span className="font-mono text-[11px] text-ink-400">
            v0.2 · May 2026 · dark vault
          </span>
        </footer>
      </main>
    </>
  );
}

function Block({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-24 border-t border-rule pt-12">
      <header className="flex items-baseline gap-4 text-ink-500">
        <span className="font-mono text-[11px] tracking-[0.18em]">
          {eyebrow}
        </span>
        <span className="h-px flex-1 bg-rule" aria-hidden />
        <span className="t-eyebrow">{title}</span>
      </header>
      <h2 className="t-title mt-6 text-ink-on-dark">{title}.</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

import type { ReactNode } from "react";

/**
 * Honest design notes from the build of A Museum of Notetaking.
 *
 * Not a feature list. Each entry is a decision taken while shaping the
 * site: what was done, then a sentence of why or what it implies.
 * Filed in four cases — direction (what the site is), strategy (what
 * it does), maturity (how it holds up), taste (what the eye chose).
 *
 * The voice is restrained on purpose. Sam at Granola is the reader.
 */

type FieldNote = {
  title: string;
  body: ReactNode;
};

type FieldNoteCase = {
  caseNo: string;
  group: string;
  notes: FieldNote[];
};

const cases: FieldNoteCase[] = [
  {
    caseNo: "01",
    group: "Creative direction",
    notes: [
      {
        title: "Site as application",
        body: (
          <>
            The application is the museum. There is no separate
            portfolio site linking out to one. Scroll through the work
            and you have already used the work; the argument is the
            artifact.
          </>
        ),
      },
      {
        title: "Forensic archive as metaphor",
        body: (
          <>
            Notetaking is forensic. Fragments left behind, filed
            evidence, status stamps. The visual language of a
            classified-then-declassified case file carries the product
            premise without ever having to state it.
          </>
        ),
      },
      {
        title: "Dark vault, warm paper as a scope",
        body: (
          <>
            The original warm-bone editorial palette was not thrown
            away. It was demoted to{" "}
            <code className="font-mono">.surface-lit</code> and is
            restored only inside drawers, the detail card, and the
            intake card. Lit paper appears where the visitor is invited
            to engage; outside, the vault.
          </>
        ),
      },
      {
        title: "Single-typeface system",
        body: (
          <>
            Kobe 1.1 carries every typographic role on the site.
            Contrast is held by weight (900 / 700 / 400) and obliquity,
            not by typeface family. The prior four-family stack
            (Newsreader, Inter, JBM, Caveat) and an interim Category
            mapping are still registered in{" "}
            <code className="font-mono">app/layout.tsx</code> and
            documented in <code className="font-mono">globals.css</code>
            , so a revert is one CSS line.
          </>
        ),
      },
    ],
  },
  {
    caseNo: "02",
    group: "Strategy",
    notes: [
      {
        title: "Color returns on interaction",
        body: (
          <>
            Each prototype opens monochrome (&ldquo;FILED&rdquo;) and
            warms back to color the moment the visitor intervenes. The
            mechanic is the product argument: software should sit quiet
            until invited forward.
          </>
        ),
      },
      {
        title: "Bloom-intensity, contextual",
        body: (
          <>
            A <code className="font-mono">--bloom-intensity</code>{" "}
            token, plumbed up through{" "}
            <code className="font-mono">
              body:has(.bloom-quiet-active)
            </code>
            , lets local subtrees damp the global ambience while they
            hold focus. CSS-only context-awareness; the IntakeCard and
            DetailCard breathe quieter without any JS subscribing to
            anything.
          </>
        ),
      },
      {
        title: "The visitor as the fourth file",
        body: (
          <>
            Case 04 is an interactive intake card the reader fills,
            develops, and saves as PNG. It frames the reader as
            participant, not audience, and gives them a souvenir on
            the way out.
          </>
        ),
      },
      {
        title: "Performance as a constraint, not an afterthought",
        body: (
          <>
            Two filtered fixed-position layers is the budget for the
            whole page: Atmosphere and the Hero horizon. The
            contrast/brightness pair never changes after mount; only
            transforms animate, and the noise SVGs are rasterised once
            at module scope. Drawer halos are box-shadow only, by
            choice.
          </>
        ),
      },
    ],
  },
  {
    caseNo: "03",
    group: "Maturity",
    notes: [
      {
        title: "Tokens held across themes",
        body: (
          <>
            When the warm-bone palette became a scoped sub-theme, every
            token name stayed identical (
            <code className="font-mono">--color-paper</code>,{" "}
            <code className="font-mono">--color-ink-900</code>) and only
            the values changed. Prototype components built on the warm
            palette kept working without edits, and every prior
            typographic mapping is recorded inline with literal CSS
            revert lines.
          </>
        ),
      },
      {
        title: "Progressive subtraction of chrome",
        body: (
          <>
            The forensic typewriter strips proliferated, then were
            progressively cut as the editorial voice asserted itself.
            The &ldquo;ACT 01 OF 03 · DRAWERS PROTRUDING&rdquo; line was
            deleted because it was telling the reader what they could
            already see.
          </>
        ),
      },
      {
        title: "Copy contradictions are credibility leaks",
        body: (
          <>
            SORTED was removed from Room 1 once the Flatlay below it
            was titled UNSORTED. Small but it matters; a single
            inconsistent label is enough to make a careful reader
            distrust the rest.
          </>
        ),
      },
      {
        title: "Reduced motion, first-class",
        body: (
          <>
            Every motion feature has a non-motion equivalent.
            Drag-to-peel has an Enter alternative, drift animations
            pause, color-returns degrades to instant, the polaroid
            develop is skipped. Designed alongside the motion, not
            bolted on at the end.
          </>
        ),
      },
    ],
  },
  {
    caseNo: "04",
    group: "Taste",
    notes: [
      {
        title: "The drawer pierces the fold",
        body: (
          <>
            The half-lit drawer does not sit politely below the hero.
            It pierces through, half below the viewport, with an ember
            pool above. Composition tells you to scroll without a
            chevron or a hint.
          </>
        ),
      },
      {
        title: "One number per drawer",
        body: (
          <>
            Shine, halo, drop-shadow, light shaft, and pocket lighting
            all derive from a single{" "}
            <code className="font-mono">--tz</code> custom property per
            drawer. One scrubbed value, six visible behaviours; the
            wall breathes with light without a frame of choreography
            written in JS.
          </>
        ),
      },
      {
        title: "One detail card, two doors",
        body: (
          <>
            The Vision-Pro-style centre-stage surface is written into
            by both the intake-table flatlay and the 8×6 drawer wall.
            The wall is one of two ways to access an artifact; the
            surface is reusable presentation, not a feature of the
            wall.
          </>
        ),
      },
      {
        title: "Grain as structure, not decoration",
        body: (
          <>
            The first ambient layer was wimpy. Replaced wholesale with
            the cjimmy{" "}
            <code className="font-mono">
              contrast(170%) brightness(1000%)
            </code>{" "}
            noise-crush, multiplied back over a vault-tinted gradient.
            The grain is now the dominant texture of the page, not a
            faint sprinkle on top.
          </>
        ),
      },
    ],
  },
];

export function FieldNotes() {
  return (
    <div className="mt-10 space-y-14">
      {cases.map((c) => (
        <section key={c.caseNo} aria-label={`Field notes ${c.caseNo}`}>
          <header className="flex items-baseline gap-4 text-ink-500">
            <span className="font-mono text-[11px] tracking-[0.18em]">
              FIELD NOTES No. {c.caseNo}
            </span>
            <span className="h-px flex-1 bg-rule" aria-hidden />
            <span className="t-eyebrow">{c.group}</span>
          </header>
          <ul className="surface-lit mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {c.notes.map((n) => (
              <li
                key={n.title}
                className="rounded-md border border-rule bg-paper p-5"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-700">
                  {n.title}
                </p>
                <p className="mt-3 text-[14px] leading-[1.6] text-ink-700">
                  {n.body}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

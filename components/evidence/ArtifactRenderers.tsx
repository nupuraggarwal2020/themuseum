"use client";

import type { ReactNode } from "react";

/* ---------------------------------------------------------------------
   Artifact renderers.
   Each artifact is a self-contained typographic recreation. No images
   are imported. Layout is fluid; the parent grid handles placement.

   Contrast / token scope:
   These renderers paint dark ink onto cream/manila paper. The site's
   default ink tokens (--color-ink-*) are LIGHT (designed for the dark
   vault background); they only flip to dark inks inside the
   `.surface-lit` scope (see app/globals.css). Older host surfaces
   (DetailCard, Drawer pockets, the legacy desk panel) wrapped these
   renderers in `.surface-lit` for free, but the manila Flatlay stage
   does not. Each renderer below therefore opens its own `surface-lit`
   scope so the ink tokens resolve to readable dark values regardless
   of where the renderer is mounted.

   AAA target:
   `text-ink-500` inside surface-lit is L=0.50, which on cream paper
   reads at ~5:1 (AA, not AAA). For body text we explicitly push
   meta/eyebrow lines (which were using `text-ink-500` /
   `t-typewriter-sm`) down to L≈0.32 (text-ink-700 equivalent or
   hardcoded oklch) so all body lines clear ~7:1.
   --------------------------------------------------------------------- */

/* ----------------- shared chrome ----------------- */

export function PaperShadow() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-[3px]"
      style={{
        boxShadow:
          "0 1px 0 oklch(0.86 0.014 80 / 0.6), 0 14px 30px -16px oklch(0.18 0.01 80 / 0.34)",
      }}
    />
  );
}

/** Tape strip in the corner of certain artifacts. */
export function TapeStrip({
  side = "tl",
}: {
  side?: "tl" | "tr" | "bl" | "br";
}) {
  const pos = {
    tl: "left-3 top-0 -translate-y-1/2 -rotate-3",
    tr: "right-3 top-0 -translate-y-1/2 rotate-3",
    bl: "left-3 bottom-0 translate-y-1/2 rotate-3",
    br: "right-3 bottom-0 translate-y-1/2 -rotate-3",
  }[side];
  return (
    <span
      aria-hidden
      className={`absolute z-10 h-4 w-14 ${pos} bg-ink-300/35 mix-blend-multiply`}
      style={{
        background:
          "linear-gradient(180deg, oklch(0.86 0.014 80 / 0.55) 0%, oklch(0.92 0.012 80 / 0.4) 100%)",
        boxShadow: "0 1px 0 oklch(0.18 0.01 80 / 0.06)",
      }}
    />
  );
}

/* ============================ KEEP card ============================
   Reconstructs Google Keep notes — pale-yellow hue, simple sans body,
   sans-serif heading, hairline border. Three variants by content. */

type KeepProps = {
  variant: "snacks" | "ledger" | "anniversary";
};

export function KeepCard({ variant }: KeepProps) {
  if (variant === "snacks") {
    return (
      <KeepShell title="Snack" tinted>
        <ul className="space-y-[3px]">
          <li>Nimbu masala</li>
          <li>Papdi</li>
          <li>Nimbu masala</li>
          <li>Murukku</li>
          <li>Bhakarvadi</li>
        </ul>
      </KeepShell>
    );
  }
  if (variant === "ledger") {
    return (
      <KeepShell title="Aug 25">
        <p className="leading-[1.55]">
          Ajeet owes 3161
          <br />
          Nupur owes 353
        </p>
        <Divider />
        <p className="t-typewriter-sm mt-1 text-ink-700">SEPT 2025</p>
        <p className="leading-[1.55]">
          Ajeet owes 4500
          <br />
          Nupur owes 1103
        </p>
        <Divider />
        <p className="t-typewriter-sm mt-1 text-ink-700">28 AUG</p>
        <p className="leading-[1.55]">
          Ajeet owes 2810
          <br />
          Nupur owes 72.5
        </p>
      </KeepShell>
    );
  }
  return (
    <KeepShell title="Anniversary gifts we've given">
      <p className="leading-[1.55]">
        <span className="font-medium">1st: Paper</span>
        <br />
        kindle paper white
        <br />
        puzzle set
      </p>
    </KeepShell>
  );
}

function KeepShell({
  title,
  children,
  tinted = false,
}: {
  title: string;
  children: ReactNode;
  tinted?: boolean;
}) {
  return (
    <div
      className={`surface-lit ${tinted ? "tex-keep" : "tex-paper"} relative h-full w-full overflow-hidden rounded-[3px] border border-rule px-4 pb-4 pt-3.5`}
    >
      <PaperShadow />
      <h4 className="mb-2 font-sans text-[14px] font-semibold text-ink-900">
        {title}
      </h4>
      <div className="font-sans text-[13px] leading-[1.5] text-ink-900">
        {children}
      </div>
    </div>
  );
}

function Divider() {
  return <hr className="my-2 border-0 border-t border-ink-200/70" />;
}

/* ============================ Polaroid =============================
   White-bordered card with the Canva easel content squeezed inside, plus
   a hand-written caption underneath. Slight tilt handled by parent. */

export function PolaroidArtifact() {
  return (
    <div className="surface-lit tex-paper relative h-full w-full overflow-hidden rounded-[3px] border border-rule px-3 pb-12 pt-3">
      <PaperShadow />
      <TapeStrip side="tl" />
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-bone-50">
        {/* Mini canva easel: title, subtitle, bullet list */}
        <div className="flex h-full flex-col gap-1.5 px-3 py-2.5">
          <p className="font-serif text-[13px] leading-tight text-ink-900">
            July 24 to Dec 24
          </p>
          <p className="font-serif text-[12px] italic leading-tight text-ink-800">
            Driver
          </p>
          <ul className="mt-1 space-y-1 font-serif text-[8px] leading-[1.35] text-ink-800">
            <li>
              · Designed and launched the atlassian rovo integration for
              canva. Worked with an SI to deliver a high quality integration,
              featured as the main partner at Atlassian&rsquo;s launch event
            </li>
            <li>
              · Developed research-backed Developer archetypes, ran user
              interviews and met with real users at the Extend event to
              validate them
            </li>
            <li>
              · Worked with the Apps API team on Suspended Apps. Briefed the
              Apps Review team on how to review apps for a suspended state
            </li>
            <li>
              · Set up a new process for the connect api team to triage and
              evaluate connect api feedback. Helped triage close to 100
              feedback items
            </li>
          </ul>
        </div>
      </div>
      <p className="font-hand mt-2 text-center text-[1.05rem] leading-tight text-ink-800">
        performance review
      </p>
    </div>
  );
}

/* ============================ Device =============================
   A custom-built productivity dashboard rendered as a beige device frame.
   Today's progress 0%, statistics 4/0/2/0, thoughts include the quote. */

export function DeviceArtifact() {
  return (
    <div className="surface-lit relative h-full w-full">
      {/* Device frame */}
      <div
        className="relative h-full w-full overflow-hidden rounded-[6px] border border-ink-300"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.95 0.012 80) 0%, oklch(0.9 0.014 78) 100%)",
          boxShadow:
            "inset 0 1px 0 oklch(0.99 0.005 85 / 0.7), 0 18px 36px -22px oklch(0.18 0.01 80 / 0.4), 0 2px 0 oklch(0.18 0.01 80 / 0.12)",
        }}
      >
        <PaperShadow />
        {/* Browser-style top bar */}
        <div className="flex items-center gap-1.5 border-b border-ink-300/60 bg-bone-100/80 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-ink-300" />
          <span className="h-2 w-2 rounded-full bg-ink-300" />
          <span className="h-2 w-2 rounded-full bg-ink-300" />
          <span className="ml-3 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-700">
            my-productivity-dashboard
          </span>
        </div>
        {/* Dashboard body */}
        <div className="grid grid-cols-3 gap-2 p-3">
          {/* Progress card */}
          <DeviceCard label="Today's Progress" small="Edit">
            <div className="my-2 flex flex-col items-center gap-1">
              <ProgressRing value={0} />
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-700">
                0 of 4 tasks
              </p>
            </div>
          </DeviceCard>
          {/* Stats */}
          <DeviceCard label="Statistics" small="View All">
            <div className="grid grid-cols-2 gap-1.5">
              <StatTile big="4" small="TASKS" />
              <StatTile big="0" small="WINS" />
              <StatTile big="2" small="THOUGHTS" />
              <StatTile big="0" small="STREAK" />
            </div>
          </DeviceCard>
          {/* Quick actions */}
          <DeviceCard label="Quick Actions">
            <div className="grid grid-cols-2 gap-1">
              {["ADD TASK", "LOG WIN", "ADD THOUGHT", "ARCHIVE"].map((q) => (
                <span
                  key={q}
                  className="rounded-sm border border-ink-200/80 bg-bone-50 py-1 text-center font-mono text-[7px] tracking-[0.12em] text-ink-800"
                >
                  {q}
                </span>
              ))}
            </div>
          </DeviceCard>
          {/* Wide thoughts panel */}
          <div className="col-span-3">
            <DeviceCard label="Thoughts" small="Add">
              <p className="font-sans text-[10px] leading-[1.35] text-ink-900">
                In the AI world, references are everything. If you&rsquo;ve
                got good references, you can make it look beautiful and make
                it work exactly you like.
                <span className="ml-1 font-mono text-[8px] uppercase tracking-[0.12em] text-ink-700">
                  Just now
                </span>
              </p>
              <p className="mt-1.5 font-sans text-[10px] text-ink-900">
                I hate documentation
                <span className="ml-1 font-mono text-[8px] uppercase tracking-[0.12em] text-ink-700">
                  Just now
                </span>
              </p>
            </DeviceCard>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeviceCard({
  label,
  small,
  children,
}: {
  label: string;
  small?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[3px] border border-ink-200/70 bg-paper px-2 py-1.5">
      <div className="mb-1 flex items-baseline justify-between">
        <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-ink-800">
          {label}
        </p>
        {small ? (
          <p className="font-mono text-[7px] uppercase tracking-[0.14em] text-ink-700">
            {small}
          </p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function ProgressRing({ value }: { value: number }) {
  const r = 14;
  const c = 2 * Math.PI * r;
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden>
      <circle
        cx="18"
        cy="18"
        r={r}
        fill="none"
        stroke="oklch(0.84 0.012 80)"
        strokeWidth="2"
      />
      <circle
        cx="18"
        cy="18"
        r={r}
        fill="none"
        stroke="oklch(0.55 0.22 25)"
        strokeWidth="2"
        strokeDasharray={c}
        strokeDashoffset={c - (value / 100) * c}
        strokeLinecap="round"
        transform="rotate(-90 18 18)"
      />
      <text
        x="18"
        y="20"
        textAnchor="middle"
        fontFamily="ui-monospace"
        fontSize="8"
        fill="oklch(0.4 0.01 80)"
      >
        {value}%
      </text>
    </svg>
  );
}

function StatTile({ big, small }: { big: string; small: string }) {
  return (
    <div className="rounded-sm bg-bone-50 px-1 py-1.5 text-center">
      <p className="font-serif text-[14px] leading-none text-ink-900">{big}</p>
      <p className="mt-0.5 font-mono text-[6px] uppercase tracking-[0.18em] text-ink-700">
        {small}
      </p>
    </div>
  );
}

/* ============================ Recipe ============================ */

export function RecipeArtifact() {
  return (
    <div className="surface-lit tex-vellum relative h-full w-full overflow-hidden rounded-[3px] border border-rule px-5 pb-5 pt-4">
      <PaperShadow />
      <TapeStrip side="tr" />
      <p className="font-hand text-[1.5rem] leading-none text-ink-900">
        mulled wine
      </p>
      <p className="t-typewriter-sm mt-1 text-ink-700">for the cold week</p>
      <ul className="mt-3 space-y-1 font-hand text-[1.15rem] leading-[1.35] text-ink-900">
        <li>cut oranges</li>
        <li>cut lemons</li>
        <li>cinnamon stick</li>
        <li>sugar</li>
        <li>star anise</li>
        <li>cardamom</li>
        <li>nutmeg</li>
        <li>chai masala</li>
      </ul>
    </div>
  );
}

/* ============================ Blister ============================
   Pill blister card. 14 cells, only one printed. */

export function BlisterArtifact() {
  return (
    <div className="surface-lit tex-paper relative h-full w-full overflow-hidden rounded-[3px] border border-rule p-4">
      <PaperShadow />
      <p className="t-typewriter text-ink-900">
        MEDICINE · TRACKING
      </p>
      <p className="t-typewriter-sm mt-1 text-ink-700">
        WK 01 · 1 of 14 cells filled
      </p>
      <div className="mt-3 grid grid-cols-7 gap-1.5">
        {Array.from({ length: 14 }).map((_, i) => (
          <BlisterCell key={i} filled={i === 0} />
        ))}
      </div>
      <p className="mt-3 font-serif text-[13px] leading-[1.45] text-ink-900">
        Have to exercise, go to gym or however you choose…
      </p>
    </div>
  );
}

function BlisterCell({ filled }: { filled: boolean }) {
  return (
    <div
      className="relative aspect-square rounded-full border border-ink-200/80"
      style={{
        background: filled
          ? "radial-gradient(circle at 30% 25%, oklch(0.95 0.018 75) 0%, oklch(0.78 0.04 60) 100%)"
          : "linear-gradient(180deg, oklch(0.97 0.008 85) 0%, oklch(0.92 0.01 80) 100%)",
        boxShadow: filled
          ? "inset 0 -1px 0 oklch(0.18 0.01 80 / 0.18)"
          : "inset 0 0 0 1px oklch(0.99 0.005 85 / 0.7)",
      }}
    />
  );
}

/* ============================ Cassette ============================ */

export function CassetteArtifact() {
  return (
    <div className="surface-lit tex-cassette relative h-full w-full overflow-hidden rounded-[6px] border border-ink-300 p-3">
      <PaperShadow />
      <div className="relative h-full w-full rounded-[3px] border border-ink-200/80 bg-paper px-3 pb-3 pt-2">
        <p className="t-typewriter text-ink-900">VOICE MEMOS</p>
        <p className="t-typewriter-sm text-ink-700">2019 onward</p>
        {/* Hand-written sticker label */}
        <p className="font-hand mt-1 text-[1.1rem] leading-tight text-ink-900">
          do not erase
        </p>
        {/* Reels */}
        <div className="mt-3 flex items-center justify-between px-2">
          <CassetteReel />
          <span className="block h-px flex-1 bg-ink-300/70 mx-3" />
          <CassetteReel />
        </div>
        <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-[0.16em] text-ink-700">
          Side A · 312 takes
        </p>
      </div>
    </div>
  );
}

function CassetteReel() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden>
      <circle cx="17" cy="17" r="15.5" fill="none" stroke="oklch(0.74 0.012 78)" />
      <circle cx="17" cy="17" r="9" fill="none" stroke="oklch(0.74 0.012 78)" />
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i * Math.PI) / 3;
        const round = (n: number) => Number(n.toFixed(4));
        return (
          <line
            key={i}
            x1={round(17 + Math.cos(a) * 9)}
            y1={round(17 + Math.sin(a) * 9)}
            x2={round(17 + Math.cos(a) * 15.5)}
            y2={round(17 + Math.sin(a) * 15.5)}
            stroke="oklch(0.74 0.012 78)"
            strokeWidth="0.7"
          />
        );
      })}
      <circle cx="17" cy="17" r="1.5" fill="oklch(0.32 0.01 80)" />
    </svg>
  );
}

/* ============================ Fingerprint ============================ */

export function FingerprintArtifact() {
  return (
    <div className="surface-lit tex-paper relative h-full w-full overflow-hidden rounded-[3px] border border-rule p-4">
      <PaperShadow />
      <p className="t-typewriter text-ink-900">INTAKE PRINT</p>
      <p className="t-typewriter-sm mt-1 text-ink-700">
        ARCHIVIST · NUPUR AGGARWAL
      </p>
      <p className="t-typewriter-sm text-ink-700">FILED · 2026 / 05 / 07</p>

      <div className="relative mt-3 aspect-[3/4] w-full overflow-hidden border border-ink-200 bg-bone-50">
        <FingerprintMark />
      </div>

      <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.12em] text-ink-700">
        SUBJECT · RIGHT THUMB · ROLLED
      </p>
    </div>
  );
}

function FingerprintMark() {
  return (
    <svg
      viewBox="0 0 100 130"
      className="absolute inset-0 h-full w-full text-ink-800"
      stroke="currentColor"
      strokeWidth="0.55"
      fill="none"
      aria-hidden
    >
      {Array.from({ length: 18 }).map((_, i) => {
        const r = 10 + i * 2.6;
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
      <path d="M 18 65 Q 50 30 82 65" />
      <path d="M 22 80 Q 50 55 78 80" />
      <path d="M 28 95 Q 50 78 72 95" />
    </svg>
  );
}

/* ============================ Torn paper ============================ */

export function TornArtifact() {
  return (
    <div className="surface-lit relative h-full w-full">
      <div
        className="relative h-full w-full overflow-hidden border border-rule bg-paper px-6 py-5"
        style={{
          clipPath:
            "polygon(0 6%, 6% 2%, 18% 6%, 30% 1%, 48% 5%, 64% 0%, 80% 4%, 94% 1%, 100% 8%, 99% 92%, 88% 96%, 70% 100%, 52% 95%, 34% 100%, 18% 94%, 4% 99%, 0 90%)",
        }}
      >
        <PaperShadow />
        <p
          className="font-serif text-[clamp(1rem,1vw+0.6rem,1.45rem)] italic leading-[1.35] text-ink-900"
          style={{ letterSpacing: "-0.005em" }}
        >
          &ldquo;In the AI world,{" "}
          <span className="not-italic font-medium text-ink-900 underline decoration-cherry-700 decoration-[2px] underline-offset-[6px]">
            references are everything.
          </span>{" "}
          If you&rsquo;ve got good references, you can make it look beautiful
          and make it work exactly you like.&rdquo;
        </p>
        <p className="t-typewriter-sm mt-3 text-ink-700">
          TORN FROM THOUGHTS PANEL · JUST NOW
        </p>
      </div>
    </div>
  );
}

/* ============================ Day-1 questions ============================ */

export function QuestionsArtifact() {
  return (
    <div className="surface-lit tex-paper relative h-full w-full overflow-hidden rounded-[3px] border border-rule p-4">
      <PaperShadow />
      <h4 className="font-sans text-[13px] font-semibold text-ink-900">
        Day 1 questions
      </h4>
      <ul className="mt-2 space-y-1.5 font-sans text-[12px] leading-[1.45] text-ink-900">
        <li>How do you give someone a kudos</li>
        <li>Is there a new person blog?</li>
        <li>best way to introduce myself to the team</li>
        <li>How do you go on coffee dates (via donut)</li>
        <li>Best way to meet all the stakeholders</li>
      </ul>
    </div>
  );
}

/* ============================ Tag (twine) ============================ */

export function TagArtifact() {
  return (
    <div className="surface-lit relative flex h-full w-full items-center gap-3">
      {/* Twine */}
      <svg
        aria-hidden
        className="hidden sm:block"
        width="80"
        height="60"
        viewBox="0 0 80 60"
        fill="none"
        stroke="oklch(0.32 0.01 80)"
        strokeWidth="0.8"
      >
        <path d="M 0 12 Q 20 18 40 30 T 78 44" />
      </svg>
      <div
        className="relative flex-1"
        style={{ filter: "drop-shadow(0 8px 14px oklch(0.18 0.01 80 / 0.22))" }}
      >
        <svg
          viewBox="0 0 280 90"
          className="h-auto w-full"
          aria-hidden
        >
          <defs>
            <clipPath id="tagShape">
              <path d="M 30 5 L 270 5 L 270 85 L 30 85 L 4 45 Z" />
            </clipPath>
          </defs>
          <path
            d="M 30 5 L 270 5 L 270 85 L 30 85 L 4 45 Z"
            fill="oklch(0.97 0.012 80)"
            stroke="oklch(0.32 0.01 80)"
            strokeWidth="0.8"
          />
          <circle
            cx="22"
            cy="45"
            r="4.5"
            fill="oklch(0.96 0.01 85)"
            stroke="oklch(0.32 0.01 80)"
            strokeWidth="0.8"
          />
          <text
            x="44"
            y="38"
            fontFamily="ui-monospace, monospace"
            fontSize="10"
            fill="oklch(0.32 0.01 80)"
            letterSpacing="1.2"
          >
            EXHIBIT A
          </text>
          <text
            x="44"
            y="58"
            fontFamily="ui-monospace, monospace"
            fontSize="11"
            fontWeight="600"
            fill="oklch(0.18 0.01 80)"
            letterSpacing="0.9"
          >
            TWELVE WAYS OF NOT
          </text>
          <text
            x="44"
            y="74"
            fontFamily="ui-monospace, monospace"
            fontSize="11"
            fontWeight="600"
            fill="oklch(0.18 0.01 80)"
            letterSpacing="0.9"
          >
            QUITE TAKING NOTES
          </text>
        </svg>
      </div>
    </div>
  );
}

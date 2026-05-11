/* ---------------------------------------------------------------------
   Evidence Log — case file 01
   The twelve artifacts that make up the wall. All content is reconstructed
   typographically from real sources (Google Keep notes, a custom
   productivity dashboard, a Canva easel performance review). The visuals
   are pure HTML/CSS/SVG; nothing is lifted from a screenshot.

   {{ REPLACE: any of these are stand-ins. Edit values, swap exhibits,
   or add your own. The shape is a typewriter label + body content. }}
   --------------------------------------------------------------------- */

export type ArtifactKind =
  | "keep"
  | "polaroid"
  | "device"
  | "recipe"
  | "blister"
  | "cassette"
  | "fingerprint"
  | "torn"
  | "questions"
  | "tag";

/**
 * What kind of thing is filed inside the drawer. Drives the small
 * content-type marker on the closed drawer face. The vocabulary is
 * deliberately tight so the cabinet reads as a coherent archive at a
 * glance, not a tag cloud. Mirrors how a real archivist would label
 * folders before filing them: by the activity that produced the
 * artifact, not by the medium.
 */
export type ArtifactType =
  | "LIST"
  | "LEDGER"
  | "NOTE"
  | "LOG"
  | "SESSION"
  | "VOICE MEMO"
  | "INTAKE";

export type Artifact = {
  id: string;
  exhibit: string; // "EXHIBIT A"
  kind: ArtifactKind;
  /** Content-type marker shown on the drawer face. */
  type: ArtifactType;
  label: string; // typewriter title shown in annotation card
  meta: string; // "GOOGLE KEEP — created 14 Mar 2018, last edited never"
  caption?: string; // hand-written caption shown under the artifact
  /* Layout: a 12-column grid. */
  col: string; // tailwind col-span / col-start
  row: string; // tailwind row-span / row-start
  rotate: number; // small natural tilt
  z?: number; // for overlap order
};

export const ARTIFACTS: Artifact[] = [
  {
    id: "snacks",
    type: "LIST",
    exhibit: "EXHIBIT A",
    kind: "keep",
    label: "SNACK",
    meta: "GOOGLE KEEP · personal · 4 items, last edited never",
    col: "col-span-12 sm:col-span-4",
    row: "sm:row-start-1",
    rotate: -2.4,
    z: 4,
  },
  {
    id: "ledger",
    type: "LEDGER",
    exhibit: "EXHIBIT B",
    kind: "keep",
    label: "AJEET OWES / NUPUR OWES",
    meta: "GOOGLE KEEP · personal · last edited Sept 2025",
    col: "col-span-12 sm:col-span-4 sm:col-start-5",
    row: "sm:row-start-1",
    rotate: 1.6,
    z: 3,
  },
  {
    id: "anniversary",
    type: "LIST",
    exhibit: "EXHIBIT C",
    kind: "keep",
    label: "ANNIVERSARY GIFTS I'M THINKING OF",
    meta: "GOOGLE KEEP · personal · 1 entry · paper",
    col: "col-span-12 sm:col-span-4 sm:col-start-9",
    row: "sm:row-start-1",
    rotate: -1.4,
    z: 2,
  },
  {
    id: "polaroid",
    type: "SESSION",
    exhibit: "EXHIBIT D",
    kind: "polaroid",
    label: "PERFORMANCE REVIEW (TYPESET IN A DESIGN TOOL)",
    meta: "ARC EASEL · self-review · July 24 to Dec 24",
    caption: "performance review",
    col: "col-span-12 sm:col-span-5",
    row: "sm:row-start-2",
    rotate: -3.2,
    z: 5,
  },
  {
    id: "dashboard",
    type: "LOG",
    exhibit: "EXHIBIT E",
    kind: "device",
    label: "MY PRODUCTIVITY DASHBOARD",
    meta: "CUSTOM BUILD · ~9 hours over a long weekend · 10 days streak",
    caption: "the one I built when nothing else fit",
    col: "col-span-12 sm:col-span-7 sm:col-start-6",
    row: "sm:row-start-2",
    rotate: 1.4,
    z: 6,
  },
  {
    id: "recipe",
    type: "LIST",
    exhibit: "EXHIBIT F",
    kind: "recipe",
    label: "MULLED WINE",
    meta: "GOOGLE KEEP · recipe · saved twice, made once",
    caption: "recipe",
    col: "col-span-12 sm:col-span-4",
    row: "sm:row-start-3",
    rotate: -1.4,
    z: 3,
  },
  {
    id: "blister",
    type: "LOG",
    exhibit: "EXHIBIT G",
    kind: "blister",
    label: "MEDICINE",
    meta: "GOOGLE KEEP · medical · 1 of 14 cells used",
    col: "col-span-12 sm:col-span-4 sm:col-start-5",
    row: "sm:row-start-3",
    rotate: 0.8,
    z: 2,
  },
  {
    id: "cassette",
    type: "VOICE MEMO",
    exhibit: "EXHIBIT H",
    kind: "cassette",
    label: "VOICE MEMOS / 2019 onward",
    meta: "iPHONE VOICE MEMOS · 312 entries · titled NEW RECORDING (NEW RECORDING)",
    col: "col-span-12 sm:col-span-4 sm:col-start-9",
    row: "sm:row-start-3",
    rotate: -2.6,
    z: 4,
  },
  {
    id: "fingerprint",
    type: "INTAKE",
    exhibit: "EXHIBIT I",
    kind: "fingerprint",
    label: "INTAKE PRINT",
    meta: "ARCHIVIST · NUPUR AGGARWAL · filed 2026",
    col: "col-span-12 sm:col-span-3",
    row: "sm:row-start-4",
    rotate: -1.2,
    z: 5,
  },
  {
    id: "torn",
    type: "NOTE",
    exhibit: "EXHIBIT J",
    kind: "torn",
    label: "QUOTE · TORN FROM A THOUGHTS PANEL",
    meta: "MY PRODUCTIVITY DASHBOARD · just now",
    col: "col-span-12 sm:col-span-6 sm:col-start-4",
    row: "sm:row-start-4",
    rotate: 2.2,
    z: 4,
  },
  {
    id: "questions",
    type: "INTAKE",
    exhibit: "EXHIBIT K",
    kind: "questions",
    label: "DAY 1 QUESTIONS",
    meta: "GOOGLE KEEP · work · written on every first day, never reread",
    caption: "first day at every job, in the same handwriting",
    col: "col-span-12 sm:col-span-3 sm:col-start-10",
    row: "sm:row-start-4",
    rotate: -2.4,
    z: 3,
  },
  {
    id: "tag",
    type: "NOTE",
    exhibit: "EXHIBIT L",
    kind: "tag",
    label: "EXHIBIT TAG",
    meta: "EVIDENCE LABEL · twine · hung from desk edge",
    col: "col-span-12 sm:col-span-5 sm:col-start-7",
    row: "sm:row-start-5",
    rotate: -4.8,
    z: 2,
  },
];

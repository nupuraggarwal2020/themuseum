/**
 * Mirrors the tokens defined in `app/globals.css` under `@theme {}`.
 * The /system page renders these by reading the same CSS variable names,
 * so the only source of truth for values is the stylesheet.
 *
 * Forensic-archive edition: cherry replaces amber as the single
 * specimen of pigment; mono and hand fonts are documented alongside
 * the editorial serif.
 */

export type TokenColor = {
  name: string;
  /** CSS variable name without `--` prefix. */
  cssVar: string;
  role: string;
};

export type TokenFont = {
  name: string;
  cssVar: string;
  role: string;
  substituteNote?: string;
};

export type TokenMotion = {
  name: string;
  cssVar: string;
  role: string;
};

export const colorTokens: TokenColor[] = [
  { name: "paper", cssVar: "color-paper", role: "Card surface" },
  { name: "bone-50", cssVar: "color-bone-50", role: "Page canvas (aged)" },
  { name: "bone-100", cssVar: "color-bone-100", role: "Surface elevation" },
  { name: "bone-200", cssVar: "color-bone-200", role: "Subtle separator" },
  { name: "bone-300", cssVar: "color-bone-300", role: "Raised separator" },
  { name: "ink-900", cssVar: "color-ink-900", role: "Primary ink" },
  { name: "ink-700", cssVar: "color-ink-700", role: "Body text" },
  { name: "ink-500", cssVar: "color-ink-500", role: "Secondary text" },
  { name: "ink-400", cssVar: "color-ink-400", role: "Quiet text" },
  { name: "ink-300", cssVar: "color-ink-300", role: "Hairline / disabled" },
  {
    name: "cherry-700",
    cssVar: "color-cherry-700",
    role: "Specimen pigment (cherry, hover anchor)",
  },
  {
    name: "cherry-600",
    cssVar: "color-cherry-600",
    role: "Specimen pigment (cherry, primary)",
  },
  {
    name: "cherry-100",
    cssVar: "color-cherry-100",
    role: "Pigment wash (selection, button bg)",
  },
  { name: "rule", cssVar: "color-rule", role: "Hairline divider" },
  {
    name: "rule-strong",
    cssVar: "color-rule-strong",
    role: "Stronger divider",
  },
];

export const typeRamp = [
  {
    name: "display-caps",
    cls: "t-display-caps",
    sample: "A MUSEUM OF NOTETAKING.",
    spec: "Newsreader · clamp(40–80px) · LH 1 · LS 0.005em · UPPER",
  },
  {
    name: "display",
    cls: "t-display",
    sample: "A museum of notetaking.",
    spec: "Newsreader · clamp(44–92px) · LH 1 · LS −0.02em",
  },
  {
    name: "headline",
    cls: "t-headline",
    sample: "The wall of unfiled thoughts.",
    spec: "Newsreader · clamp(32–56px) · LH 1.05 · LS −0.018em",
  },
  {
    name: "title",
    cls: "t-title",
    sample: "Memory Shards",
    spec: "Newsreader · clamp(24–34px) · LH 1.18 · LS −0.012em",
  },
  {
    name: "lede",
    cls: "t-lede",
    sample:
      "A collection of contradiction and clarity. Scribbles, traces, pieces of selves once denied or dismissed.",
    spec: "Newsreader · clamp(18–22px) · LH 1.55",
  },
  {
    name: "typewriter",
    cls: "t-typewriter",
    sample: "EVIDENCE LOG · SCATTERED · SORTED",
    spec: "JetBrains Mono · 11px · 400 · LS 0.06em · UPPER",
  },
  {
    name: "typewriter-sm",
    cls: "t-typewriter-sm",
    sample: "FILED 2024 · STATUS: REOPENED",
    spec: "JetBrains Mono · 10px · LS 0.08em · UPPER",
  },
  {
    name: "body",
    cls: "t-body",
    sample:
      "Each one looks intentional from the outside. Inside, the same shape: two productive weeks, then nothing.",
    spec: "Inter · 17px · LH 1.65",
  },
  {
    name: "hand",
    cls: "t-hand",
    sample: "performance review (typeset in a design tool??)",
    spec: "Caveat · 1.35rem · LH 1.3",
  },
];

export const fontTokens: TokenFont[] = [
  {
    name: "serif (editorial)",
    cssVar: "font-serif",
    role: "Headlines, narrative, the letter, saved cards",
    substituteNote:
      "Originally targeted Söhne Serif / Tiempos / Lyon. Swapped to Newsreader (free, Google Fonts) for licensing and self-hosting via next/font. The italic carries most of the editorial mood.",
  },
  {
    name: "mono (chrome)",
    cssVar: "font-mono",
    role: "Case numbers, status stamps, metadata, captions",
    substituteNote:
      "JetBrains Mono via next/font. The whole forensic chrome is built on this face: typewriter feel without committing to a literal typewriter font.",
  },
  {
    name: "hand (intake + tags)",
    cssVar: "font-hand",
    role: "Hand-written captions, recipe card, intake form input",
    substituteNote:
      "Caveat via next/font. Picked over Homemade Apple for legibility at small sizes and broader weight range.",
  },
  {
    name: "sans (utility)",
    cssVar: "font-sans",
    role: "Inter, fallback UI, kept minimal in this edition",
    substituteNote:
      "Inter, retained for body text inside Keep cards and dashboard mock. Most chrome now uses mono.",
  },
];

export const motionTokens: TokenMotion[] = [
  {
    name: "settle",
    cssVar: "ease-settle",
    role:
      "Primary ease-out. Entrances, room reveals, card resolution, modal opens.",
  },
  {
    name: "snap",
    cssVar: "ease-snap",
    role: "Drag release, pressed state, drop-into-place.",
  },
  {
    name: "glide",
    cssVar: "ease-glide",
    role: "Cross-fades, scrubbed scrolls, the playback caret.",
  },
];

export const durationTokens: TokenMotion[] = [
  { name: "quick", cssVar: "duration-quick", role: "200ms · taps, hovers" },
  { name: "base", cssVar: "duration-base", role: "350ms · component change" },
  { name: "slow", cssVar: "duration-slow", role: "600ms · room reveals" },
  {
    name: "restore",
    cssVar: "duration-restore",
    role: "800ms · color returns to a filed prototype on first interaction",
  },
];

/**
 * Drawer-wall palette. The DrawerWall + Drawer components used to hardcode
 * their face / handle / lip / inset colours inline. They now read every
 * value from this token set so the cabinet can be retoned per theme
 * without touching the components. Light mode is the meaningful addition:
 * the same geometry on a pale-bone palette so the cabinet reads as
 * bone / pale-wood instead of dark steel. Source of truth is
 * `app/globals.css` (`--drawer-*` blocks); this array mirrors it for
 * the /system page swatch render.
 *
 * `--drawer-marker-shadow` is a `box-shadow` value rather than a colour
 * and is documented in Notes & deviations rather than rendered here.
 */
export const drawerTokens: TokenColor[] = [
  {
    name: "wall-bg-inner",
    cssVar: "drawer-wall-bg-inner",
    role: "Cabinet recess (inner)",
  },
  {
    name: "wall-bg-outer",
    cssVar: "drawer-wall-bg-outer",
    role: "Cabinet recess (outer rim)",
  },
  {
    name: "wall-pool",
    cssVar: "drawer-wall-pool",
    role: "Ember pool above the wall",
  },

  { name: "face-top", cssVar: "drawer-face-top", role: "Face highlight" },
  { name: "face-mid", cssVar: "drawer-face-mid", role: "Face body" },
  { name: "face-bot", cssVar: "drawer-face-bot", role: "Face shadow" },
  { name: "border", cssVar: "drawer-border", role: "Drawer outline" },

  {
    name: "edge-highlight",
    cssVar: "drawer-edge-highlight",
    role: "Top-edge highlight at rest",
  },
  {
    name: "edge-highlight-open",
    cssVar: "drawer-edge-highlight-open",
    role: "Top-edge highlight when open",
  },
  {
    name: "edge-shadow",
    cssVar: "drawer-edge-shadow",
    role: "Lower-edge shadow at rest",
  },
  {
    name: "edge-shadow-open",
    cssVar: "drawer-edge-shadow-open",
    role: "Lower-edge shadow when open",
  },
  {
    name: "edge-deep-open",
    cssVar: "drawer-edge-deep-open",
    role: "Inner-pocket depth shadow",
  },
  { name: "lip", cssVar: "drawer-lip", role: "Drawer-front lip" },

  {
    name: "handle-bright",
    cssVar: "drawer-handle-bright",
    role: "Handle highlight",
  },
  { name: "handle-mid", cssVar: "drawer-handle-mid", role: "Handle body" },
  { name: "handle-dim", cssVar: "drawer-handle-dim", role: "Handle shadow" },
  {
    name: "handle-edge-light",
    cssVar: "drawer-handle-edge-light",
    role: "Handle rim highlight",
  },
  {
    name: "handle-edge-dark",
    cssVar: "drawer-handle-edge-dark",
    role: "Handle rim shadow",
  },
];

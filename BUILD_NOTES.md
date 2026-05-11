# Build notes — A Museum of Notetaking (Forensic Archive edition)

This file is the bridge between the build that landed on disk and the
person who has to ship it. Read once, then edit.

## 0) Direction change — the forensic-archive redirect

The original brief was a warm editorial scrollytelling site (bone +
amber, generic notebook covers in Room 1, four anonymous "rooms"). On
day six the direction changed to a **forensic archive**: black,
off-white, one cherry-red specimen of pigment; every room presented as
a CASE FILE; Room 1 rebuilt as twelve specific typographic exhibits
drawn from real Keep notes / dashboards / Canva easels; both
prototypes opening in monochrome and warming to color the moment a
visitor interacts; and a "FOR THE RECORD" intake card that visitors
can fill in, develop (1s polaroid animation), and download as a PNG.

What was salvaged from the original build:

- The Next.js 16 / React 19 / Tailwind v4 / Motion / GSAP foundation.
- The two prototypes' underlying logic — the rAF playback + capture in
  Scroll Back, the drag-to-peel + connect + cluster glow in Memory
  Shards — were preserved verbatim and only re-skinned (amber → cherry,
  warm chrome → forensic chrome, plus an outer FiledFrame wrapper for
  the color-returns mechanic).
- The `/system` page's runtime token-reader (`useSyncExternalStore` +
  `getComputedStyle`) was kept and reframed as `INDEX — SYSTEM
  SPECIMENS`.
- README scaffolding, polish tasks (skip link, focus rings,
  reduced-motion, OG image, favicon, 404), and the production
  build/lint setup.

What was thrown away:

- The warm amber accent (replaced by `--color-cherry-*`).
- The generic notebook wall in Room 1 (replaced by the twelve typographic
  artifacts in `components/evidence/`).
- All placeholder copy aimed at a generic museum (replaced with the
  specific Nupur-authored content from the brief: snacks list, owes
  ledger, anniversary gifts, mulled-wine recipe, Mounjaro guideline,
  Day 1 questions, etc.).

## a) What was built

A Next.js 16 / React 19 / Tailwind v4 site, fully type-checked,
lint-clean, and statically buildable to four routes:

| Route | What it is |
| --- | --- |
| `/` | Hero, four cases, in one continuous scroll |
| `/system` | INDEX — SYSTEM SPECIMENS (color/type/motion evidence) |
| `/opengraph-image` | Typographic 1200×630 OG image (forensic) |
| `/icon` | 32×32 favicon (cherry dot + M) |
| `/_not-found` | EXHIBIT MISFILED 404 |

The four cases:

- **CASE No. 01 — EVIDENCE LOG.** Twelve typographic artifacts laid out
  on a desktop with binder rings down the left edge. Hover lifts the
  artifact 4 px, grows the shadow, and reveals a small typewriter
  annotation. Click expands the artifact into a center-stage modal
  with an exhibit-label treatment underneath. Click outside or Esc
  closes. The twelve are: two Keep cards (snacks, owes ledger), an
  anniversary-gifts card, a Polaroid of a Canva easel, a beige device
  frame rendering a custom productivity dashboard, a handwritten mulled-
  wine recipe card, a pill-blister Mounjaro card, a cassette tape, a
  fingerprint card, a torn paper strip with a cherry-underlined quote,
  a Day-1-questions Keep card, and an evidence label tag with twine
  hanging off the bottom-right edge.
- **CASE No. 02 — THE FOUR-SECOND DELAY.** The Scroll Back prototype
  inside a `FiledFrame` wrapper. Opens in monochrome. Pressing "Wait,
  what?" or capturing a sentence triggers the color-returns crossfade
  (800 ms, settle ease).
- **CASE No. 03 — THE BRAINSTORM.** The Memory Shards prototype inside
  a `FiledFrame` wrapper. Opens in monochrome. Peeling the first phrase
  (drag or Enter) triggers the same crossfade.
- **CASE No. 04 — FOR THE RECORD.** The interactive intake card on top,
  the letter to Granola underneath. The intake card has a NAME / COUNTRY
  / TELL US ABOUT YOUR STORY / WHAT'S YOUR INVISIBLE LUGGAGE form,
  written in a hand-feel font (Caveat) with perforation marks down the
  side and a mug-shot-style photo box on the left that starts as a
  pencil-sketch silhouette and develops into a cherry stamp. A "DEVELOP"
  button runs a 1 s polaroid animation; "Save as PNG" exports a
  high-resolution PNG via `html-to-image`. Answers persist in
  `localStorage` so a refresh keeps the card filled in.

Polish that landed:

- **Three faces** via `next/font`: Newsreader (editorial serif),
  JetBrains Mono (typewriter chrome), Caveat (hand-feel for tags +
  intake input). Inter retained as a small utility face for the
  dashboard and Keep cards.
- **Forensic palette** in OKLCH: `--color-paper`, the bone family,
  the ink family, the cherry family, plus a `--color-restore-*` warm
  scale used during the color-returns crossfade.
- **Subtle paper-grain noise** rendered via inline SVG turbulence on
  `body::before` (low opacity, fixed, pointer-events none) plus a soft
  vignette on `body::after`.
- **Three motion easings** (`settle`, `snap`, `glide`), three
  durations (200, 350, 600 ms) plus a fourth (`--duration-restore` =
  800 ms) used by the color-returns crossfade.
- **Color returns mechanic** implemented with two CSS classes,
  `.filed` (saturate 0.05, slight desaturation) and `.restored`
  (saturate 1), both transitioning over `--duration-restore`. State
  lives in `FiledFrame.tsx` and flips on the prototypes' `onInteract`
  callback.
- **Reduced-motion fallbacks** in both prototypes (drag becomes Enter,
  arc becomes a quiet appearance), in the color-returns crossfade
  (transition collapses to instant), in the IntakeCard develop
  animation (skipped), and globally in `globals.css`.
- Skip-to-content link, visible focus rings (cherry), aria-current on
  the room rail, role + aria-label on every interactive surface in the
  prototypes and on every artifact in the Evidence Log.
- A typographic OG image and a tiny mono favicon, both retoned for the
  forensic palette.
- Custom 404 page in the same voice as the museum.

## b) What you should personalise before sharing

Search the repo for `{{ REPLACE:` to see every placeholder in one
pass. In rough order of how much they matter:

1. **`components/Letter.tsx`** — addressee, the specific Granola
   feature you admire, your sign-off, your contact details. The letter
   is the close. Read it aloud, then cut a third.
2. **`components/IntakeCard.tsx`** — the `NUPUR.WORKS` footer (your
   real domain).
3. **`components/Room2ScrollBack.tsx`** — replace the chemistry
   lecture story with your own four-seconds-behind moment.
4. **`components/Room3MemoryShards.tsx`** — replace the brainstorm
   story with your own.
5. **`components/scroll-back/script.ts`** — the placeholder transcript
   is a fictional 9 am chemistry lecture.
6. **`components/memory-shards/transcript.ts`** — the placeholder is a
   fictional Tuesday-morning kickoff for "Voca."
7. **`components/evidence/artifacts.ts`** + **`ArtifactRenderers.tsx`**
   — the twelve exhibits. The brief shipped with very specific copy
   (snack list, owes ledger, anniversary gifts, mulled-wine recipe,
   Mounjaro guideline, Day 1 questions, etc.). Edit dates, currency, or
   names as the truth shifts.
8. **`app/layout.tsx`** — `metadataBase` is set to a placeholder URL.
   Replace with your real domain before deploy.
9. **`README.md`** + **`/system`** Notes & deviations — add your name
   where appropriate.

## c) How to deploy to Vercel

```sh
cd granola-museum
npx vercel        # walk through the prompts; defaults are correct
npx vercel --prod # promote the latest preview to production
```

After the first deploy:

1. Open the project in the Vercel dashboard.
2. Domains → add `museum.yourdomain.com` (or whichever subdomain).
3. Update `metadataBase` in `app/layout.tsx` to match the production
   URL so the OG image absolute-URLs are correct.
4. Optional: set `Default Branch Production` to `main`.

There are no environment variables. There is no analytics. There are
no third-party scripts. The site is fully static after `next build`,
including `/opengraph-image` and `/icon` (built once, cached forever).
The intake card's PNG export runs entirely in the browser via
`html-to-image`.

## d) Deviations from the plan, with reasoning

- **Söhne Serif → Newsreader.** None of the suggested premium serifs
  are free. Newsreader is the closest free Google Font and ships via
  `next/font`. Documented on `/system` Notes & deviations.
- **Real photos vs typographic artifacts.** The brief explicitly said
  *do not lift the photographs from the references — reconstruct the
  feel with hand-built CSS/SVG artifacts.* Every Evidence Log artifact
  is therefore pure HTML/CSS/SVG (no `<img>` tags), which keeps the
  page weight tiny, the work license-clean, and the artifacts editable
  by changing strings rather than re-shooting photographs.
- **Real audio in Scroll Back.** Same as before — simulated playback
  driven by a rAF loop and per-character cadence. The hook for real
  audio is a one-line change.
- **GSAP usage scope.** GSAP + ScrollTrigger is registered but not
  used by any room after the Room 1 rebuild (Evidence Log uses Motion
  for the modal). Kept as a dependency because it costs nothing in the
  static build and is useful for any future ScrollTrigger work.
- **Polaroid placeholder.** The Polaroid artifact's image area is a
  light watercolor-style CSS block, not a real photograph of the Canva
  easel. The visible content of the Polaroid is the handwritten label
  and the caption (`performance review (typeset in a design tool??)`),
  which carries the joke without needing the original image.
- **`html-to-image` over a server-side renderer.** The intake card
  could have been exported via Satori (the same library that builds
  the OG image). I chose `html-to-image` because the card is rich
  with custom fonts, perforation marks, and the develop animation —
  rendering it client-side avoids replicating the styling in a Satori
  JSX tree, and the export is a 1 s round-trip in the browser. PNG
  only for now (PDF could be added trivially via `jspdf` later).
- **Connection-handle keyboard alternative.** Drag-to-peel and shard
  movement have keyboard equivalents in Memory Shards. The
  drag-to-connect handle does not (it's mouse only). This is the one
  intentional gap.

## e) Performance + accessibility quick check

- `next build` produces only static pages. No SSR, no edge functions.
- All animations target `transform`, `opacity`, and `filter` only. The
  color-returns crossfade is a single `filter: saturate()` transition
  applied to one wrapper element per prototype.
- The grain overlay is a single inline SVG, ~700 bytes, encoded into
  a data URI in the stylesheet (no extra HTTP).
- No raster images on `/`. LCP is governed by the hero text and the
  three fonts, all self-hosted via `next/font` with `display: swap`.
- Color contrast: `ink-900` on `bone-50` ≈ 13:1; `ink-700` on `bone-50`
  ≈ 8:1; `ink-500` on `bone-50` ≈ 4.7:1. Body text is `ink-700`. The
  cherry accent is used surgically (max three places per page) and
  never as the only signal for any interaction.
- `prefers-reduced-motion` collapses transitions globally (in
  `globals.css`), skips the prototype showpieces (drag → Enter,
  arc → quiet entrance), skips the develop animation on the intake
  card, and snaps the color-returns crossfade to instant.

## g) Dark-vault retheme — what changed and what did not

The site reads as a dark vault with one halated ember accent. The
build keeps every motion detail, every line of copy, every
`{{ REPLACE: ... }}` marker, and every prototype interaction from the
warm-bone build. Only the visual shell moved.

What changed (file by file):

- `app/globals.css` — palette flipped to dark vault. Existing token
  *names* (bone-50, paper, ink-900, cherry-700, rule, restore-300)
  are preserved so every existing class keeps working; their values
  point at vault tones, ember, and dark hairlines. The original
  warm-bone palette is preserved as a CSS scope (`.surface-lit`) so
  anything inside a lit drawer, a paper card, the Vision-Pro detail
  surface, or the FOR THE RECORD intake card keeps its dark-on-warm
  legibility. New tokens added: `--color-vault`, `--color-vault-deep`,
  `--color-paper-lit`, `--color-ember`, `--color-ember-glow`,
  `--color-ink-on-dark`, `--color-ink-on-light`, `--grain-opacity`.
  New ember keyframes (`vault-bloom-a`, `vault-bloom-b`) and a steel
  `tex-drawer-face` texture for the drawer cells.
- `components/Atmosphere.tsx` — new. Single fixed-position layer that
  renders the grain (inline SVG turbulence), two slow-drifting ember
  bloom radials, and the centre vignette. Per-component grain is
  forbidden; this is the only place it lives.
- `components/SiteFrame.tsx` — injects `<Atmosphere />`, retones the
  wordmark dot to ember with a soft halo.
- `components/Hero.tsx` — text classes flip to ink-on-dark, the cherry
  span flips to ember, the case-file chip becomes a dark vault chip.
  A single half-lit drawer anchored to the bottom of the viewport
  beckons forward into Room 1 (decorative, `aria-hidden`, static
  handle).
- `components/drawer-wall/Drawer.tsx` — new. Single drawer primitive
  (steel face + handle + pocket + optional placard). Drives forward
  motion via a `--tz` custom property so a parent ScrollTrigger can
  scrub it. The pocket is `.surface-lit` so artifact recreations land
  on warm paper without retoning.
- `components/drawer-wall/DrawerWall.tsx` — new. 8×6 grid (48 cells).
  Twelve specific cells correspond to the twelve artifacts in
  `evidence/artifacts.ts`; the remaining 36 stay closed and provide
  rhythm. The wall is pinned for ~3× viewport (GSAP ScrollTrigger,
  scrub 0.6) and sequenced in three acts of four drawers each, never
  more than ~6 protruding simultaneously. Reduced motion replaces the
  scroll choreography with a stagger-fade as the wall enters view.
- `components/drawer-wall/DetailCard.tsx` — new. Vision-Pro-style
  centre-stage detail surface (semi-translucent paper-lit card,
  rounded 24px, 1px inner highlight, faint outer ember halo). Top-left
  Back chip, top-right Expand and "…", body with the artifact
  recreation + editorial-serif quote + typewriter metadata row,
  artist strip with NA avatar, side rail with three icon buttons.
  Esc / click-outside / Back closes; arrow keys cycle previous/next.
- `components/evidence/EvidenceLog.tsx` — refactored to render the
  DrawerWall in place of the binder-rings + grid layout. Heading
  copy, the EVIDENCE LOG · SCATTERED · SORTED subhead, and the closing
  paragraph are preserved verbatim.
- `components/FiledFrame.tsx` — outer chrome reads on the vault, the
  inner case is wrapped in `.surface-lit` and given a faint outer
  ember halo so the prototype reads as a lit display case sitting on
  the dark wall. Restoration tinted ember rather than cold cherry.
- `components/IntakeCard.tsx` — wrapped in a `.surface-lit` halo so
  the FOR THE RECORD card sits inside a lit display case on the
  vault. Storage key is now `museum.intakeCard.v1`. The polaroid
  develop is 900ms (50ms under reduced motion). All interaction logic
  preserved.
- `components/memory-shards/MemoryShards.tsx` — canvas background
  forced to dark vault even though the prototype is `.surface-lit`
  (shards remain paper-lit because they inherit from the parent
  scope; the canvas overrides only its own background). Connection
  lines now ember at 40%, pending-connect lines ember-glow, cluster
  glow uses ember-glow tints. Drag, drag-peel, hand-jitter, cluster
  proximity, keyboard parity, and reduced-motion fallbacks are all
  unchanged.
- `components/RoomMarker.tsx` — current room is a lit ember dot with
  a soft glow; quiet rooms remain faint dashes.
- `components/Letter.tsx` — same copy, retoned for the vault. The
  intake card sits inside its own surface-lit halo.
- `app/system/page.tsx` — surfaces inside cards stay paper-lit so
  swatches and type ramps remain readable; outer chrome reads on the
  vault. New deviation block documents the dark-vault retheme.
- `app/not-found.tsx` — retoned with the same chrome and ember return
  link.
- `app/layout.tsx` — `themeColor` flipped to vault.

What was preserved (do not edit lightly):

- All copy. Hero tagline, RoomHeading filed-notes, FiledFrame status
  strip, Letter copy, /system labels, every `{{ REPLACE: ... }}`
  marker, the intake card label set, the EVIDENCE LOG subhead.
- All motion. Scroll Back rewind-into-card flight (timing, easing,
  spring, overshoot). Memory Shards drag-peel + connection-line
  jitter + cluster glow. Hero parallax intro. Every easing
  (`settle`, `snap`, `glide`) and duration (200/350/600/800ms) lives
  in `globals.css` and has not moved.
- All interaction logic. Both prototypes' behaviour is identical;
  only their visual shell changed. Keyboard shortcuts and focus
  rings (now ember) and reduced-motion fallbacks are unchanged.
- The `/system` page structure is identical; only colour resolution
  changed and a new note was added.

Out of scope this pass (intentionally not shipped):

- Real audio in Scroll Back (still simulated).
- Live Whisper.
- View-source easter egg.

Reduced-motion fallbacks added or extended this pass:

- DrawerWall — scroll choreography replaced with a stagger-fade as
  the wall enters view. All twelve drawers reveal their artifacts
  without z-axis motion.
- IntakeCard — the polaroid develop animation is skipped; the card
  jumps to the developed state.
- Atmosphere — the ember bloom drift pauses; the grain and vignette
  remain.
- DetailCard — opens with opacity only, no scale-in.

### Visual pass — gradient, flatlay, drawer shine (later edit)

Three connected upgrades layered on top of the dark-vault retheme. No
copy moved, no motion changed, no interaction logic touched. Every
preserved rule from above still holds; the visual shell got thicker.

- **Atmosphere overhaul.** `components/Atmosphere.tsx` is now a
  multi-tier system instead of two faint blooms:
    1. Base vault — solid `--background` from `<body>` (no DOM).
    2. Fluid bloom field — three large radial gradients of
       `--ember-glow` and `--ember`, blended `mix-blend-mode: screen`,
       drifting on 96–120s loops with subtle scale breathing. Reads
       like sunlight through fog. Reference:
       `references/grain-02-sounds-fm-vertical-gradient.png`.
    3. Thick grain — coarse SVG `feTurbulence` (baseFrequency 0.85,
       3 octaves) at `--grain-opacity: 0.32` with `mix-blend-mode:
       overlay`, plus a finer second tile at `--grain-opacity-fine:
       0.12` with `soft-light`. Tiles are baked into data: URIs so no
       extra requests. The grain is now the dominant texture.
    4. Vignette — soft inner shadow that deepens at the corners, ~25%
       at the very edge fading to 0 by ~30% in.
  Per-component grain duplicates remain forbidden. The atmosphere
  reads `--bloom-intensity` (default 1) so quieter contexts can dial
  it down; `body:has(.bloom-quiet-active)` is the cross-tree opt-in.
- **Hero horizon gradient.** Hero-only vertical gradient rendered
  inside `Hero.tsx` (absolute, not site-wide):
  vault → vault → mix(ember, vault, 35%) → mix(ember-glow, vault,
  60%) → vault. Reads literally as "sun setting into the horizon".
  The rest of the site keeps the bloom field but loses the horizon.
- **Flatlay reintroduced.** New component
  `components/evidence/Flatlay.tsx` renders the same twelve artifacts
  via the existing `renderArtifact` callback owned by
  `EvidenceLog.tsx`. The flatlay sits inside a `.surface-lit` panel
  with rounded corners, a paper-lit backplate, a faint paper texture,
  and an upper-left ambient light pool, so the whole thing reads as
  "the intake table" against the dark vault. Above the table:
  `INTAKE TABLE · UNSORTED · BEFORE FILING`. Below: `↓ FILED INTO THE
  DRAWERS BELOW`. The flatlay sits in `EvidenceLog.tsx` ABOVE the
  existing `DrawerWall` — same room heading + filed-note still
  anchor the room. On ≥1024px the artifacts are absolute-positioned
  in a single composed scene capped at `min(70vh, 720px)`, rotated
  -6° to +6° with overlap and rotation-scaled drop shadows. On
  <1024px the artifacts wrap into a flex grid with the same rotations
  preserved. Each tile is keyboard-focusable and calls the same
  `onDrawerOpen` handler the wall uses, so the same DetailCard opens
  from either path. State is not duplicated.
- **Drawer shine.** `components/drawer-wall/Drawer.tsx` now exposes a
  `--shine` custom property (= `--tz / 124`, clamped 0..1) and
  layers three light treatments that all scale with it:
    1. Inner light leak — soft ember-glow radial gradient biased
       toward the front edge of the pocket, blended via
       `mix-blend-mode: screen` so it warms the pocket without
       washing the typographic recreations. Sits *under* the
       children in source order.
    2. Halated outer bloom — a layered `box-shadow` on the drawer
       face: a wide ~80–120px blur of `--ember` at ~12% for the
       volumetric halo, plus a tighter ~28–46px blur at ~30% for the
       hot rim. Closed drawers stay matte (no halo).
    3. Forward light shaft — a pseudo-overlay below the drawer
       mouth, blurred 40px, gradient of `--ember-glow` → `--ember`
       → transparent at ~60% opacity, projected forward on Z so the
       beam reads as warmth spilling into the room. Length and
       width scale with `--shine`.
  The closed/open contrast is now the visual reward of the scroll
  choreography. As 3–6 drawers protrude simultaneously the wall
  breathes with light without washing out, since each drawer's halo
  is spatially distributed and the inner leak uses screen blend.
- **Hygiene.** All animations remain on `transform`, `opacity`,
  `filter`, and `box-shadow`. No layout-triggering properties.
  Reduced-motion still pauses bloom drift (no breathing, no drift),
  still suppresses the flatlay entrance fades (tilts and shadows
  remain), and the existing drawer-wall reduced-motion fallback
  (stagger-fade, no z-axis) is unchanged. `npm run typecheck`,
  `npm run lint`, and `npm run build` pass clean after this pass.

### Kobe font swap + grainy-gradients atmosphere rewrite (later edit)

Two connected swaps on top of the dark-vault retheme. No copy moved, no
motion changed, no interaction logic touched.

- **Workstream A — Kobe 1.1 as the single typographic family.** Six VJ-Type
  Kobe trial OTFs (Regular / RegularOblique / Bold / BoldOblique / Black /
  BlackOblique) live at `app/fonts/kobe/`. Registered in
  `app/layout.tsx` lines 14–48 via `next/font/local` with array `src` →
  three weights (`400` / `700` / `900`) × two styles (`normal` / `italic`),
  variable `--font-kobe`, `display: swap`. `kobe.variable` is the first
  className on the `<html>` element so `--font-kobe` resolves through the
  rest of the tree. The Category, Newsreader, Inter, JetBrains Mono, and
  Caveat registrations remain intact for revert.

  All five `--font-*` tokens in `app/globals.css` (lines 85–112) point at
  Kobe with `"Helvetica Neue", system-ui, sans-serif` fallbacks. Kobe has
  no native mono or handwritten variant, so the typewriter classes lean
  on Bold (700) + tighter tracking for chrome character, and the
  IntakeCard inputs use RegularOblique (400 italic) so they still feel
  written rather than typed. The previous Category mapping is recorded
  inline at `app/globals.css` lines 90–95 as the immediate revert target;
  the older four-family Newsreader/Inter/JBM/Caveat mapping is recorded
  at lines 97–101 as the deeper revert target.

  Typography utility classes were retuned to use Kobe's weights
  intentionally:
    - `.t-display`, `.t-headline`, `.t-display-caps` → 900 (Black) — the
      editorial weight the previous multi-family stack carried via a
      heavier display serif. Per-room override is still possible at the
      call site.
    - `.t-display em`, `.t-display-caps em`, `.t-headline em` → 900 italic
      (BlackOblique), picked up via the registered italic variants.
    - `.t-typewriter`, `.t-typewriter-sm`, `.t-eyebrow`, `.t-meta`,
      `.t-title` → 700 (Bold) + tight tracking. Reads as proper chrome
      against the dark vault instead of body text.
    - `.t-lede`, `.t-body` → 400 (Regular).
    - `.t-hand` → 400 italic (RegularOblique). The IntakeCard input
      `<input>` and `<textarea>` carry the `italic` Tailwind class
      explicitly (`components/IntakeCard.tsx` lines 343, 355) so they
      inherit the obliquity without the `font-hand` utility forcing
      italic on every other use site (Letter signature, artifact
      recreations).

- **Workstream B — Grainy-gradients atmosphere via the cjimmy technique.**
  `components/Atmosphere.tsx` and the Hero `HorizonGradient` were both
  rewritten end-to-end to use the cjimmy "grainy gradients" trick
  (CSS-Tricks, 2021): SVG `feTurbulence` (`baseFrequency: 0.65`,
  `numOctaves: 3`, `stitchTiles: stitch`) layered with a CSS gradient
  inside the same `background` shorthand, then crushed into stark grain
  by `filter: contrast(170%) brightness(1000%)`, with a sibling
  `mix-blend-mode: multiply` overlay re-darkening the blown-out grain
  back into the vault context. Both layers live inside an `isolation:
  isolate` parent so the multiply blend stays contained.

  Atmosphere composition (back to front):
    1. `.atmosphere-grainy-base` — radial bloom (ember-glow → ember →
       vault, off-canvas at 50% 110%) layered with the noise SVG, sized
       112% × 112% so the slow translate doesn't reveal edges, filtered
       contrast(170%) brightness(1000%), drifting on a 108s loop with a
       1.04× breathing scale.
    2. `.atmosphere-grainy-overlay` — vertical multiply gradient from
       `--color-vault-deep` at the top through `--color-vault` at the
       middle to a slightly ember-warmed vault at the bottom. The
       multiply re-darkens the blown-out grain particles into cinematic
       warmth where the bloom was bright.
    3. `.atmosphere-vignette` — soft inner shadow that deepens the
       corners (preserved from the previous pass).

  Hero horizon shape (preserved from the previous pass: vault → vault
  40% → mix(ember, vault, 35%) at 70% → mix(ember-glow, vault, 60%) at
  92% → vault), now rendered with the same grainy-base + multiply-overlay
  pair contained in an `isolate` wrapper inside `Hero.tsx`. The smooth
  painterly band becomes the granular fluid texture from
  `references/grain-02-sounds-fm-vertical-gradient.png`.

  The drift animation is paused under reduced-motion (the static frame
  carries the look). `--bloom-intensity` is preserved as an opacity
  multiplier on `.atmosphere-grainy-base` so quiet contexts (IntakeCard,
  DetailCard) can still locally dim the bloom via
  `body:has(.bloom-quiet-active)`.

  Files touched:
    - `components/Atmosphere.tsx` — full rewrite. Previous tier-2 bloom
      field (three radial blobs with mix-blend-mode: screen) and tier-3
      coarse + fine grain layers (overlay / soft-light) are gone;
      replaced by the cjimmy base + overlay pair. The `vault-bloom-a/b/c`
      keyframes in `globals.css` are now unreferenced (kept in place for
      revert; harmless dead CSS).
    - `components/Hero.tsx` — `HorizonGradient` rewritten to use the same
      technique with a vertical linear gradient instead of a radial.
      Encodes its own noise SVG (separate `seed` so the two layers don't
      visibly tile together).
    - `components/drawer-wall/Drawer.tsx` — unchanged. The brief flagged
      a grainy outer halo as optional and explicitly granted permission
      to skip it if it caused jank with multiple drawers open. The
      DrawerWall protrudes up to ~6 drawers simultaneously; adding 6+
      heavy `filter: contrast(170%) brightness(1000%)` layers blows past
      the "two filtered fixed-position layers" budget the brief
      established for Atmosphere + Hero. The existing matte-when-closed /
      box-shadow-halo-when-open contrast continues to do the work and
      reads cleanly against the new grainy atmosphere.

  Performance: the technique applies a heavy filter pair to two
  fixed-position layers (Atmosphere + Hero). Both noise SVGs are
  rasterized once at module scope (no per-frame regeneration); the
  filter itself never animates (only `transform` does); `will-change:
  transform` is set on the animating layer only.

  Revert path:
    - To revert font: flip `--font-*` tokens at `app/globals.css` lines
      108–112 back to `var(--font-category), …` (the Kobe-prior
      mapping). The local Category font is still registered in
      `app/layout.tsx`.
    - To revert atmosphere: reinstate the previous bloom-field +
      coarse/fine grain composition in `Atmosphere.tsx` (recoverable
      from git). The `vault-bloom-a/b/c` keyframes and the
      `--grain-opacity` / `--grain-opacity-fine` tokens in
      `globals.css` are still in place.

## e2) Atmosphere — night-drive retune

Reworked the site-wide ambient layer from a single bottom-rising bloom
into a layered "night drive" composition translated into the museum
vocabulary. Reference: a moody dark teal-charcoal base with red/orange
"cattle" silhouettes glowing as heat shapes on the horizon, warm mist
above them, heavy SVG turbulence grain, deep vignette, and a dark
foreground anchor. We translated, didn't reproduce — there are no
animals.

Changes:

- `components/Atmosphere.tsx` rebuilt around six layers (one filtered,
  five unfiltered DOM layers; same performance budget as before):
  1. Crushed cjimmy bloom — same technique, but the bloom shape is
     now a low narrow horizon strip (`ellipse 95% 22% at 50% 102%`)
     instead of a tall bottom-rising ellipse, so the warm grain
     concentrates near the floor and leaves headroom for the herd.
  2. Multiply overlay — re-darkens the blown-out crushed grain into
     cinematic warmth (unchanged technique).
  3. **Herd constellation** (new) — a `HERD` constant defines five
     ember "bodies" along the lower-third horizon (`14% / 32% / 52% /
     71% / 87%` × `~82% Y`). Each body is a single radial gradient
     with a guaranteed-hot ember-glow core (8% sharp falloff) plus a
     wider warm halo whose alpha scales with `intensity`. Screen-blended
     on top of the multiply pass so the warmth survives. Drift-animated
     (140s loop, paused under `prefers-reduced-motion`).
  4. **Mist** (new) — a soft warm horizontal band at `50% 73%`
     fusing the discrete embers into a single horizon line.
  5. **Fine grain** (new) — separate noise SVG at `baseFrequency
     0.95`, screen-blended at `--grain-fine-opacity` (default 0.20).
     This is the high-frequency film noise the reference relies on.
  6. **Deeper vignette** — corner darkness driven by
     `--vignette-strength` (default 0.55, was effectively 0.32 before).
- `components/Hero.tsx` — `HorizonGradient` rewritten with three
  bands: a teal-undertoned "sky" (top) → transparent through the
  middle (so the Atmosphere's herd shows through right where the
  horizon lives) → a vault-deep anchor (bottom, the "silhouette"
  the BottomDrawer further reinforces). If you make the middle
  opaque, the night-drive composition collapses — the herd will
  be hidden behind the gradient.
- `app/globals.css`:
  - **New token `--color-vault-teal`** (`oklch(0.18 0.014 200)`) —
    used ONLY by `HorizonGradient` as the sky stop. The site-wide
    chrome stays on the warm `--color-vault`.
  - **New tuneable atmosphere knobs** (all in `@theme`):
    - `--herd-opacity` (0.55) — the warm "cattle" constellation.
      Lower = more subtle, higher = more visible.
    - `--mist-opacity` (0.42) — the warm haze band above the herd.
    - `--grain-fine-opacity` (0.20) — fine-grain screen-blend.
    - `--vignette-strength` (0.55) — corner darkness.
    - `--bloom-intensity` (1) — preserved; quiet contexts still
      damp it via `body:has(.bloom-quiet-active)`.

To dial it warmer/cooler/grainier/quieter, edit any of the knobs in
`globals.css`. The `HERD` array in `Atmosphere.tsx` is the way to
reshape the constellation itself (positions, sizes, intensities).

Revert path: this whole change is contained in three files — the
prior Atmosphere and HorizonGradient are recoverable from git.

## e3) Bug fixes en route

- **`Drawer.tsx` `clamp01 is not defined`** — the helper was a
  function declaration at the bottom of the file, used inside a
  `forwardRef` callback above it. Function-declaration hoisting
  *should* handle that, but Turbopack's chunking tripped on it and
  threw at runtime, breaking the BottomDrawer in Hero and (after a
  cascade) blocking everything below the hero from rendering.
  Moved the helper above the export as a `const` arrow function;
  fix is mechanical.
- **`CassetteReel` SVG hydration mismatch** — `Math.cos`/`Math.sin`
  were producing 14th-decimal float drift between SSR and client
  (`9.205771365940056` vs `9.205771365940054`). Wrapped each
  computed coordinate in `n.toFixed(4)` so server and client
  serialize identically. Cosmetic warning, but it was driving the
  Next dev "Issue" pill.
  - Note: a similar drift on `Waveform` bar heights in `ScrollBack`
    is still present; it pre-existed and is out of scope here.

## f) Known cosmetics worth a second pass

- **Mobile Evidence Log.** The desk metaphor (overlapping artifacts
  with rotation) reads beautifully at ≥1024 px. At narrower widths the
  layout collapses to a single column with reduced rotations; the
  binder rings hide. Worth a real device pass.
- **Mobile Memory Shards canvas.** The two-panel layout stacks
  cleanly on mobile but the canvas is small. Acceptable for a first
  impression; consider a "best on a wider screen" hint at <640 px.
- **Letter spacing on the letter.** Read the letter on the actual
  device you'll send the link from before sharing.
- **Intake card on very narrow viewports.** The two-column layout
  (photo box + form) stacks at <520 px; the perforation marks are
  hidden. Could be tightened.
- **Color-returns reset.** Each `FiledFrame` is a one-way trip — once
  a visitor interacts, the room stays in color for the rest of the
  session. There's no obvious "rewind" button, intentionally; the
  product argument is that color *returns* and stays.

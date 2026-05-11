# A Museum of Notetaking — Forensic Archive edition

A scrollytelling site for Granola. A forensic archive of the ways I have
not quite taken notes for a decade. Two working AI-interaction
prototypes inside.

```
hero          →  CASE No. 01 — Evidence log (12 typographic artifacts)
              →  CASE No. 02 — The four-second delay (Scroll Back)
              →  CASE No. 03 — The brainstorm (Memory Shards)
              →  CASE No. 04 — For the record (intake card + letter)
              →  /system  (Index — System Specimens)
```

The whole site is rendered in black, off-white, and one cherry-red
specimen of pigment. Both prototype rooms open in monochrome (filed
evidence) and warm to color the moment a visitor interacts.

## Run it locally

```sh
npm install
npm run dev   # http://localhost:3000
```

Other scripts:

```sh
npm run build       # production build
npm run start       # serve the production build
npm run lint        # eslint
npm run typecheck   # tsc --noEmit
```

Node ≥ 20 recommended. The project pins `motion`, `gsap`,
`@gsap/react`, `next 16`, `react 19`, `tailwindcss 4`, and
`html-to-image` (used to save the intake card as a PNG).

## Project shape

```
app/
  layout.tsx            fonts (serif/mono/hand), metadata, viewport, skip-link
  page.tsx              hero + four cases, in scroll order
  globals.css           tokens (@theme), grain overlay, color-returns CSS
  opengraph-image.tsx   1200×630 typographic OG image (forensic)
  icon.tsx              32×32 favicon (cherry dot + M)
  not-found.tsx         404 — exhibit misfiled
  system/page.tsx       INDEX — SYSTEM SPECIMENS
components/
  Hero.tsx                       title, CASE FILE chip, fingerprint, turn-page cue
  evidence/
    EvidenceLog.tsx              CASE No. 01 — wall + binder rings + modal
    artifacts.ts                 the twelve exhibits (data only)
    ArtifactRenderers.tsx        per-kind renderers (KeepCard, Polaroid, Device,
                                 Recipe, Blister, Cassette, Fingerprint, Torn,
                                 Questions, Tag)
  Room2ScrollBack.tsx            CASE No. 02 narrative + FiledFrame + ScrollBack
  Room3MemoryShards.tsx          CASE No. 03 narrative + FiledFrame + MemoryShards
  Letter.tsx                     CASE No. 04 — IntakeCard + the letter
  IntakeCard.tsx                 form + localStorage + develop + save-as-PNG
  FiledFrame.tsx                 wraps a prototype: monochrome → color on interact
  SiteFrame.tsx, RoomMarker.tsx  fixed chrome
  Section.tsx, RoomHeading.tsx   primitives
  scroll-back/                   prototype 02
    ScrollBack.tsx, Waveform.tsx, script.ts
  memory-shards/                 prototype 03
    MemoryShards.tsx, transcript.ts, types.ts
  system/
    SwatchGrid.tsx, MotionDemos.tsx
lib/
  tokens.ts             token names + descriptions, mirrored on /system
```

## Design system

All tokens live in `app/globals.css` under the `@theme` block. The
`/system` page reads the same CSS custom properties at runtime
(`useSyncExternalStore` + `getComputedStyle`), so editing a token in
the stylesheet changes both the museum and its documentation.

| Token group | Source | Documented at |
| --- | --- | --- |
| Color (OKLCH) | `app/globals.css` `@theme` | `/system` → Color evidence |
| Type ramp | `app/globals.css` `.t-*` classes | `/system` → Type evidence |
| Motion easings + durations | `app/globals.css` `@theme` | `/system` → Motion evidence |

The fonts are: **Newsreader** (editorial serif), **JetBrains Mono**
(typewriter chrome), **Caveat** (hand-feel for tags + intake input).
Inter is retained as a small utility face for the dashboard mock and
Keep cards.

## Accessibility notes

- Skip-to-content link in the layout.
- Both prototypes have full keyboard equivalents:
  - Memory Shards: Tab a phrase, Enter to shard it. Tab a shard,
    arrow keys to move, Backspace to remove.
  - Scroll Back: Space captures the most recently completed sentence,
    P plays/pauses, R resets.
- Each Evidence Log artifact is a button; modal closes on Esc.
- Reduced-motion is respected everywhere. The drag-to-peel falls back
  to Enter-to-shard, the Scroll Back arc collapses to in-place, and
  the color-returns crossfade becomes an instant change.
- Focus styles are visible everywhere via `:focus-visible`, in cherry.

## The intake card

`components/IntakeCard.tsx` renders the "FOR THE RECORD" card. Visitor
answers persist in `localStorage` under
`museum-of-notetaking:intake-card`. **Develop** runs a 1s polaroid
animation; **Save as PNG** uses `html-to-image` to download a
high-resolution PNG of the filled-in card. Buttons are excluded from
the export via the `.no-export` class.

## Deploy

```sh
# from this directory
npx vercel        # follow prompts; defaults are correct
# or
npx vercel --prod
```

Set the project name to `museum-of-notetaking` (or your subdomain),
point a custom domain like `museum.yourdomain.com` at the project, and
ship.

## What to personalise before sharing

Search the repo for `{{ REPLACE:` to find every placeholder in one pass.
The major ones are:

- `components/Letter.tsx` — addressee, the Granola feature you admire,
  your sign-off, your contact details.
- `components/IntakeCard.tsx` — the "NUPUR.WORKS" footer (your domain).
- `components/Room2ScrollBack.tsx` — your own first-person moment for
  the prototype's framing story.
- `components/Room3MemoryShards.tsx` — your own first-person moment.
- `components/scroll-back/script.ts` — the timed transcript used by
  the prototype.
- `components/memory-shards/transcript.ts` — the brainstorm transcript
  used by the prototype.
- `components/evidence/artifacts.ts` — the twelve exhibits' labels and
  metadata. The renderers in `ArtifactRenderers.tsx` hold the visible
  body content for each exhibit and are direct candidates for editing.

See `BUILD_NOTES.md` for the deeper walkthrough, the forensic-archive
direction change, and any deliberate deviations from the original plan.

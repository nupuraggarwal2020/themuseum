# Museum of Notetaking — Copy Review

Use this doc to read every word on the site. Each section ends with a citation
to its source file. To request edits, mention the section header and quote the
old text; I'll find the right file.

Notation:

- `> [aria]` aria-label on an element
- `> [alt]` image alt text
- `> [button]` button label
- `> [hint]` keyboard / interaction cue
- `> [placeholder]` form placeholder
- `> [link]` link label
- `> [meta]` browser-tab / OG metadata, not visible on page

---

## 1. Homepage — `/`

### 1.1 Site frame (every page)

#### 1.1.1 Wordmark — top-left

A Museum of Notetaking

> [link] (links to `/`)
> [aria] Site frame (on the header element)

`components/SiteFrame.tsx:35`

#### 1.1.2 Design System link — top-right

[ Design System ]

> [link] (links to `/system`)

`components/SiteFrame.tsx:43`

#### 1.1.3 Skip link (visually hidden, focus-visible)

> [link] Skip to main content

`app/layout.tsx:174`

#### 1.1.4 Room marker rail (right-edge case-file tabs, lg+ only)

> [aria] Case files (on the nav)

Room labels (index · label):

- 00 · Front desk
- 01 · Evidence log
- 02 · Idea: Scroll back
- 03 · Idea: Meeting shards
- 04 · For the record

`components/RoomMarker.tsx:7`

---

### 1.2 Hero

#### 1.2.1 Lede paragraph

What do you do when you've got multiple threads open in your head, notes strewn across tools and a tool comes along that changes all that? To the lovely folks at Granola. I built this prototype to show you my appreciation and share some cool ideas with this vibe coded site. I call it -

`components/Hero.tsx:35`

#### 1.2.2 Display headline

A Museum of *Notetaking*.

(The word "Notetaking" is wrapped in `<em>` but rendered upright via `not-italic` — it just gets a class hook.)

`components/Hero.tsx:55`

#### 1.2.3 Archivist plate (lower-right)

ARCHIVIST: NUPUR AGGARWAL
INTAKE DATE: 2024 / 05 / 07

`components/Hero.tsx:60`

---

### 1.3 Case File Chip (transition between hero and Room 1)

CASE FILES No. 01–04 ~~CLASSIFIED~~ → DECLASSIFIED

(The word "CLASSIFIED" is rendered with a strike-through line in ember colour.)

> [aria] Case files 01–04, declassified

`components/CaseFileChip.tsx:10`

---

### 1.4 Case 01 — Evidence Log (Room 1)

> [aria] Case No. 01: evidence log (on the section)

`components/evidence/EvidenceLog.tsx:47`

#### 1.4.1 Room heading

CASE No. 01    STATUS: UNSORTED

EVIDENCE LOG · SCATTERED · OBJECTS RETRIEVED FROM CASE No. 01 · INDEX OF UNFILED THOUGHTS

**Before Granola: a wall of *unfiled* thoughts.**

A collection of contradiction and clarity. Scribbles and pieces of selves somewhat gathered and digitized, and living in fragments everywhere. Notebooks, notekeepers, JIRAs. I tried it all. But the tool was never the problem. The problem was that every tool asked me to *be* someone before it would help me.

`components/evidence/EvidenceLog.tsx:50`

---

#### 1.4.2 Flatlay — the open manila case file (lg+) / stacked artifacts (<lg)

> [aria] Open case file · unfiled thoughts spread across the desk

`components/evidence/Flatlay.tsx:169`

The lg+ stage is now a "manila case file" — two folder halves spread on a deep-vault backdrop, with a curated subset of artifacts (snacks, polaroid print, recipe, ledger, torn quote, questions) plus decorative pieces. Under lg the original twelve-artifact stacked panel is preserved.

##### 1.4.2.a Hover annotation strip on each artifact tile

Format: `<exhibit> · <label>` (e.g. `EXHIBIT A · SNACK`)

`components/evidence/Flatlay.tsx:1199`

##### 1.4.2.b Cream museum poster (paperclipped to the left half)

Eyebrow:

A MUSEUM OF

Display caps, stacked on two lines (with a soft hyphen):

NOTE-
TAKING.

Bottom matter (small print at the foot of the poster):

CASE FILE 01 — 04
FOR GRANOLA · PERSONAL · MESSY · FILED.

`components/evidence/Flatlay.tsx:605`

##### 1.4.2.c Vertical EVIDENCE LOG strip (taped to the spine)

Vertically rotated mono caps:

EVIDENCE LOG · 2014—2026

Small registry number at the bottom:

R—01

`components/evidence/Flatlay.tsx:733`

##### 1.4.2.d Handwritten design-notes page (right half)

Header (mono caps, boxed):

ROUTES — MUSEUM    PG. 1 / 3

Body (Caveat hand, bullet list):

three routes,

- · LOGOMARK — filing cabinet, restrained
- · VOICE — forensic, dry, slow
- · TYPE — Kobe display, mono chrome
- · ATMOSPHERE — vault haze, ember bloom
- · COPY — case-file, not pitch deck

**1.** drawer wall — 12 closed steel drawers, click to file out
**2.** open folder — spread of papers, pre-filing
**3.** shards — restoring colour by tapping the timeline

*(route 02 is what Sam is looking at now)*

Three small numbered route thumbnails at the foot, labelled `01`, `02`, `03` (route `02` is highlighted).

`components/evidence/Flatlay.tsx:825`

##### 1.4.2.e Yellow Post-it (upper-right corner)

FOR SAM
case file 01.
— N.

`components/evidence/Flatlay.tsx:1023`

##### 1.4.2.f Editorial pivot (between flatlay and drawer wall)

**After Granola: neatly *filed*, collected, and answerable.**

Granola is my new filing system. I can be fully present, while being assured that all the important stuff is filed and easy to query. Granola sits quietly through the meeting and lets the noticing happen after while I can enjoy just being present.

`components/evidence/Flatlay.tsx:194`

##### 1.4.2.g Transition strip below the flatlay

↓ FILED INTO THE DRAWERS BELOW

> [hint] Click any open drawer to inspect what's inside

`components/evidence/Flatlay.tsx:207`

---

#### 1.4.3 The 12 typographic artifacts

These render inside the manila spread (six of them on lg+), the stacked-panel mobile layout (all twelve on <lg), the drawer-wall pockets, and the DetailCard. Each artifact has:

- An `exhibit` letter (EXHIBIT A through EXHIBIT L)
- A `label` (the typewriter title shown on hover and in the detail card)
- A `type` (one of `LIST`, `LEDGER`, `NOTE`, `LOG`, `SESSION`, `VOICE MEMO`, `INTAKE` — engraved on the closed drawer face and shown on the DetailCard manila tab)
- A `meta` line (the app of origin + small details, used to compute the placard year)
- An optional `caption` (used in DetailCard, see §1.4.5)
- The body content rendered by `ArtifactRenderers.tsx`

Source for the metadata fields below: `components/evidence/artifacts.ts:57`

---

##### Artifact 01 — EXHIBIT A · SNACK

Body content (Keep card, tinted yellow):

Snack

- Nimbu masala
- Papdi
- Nimbu masala
- Murukku
- Bhakarvadi

`components/evidence/ArtifactRenderers.tsx:62`

Metadata (drawer face + DetailCard tab):

- Type label: KEEP NOTE (placard) · LIST (drawer face marker + DetailCard tab)
- Meta: GOOGLE KEEP · personal · 4 items, last edited never

`components/evidence/artifacts.ts:58`

---

##### Artifact 02 — EXHIBIT B · AJEET OWES / NUPUR OWES

Body content (Keep card):

Aug 25
Ajeet owes 3161
Nupur owes 353

SEPT 2025
Ajeet owes 4500
Nupur owes 1103

28 AUG  
Ajeet owes 2810  
Nupur owes 72.5

`components/evidence/ArtifactRenderers.tsx:74`

Metadata:

- Type label: KEEP NOTE (placard) · LEDGER (drawer face marker + DetailCard tab)
- Meta: GOOGLE KEEP · personal · last edited Sept 2025

`components/evidence/artifacts.ts:70`

---

##### Artifact 03 — EXHIBIT C · ANNIVERSARY GIFTS I'M THINKING OF

Body content (Keep card):

Anniversary gifts we've given

**1st: Paper**
kindle paper white
puzzle set

`components/evidence/ArtifactRenderers.tsx:98`

Metadata:

- Type label: KEEP NOTE (placard) · LIST (drawer face marker + DetailCard tab)
- Meta: GOOGLE KEEP · personal · 1 entry · paper

`components/evidence/artifacts.ts:82`

---

##### Artifact 04 — EXHIBIT D · PERFORMANCE REVIEW (TYPESET IN A DESIGN TOOL)

Body content (Polaroid):

July 24 to Dec 24
*Driver*

- · Designed and launched the atlassian rovo integration for canva. Worked with an SI to deliver a high quality integration, featured as the main partner at Atlassian's launch event
- · Developed research-backed Developer archetypes, ran user interviews and met with real users at the Extend event to validate them
- · Worked with the Apps API team on Suspended Apps. Briefed the Apps Review team on how to review apps for a suspended state
- · Set up a new process for the connect api team to triage and evaluate connect api feedback. Helped triage close to 100 feedback items

Hand-written caption underneath:

*performance review*

`components/evidence/ArtifactRenderers.tsx:143`

Metadata:

- Type label: DESIGN BOARD (placard) · SESSION (drawer face marker + DetailCard tab)
- Meta: ARC EASEL · self-review · July 24 to Dec 24
- Caption (used as italic quote in DetailCard): performance review

`components/evidence/artifacts.ts:94`

---

##### Artifact 05 — EXHIBIT E · MY PRODUCTIVITY DASHBOARD

Body content (Beige device frame, browser-style top bar):

URL slug in top bar: my-productivity-dashboard

Three small cards across the top:

**Today's Progress** *(top-right link: Edit)*
0%
0 of 4 tasks

**Statistics** *(top-right link: View All)*
4 TASKS
0 WINS
2 THOUGHTS
0 STREAK

**Quick Actions**
ADD TASK
LOG WIN
ADD THOUGHT
ARCHIVE

Wide thoughts panel below *(top-right link: Add)*:

**Thoughts**
In the AI world, references are everything. If you've got good references, you can make it look beautiful and make it work exactly as you like. *Just now*
I hate documentation *Just now*

`components/evidence/ArtifactRenderers.tsx:191`

Metadata:

- Type label: DASHBOARD (placard) · LOG (drawer face marker + DetailCard tab)
- Meta: CUSTOM BUILD · ~9 hours over a long weekend · 10 days streak
- Caption: the one I built when nothing else fit

`components/evidence/artifacts.ts:107`

---

##### Artifact 06 — EXHIBIT F · MULLED WINE

Body content (Recipe card, hand-written):

mulled wine
*for the cold week*

- cut oranges
- cut lemons
- cinnamon stick
- sugar
- star anise
- cardamom
- nutmeg
- chai masala

`components/evidence/ArtifactRenderers.tsx:350`

Metadata:

- Type label: RECIPE (placard) · LIST (drawer face marker + DetailCard tab)
- Meta: GOOGLE KEEP · recipe · saved twice, made once
- Caption: recipe

`components/evidence/artifacts.ts:120`

---

##### Artifact 07 — EXHIBIT G · MEDICINE

Body content (Pill blister card, 14 cells, only the first one filled):

MEDICINE · TRACKING
WK 01 · 1 of 14 cells filled

(14 round cells in a 7-column grid, 1 filled.)

Have to exercise, go to gym or however you choose…

`components/evidence/ArtifactRenderers.tsx:376`

Metadata:

- Type label: MEDICAL CARD (placard) · LOG (drawer face marker + DetailCard tab)
- Meta: GOOGLE KEEP · medical · 1 of 14 cells used

`components/evidence/artifacts.ts:133`

---

##### Artifact 08 — EXHIBIT H · VOICE MEMOS / 2019 onward

Body content (Cassette card with two reels):

VOICE MEMOS
2019 onward

Hand-written sticker label in the middle:
*do not erase*

(Two cassette reels, divider line between them)

Side A · 312 takes

`components/evidence/ArtifactRenderers.tsx:416`

Metadata:

- Type label: VOICE MEMOS (placard) · VOICE MEMO (drawer face marker + DetailCard tab)
- Meta: iPHONE VOICE MEMOS · 312 entries · titled NEW RECORDING (NEW RECORDING)

`components/evidence/artifacts.ts:145`

---

##### Artifact 09 — EXHIBIT I · INTAKE PRINT

Body content (Fingerprint card):

INTAKE PRINT
ARCHIVIST · NUPUR AGGARWAL
FILED · 2026 / 05 / 07

(Hand-drawn fingerprint mark in an off-white box)

SUBJECT · RIGHT THUMB · ROLLED

`components/evidence/ArtifactRenderers.tsx:468`

Metadata:

- Type label: INTAKE PRINT (placard) · INTAKE (drawer face marker + DetailCard tab)
- Meta: ARCHIVIST · NUPUR AGGARWAL · filed 2026

`components/evidence/artifacts.ts:157`

---

##### Artifact 10 — EXHIBIT J · QUOTE · TORN FROM A THOUGHTS PANEL

Body content (Torn paper, jagged edges):

"In the AI world, **references are everything.** If you've got good references, you can make it look beautiful and make it work exactly as you like."

(The phrase "references are everything." is rendered as a non-italic medium weight, with a cherry underline.)

TORN FROM THOUGHTS PANEL · JUST NOW

`components/evidence/ArtifactRenderers.tsx:521`

Metadata:

- Type label: TORN PAGE (placard) · NOTE (drawer face marker + DetailCard tab)
- Meta: MY PRODUCTIVITY DASHBOARD · just now

`components/evidence/artifacts.ts:169`

---

##### Artifact 11 — EXHIBIT K · DAY 1 QUESTIONS

Body content (Keep card):

Day 1 questions

- How do you give someone a kudos
- Is there a new person blog?
- best way to introduce myself to the team
- How do you go on coffee dates (via donut)
- Best way to meet all the stakeholders

`components/evidence/ArtifactRenderers.tsx:553`

Metadata:

- Type label: QUESTIONS (placard) · INTAKE (drawer face marker + DetailCard tab)
- Meta: GOOGLE KEEP · work · written on every first day, never reread
- Caption: first day at every job, in the same handwriting

`components/evidence/artifacts.ts:181`

---

##### Artifact 12 — EXHIBIT L · EXHIBIT TAG

Body content (Twine tag with three lines of stamped type):

EXHIBIT A
**TWELVE WAYS OF NOT**
**QUITE TAKING NOTES**

`components/evidence/ArtifactRenderers.tsx:573`

Metadata:

- Type label: EXHIBIT TAG (placard) · NOTE (drawer face marker + DetailCard tab)
- Meta: EVIDENCE LABEL · twine · hung from desk edge

`components/evidence/artifacts.ts:194`

---

#### 1.4.4 Drawer wall (8×6 wall of dark steel drawers)

Visible chrome on each artifact drawer:

##### 1.4.4.a Per-drawer aria label

> [aria] Open exhibit `<EXHIBIT A>` · `<LABEL>`
> e.g. "Open exhibit EXHIBIT A · SNACK"

`components/drawer-wall/DrawerWall.tsx:332`

##### 1.4.4.b Content-type marker engraved on each closed drawer face (NEW)

A small mono-uppercase one-word indicator centred just below the handle, drawn from the artifact's `type` field. Hidden below sm:.

Vocabulary, in order of the 12 drawers:

- A · LIST (snacks)
- B · LEDGER (ledger)
- C · LIST (anniversary)
- D · SESSION (polaroid)
- E · LOG (dashboard)
- F · LIST (recipe)
- G · LOG (blister)
- H · VOICE MEMO (cassette)
- I · INTAKE (fingerprint)
- J · NOTE (torn)
- K · INTAKE (questions)
- L · NOTE (tag)

`components/drawer-wall/Drawer.tsx:182`

##### 1.4.4.c Placard text rendered next to each open drawer

(Three lines of caps, on a small lit paper card, sm+ only)

- Line 1: `<EXHIBIT>` (e.g. `EXHIBIT A`)
- Line 2: type label from `kind` (one of: `KEEP NOTE`, `DESIGN BOARD`, `DASHBOARD`, `RECIPE`, `MEDICAL CARD`, `VOICE MEMOS`, `INTAKE PRINT`, `TORN PAGE`, `QUESTIONS`, `EXHIBIT TAG`)
- Line 3: `FILED <year>` (year is parsed from the artifact's meta string when a 4-digit number is present, e.g. `FILED 2025` for the ledger or `FILED 2026` for the fingerprint); falls back to `ON FILE` when no year is present (the current default for 10 of the 12 drawers)

`components/drawer-wall/DrawerWall.tsx:280`

---

#### 1.4.5 DetailCard — manila file-folder modal (opens when an artifact is clicked)

The DetailCard was rewritten as a manila folder. There is no chrome — no back button, no expand affordance, no kebab, no prev/next, no metadata strip, no italic quote, no artist plate. Each file is its own moment. Click outside or press Esc to close.

##### 1.4.5.a Backdrop close button

> [aria] Close exhibit (full-bleed transparent button covering the dimmed backdrop)

`components/drawer-wall/DetailCard.tsx:186`

##### 1.4.5.b Folder modal aria-label

Computed per artifact as:

> Exhibit `<letter>`: `<label>`[, filed `<year>`][, filed as `<type-lowercased>`]

E.g. `Exhibit B: AJEET OWES / NUPUR OWES, filed 2025, filed as ledger` · `Exhibit A: SNACK, filed as list` · `Exhibit I: INTAKE PRINT, filed 2026, filed as intake`.

The screen-reader title (sr-only) reads:

> Exhibit `<letter>`: `<label>`

`components/drawer-wall/DetailCard.tsx:161`

##### 1.4.5.c Manila tab text (top-left of the folder)

`EXHIBIT <letter>` · `<TYPE>`

(e.g. `EXHIBIT A · LIST`, `EXHIBIT B · LEDGER`, `EXHIBIT D · SESSION`, `EXHIBIT H · VOICE MEMO`, `EXHIBIT I · INTAKE`, `EXHIBIT L · NOTE`.)

`components/drawer-wall/DetailCard.tsx:266`

##### 1.4.5.d Folder body

A lighter "paper insert" sits inside the manila body and renders the artifact via the same renderer used by the drawer pocket and the flatlay tile. No additional copy is generated by the modal itself.

`components/drawer-wall/DetailCard.tsx:328`

---

### 1.5 Case 02 — Scroll Back (Room 2)

> [aria] Case No. 02: the four-second delay (on the section)

`components/Room2ScrollBack.tsx:23`

#### 1.5.1 Room heading

CASE No. 02    STATUS: REOPENED

FILED 2024 / 09 · INCIDENT: IMPORTANT MEETING, 9AM · REPORTING ARCHIVIST: NUPUR AGGARWAL

**The meeting I was *four seconds* behind.**

A 9am meeting on strategy. I am writing the previous sentence when the engineering lead says the line the whole room agrees to. By the time I notice, she has moved on. I wonder what was said and if I could bookmark it or go back a few seconds.

`components/Room2ScrollBack.tsx:26`

#### 1.5.2 Italic line beneath the lede

*What I needed was a small button labelled wait, what?*

(Whole line is rendered italic; `wait, what?` is wrapped in a semantic `<em>`.)

`components/Room2ScrollBack.tsx:48`

#### 1.5.3 FiledFrame chrome

Top strip:

CASE No. 02 · Scroll Back

FILED 2024 / 09 · STATUS: ~~FILED~~ → REOPENED

(After first interaction, this becomes: `FILED 2024 / 09 · STATUS: REOPENED`, with REOPENED in ember.)

Status caption beneath the prototype frame (initial):

● FILED · interact to reopen the case. Color returns on contact.

After first interaction:

● LIVE · color returned the moment you intervened.

`components/FiledFrame.tsx:72`

#### 1.5.4 Prototype header (inside the lit case)

EXHIBIT 02 / A    Scroll Back · Bookmark the sentence you noticed four seconds late.

`components/scroll-back/ScrollBack.tsx:242`

#### 1.5.5 Header buttons

> [button] Play  (becomes `Pause` while playing, `Replay` after the transcript ends)
> [aria] Start playback / Pause playback / Replay

> [button] Wait, what?  (the capture button)

> [button] Reset

`components/scroll-back/ScrollBack.tsx:482`

#### 1.5.6 Scrubber row above the transcript

Format: `MM:SS / MM:SS` (e.g. `00:00 / 01:08`)

`components/scroll-back/ScrollBack.tsx:274`

#### 1.5.7 Transcript region

> [aria] Live transcript (on the scrolling log)

`components/scroll-back/ScrollBack.tsx:301`

Each transcript line shows the speaker dot, the speaker name (uppercase mono), the timestamp, and then the typed-out sentence.

Speakers:

- **Maya** · Engineering lead
- **Theo** · Teammate

`components/scroll-back/script.ts:26`

**Sentence list (in playback order)**

1. **Maya · 00:08** — Right, where we left off. The question on the table: what makes one version of this product win and another one die.
2. **Maya · 00:14** — It is not the feature list. It is what the product asks of you on the first day, before you have learned anything.
3. **Maya · 00:21** — And the asks depend entirely on the defaults around them. Whether we open empty or pre-seeded, whether the account comes first or last, whether the share button is hidden or anchored. Each gives a different product.
4. **Maya · 00:32** — If you remember nothing else from this meeting, remember this one line, because it is the thing the doc will not say but will assume you know.
5. **Maya · 00:44** — A product is not a list of features. It is a list of defaults you are willing to defend.
6. **Maya · 00:54** — Same product, different defaults, different outcome. That is the entire strategy in eight words.
7. **Theo · 01:04** — Sorry, could you repeat the eight-word version?
8. **Maya · 01:08** — Same product, different defaults, different outcome. Write it down.

`components/scroll-back/script.ts:46`

#### 1.5.8 Hint text inside the transcript

> [hint] Press [Space] to bookmark the last sentence.

(The word `Space` is shown as a `<kbd>` chip.)

`components/scroll-back/ScrollBack.tsx:347`

#### 1.5.9 Saved-card sidebar

> [aria] Saved bookmarks (on the aside)

Header:

Saved    `<count>`

Empty state (italic serif):

*Sentences you bookmark land here.*

`components/scroll-back/ScrollBack.tsx:373`

#### 1.5.10 Saved card (per item)

> [aria] Saved bookmark from `<speaker>` at `<timestamp>`

Visible body of each card: the speaker dot, the speaker name (uppercased mono), the timestamp, the captured sentence (serif), then a small waveform and a status word.

Status word: `tap to play` (default) / `playing` (briefly while pulsing)

`components/scroll-back/ScrollBack.tsx:549`

#### 1.5.11 Closing line beneath the prototype

The capture happens on the sentence that just *finished*. So you stay present.

`components/Room2ScrollBack.tsx:62`

---

### 1.6 Case 03 — Memory Shards (Room 3)

> [aria] Case No. 03: the brainstorm (on the section)

`components/Room3MemoryShards.tsx:22`

#### 1.6.1 Room heading

CASE No. 03    STATUS: REOPENED

FILED 2025 / 02 · INCIDENT: IDEATION MEETING, 8 PEOPLE, 40 MINUTES · REPORTING ARCHIVIST: NUPUR AGGARWAL

**The brainstorm I *couldn't* reconstruct.**

Eight people, forty minutes, many ideas. I left the room feeling like we had decided something. The next morning, the transcript was a flat list of who said what but not connected to the visual whiteboard, and the part I actually wanted, the *structure* of the meeting, was gone.

`components/Room3MemoryShards.tsx:25`

#### 1.6.2 Italic line beneath the lede

*Memory is spatial. The notes were a list. The notes lost.*

`components/Room3MemoryShards.tsx:48`

#### 1.6.3 FiledFrame chrome

Top strip:

CASE No. 03 · Memory Shards

FILED 2025 / 02 · STATUS: ~~FILED~~ → REOPENED

(After first interaction: `FILED 2025 / 02 · STATUS: REOPENED`, REOPENED in ember.)

Status caption beneath the prototype:

● FILED · interact to reopen the case. Color returns on contact.

After first interaction:

● LIVE · color returned the moment you intervened.

`components/FiledFrame.tsx:72`

#### 1.6.4 Prototype header (inside the lit case)

EXHIBIT 03 / A    Memory Shards · A spatial canvas for the parts of a meeting that mattered.

`components/memory-shards/MemoryShards.tsx:763`

#### 1.6.5 Toolbar buttons

> [button] Suggest clusters
> [button] Seed an example
> [button] Clear canvas

`components/memory-shards/MemoryShards.tsx:767`

#### 1.6.6 Transcript panel

> [aria] Transcript (on the aside)

Header row:

Transcript    Voca, kickoff · 04:18

`components/memory-shards/MemoryShards.tsx:976`

Per phrase row:

> [aria] `<speaker>` at `<time>`: `<text>`. Press enter to send to canvas.
> [hint] drag · ↵  (small annotation that appears in the corner on hover/focus)

`components/memory-shards/MemoryShards.tsx:1034`

Speakers (color-coded dots):

- **Maya** · PM
- **Jonas** · Designer
- **Ari** · Engineer
- **Pippa** · Researcher
- **Wes** · Founder
- **Tomi** · Engineer

`components/memory-shards/transcript.ts:29`

Phrase list (in transcript order):

1. **Wes · 00:08** — Okay, the question for the next forty minutes is just: where does Voca lose its first-time users.
2. **Maya · 00:21** — Step three. It's always step three. Eighty-one percent of the drop is between connect-account and the first capture.
3. **Jonas · 00:34** — Step three is also where we ask for the most. Microphone, calendar, contacts, all in twenty seconds.
4. **Pippa · 00:48** — From the seven sessions last week, five people called the calendar permission 'creepy.' Their word.
5. **Ari · 01:02** — We don't actually need calendar at signup. We can ask the first time they want to record a meeting.
6. **Wes · 01:15** — Defer it. Yeah. The whole onboarding should be: capture one thing, see one thing back, that's it.
7. **Tomi · 01:28** — Counterpoint. If they don't connect calendar in the first session we lose seventy percent of automatic capture later.
8. **Maya · 01:41** — True, but right now they don't even reach the first session.
9. **Jonas · 01:55** — What if the first capture is the onboarding. You hold the mic, we transcribe one sentence, we show you a card.
10. **Pippa · 02:09** — That mirrors what worked in the field with researchers. The first interaction needs to feel like the product, not like a setup screen.
11. **Ari · 02:24** — I can ship that in a week if we don't touch the second screen.
12. **Wes · 02:38** — Don't touch the second screen.
13. **Tomi · 02:51** — Wild idea, kind of unrelated. What if the onboarding is a real meeting. A sixty-second meeting with us. With the team.
14. **Jonas · 03:04** — Like a recorded message that plays as if it's live and you're capturing it.
15. **Maya · 03:18** — That's bold and probably illegal in three countries.
16. **Pippa · 03:31** — Make it obvious it's a recording. The novelty is the delight, not the deception.
17. **Wes · 03:46** — Park that. Let's land the small win first. Defer the permissions, ship the one-sentence capture.
18. **Ari · 04:01** — I'll have a draft tomorrow morning.

`components/memory-shards/transcript.ts:68`

#### 1.6.7 Spatial canvas (right side)

> [aria] Spatial canvas. Shards from the transcript appear here. (role=application)

Empty-state (italic serif, centered):

*Drag a phrase from the left, or press Enter on a focused phrase.*

`components/memory-shards/MemoryShards.tsx:1190`

#### 1.6.8 Per-shard chrome on the canvas

> [aria] `<speaker>` at `<time>`: `<text>`. Use arrow keys to move, backspace to remove. (on each shard)

> [aria] Click here, then click another shard to draw a thread between them (on the small `+` connect handle that appears top-right of each shard on hover)

`components/memory-shards/MemoryShards.tsx:1472`

#### 1.6.9 Closing line beneath the prototype

Drag a phrase out and the page lets it go. Connect two and the line jitters slightly, so the canvas reads as thinking, not as software. Press [Tab] then [Enter] for the same thing without a mouse.

(`Tab` and `Enter` shown as `<kbd>` chips.)

`components/Room3MemoryShards.tsx:62`

---

### 1.7 Case 04 — Letter (For The Record)

> [aria] For the record · a letter to Granola (on the section)

`components/Letter.tsx:26`

#### 1.7.1 Case head

CASE No. 04    STATUS: FOR THE RECORD

(`FOR THE RECORD` is rendered in ember.)

`components/Letter.tsx:30`

#### 1.7.2 Headline

**Hey Visitor. *Make your Keepsake here.***

(The second sentence is italicised in a slightly muted ink colour.)

`components/Letter.tsx:44`

#### 1.7.3 Intro paragraph above the IntakeCard

A small keepsake for you. Enter the info and press develop.

`components/Letter.tsx:48`

---

#### 1.7.4 IntakeCard (interactive form)

##### 1.7.4.a Card header

FOR THE RECORD    EXHIBIT · VISITOR · CARD No. `<MM-DD>`

(`MM-DD` is today's date, padded; e.g. `05-08`.)

`components/IntakeCard.tsx:189`

##### 1.7.4.b Field labels (small mono caps)

- NAME
- COUNTRY
- TELL ME A BORING FACT (multiline)
- WHAT'S YOUR INVISIBLE LUGGAGE (multiline)

`components/IntakeCard.tsx:202`

##### 1.7.4.c Field aria-labels

> [aria] Your name (on NAME input)
> [aria] Your country (on COUNTRY input)
> [aria] A short story about you (on STORY textarea)
> [aria] Your invisible luggage (on LUGGAGE textarea)

##### 1.7.4.d Field placeholders

All four inputs have an empty placeholder (`""`).

`components/IntakeCard.tsx:205`

##### 1.7.4.e Empty photo box (left side, before "Develop" pressed)

> [placeholder] ?  (a single question mark in mono)

(With a small head-and-shoulders silhouette sketch above it.)

`components/IntakeCard.tsx:379`

##### 1.7.4.f Card footer (always present, included in PNG export)

EXHIBIT FILED · A MUSEUM OF NOTETAKING    NUPUR.WORKS

`components/IntakeCard.tsx:244`

##### 1.7.4.g Status hint outside the card

Before develop:

FILL IN, THEN PRESS DEVELOP

After develop:

DEVELOPED · YOUR EXHIBIT IS READY

`components/IntakeCard.tsx:258`

##### 1.7.4.h Buttons

Before develop:

> [button] Develop  (becomes `Developing…` while in flight; disabled when all fields empty)

After develop:

> [button] Save as PNG  (becomes `Saving…` while exporting)
> [button] Reset card

`components/IntakeCard.tsx:266`

---

#### 1.7.5 Letter body

DOCUMENT 04.B · LETTER, ENCLOSED

Dear *{{ REPLACE: Sam }}*,

(The placeholder text `{{ REPLACE: Sam }}` is rendered literally on the page in ember italic — it's the one remaining template marker the user is supposed to swap.)

I have, on my desk right now, many notebooks with three pages of decisive thinking and four hundred pages of notes I took during the meetings and after. This has stayed almost constant for a decade, across many different systems.

The thing I love about Granola is *it lets me be present without missing any information and enabled countless follow-ups and a shared way of documenting*. It is the first software I have used that respects the order in which thinking actually happens, which is: live first, write later, and only the parts that turned out to matter.

I built this museum as my application because I wanted to show you how I think. I may not be a developer, but I am a builder with a creative director's vision, and I wanted to challenge myself to build some interactions in a way a CV cannot. The first, *Scroll Back*, is for the moment a sentence lands four seconds after the meaning does. The second, *Memory Shards*, is for the brainstorm whose shape I knew but whose notes I never could reconstruct. Both are very rough, but maybe belong in a product like yours. I would like to help you build them.

If any of this struck a chord, or any of the choices made you wince, I would love to hear which.

Yours,
*Nupur Aggarwal*

[nupur.aggarwal92@gmail.com](mailto:nupur.aggarwal92@gmail.com)
Work portfolio: [nupuraggarwal.vercel.app](http://nupuraggarwal.vercel.app) (password: magic)

(`Nupur Aggarwal` is rendered in handwriting (`font-hand`) at 1.8rem in ember; the email + portfolio line is in a small typewriter style; the portfolio URL is a real anchor opening in a new tab.)

`components/Letter.tsx:64`

#### 1.7.6 End-of-file mark (bottom of homepage)

End of file · 04 of 04

`components/Letter.tsx:165`

---

## 2. System page — `/system`

### 2.1 Header

/SYSTEM

**The pieces underneath.**

One serif, one sans, one accent, three easings. Every choice on the site reads from this page. Change a token here, the museum moves with it.

`app/system/page.tsx:24`

---

### 2.2 Block 01 — Color

**Color.**

A deep matte vault, near-white ink-on-dark, and a single halated ember. Every token name from the warm-bone build is preserved and retargeted; values are still OKLCH so the brightness curves at the extremes hold up.

`app/system/page.tsx:39`

#### 2.2.1 Swatch grid (one swatch per color token)

For each swatch:

- Token name (e.g. `paper`, `bone-50`, `ink-900`, `cherry-700`, `rule`)
- Role line (the human description)
- Resolved value (mono, e.g. `oklch(...)`)

> [aria] Swatch for `<token name>` (on each color square)

Roles, in order:

- **paper** — Card surface
- **bone-50** — Page canvas (aged)
- **bone-100** — Surface elevation
- **bone-200** — Subtle separator
- **bone-300** — Raised separator
- **ink-900** — Primary ink
- **ink-700** — Body text
- **ink-500** — Secondary text
- **ink-400** — Quiet text
- **ink-300** — Hairline / disabled
- **cherry-700** — Specimen pigment (cherry, hover anchor)
- **cherry-600** — Specimen pigment (cherry, primary)
- **cherry-100** — Pigment wash (selection, button bg)
- **rule** — Hairline divider
- **rule-strong** — Stronger divider

`lib/tokens.ts:31`

---

### 2.3 Block 02 — Typography

**Typography.**

One editorial serif for narrative weight, one geometric sans for interface. The display sizes use `clamp()` so the type ramp scales down honestly on small screens instead of collapsing to body.

`app/system/page.tsx:51`

#### 2.3.1 Font tokens (one card each)

**serif (editorial)** — `var(--font-serif)`
Headlines, narrative, the letter, saved cards
*Originally targeted Söhne Serif / Tiempos / Lyon. Swapped to Newsreader (free, Google Fonts) for licensing and self-hosting via next/font. The italic carries most of the editorial mood.*

**mono (chrome)** — `var(--font-mono)`
Case numbers, status stamps, metadata, captions
*JetBrains Mono via next/font. The whole forensic chrome is built on this face: typewriter feel without committing to a literal typewriter font.*

**hand (intake + tags)** — `var(--font-hand)`
Hand-written captions, recipe card, intake form input
*Caveat via next/font. Picked over Homemade Apple for legibility at small sizes and broader weight range.*

**sans (utility)** — `var(--font-sans)`
Inter, fallback UI, kept minimal in this edition
*Inter, retained for body text inside Keep cards and dashboard mock. Most chrome now uses mono.*

`lib/tokens.ts:124`

#### 2.3.2 Type ramp

Header: Type ramp

Each row shows a name + spec on the left and a sample on the right.

- **display-caps** · `Newsreader · clamp(40–80px) · LH 1 · LS 0.005em · UPPER` → A MUSEUM OF NOTETAKING.
- **display** · `Newsreader · clamp(44–92px) · LH 1 · LS −0.02em` → A museum of notetaking.
- **headline** · `Newsreader · clamp(32–56px) · LH 1.05 · LS −0.018em` → The wall of unfiled thoughts.
- **title** · `Newsreader · clamp(24–34px) · LH 1.18 · LS −0.012em` → Memory Shards
- **lede** · `Newsreader · clamp(18–22px) · LH 1.55` → A collection of contradiction and clarity. Scribbles, traces, pieces of selves once denied or dismissed.
- **typewriter** · `JetBrains Mono · 11px · 400 · LS 0.06em · UPPER` → EVIDENCE LOG · SCATTERED · SORTED
- **typewriter-sm** · `JetBrains Mono · 10px · LS 0.08em · UPPER` → FILED 2024 · STATUS: REOPENED
- **body** · `Inter · 17px · LH 1.65` → Each one looks intentional from the outside. Inside, the same shape: two productive weeks, then nothing.
- **hand** · `Caveat · 1.35rem · LH 1.3` → performance review (typeset in a design tool??)

`lib/tokens.ts:65`

---

### 2.4 Block 03 — Motion

**Motion.**

Three eases, three durations. Anything that wants more is asking to be a different surface.

`app/system/page.tsx:106`

#### 2.4.1 Easings specimen card

SPECIMEN · EASINGS
MEASUREMENT MARKS · 0 · 25 · 50 · 75 · 100

Three easings, one row each. Each row shows a name + var, a clickable strip that animates a cherry bar across, and a description.

- **settle** · `var(--ease-settle)` — Primary ease-out. Entrances, room reveals, card resolution, modal opens.
- **snap** · `var(--ease-snap)` — Drag release, pressed state, drop-into-place.
- **glide** · `var(--ease-glide)` — Cross-fades, scrubbed scrolls, the playback caret.

> [aria] Replay `<name>` easing demo (on each strip)

Footer line:

Click any strip to replay all three.

`components/system/MotionDemos.tsx:20`

#### 2.4.2 Durations specimen card

SPECIMEN · DURATIONS
STAMPED IN MS · KEEP THE LIST SHORT

- **quick** · `var(--duration-quick)` — 200ms · taps, hovers
- **base** · `var(--duration-base)` — 350ms · component change
- **slow** · `var(--duration-slow)` — 600ms · room reveals
- **restore** · `var(--duration-restore)` — 800ms · color returns to a filed prototype on first interaction

Footer line:

Beyond 800ms is reserved for room transitions, never UI controls.

`lib/tokens.ts:174`

---

### 2.5 Block 04 — Field notes

**Field notes.**

Decisions taken while building this. Filed in four cases: direction, strategy, maturity, taste. Each entry is one decision and a sentence of reasoning. Read these instead of a feature list.

`app/system/page.tsx:116`

#### 2.5.1 FIELD NOTES No. 01 · Creative direction

> [aria] Field notes 01 (on the section)

**Site as application**
The application is the museum. There is no separate portfolio site linking out to one. Scroll through the work and you have already used the work; the argument is the artifact.

**Forensic archive as metaphor**
Notetaking is forensic. Fragments left behind, filed evidence, status stamps. The visual language of a classified-then-declassified case file carries the product premise without ever having to state it.

**Dark vault, warm paper as a scope**
The original warm-bone editorial palette was not thrown away. It was demoted to `.surface-lit` and is restored only inside drawers, the detail card, and the intake card. Lit paper appears where the visitor is invited to engage; outside, the vault.

**Single-typeface system**
Kobe 1.1 carries every typographic role on the site. Contrast is held by weight (900 / 700 / 400) and obliquity, not by typeface family. The prior four-family stack (Newsreader, Inter, JBM, Caveat) and an interim Category mapping are still registered in `app/layout.tsx` and documented in `globals.css`, so a revert is one CSS line.

`components/system/FieldNotes.tsx:27`

#### 2.5.2 FIELD NOTES No. 02 · Strategy

> [aria] Field notes 02

**Color returns on interaction**
Each prototype opens monochrome ("FILED") and warms back to color the moment the visitor intervenes. The mechanic is the product argument: software should sit quiet until invited forward.

**Bloom-intensity, contextual**
A `--bloom-intensity` token, plumbed up through `body:has(.bloom-quiet-active)`, lets local subtrees damp the global ambience while they hold focus. CSS-only context-awareness; the IntakeCard and DetailCard breathe quieter without any JS subscribing to anything.

**The visitor as the fourth file**
Case 04 is an interactive intake card the reader fills, develops, and saves as PNG. It frames the reader as participant, not audience, and gives them a souvenir on the way out.

**Performance as a constraint, not an afterthought**
Two filtered fixed-position layers is the budget for the whole page: Atmosphere and the Hero horizon. The contrast/brightness pair never changes after mount; only transforms animate, and the noise SVGs are rasterised once at module scope. Drawer halos are box-shadow only, by choice.

`components/system/FieldNotes.tsx:82`

#### 2.5.3 FIELD NOTES No. 03 · Maturity

> [aria] Field notes 03

**Tokens held across themes**
When the warm-bone palette became a scoped sub-theme, every token name stayed identical (`--color-paper`, `--color-ink-900`) and only the values changed. Prototype components built on the warm palette kept working without edits, and every prior typographic mapping is recorded inline with literal CSS revert lines.

**Progressive subtraction of chrome**
The forensic typewriter strips proliferated, then were progressively cut as the editorial voice asserted itself. The "ACT 01 OF 03 · DRAWERS PROTRUDING" line was deleted because it was telling the reader what they could already see.

**Copy contradictions are credibility leaks**
SORTED was removed from Room 1 once the Flatlay below it was titled UNSORTED. Small but it matters; a single inconsistent label is enough to make a careful reader distrust the rest.

**Reduced motion, first-class**
Every motion feature has a non-motion equivalent. Drag-to-peel has an Enter alternative, drift animations pause, color-returns degrades to instant, the polaroid develop is skipped. Designed alongside the motion, not bolted on at the end.

`components/system/FieldNotes.tsx:140`

#### 2.5.4 FIELD NOTES No. 04 · Taste

> [aria] Field notes 04

**The drawer pierces the fold**
The half-lit drawer does not sit politely below the hero. It pierces through, half below the viewport, with an ember pool above. Composition tells you to scroll without a chevron or a hint.

**One number per drawer**
Shine, halo, drop-shadow, light shaft, and pocket lighting all derive from a single `--tz` custom property per drawer. One scrubbed value, six visible behaviours; the wall breathes with light without a frame of choreography written in JS.

**One detail card, two doors**
The Vision-Pro-style centre-stage surface is written into by both the intake-table flatlay and the 8×6 drawer wall. The wall is one of two ways to access an artifact; the surface is reusable presentation, not a feature of the wall.

**Grain as structure, not decoration**
The first ambient layer was wimpy. Replaced wholesale with the cjimmy `contrast(170%) brightness(1000%)` noise-crush, multiplied back over a vault-tinted gradient. The grain is now the dominant texture of the page, not a faint sprinkle on top.

`components/system/FieldNotes.tsx:196`

---

### 2.6 Block 05 — Notes & deviations

(No paragraph lede; jumps straight to the cards.)

`app/system/page.tsx:126`

**Serif substitution**
Söhne Serif / Tiempos / Lyon Text were the ideal targets. We ship Newsreader (Google Fonts, free, self-hosted via next/font) so the site ships without licensing friction. Swap in a paid serif by changing one font import.

**Audio in Scroll Back**
The prototype simulates playback via a JS timer keyed to a cadence per character. To wire real audio, replace the rAF loop with `audio.currentTime` and the cadence math with sentence start/end timestamps.

**Reduced motion**
Both prototypes degrade cleanly when the user prefers reduced motion: drag is replaced by Enter to shard, the Scroll Back flight animation skips its arc and the card appears in place, the DrawerWall loses its scroll choreography in favour of a stagger-fade, the IntakeCard skips the polaroid develop, and the ember bloom in the Atmosphere layer pauses.

**Where the placeholders live**
Every personal copy block is marked with `{{ REPLACE: ... }}` in the source. Search the repo for that string to see the full set in one pass.

**Dark-vault retheme**
The site reads as a dark vault with one halated ember accent. The original warm-bone palette is preserved as a scope (`.surface-lit`) so anything that lives inside a lit drawer, a paper card, the Vision-Pro detail surface, or the FOR THE RECORD intake card keeps its dark-on-warm legibility. Tokens did not rename; only their values flipped. The grain, ember bloom, and vignette all live in a single fixed-position `<Atmosphere />` layer rendered once by `SiteFrame`; per-component grain duplicates are forbidden.

`app/system/page.tsx:128`

---

### 2.7 System page footer

> [link] ← Back to the museum

v0.2 · May 2026 · dark vault

`app/system/page.tsx:196`

---

## 3. Meta

### 3.1 Site metadata (browser tab + OG)

> [meta] Title default: A Museum of Notetaking · Personal. Messy. Filed but never forgotten.
> [meta] Title template: %s · A Museum of Notetaking
> [meta] Description: Three case files. Two prototypes. One letter. A forensic archive of the ways I have not quite taken notes for ten years, and a sketch of the interactions that might have caught the next thought.
> [meta] Author: Nupur, for Granola
> [meta] OG title: A Museum of Notetaking
> [meta] OG description: Personal. Messy. Filed but never forgotten. A forensic archive of notetaking, for Granola.
> [meta] Twitter title: A Museum of Notetaking
> [meta] Twitter description: Personal. Messy. Filed but never forgotten. A forensic archive, for Granola.

`app/layout.tsx:129`

> [meta] /system page title: System
> [meta] /system page description: Tokens, type, and motion that hold the museum together. Read directly from the stylesheet.

(The title template means the browser tab reads `System · A Museum of Notetaking`.)

`app/system/page.tsx:10`

---

### 3.2 Open Graph image

> [alt] A Museum of Notetaking · Personal. Messy. Filed but never forgotten.

On-image text, top-left chip:

● CASE FILE No. 01–04    CLASSIFIED → DECLASSIFIED

On-image text, top-right meta:

For Granola · 2026

Big title in two wrapped lines:

A Museum
 of Notetaking.

Caps subtitle (last word in cherry):

PERSONAL. MESSY. FILED BUT NEVER FORGOTTEN.

Footer-left, two stacked lines:

ARCHIVIST · NUPUR AGGARWAL
EVIDENCE · TWELVE WAYS OF NOT QUITE TAKING NOTES

Footer-right:

museum / case 00 → 04

`app/opengraph-image.tsx:3`

---

### 3.3 Favicon (32×32 generated icon)

A single uppercase `M` next to a small cherry dot. (No accompanying alt text — the icon route just outputs an `M`.)

`app/icon.tsx:43`

---

### 3.4 404 page

404 · page not in this museum

**That room is in a different building.**

> [link] Return to the entrance

`app/not-found.tsx:10`

---

## Appendix · uncertain inclusions

These are source files where I made a judgment call. Worth a sanity check:

- `**components/Letter.tsx:78*`* — The single remaining `{{ REPLACE: Sam }}` marker is rendered literally on the page in ember italic as `{{ REPLACE: Sam }}`. The other three placeholders that used to live in this file (`your name`, the Granola-feature paragraph, `your.email@domain` / `yourdomain.com`) have been filled in this round and are now real copy. If you still want `Sam` swapped before launch, that's the last remaining marker.
- `**components/Letter.tsx:142**` — `Work portfolio: nupuraggarwal.vercel.app (password: magic)` is rendered as a real `<a>` opening in a new tab. The link styling (underline + hover to ink-on-dark) is added inline; if you want a different visual treatment for the only outbound link in the letter, this is where it lives.
- `**components/IntakeCard.tsx:248**` — The `NUPUR.WORKS` line in the card footer still has a `{{ REPLACE: yourdomain.com }}` comment beside it but renders the hard-coded `NUPUR.WORKS`. Worth a confirm against the new portfolio link in the letter.
- `**components/IntakeCard.tsx:191**` — The `CARD No. <MM-DD>` field is computed at render time from today's date. The exact two-digit value will change daily; documented as a pattern.
- `**components/scroll-back/ScrollBack.tsx:580**` — The strings `tap to play` / `playing` are visible on each saved card, but they live next to an `aria-hidden` waveform. Included as visible copy.
- `**components/memory-shards/MemoryShards.tsx:1078**` — The `drag · ↵` annotation that appears on hover/focus of each transcript phrase is `aria-hidden`. Included as a `[hint]`.
- `**components/CaseFileChip.tsx:19**` — The `→ DECLASSIFIED` arrow is rendered as text with a non-breaking space. Rendered here as a literal `→ DECLASSIFIED`.
- `**components/system/FieldNotes.tsx:163**` — The phrase `"ACT 01 OF 03 · DRAWERS PROTRUDING"` appears inside a field-note describing copy that was *removed*. It's user-visible on the /system page as a quoted example, not as live UI copy.
- **Flatlay rewrite — `components/evidence/Flatlay.tsx*`* — The lg+ stage was replaced with the manila-folder spread (poster + vertical strip + design-notes page + Post-it + curated kept artifacts) by the time of this regeneration. All of that copy is captured in §1.4.2.b–§1.4.2.e. The sub-lg path keeps the original twelve-artifact stacked layout. The legacy collage stage (with the `performance review (the original)` polaroid caption and the index-circle `01` chrome) is preserved at the bottom of the file as `FlatlayCollageStageLegacy` for revert but is not wired into the page; its copy is *not* user-visible and is therefore not in this doc.
- `**app/globals.css*`* — Not read. CSS variables and class definitions only; no human-readable prose lives there besides class names. Skipped on purpose per the brief.
- `**components/Atmosphere.tsx**` — Decorative ambient layer. No user-visible copy. Confirmed; not included.
- `**components/scroll-back/Waveform.tsx**` — Decorative; no copy.
- `**BUILD_NOTES.md`, `README.md**` — Repo-level documentation, not user-visible. Excluded.


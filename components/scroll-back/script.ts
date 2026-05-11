/* ---------------------------------------------------------------------
   Scroll Back — placeholder simulated transcript.
   {{ REPLACE: with a real recorded clip + timed transcript when one is
      available. The placeholder is a fictional 9am strategy meeting
      because the prototype's story is "the meeting I was four seconds
      behind." It's intentionally specific so the demo lands. }}
   --------------------------------------------------------------------- */

export type Speaker = {
  id: string;
  name: string;
  role: string;
  color: string;
};

export type Sentence = {
  id: string;
  speakerId: string;
  /** Display timestamp (mm:ss). */
  time: string;
  text: string;
  /** Optional gap (ms) before this sentence. */
  gapMs?: number;
};

export const speakers: Speaker[] = [
  {
    id: "professor",
    name: "Maya",
    role: "Engineering lead",
    color: "oklch(0.32 0.02 60)",
  },
  {
    id: "student",
    name: "Theo",
    role: "Teammate",
    color: "oklch(0.62 0.13 65)",
  },
];

/** ms per typed character. Tweaked for legibility, not realism. */
export const MS_PER_CHAR = 38;
/** Default pause between sentences. */
export const DEFAULT_GAP_MS = 480;

export const sentences: Sentence[] = [
  {
    id: "s1",
    speakerId: "professor",
    time: "00:08",
    text:
      "Right, where we left off. The question on the table: what makes one version of this product win and another one die.",
  },
  {
    id: "s2",
    speakerId: "professor",
    time: "00:14",
    text:
      "It is not the feature list. It is what the product asks of you on the first day, before you have learned anything.",
  },
  {
    id: "s3",
    speakerId: "professor",
    time: "00:21",
    text:
      "And the asks depend entirely on the defaults around them. Whether we open empty or pre-seeded, whether the account comes first or last, whether the share button is hidden or anchored. Each gives a different product.",
    gapMs: 600,
  },
  {
    id: "s4",
    speakerId: "professor",
    time: "00:32",
    text:
      "If you remember nothing else from this meeting, remember this one line, because it is the thing the doc will not say but will assume you know.",
    gapMs: 700,
  },
  {
    id: "s5",
    speakerId: "professor",
    time: "00:44",
    text:
      "A product is not a list of features. It is a list of defaults you are willing to defend.",
    gapMs: 900,
  },
  {
    id: "s6",
    speakerId: "professor",
    time: "00:54",
    text:
      "Same product, different defaults, different outcome. That is the entire strategy in eight words.",
  },
  {
    id: "s7",
    speakerId: "student",
    time: "01:04",
    text: "Sorry, could you repeat the eight-word version?",
    gapMs: 700,
  },
  {
    id: "s8",
    speakerId: "professor",
    time: "01:08",
    text: "Same product, different defaults, different outcome. Write it down.",
  },
];

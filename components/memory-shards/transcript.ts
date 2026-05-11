/* ---------------------------------------------------------------------
   Memory Shards — placeholder transcript.
   {{ REPLACE: with your real brainstorm transcript when you have one;
      this fictional one is a Tuesday morning kickoff for a redesign of
      a fictional "Voca" onboarding flow. It is intentionally specific
      so the prototype demos cleanly out of the box. }}
   --------------------------------------------------------------------- */

export type Speaker = {
  id: string;
  name: string;
  role: string;
  /** OKLCH color used for the speaker dot and shard accent. */
  color: string;
};

export type Phrase = {
  id: string;
  speakerId: string;
  /** Timestamp string, mm:ss, for display only. */
  time: string;
  text: string;
  /** Optional cluster grouping used by the "suggest clusters" demo. */
  cluster?: "what-breaks" | "small-wins" | "scary-idea";
  /** A 5-bar height pattern used to render a tiny waveform on the shard. */
  wave?: number[];
};

export const speakers: Speaker[] = [
  {
    id: "maya",
    name: "Maya",
    role: "PM",
    color: "oklch(0.62 0.13 65)",
  },
  {
    id: "jonas",
    name: "Jonas",
    role: "Designer",
    color: "oklch(0.55 0.06 145)",
  },
  {
    id: "ari",
    name: "Ari",
    role: "Engineer",
    color: "oklch(0.58 0.08 35)",
  },
  {
    id: "pippa",
    name: "Pippa",
    role: "Researcher",
    color: "oklch(0.5 0.025 240)",
  },
  {
    id: "wes",
    name: "Wes",
    role: "Founder",
    color: "oklch(0.32 0.02 60)",
  },
  {
    id: "tomi",
    name: "Tomi",
    role: "Engineer",
    color: "oklch(0.55 0.06 5)",
  },
];

export const phrases: Phrase[] = [
  {
    id: "p1",
    speakerId: "wes",
    time: "00:08",
    text: "Okay, the question for the next forty minutes is just: where does Voca lose its first-time users.",
  },
  {
    id: "p2",
    speakerId: "maya",
    time: "00:21",
    text: "Step three. It's always step three. Eighty-one percent of the drop is between connect-account and the first capture.",
    cluster: "what-breaks",
    wave: [0.3, 0.6, 0.9, 0.5, 0.2],
  },
  {
    id: "p3",
    speakerId: "jonas",
    time: "00:34",
    text: "Step three is also where we ask for the most. Microphone, calendar, contacts, all in twenty seconds.",
    cluster: "what-breaks",
    wave: [0.4, 0.8, 0.7, 0.4, 0.5],
  },
  {
    id: "p4",
    speakerId: "pippa",
    time: "00:48",
    text: "From the seven sessions last week, five people called the calendar permission 'creepy.' Their word.",
    cluster: "what-breaks",
    wave: [0.2, 0.7, 0.9, 0.6, 0.3],
  },
  {
    id: "p5",
    speakerId: "ari",
    time: "01:02",
    text: "We don't actually need calendar at signup. We can ask the first time they want to record a meeting.",
    cluster: "what-breaks",
    wave: [0.5, 0.4, 0.8, 0.5, 0.4],
  },
  {
    id: "p6",
    speakerId: "wes",
    time: "01:15",
    text: "Defer it. Yeah. The whole onboarding should be: capture one thing, see one thing back, that's it.",
    cluster: "small-wins",
    wave: [0.4, 0.6, 0.7, 0.8, 0.6],
  },
  {
    id: "p7",
    speakerId: "tomi",
    time: "01:28",
    text: "Counterpoint. If they don't connect calendar in the first session we lose seventy percent of automatic capture later.",
    wave: [0.3, 0.5, 0.6, 0.5, 0.4],
  },
  {
    id: "p8",
    speakerId: "maya",
    time: "01:41",
    text: "True, but right now they don't even reach the first session.",
    wave: [0.2, 0.5, 0.7, 0.4, 0.3],
  },
  {
    id: "p9",
    speakerId: "jonas",
    time: "01:55",
    text: "What if the first capture is the onboarding. You hold the mic, we transcribe one sentence, we show you a card.",
    cluster: "small-wins",
    wave: [0.5, 0.7, 0.9, 0.6, 0.4],
  },
  {
    id: "p10",
    speakerId: "pippa",
    time: "02:09",
    text: "That mirrors what worked in the field with researchers. The first interaction needs to feel like the product, not like a setup screen.",
    cluster: "small-wins",
    wave: [0.4, 0.6, 0.8, 0.5, 0.5],
  },
  {
    id: "p11",
    speakerId: "ari",
    time: "02:24",
    text: "I can ship that in a week if we don't touch the second screen.",
    wave: [0.6, 0.7, 0.5, 0.4, 0.3],
  },
  {
    id: "p12",
    speakerId: "wes",
    time: "02:38",
    text: "Don't touch the second screen.",
    wave: [0.3, 0.4, 0.7, 0.5, 0.3],
  },
  {
    id: "p13",
    speakerId: "tomi",
    time: "02:51",
    text: "Wild idea, kind of unrelated. What if the onboarding is a real meeting. A sixty-second meeting with us. With the team.",
    cluster: "scary-idea",
    wave: [0.5, 0.7, 0.9, 0.7, 0.5],
  },
  {
    id: "p14",
    speakerId: "jonas",
    time: "03:04",
    text: "Like a recorded message that plays as if it's live and you're capturing it.",
    cluster: "scary-idea",
    wave: [0.4, 0.6, 0.8, 0.6, 0.4],
  },
  {
    id: "p15",
    speakerId: "maya",
    time: "03:18",
    text: "That's bold and probably illegal in three countries.",
    wave: [0.3, 0.7, 0.6, 0.4, 0.3],
  },
  {
    id: "p16",
    speakerId: "pippa",
    time: "03:31",
    text: "Make it obvious it's a recording. The novelty is the delight, not the deception.",
    cluster: "scary-idea",
    wave: [0.4, 0.5, 0.8, 0.6, 0.5],
  },
  {
    id: "p17",
    speakerId: "wes",
    time: "03:46",
    text: "Park that. Let's land the small win first. Defer the permissions, ship the one-sentence capture.",
    wave: [0.4, 0.6, 0.7, 0.8, 0.5],
  },
  {
    id: "p18",
    speakerId: "ari",
    time: "04:01",
    text: "I'll have a draft tomorrow morning.",
    wave: [0.5, 0.6, 0.4, 0.3, 0.2],
  },
];

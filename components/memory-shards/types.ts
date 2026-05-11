import type { Phrase } from "./transcript";

export type ShardId = string;

export type Shard = {
  id: ShardId;
  phrase: Phrase;
  /** Position on the canvas, in canvas-relative pixels. */
  x: number;
  y: number;
  /** Index used to stagger entrance and z-stack older shards behind. */
  order: number;
  /** True when the shard arrived via a drag-flight that already
      animated the entry, so the card itself should mount with no
      entrance animation. The keyboard / seed paths leave this false
      so they still get the polished 280 ms entry. */
  instantMount?: boolean;
};

export type Connection = {
  id: string;
  from: ShardId;
  to: ShardId;
  /** Random midpoint offset for hand-drawn feel. */
  curve: number;
};

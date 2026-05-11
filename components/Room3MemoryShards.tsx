"use client";

/* ---------------------------------------------------------------------
   CASE No. 03 — The brainstorm.
   Same forensic frame as case 02. Color returns the moment a phrase is
   peeled, dropped, or seeded. Until then the canvas is monochrome.

   {{ REPLACE: the personal story below with your own real moment.
      The fictional Voca onboarding kickoff is a stand-in to keep the
      Memory Shards prototype shippable today. }}
   --------------------------------------------------------------------- */

import { Section } from "./Section";
import { RoomHeading } from "./RoomHeading";
import { FiledFrame } from "./FiledFrame";
import { MemoryShards } from "./memory-shards/MemoryShards";

export function Room3MemoryShards() {
  return (
    <Section
      id="room-3"
      label="Case No. 03: the brainstorm"
    >
      <div className="pt-32 sm:pt-44">
        <RoomHeading
          caseNo="03"
          status="REOPENED"
          filedNote="FILED 2025 / 02 · INCIDENT: IDEATION MEETING, 8 PEOPLE, 40 MINUTES · REPORTING ARCHIVIST: NUPUR AGGARWAL"
          title={
            <>
              The brainstorm I{" "}
              <em className="italic">couldn&rsquo;t</em> reconstruct.
            </>
          }
          body={
            <>
              {/* {{ REPLACE: your own first-person moment }} */}
              Eight people, forty minutes, many ideas. I left the room
              feeling like we had decided something. The next morning,
              the transcript was a flat list of who said what but not
              connected to the visual whiteboard, and the part I
              actually wanted, the <em>structure</em> of the meeting,
              was gone.
            </>
          }
        />

        <p className="mx-auto mt-6 max-w-[68ch] px-6 font-serif italic text-ink-600">
          Memory is spatial. The notes were a list. The notes lost.
        </p>
      </div>

      <div className="mt-16 pb-32 sm:mt-24 sm:pb-44">
        <FiledFrame
          caseNo="03"
          prototypeName="Memory Shards"
          filedYear="2025 / 02"
        >
          {(onInteract) => <MemoryShards onInteract={onInteract} />}
        </FiledFrame>

        <p className="mx-auto mt-10 max-w-[60ch] px-6 text-[14px] text-ink-500">
          Drag a phrase out and the page lets it go. Connect two and the line
          jitters slightly, so the canvas reads as thinking, not as software.
          Press{" "}
          <kbd className="rounded border border-rule bg-bone-50 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-700">
            Tab
          </kbd>{" "}
          then{" "}
          <kbd className="rounded border border-rule bg-bone-50 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-700">
            Enter
          </kbd>{" "}
          for the same thing without a mouse.
        </p>
      </div>
    </Section>
  );
}

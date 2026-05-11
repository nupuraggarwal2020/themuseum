"use client";

/* ---------------------------------------------------------------------
   CASE No. 02 — The four-second delay.
   The case opens in monochrome ("FILED 2024 — STATUS: REOPENED"). The
   moment the visitor hits Play or "Wait, what?", color returns to the
   prototype. That is the literal product argument.

   {{ REPLACE: the personal story below with your own real moment.
      The fictional 9am chemistry lecture is a stand-in to keep the
      prototype demo legible and shippable today. }}
   --------------------------------------------------------------------- */

import { Section } from "./Section";
import { RoomHeading } from "./RoomHeading";
import { FiledFrame } from "./FiledFrame";
import { ScrollBack } from "./scroll-back/ScrollBack";

export function Room2ScrollBack() {
  return (
    <Section
      id="room-2"
      label="Case No. 02: the four-second delay"
    >
      <div className="pt-32 sm:pt-44">
        <RoomHeading
          caseNo="02"
          status="REOPENED"
          filedNote="FILED 2024 / 09 · INCIDENT: IMPORTANT MEETING, 9AM · REPORTING ARCHIVIST: NUPUR AGGARWAL"
          title={
            <>
              The meeting I was{" "}
              <em className="italic">four seconds</em> behind.
            </>
          }
          body={
            <>
              {/* {{ REPLACE: your own first-person moment }} */}
              A 9am meeting on strategy. I am writing the previous
              sentence when the engineering lead says the line the
              whole room agrees to. By the time I notice, she has
              moved on. I wonder what was said and if I could bookmark
              it or go back a few seconds.
            </>
          }
        />

        <p className="mx-auto mt-6 max-w-[68ch] px-6 font-serif italic text-ink-600">
          What I needed was a small button labelled <em>wait, what?</em>
        </p>
      </div>

      <div className="mt-16 pb-32 sm:mt-24 sm:pb-44">
        <FiledFrame
          caseNo="02"
          prototypeName="Scroll Back"
          filedYear="2024 / 09"
        >
          {(onInteract) => <ScrollBack onInteract={onInteract} />}
        </FiledFrame>

        <p className="mx-auto mt-10 max-w-[60ch] px-6 text-[14px] text-ink-500">
          The capture happens on the sentence that just <em>finished</em>.
          So you stay present.
        </p>
      </div>
    </Section>
  );
}

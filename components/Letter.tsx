"use client";

/* ---------------------------------------------------------------------
   FOR THE RECORD — letter to Granola.
   Above the letter: an interactive intake card the visitor fills in,
   develops, and saves. Below: the actual letter, single column,
   editorial leading, three placeholders the user should personalize.

   Dark-vault edition: only colour tokens have changed. The copy and
   the layout are unchanged. The IntakeCard renders itself inside its
   own .surface-lit halo so the letter chrome stays on the vault and
   the card sits inside it like a lit display case.

   {{ REPLACE: addressee name }}
   {{ REPLACE: specific Granola feature you admire }}
   {{ REPLACE: your sign-off and contact line }}
   --------------------------------------------------------------------- */

import { motion, useReducedMotion } from "motion/react";
import { Section } from "./Section";
import { IntakeCard } from "./IntakeCard";

export function Letter() {
  const reduce = useReducedMotion();
  return (
    <Section id="letter" label="For the record · a letter to Granola">
      <div className="mx-auto max-w-[44rem] px-6 pb-40 pt-32 sm:pt-44">
        {/* Case head */}
        <div className="mb-12 flex items-center gap-4">
          <p className="t-typewriter text-ink-on-dark">CASE No.&nbsp;04</p>
          <span className="h-px flex-1 bg-rule" aria-hidden />
          <p className="t-typewriter-sm text-ink-500">
            STATUS:&nbsp;<span className="text-ember">FOR THE RECORD</span>
          </p>
        </div>

        <motion.h2
          className="t-headline text-balance text-ink-on-dark"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        >
          Hey Visitor.{" "}
          <em className="italic text-ink-700">Make your Keepsake here.</em>
        </motion.h2>

        <p className="mt-5 max-w-[42ch] font-serif text-[1.1rem] leading-[1.55] text-ink-700">
          A small keepsake for you. Enter the info and Press develop.
        </p>

        <div className="mt-12">
          <IntakeCard />
        </div>

        {/* The letter itself */}
        <motion.div
          className="mt-32"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <p className="t-typewriter mb-8 text-ink-700">
            DOCUMENT 04.B · LETTER, ENCLOSED
          </p>

          <p
            className="text-balance font-serif text-ink-on-dark"
            style={{
              fontSize: "clamp(1.5rem, 1.4vw + 1rem, 2.1rem)",
              lineHeight: 1.32,
              letterSpacing: "-0.012em",
            }}
          >
            Dear Granola team,
          </p>

          <div
            className="mt-10 space-y-7 font-serif text-ink-on-dark/90"
            style={{
              fontSize: "clamp(1.125rem, 0.4vw + 1rem, 1.25rem)",
              lineHeight: 1.7,
              letterSpacing: "-0.003em",
            }}
          >
            <p>
              I have, on my desk right now, many notebooks with three
              pages of decisive thinking and four hundred pages of notes
              I took during the meetings and after. This has stayed
              almost constant for a decade, across many different
              systems.
            </p>
            <p>
              The thing I love about Granola is{" "}
              <span className="italic">
                it lets me be present without missing any information
                and enabled countless follow ups and a shared way of
                documenting
              </span>
              . It is the first software I have used that respects the order
              in which thinking actually happens, which is: live first, write
              later, and only the parts that turned out to matter.
            </p>
            <p>
              I built this museum as my application because I wanted to
              show you how I think. I may not be a developer, but I am a
              builder with a creative directior&rsquo;s vision, and I
              wanted to challenge myself to build some interactions in a
              way a CV cannot. The first,{" "}
              <em className="italic">Scroll Back</em>, is for the moment a
              sentence lands four seconds after the meaning does. The second,{" "}
              <em className="italic">Memory Shards</em>, is for the
              brainstorm whose shape I knew but whose notes I never could
              reconstruct. Both are very rough, but maybe belong in a
              product like yours. I would like to help you build them.
            </p>
            <p>
              If any of this struck a chord, or any of the choices made
              you wince, I would love to hear which.
            </p>
          </div>

          <div className="mt-14 flex flex-wrap items-baseline justify-between gap-4">
            <p
              className="font-serif text-ink-on-dark"
              style={{ fontSize: "1.25rem" }}
            >
              Yours,
              <br />
              <span className="font-hand text-[1.8rem] text-ember">
                Nupur Aggarwal
              </span>
            </p>
            <p className="t-typewriter-sm text-right text-[13px] text-ink-500">
              nupur.aggarwal92@gmail.com
              <br />
              Work portfolio:{" "}
              <a
                href="http://nupuraggarwal.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-ink-300 underline-offset-2 hover:text-ink-on-dark"
              >
                nupuraggarwal.vercel.app
              </a>{" "}
              (password: magic)
            </p>
          </div>
        </motion.div>

        <motion.hr
          initial={reduce ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1], delay: 0.2 }}
          className="mx-auto mt-24 h-px w-24 origin-left border-0 bg-rule"
          style={{ transformOrigin: "left" }}
        />

        <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-ink-500">
          End of file · 04 of 04
        </p>
      </div>
    </Section>
  );
}

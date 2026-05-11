"use client";

/* ---------------------------------------------------------------------
   Case No. 01 — Evidence Log.
   The forensic-grid layout has been replaced with a wall of file
   drawers (DrawerWall). Twelve specific cells correspond to the twelve
   artifacts in ./artifacts.ts and protrude in three acts as the
   visitor scrolls. The heading and the EVIDENCE LOG subhead are
   preserved.

   {{ REPLACE: artifact content lives in ./artifacts.ts. Edit copy or
   add your own exhibits there. The renderers in ./ArtifactRenderers.tsx
   are reusable; new kinds can be added as new renderers. }}
   --------------------------------------------------------------------- */

import { useCallback, useState } from "react";

import { DetailCard } from "../drawer-wall/DetailCard";
import { DrawerWall } from "../drawer-wall/DrawerWall";
import { Section } from "../Section";
import { RoomHeading } from "../RoomHeading";
import { ARTIFACTS, type Artifact } from "./artifacts";
import { Flatlay } from "./Flatlay";
import {
  BlisterArtifact,
  CassetteArtifact,
  DeviceArtifact,
  FingerprintArtifact,
  KeepCard,
  PolaroidArtifact,
  QuestionsArtifact,
  RecipeArtifact,
  TagArtifact,
  TornArtifact,
} from "./ArtifactRenderers";

export function EvidenceLog() {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = ARTIFACTS.find((a) => a.id === openId) ?? null;
  const close = useCallback(() => setOpenId(null), []);
  const onDrawerOpen = useCallback(
    (artifact: Artifact) => setOpenId(artifact.id),
    [],
  );

  return (
    <Section id="room-1" label="Case No. 01: evidence log">
      <div className="pt-32 sm:pt-44">
        <RoomHeading
          caseNo="01"
          status="UNSORTED"
          filedNote="EVIDENCE LOG · SCATTERED · OBJECTS RETRIEVED FROM CASE No. 01 · INDEX OF UNFILED THOUGHTS"
          title={
            <>
              Before Granola: a wall of{" "}
              <em className="italic">unfiled</em> thoughts.
            </>
          }
          body={
            <>
              A collection of contradiction and clarity. Scribbles and
              pieces of selves somewhat gathered and digitized, and
              living in fragments everywhere. Notebooks, notekeepers,
              JIRAs. I tried it all. But the tool was never the
              problem. The problem was that every tool asked me to{" "}
              <em className="italic">be</em> someone before it would
              help me.
            </>
          }
        />
      </div>

      {/* The flatlay — prelude to the wall. Twelve raw artifacts on
          the intake table, before any of them are filed. The same
          DetailCard handler that the drawer wall uses opens here too,
          so the artifact content remains a single source of truth. */}
      <div className="relative mt-16 sm:mt-24">
        <Flatlay
          artifacts={ARTIFACTS}
          renderArtifact={renderArtifact}
          onOpen={onDrawerOpen}
        />
      </div>

      {/* The wall — pinned for the duration of the room. The transition
          strip beneath the flatlay reads "FILED INTO THE DRAWERS BELOW",
          so the wall lands exactly as a continuation of that sentence. */}
      <div className="relative mt-12 mb-32 sm:mt-16 sm:mb-44">
        <DrawerWall
          renderArtifact={renderArtifact}
          onOpen={onDrawerOpen}
        />
      </div>

      <DetailCard
        artifact={open}
        onClose={close}
        renderArtifact={renderArtifact}
      />
    </Section>
  );
}

/** Same renderer used by the drawer pocket and the detail-card stage. */
function renderArtifact(artifact: Artifact) {
  switch (artifact.kind) {
    case "keep":
      if (artifact.id === "snacks") return <KeepCard variant="snacks" />;
      if (artifact.id === "ledger") return <KeepCard variant="ledger" />;
      return <KeepCard variant="anniversary" />;
    case "polaroid":
      return <PolaroidArtifact />;
    case "device":
      return <DeviceArtifact />;
    case "recipe":
      return <RecipeArtifact />;
    case "blister":
      return <BlisterArtifact />;
    case "cassette":
      return <CassetteArtifact />;
    case "fingerprint":
      return <FingerprintArtifact />;
    case "torn":
      return <TornArtifact />;
    case "questions":
      return <QuestionsArtifact />;
    case "tag":
      return <TagArtifact />;
    default:
      return null;
  }
}

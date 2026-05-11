import { CaseFileChip } from "@/components/CaseFileChip";
import { EvidenceLog } from "@/components/evidence/EvidenceLog";
import { Hero } from "@/components/Hero";
import { Letter } from "@/components/Letter";
import { Room2ScrollBack } from "@/components/Room2ScrollBack";
import { Room3MemoryShards } from "@/components/Room3MemoryShards";
import { RoomMarker } from "@/components/RoomMarker";
import { SiteFrame } from "@/components/SiteFrame";

export default function HomePage() {
  return (
    <>
      <SiteFrame />
      <RoomMarker />
      <main id="main">
        <Hero />
        <section
          aria-hidden
          className="relative z-10 flex justify-center px-6 pb-3 pt-24 sm:pb-4 sm:pt-32"
        >
          <CaseFileChip />
        </section>
        <EvidenceLog />
        <Room2ScrollBack />
        <Room3MemoryShards />
        <Letter />
      </main>
    </>
  );
}

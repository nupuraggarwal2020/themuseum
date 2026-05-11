import Link from "next/link";

import { SiteFrame } from "@/components/SiteFrame";

export default function NotFound() {
  return (
    <>
      <SiteFrame />
      <main className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center gap-6 px-6 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
          404 · page not in this museum
        </p>
        <h1 className="t-headline text-balance text-ink-on-dark">
          That room is in a different building.
        </h1>
        <Link
          href="/"
          className="press text-[13px] uppercase tracking-[0.16em] text-ember hover:text-ink-on-dark"
        >
          Return to the entrance
        </Link>
      </main>
    </>
  );
}

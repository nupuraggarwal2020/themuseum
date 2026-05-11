import type { ReactNode } from "react";

type Props = {
  caseNo: string;
  status: string;
  title: ReactNode;
  body?: ReactNode;
  /** Small typewriter phrase under the case label, e.g. "FILED 2024 — REOPENED" */
  filedNote?: string;
};

/**
 * The opening of each room: a case-file plate with case number, status
 * stamp, the editorial title, and an optional editorial paragraph.
 * Restraint is the whole point. Cherry appears once, on the status word.
 */
export function RoomHeading({
  caseNo,
  status,
  title,
  body,
  filedNote,
}: Props) {
  return (
    <header className="mx-auto flex max-w-[68ch] flex-col gap-7 px-6">
      <div className="flex items-center gap-4">
        <span className="t-typewriter text-ink-900">
          CASE No.&nbsp;{caseNo}
        </span>
        <span className="h-px flex-1 bg-rule" aria-hidden />
        <span className="t-typewriter-sm text-ink-500">
          STATUS:&nbsp;<span className="text-cherry-700">{status}</span>
        </span>
      </div>

      {filedNote ? (
        <p className="t-typewriter-sm -mt-3 text-ink-500">{filedNote}</p>
      ) : null}

      <h2 className="t-headline text-ink-900">{title}</h2>
      {body ? <div className="t-lede">{body}</div> : null}
    </header>
  );
}

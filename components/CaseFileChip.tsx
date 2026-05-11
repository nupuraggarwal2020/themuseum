/**
 * Case-file chip. Small typewriter stamp announcing the spread of cases
 * about to follow (01–04). Used as a transition marker between the hero
 * and Room 1, replacing the old in-hero placement.
 */
export function CaseFileChip() {
  return (
    <span
      className="inline-flex items-center gap-2 border border-ink-300/60 bg-vault-deep px-2.5 py-1 text-ink-on-dark"
      aria-label="Case files 01–04, declassified"
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.18em]">
        CASE FILES No.&nbsp;01–04
      </span>
      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-500">
        <span className="line-through decoration-ember decoration-[1.5px]">
          CLASSIFIED
        </span>{" "}
        →&nbsp;DECLASSIFIED
      </span>
    </span>
  );
}

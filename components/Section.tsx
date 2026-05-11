import type { ReactNode } from "react";

type Props = {
  id?: string;
  children: ReactNode;
  className?: string;
  /** Sets a stable label for screen readers and the room marker. */
  label?: string;
};

/**
 * Section primitive used by every room. Provides the consistent vertical
 * rhythm and the accessible landmark. Rooms compose freely inside.
 */
export function Section({ id, children, className = "", label }: Props) {
  return (
    <section
      id={id}
      aria-label={label}
      className={`relative w-full ${className}`}
    >
      {children}
    </section>
  );
}

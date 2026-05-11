"use client";

import { useSyncExternalStore } from "react";
import { colorTokens, type TokenColor } from "@/lib/tokens";

/**
 * Reads computed CSS custom properties via useSyncExternalStore so the
 * /system page is genuinely sourced from the stylesheet at runtime.
 * The store has no real subscription — values don't change after mount —
 * so the subscribe function is a no-op.
 */
function useResolvedColor(varName: string) {
  return useSyncExternalStore(
    () => () => {},
    () => {
      if (typeof document === "undefined") return "";
      return getComputedStyle(document.documentElement)
        .getPropertyValue(`--${varName}`)
        .trim();
    },
    () => "",
  );
}

/**
 * Renders a grid of swatches for the given colour token list. Defaults
 * to the museum's base palette (`colorTokens`); the same component is
 * reused with `tokens={drawerTokens}` for the drawer-cabinet block so
 * both blocks read from the same Swatch surface.
 */
export function SwatchGrid({
  tokens = colorTokens,
}: {
  tokens?: TokenColor[];
} = {}) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-4">
      {tokens.map((t) => (
        <Swatch key={t.cssVar} token={t} />
      ))}
    </div>
  );
}

function Swatch({ token }: { token: TokenColor }) {
  const value = useResolvedColor(token.cssVar);
  return (
    <figure className="group flex flex-col gap-2">
      <span
        className="block aspect-[4/3] w-full rounded-[3px] border border-rule"
        style={{ background: `var(--${token.cssVar})` }}
        aria-label={`Swatch for ${token.name}`}
      />
      <figcaption className="flex flex-col">
        <span className="font-mono text-[12px] text-ink-900">{token.name}</span>
        <span className="font-mono text-[10px] text-ink-500">{token.role}</span>
        <code className="mt-1 truncate font-mono text-[10px] text-ink-400">
          {value || `var(--${token.cssVar})`}
        </code>
      </figcaption>
    </figure>
  );
}

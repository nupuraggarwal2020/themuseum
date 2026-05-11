/* ---------------------------------------------------------------------
   ThemeScript — synchronous inline script that resolves the active
   theme and stamps `data-theme` on <html> BEFORE first paint.

   Rendered as a raw <script dangerouslySetInnerHTML>, server-emitted
   into the very top of <body> (placed by app/layout.tsx). Because the
   tag is inline (no src) and lives in the document body, the browser
   parses and executes it synchronously while constructing the DOM —
   long before React hydrates. The chosen palette is therefore in
   place when the browser draws the first frame; no dark↔light flash.

   Why not next/script with strategy="beforeInteractive"?
   In the Next.js App Router, beforeInteractive scripts are deferred:
   their bodies are pushed into a `self.__next_s` queue that the Next
   runtime drains after its own bootstrap loads. That bootstrap arrives
   AFTER the first paint, which means a brief flash of the default
   (dark) palette would appear for any user whose chosen theme is
   light. The raw inline-script pattern is the only option that runs
   strictly before paint in App Router today.

   React 19 emits a dev-mode advisory ("Scripts inside React components
   are never executed when rendering on the client") for any inline
   <script> element rendered through React. The advisory is about
   client-side renders (post-hydration); it does NOT apply to the
   initial server-rendered HTML, where the script runs as expected.
   The warning is intentional noise, not a bug.

   Resolution order:
     1. localStorage["museum-theme"] → "light" | "dark" if set.
     2. Otherwise, prefers-color-scheme → "light" or "dark".
     3. Defaults to "dark" on any failure (Safari private mode throws
        when accessing localStorage).

   Note: we deliberately set `data-theme` on every load, including the
   prefers-color-scheme fallback. The CSS layers handle "no attribute"
   too via `:root:not([data-theme])`, but having the attribute always
   present means <ThemeToggle /> can read a guaranteed value at mount.
   --------------------------------------------------------------------- */

const SCRIPT = `(function(){try{var t=localStorage.getItem("museum-theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";}document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`;

export function ThemeScript() {
  return (
    <script
      // suppressHydrationWarning silences the script-attribute hydration
      // mismatch React 19 logs because the inline source is computed
      // server-side and never re-rendered on the client.
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: SCRIPT }}
    />
  );
}

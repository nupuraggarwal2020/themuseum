/* ---------------------------------------------------------------------
   Atmosphere — site-wide ambient layer.
   Mounted exactly once by SiteFrame so the rest of the codebase stays
   grain-free. Per-component grain duplicates are forbidden.

   Aesthetic — a translation of the "night drive" western technique into
   the museum's vault. The reference layered:

     1. moody dark teal-charcoal base
     2. radial-gradient blobs of red/orange that read as heat (cattle)
     3. a low band of warm haze above them (mist)
     4. heavy SVG turbulence grain
     5. deep vignette
     6. dark foreground silhouette anchoring the bottom

   We translate, not reproduce. There are no animals. The "cattle"
   become a small constellation of warm blurred ember bodies — heat
   blooms in the vault. The "mist" is a soft warm strip just above
   them. The "silhouette" is owned by Hero (the half-lit drawer + the
   vault-deep foreground in HorizonGradient). The "grain" and
   "vignette" live here.

   Layer roster (one filtered; rest are unfiltered DOM layers):

     1. .atmosphere-grainy-base — cjimmy crushed-grain bloom. The
        feTurbulence noise (baseFrequency 0.65) is layered with a
        focused horizon-band radial, then crushed by
        contrast(170%) brightness(1000%). This produces stark warm
        grain particles concentrated along the lower horizon.
        Drift-animated (108s loop). Filtered.
     2. .atmosphere-herd — the constellation of 5 ember bodies along
        the horizon. Pure radial gradients, no filter. Mix-blend-mode
        is screen so the warmth ADDs to the crushed bloom rather than
        replacing it. Slow drift (140s loop) shifts the herd by a
        few px — never enough to read as motion, just enough to keep
        the static composition feeling alive.
     3. .atmosphere-mist — a wide soft warm haze sitting just above
        the herd. Helps fuse the embers into a single horizon line
        and prevents them from reading as discrete blobs.
     4. .atmosphere-grainy-overlay — the multiply pass. Re-darkens
        the blown-out grain into cinematic warmth.
     5. .atmosphere-fine-grain — fresh feTurbulence at baseFrequency
        0.95, screen-blended at low opacity. Adds the high-frequency
        film-noise the reference image relies on. Static.
     6. .atmosphere-vignette — radial corner darkness. Deepened from
        the previous pass per the "behind real content" recipe.

   `--bloom-intensity` (default 1) is preserved as a multiplier on the
   grainy-base opacity so quiet contexts (IntakeCard, DetailCard) can
   dial the bloom to 0.6 via :has(.bloom-quiet-active) on body.

   Performance: the contrast/brightness filter is GPU-heavy. We rasterize
   noise SVGs once at module scope, animate transform only on the two
   drifting layers, and use will-change: transform. Total: 1 filtered
   layer + 5 unfiltered DOM layers, all fixed-position. This sits within
   the 2-filtered-layer budget (Hero adds one more for HorizonGradient).

   Reduced motion: both drift animations pause; the static composition
   continues to do the work.
   --------------------------------------------------------------------- */

const NOISE_SVG_COARSE =
  `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320'>` +
  `<filter id='n'>` +
  `<feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch' seed='4'/>` +
  `</filter>` +
  `<rect width='100%' height='100%' filter='url(#n)'/>` +
  `</svg>`;

const NOISE_SVG_FINE =
  `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'>` +
  `<filter id='n'>` +
  `<feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch' seed='11'/>` +
  `</filter>` +
  `<rect width='100%' height='100%' filter='url(#n)'/>` +
  `</svg>`;

const NOISE_URL_COARSE = `url("data:image/svg+xml;utf8,${encodeURIComponent(NOISE_SVG_COARSE)}")`;
const NOISE_URL_FINE = `url("data:image/svg+xml;utf8,${encodeURIComponent(NOISE_SVG_FINE)}")`;

/* Herd composition — small, discrete ember bodies scattered along the
   low horizon. We bias toward fewer, smaller, hotter spots rather than
   a continuous wash, so the cluster reads as discrete heat sources
   (the night-drive cattle). Position varies in y by a couple of points
   so the line isn't a perfect horizontal. */
const HERD: Array<{
  x: string;
  y: string;
  rx: string;
  ry: string;
  intensity: number; // 0..1 — scales the halo size and outer warmth
}> = [
  { x: "14%", y: "82%", rx: "8vw", ry: "3.5vh", intensity: 0.75 },
  { x: "32%", y: "85%", rx: "10vw", ry: "4vh", intensity: 0.9 },
  { x: "52%", y: "80%", rx: "12vw", ry: "5vh", intensity: 1.0 },
  { x: "71%", y: "84%", rx: "9vw", ry: "4vh", intensity: 0.85 },
  { x: "87%", y: "81%", rx: "8vw", ry: "3.5vh", intensity: 0.7 },
];

/* Each ember body is a single radial gradient with:
     - a hot core that ALWAYS reaches full ember-glow (no fade) — the
       hot spot needs to punch through the crushed bloom, so intensity
       only scales the halo, not the core.
     - a sharp transition (8%) so the core stays compact.
     - a wider warm halo at low alpha that intensity dials.
     - a clean fade to transparent.
   This gives "distant lights on a dark horizon" rather than a wash. */
const herdBackground = HERD.map(({ x, y, rx, ry, intensity }) => {
  const ring = Math.round(intensity * 70);
  const halo = Math.round(intensity * 28);
  return (
    `radial-gradient(ellipse ${rx} ${ry} at ${x} ${y},` +
    ` var(--color-ember-glow) 0%,` +
    ` color-mix(in oklch, var(--color-ember) ${ring}%, transparent) 8%,` +
    ` color-mix(in oklch, var(--color-ember) ${halo}%, transparent) 38%,` +
    ` transparent 72%)`
  );
}).join(", ");

export function Atmosphere() {
  return (
    <div
      aria-hidden
      className="atmosphere pointer-events-none fixed inset-0 isolate -z-10"
    >
      {/* Layer order matters. The multiply pass darkens everything
          beneath it — so the multiply sits BETWEEN the crushed bloom
          (which it darkens into cinematic warmth) and the herd
          (which screen-blends warmth back on top). The herd, mist,
          and fine grain all stack additively above the multiply so
          they survive as visible warmth and speckle. */}

      {/* 1. Grainy base — cjimmy crushed bloom. Now a low, narrow
            horizon strip rather than a tall band, so the crushed grain
            stays near the floor and leaves room for the herd to read
            as discrete spots above it. The bloom shape's smaller,
            lower extent also means less ember saturation at the
            horizon line itself, which helps the herd cores punch. */}
      <div
        className="atmosphere-grainy-base absolute"
        style={{
          inset: "-12%",
          backgroundImage:
            `${NOISE_URL_COARSE},` +
            ` radial-gradient(ellipse 95% 22% at 50% 102%,` +
            ` var(--color-ember-glow) 0%,` +
            ` var(--color-ember) 28%,` +
            ` color-mix(in oklch, var(--color-ember) 30%, var(--color-vault)) 60%,` +
            ` var(--color-vault) 85%,` +
            ` var(--color-vault) 100%)`,
          backgroundSize: "320px 320px, 100% 100%",
          backgroundRepeat: "repeat, no-repeat",
          backgroundPosition: "0 0, center",
          filter: "contrast(170%) brightness(1000%)",
          opacity: "var(--bloom-intensity, 1)",
          willChange: "transform",
        }}
      />

      {/* 2. Multiply overlay. Re-darkens the blown-out grain particles
            into cinematic warmth where the bloom was bright. */}
      <div
        className="atmosphere-grainy-overlay absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg," +
            " var(--color-vault-deep) 0%," +
            " var(--color-vault) 55%," +
            " color-mix(in oklch, var(--color-vault) 78%, var(--color-ember)) 100%)",
          mixBlendMode: "multiply",
        }}
      />

      {/* 3. Herd constellation — five ember bodies along the horizon.
            Screen-blended on top of the cinematic dim so the warmth
            survives the multiply. Drift-animated. */}
      <div
        className="atmosphere-herd absolute inset-0"
        style={{
          backgroundImage: herdBackground,
          mixBlendMode: "screen",
          opacity: "var(--herd-opacity, 0.55)",
          willChange: "transform",
        }}
      />

      {/* 4. Mist — soft warm horizontal band sitting above the herd.
            Fuses the discrete embers into a single horizon line. */}
      <div
        className="atmosphere-mist absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70vw 9vh at 50% 73%," +
            " color-mix(in oklch, var(--color-ember) 28%, transparent) 0%," +
            " color-mix(in oklch, var(--color-ember) 14%, transparent) 45%," +
            " transparent 80%)",
          mixBlendMode: "screen",
          opacity: "var(--mist-opacity, 0.42)",
        }}
      />

      {/* 5. Fine grain — high-frequency film noise. Screen-blended on
            top so it reads as speckle rather than haze. */}
      <div
        className="atmosphere-fine-grain absolute inset-0"
        style={{
          backgroundImage: NOISE_URL_FINE,
          backgroundSize: "220px 220px",
          backgroundRepeat: "repeat",
          mixBlendMode: "screen",
          opacity: "var(--grain-fine-opacity, 0.20)",
        }}
      />

      {/* 6. Vignette. Deepened per the "behind real content" recipe. */}
      <div
        className="atmosphere-vignette absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center," +
            " transparent 22%," +
            " oklch(0 0 0 / calc(var(--vignette-strength, 0.55) * 0.5)) 65%," +
            " oklch(0 0 0 / var(--vignette-strength, 0.55)) 100%)",
        }}
      />

      <style>{`
        .atmosphere-grainy-base {
          animation: atmosphere-bloom-drift 108s var(--ease-glide) infinite;
          transform-origin: 50% 100%;
        }
        .atmosphere-herd {
          animation: atmosphere-herd-drift 140s var(--ease-glide) infinite;
          transform-origin: 50% 80%;
        }
        @keyframes atmosphere-bloom-drift {
          0%   { transform: translate3d(-1.5%, -0.5%, 0) scale(1);    }
          50%  { transform: translate3d( 1.5%,  1.5%, 0) scale(1.04); }
          100% { transform: translate3d(-1.5%, -0.5%, 0) scale(1);    }
        }
        @keyframes atmosphere-herd-drift {
          0%   { transform: translate3d(-0.6%, 0%,    0) scale(1);    }
          50%  { transform: translate3d( 0.8%, 0.4%,  0) scale(1.02); }
          100% { transform: translate3d(-0.6%, 0%,    0) scale(1);    }
        }
        @media (prefers-reduced-motion: reduce) {
          .atmosphere-grainy-base,
          .atmosphere-herd {
            animation: none !important;
            transform: translate3d(0, 0, 0) scale(1) !important;
          }
        }
      `}</style>
    </div>
  );
}

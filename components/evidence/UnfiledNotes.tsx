// Unfiled notes — 20 paper-artifact components for the manila folder spread.
// Each component is position-agnostic. The parent applies absolute placement,
// rotation, and any entrance/hover motion. All paper bodies share:
//   · 2-stop linear gradients (never flat fills)
//   · feTurbulence grain at baseFrequency="0.85" / numOctaves="2"
//   · layered natural shadows (no glow, no blur)
// No external images. No icon libraries. CSS + inline SVG only.

export function PostItAsk() {
  const handFont = "var(--font-caveat), 'Caveat', 'Bradley Hand', cursive";
  const monoFont = "var(--font-jetbrains-mono), ui-monospace, monospace";
  return (
    <div className="relative" style={{ aspectRatio: "1 / 1.05" }} aria-hidden={true}>
      {/* paper body — yellow gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(165deg, oklch(0.95 0.13 95) 0%, oklch(0.91 0.16 92) 100%)",
          boxShadow:
            "0 16px 32px -18px oklch(0 0 0 / 0.55), 0 4px 8px -4px oklch(0 0 0 / 0.32), 0 0 0 1px oklch(0 0 0 / 0.06)",
        }}
      />
      {/* adhesive top edge — slightly darker band */}
      <div
        className="absolute inset-x-0 top-0 h-[14%]"
        style={{
          background:
            "linear-gradient(180deg, oklch(0 0 0 / 0.10) 0%, transparent 100%)",
        }}
      />
      {/* faint corner curl shadow at bottom-right */}
      <div
        className="absolute bottom-0 right-0 w-[28%] h-[18%]"
        style={{
          background:
            "radial-gradient(ellipse at bottom right, oklch(0 0 0 / 0.18) 0%, transparent 60%)",
        }}
      />
      {/* grain */}
      <svg
        className="absolute inset-0 pointer-events-none w-full h-full"
        style={{ mixBlendMode: "multiply", opacity: 0.07 }}
      >
        <filter id="postit-ask-grain">
          <feTurbulence baseFrequency="0.85" numOctaves="2" />
        </filter>
        <rect width="100%" height="100%" filter="url(#postit-ask-grain)" />
      </svg>
      {/* content */}
      <div className="absolute inset-0 flex flex-col justify-center px-[11%] py-[16%]">
        <p
          style={{
            fontFamily: monoFont,
            fontSize: "clamp(7px, 1.1cqw, 10px)",
            letterSpacing: "0.18em",
            color: "oklch(0.22 0.07 55)",
            textTransform: "uppercase",
            marginBottom: "0.6em",
          }}
        >
          Workshop / wall
        </p>
        <p
          style={{
            fontFamily: handFont,
            fontSize: "clamp(13px, 2.5cqw, 21px)",
            lineHeight: 1.25,
            color: "oklch(0.24 0.08 50)",
            transform: "rotate(-1deg)",
            marginBottom: "0.4em",
          }}
        >
          ASK MYSELF:
        </p>
        <p
          style={{
            fontFamily: handFont,
            fontSize: "clamp(11px, 2.0cqw, 17px)",
            lineHeight: 1.35,
            color: "oklch(0.26 0.07 55)",
            transform: "rotate(0.3deg)",
          }}
        >
          where does the first note go?
        </p>
      </div>
    </div>
  );
}

export function IndexCardDistilled() {
  const monoFont = "var(--font-jetbrains-mono), ui-monospace, monospace";
  return (
    <div className="relative" style={{ aspectRatio: "5 / 3" }} aria-hidden={true}>
      {/* paper body */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.96 0.012 80) 0%, oklch(0.92 0.014 78) 100%)",
          boxShadow:
            "0 16px 32px -18px oklch(0 0 0 / 0.55), 0 4px 8px -4px oklch(0 0 0 / 0.32), 0 0 0 1px oklch(0 0 0 / 0.06)",
        }}
      />
      {/* top red header rule */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: "18%",
          height: "1px",
          background: "oklch(0.55 0.18 25 / 0.55)",
        }}
      />
      {/* horizontal blue rules */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="absolute left-0 right-0"
          style={{
            top: `${30 + i * 13}%`,
            height: "1px",
            background: "oklch(0.65 0.08 240 / 0.35)",
          }}
        />
      ))}
      {/* left margin red rule */}
      <div
        className="absolute top-0 bottom-0"
        style={{
          left: "11%",
          width: "1px",
          background: "oklch(0.55 0.18 25 / 0.5)",
        }}
      />
      {/* grain */}
      <svg
        className="absolute inset-0 pointer-events-none w-full h-full"
        style={{ mixBlendMode: "multiply", opacity: 0.06 }}
      >
        <filter id="indexcard-distilled-grain">
          <feTurbulence baseFrequency="0.85" numOctaves="2" />
        </filter>
        <rect width="100%" height="100%" filter="url(#indexcard-distilled-grain)" />
      </svg>
      {/* eyebrow top-left */}
      <p
        className="absolute"
        style={{
          top: "7%",
          left: "13%",
          fontFamily: monoFont,
          fontSize: "clamp(7px, 1.0cqw, 10px)",
          letterSpacing: "0.22em",
          color: "oklch(0.20 0.05 60)",
          textTransform: "uppercase",
        }}
      >
        Distilled · Scroll Back
      </p>
      {/* eyebrow top-right (filing mark) */}
      <p
        className="absolute"
        style={{
          top: "7%",
          right: "5%",
          fontFamily: monoFont,
          fontSize: "clamp(6px, 0.9cqw, 9px)",
          letterSpacing: "0.22em",
          color: "oklch(0.22 0.04 60)",
          textTransform: "uppercase",
        }}
      >
        02 / N.A.
      </p>
      {/* the line */}
      <div
        className="absolute"
        style={{ top: "34%", left: "13%", right: "8%" }}
      >
        <p
          style={{
            fontFamily: monoFont,
            fontSize: "clamp(10px, 1.9cqw, 16px)",
            letterSpacing: "0.04em",
            lineHeight: 1.55,
            color: "oklch(0.22 0.04 60)",
          }}
        >
          same product, different defaults, different outcome.
        </p>
      </div>
      {/* signature mark */}
      <p
        className="absolute"
        style={{
          bottom: "9%",
          right: "6%",
          fontFamily: monoFont,
          fontSize: "clamp(6px, 0.9cqw, 9px)",
          letterSpacing: "0.22em",
          color: "oklch(0.22 0.04 60)",
          textTransform: "uppercase",
        }}
      >
        — eight words —
      </p>
    </div>
  );
}

export function PostItMaya() {
  const handFont = "var(--font-caveat), 'Caveat', 'Bradley Hand', cursive";
  const monoFont = "var(--font-jetbrains-mono), ui-monospace, monospace";
  return (
    <div className="relative" style={{ aspectRatio: "1 / 1" }} aria-hidden={true}>
      {/* paper body — pink gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.91 0.08 25) 0%, oklch(0.86 0.11 22) 100%)",
          boxShadow:
            "0 16px 32px -18px oklch(0 0 0 / 0.55), 0 4px 8px -4px oklch(0 0 0 / 0.32), 0 0 0 1px oklch(0 0 0 / 0.06)",
        }}
      />
      {/* adhesive top edge */}
      <div
        className="absolute inset-x-0 top-0 h-[14%]"
        style={{
          background:
            "linear-gradient(180deg, oklch(0 0 0 / 0.10) 0%, transparent 100%)",
        }}
      />
      {/* corner curl */}
      <div
        className="absolute top-0 left-0 w-[22%] h-[16%]"
        style={{
          background:
            "radial-gradient(ellipse at top left, oklch(0 0 0 / 0.16) 0%, transparent 60%)",
        }}
      />
      {/* grain */}
      <svg
        className="absolute inset-0 pointer-events-none w-full h-full"
        style={{ mixBlendMode: "multiply", opacity: 0.07 }}
      >
        <filter id="postit-maya-grain">
          <feTurbulence baseFrequency="0.85" numOctaves="2" />
        </filter>
        <rect width="100%" height="100%" filter="url(#postit-maya-grain)" />
      </svg>
      {/* content */}
      <div className="absolute inset-0 flex flex-col justify-center px-[12%] py-[18%]">
        <p
          style={{
            fontFamily: monoFont,
            fontSize: "clamp(7px, 1.1cqw, 10px)",
            letterSpacing: "0.20em",
            color: "oklch(0.22 0.10 25)",
            textTransform: "uppercase",
            marginBottom: "0.7em",
          }}
        >
          Maya · 1:1
        </p>
        <p
          style={{
            fontFamily: handFont,
            fontSize: "clamp(12px, 2.3cqw, 19px)",
            lineHeight: 1.3,
            color: "oklch(0.26 0.10 25)",
            transform: "rotate(-1deg)",
          }}
        >
          "they don't want a feature, they want a feeling"
        </p>
      </div>
    </div>
  );
}

export function NotebookPageKickoff() {
  const handFont = "var(--font-caveat), 'Caveat', 'Bradley Hand', cursive";
  const monoFont = "var(--font-jetbrains-mono), ui-monospace, monospace";
  return (
    <div className="relative" style={{ aspectRatio: "5 / 7" }} aria-hidden={true}>
      {/* paper body */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.95 0.014 78) 0%, oklch(0.91 0.018 76) 100%)",
          boxShadow:
            "0 16px 32px -18px oklch(0 0 0 / 0.55), 0 4px 8px -4px oklch(0 0 0 / 0.32), 0 0 0 1px oklch(0 0 0 / 0.06)",
        }}
      />
      {/* faint horizontal rules */}
      {Array.from({ length: 14 }).map((_, i) => (
        <div
          key={i}
          className="absolute left-0 right-0"
          style={{
            top: `${18 + i * 5.5}%`,
            height: "1px",
            background: "oklch(0.65 0.05 220 / 0.18)",
          }}
        />
      ))}
      {/* coffee stain ring — top right */}
      <svg
        className="absolute pointer-events-none"
        style={{
          top: "6%",
          right: "8%",
          width: "38%",
          height: "26%",
          mixBlendMode: "multiply",
          opacity: 0.4,
        }}
        viewBox="0 0 200 140"
      >
        <defs>
          <radialGradient id="coffee-ring" cx="50%" cy="50%">
            <stop offset="40%" stopColor="oklch(0.55 0.10 60 / 0)" />
            <stop offset="62%" stopColor="oklch(0.45 0.12 55 / 0.75)" />
            <stop offset="72%" stopColor="oklch(0.40 0.13 50 / 0.55)" />
            <stop offset="86%" stopColor="oklch(0.50 0.10 55 / 0.18)" />
            <stop offset="100%" stopColor="oklch(0.55 0.10 60 / 0)" />
          </radialGradient>
        </defs>
        <ellipse
          cx="100"
          cy="70"
          rx="80"
          ry="55"
          fill="url(#coffee-ring)"
          transform="rotate(-12 100 70)"
        />
        <ellipse
          cx="105"
          cy="68"
          rx="70"
          ry="48"
          fill="oklch(0.62 0.08 55 / 0.12)"
          transform="rotate(-12 105 68)"
        />
      </svg>
      {/* grain */}
      <svg
        className="absolute inset-0 pointer-events-none w-full h-full"
        style={{ mixBlendMode: "multiply", opacity: 0.06 }}
      >
        <filter id="notebook-kickoff-grain">
          <feTurbulence baseFrequency="0.85" numOctaves="2" />
        </filter>
        <rect width="100%" height="100%" filter="url(#notebook-kickoff-grain)" />
      </svg>
      {/* eyebrow */}
      <p
        className="absolute"
        style={{
          top: "6%",
          left: "8%",
          fontFamily: monoFont,
          fontSize: "clamp(6px, 1.0cqw, 9px)",
          letterSpacing: "0.22em",
          color: "oklch(0.30 0.05 60)",
          textTransform: "uppercase",
        }}
      >
        Tues / kickoff prep
      </p>
      {/* handwritten content */}
      <div
        className="absolute"
        style={{ top: "16%", left: "9%", right: "8%" }}
      >
        <p
          style={{
            fontFamily: handFont,
            fontSize: "clamp(14px, 3.2cqw, 26px)",
            color: "oklch(0.24 0.06 60)",
            transform: "rotate(-0.6deg)",
            marginBottom: "0.6em",
          }}
        >
          9am — kickoff
        </p>
        <p
          style={{
            fontFamily: handFont,
            fontSize: "clamp(11px, 2.4cqw, 19px)",
            color: "oklch(0.30 0.05 60)",
            transform: "rotate(0.3deg)",
            marginBottom: "1em",
          }}
        >
          agenda:
        </p>
        <p
          style={{
            fontFamily: handFont,
            fontSize: "clamp(11px, 2.4cqw, 19px)",
            color: "oklch(0.28 0.05 60)",
            transform: "rotate(-0.4deg)",
            marginBottom: "0.55em",
          }}
        >
          1. why now
        </p>
        <p
          style={{
            fontFamily: handFont,
            fontSize: "clamp(11px, 2.4cqw, 19px)",
            color: "oklch(0.28 0.05 60)",
            transform: "rotate(0.5deg)",
            marginBottom: "0.55em",
          }}
        >
          2. what could break
        </p>
        <p
          style={{
            fontFamily: handFont,
            fontSize: "clamp(11px, 2.4cqw, 19px)",
            color: "oklch(0.28 0.05 60)",
            transform: "rotate(-0.3deg)",
          }}
        >
          3. what we won't ship
        </p>
      </div>
      {/* signature corner */}
      <p
        className="absolute"
        style={{
          bottom: "5%",
          right: "8%",
          fontFamily: handFont,
          fontSize: "clamp(10px, 2.0cqw, 16px)",
          color: "oklch(0.28 0.05 60)",
          transform: "rotate(-2deg)",
        }}
      >
        — N.
      </p>
    </div>
  );
}

export function CarbonCopyMemo() {
  const monoFont = "var(--font-jetbrains-mono), ui-monospace, monospace";
  /* Carbon-copy still reads as bluish ink, but pushed darker so
     the body text is unambiguously readable on the bluish paper.
     Opacity values below were also raised so the apparent
     "carbon ghosting" doesn't drag effective contrast under
     4.5:1. */
  const inkColor = "oklch(0.26 0.13 245)";
  const inkSoft = "oklch(0.32 0.12 245)";
  return (
    <div className="relative" style={{ aspectRatio: "5 / 4" }} aria-hidden={true}>
      {/* paper body — slightly bluish carbon paper */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.93 0.012 240) 0%, oklch(0.88 0.018 235) 100%)",
          boxShadow:
            "0 16px 32px -18px oklch(0 0 0 / 0.55), 0 4px 8px -4px oklch(0 0 0 / 0.32), 0 0 0 1px oklch(0 0 0 / 0.06)",
        }}
      />
      {/* faint horizontal carbon-ghosting bands */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="absolute left-0 right-0"
          style={{
            top: `${12 + i * 10}%`,
            height: "1px",
            background: "oklch(0.55 0.04 235 / 0.10)",
          }}
        />
      ))}
      {/* grain */}
      <svg
        className="absolute inset-0 pointer-events-none w-full h-full"
        style={{ mixBlendMode: "multiply", opacity: 0.06 }}
      >
        <filter id="carbon-grain">
          <feTurbulence baseFrequency="0.85" numOctaves="2" />
        </filter>
        <rect width="100%" height="100%" filter="url(#carbon-grain)" />
      </svg>
      {/* perforated tear edge — top */}
      <svg
        className="absolute top-0 left-0 w-full pointer-events-none"
        viewBox="0 0 100 2"
        preserveAspectRatio="none"
        style={{ height: "1.4%" }}
      >
        {Array.from({ length: 50 }).map((_, i) => (
          <circle
            key={i}
            cx={1 + i * 2}
            cy={1}
            r={0.35}
            fill="oklch(0 0 0 / 0.15)"
          />
        ))}
      </svg>
      {/* RE: line */}
      <div className="absolute" style={{ top: "9%", left: "7%", right: "7%" }}>
        <p
          style={{
            fontFamily: monoFont,
            fontSize: "clamp(8px, 1.4cqw, 12px)",
            letterSpacing: "0.18em",
            color: inkColor,
            textTransform: "uppercase",
          }}
        >
          RE: NAMING
        </p>
      </div>
      {/* divider */}
      <div
        className="absolute"
        style={{
          top: "20%",
          left: "7%",
          right: "7%",
          borderTop: "1px dashed oklch(0.32 0.12 245 / 0.55)",
        }}
      />
      {/* body */}
      <div className="absolute" style={{ top: "27%", left: "7%", right: "7%" }}>
        <p
          style={{
            fontFamily: monoFont,
            fontSize: "clamp(8px, 1.5cqw, 13px)",
            letterSpacing: "0.04em",
            lineHeight: 1.7,
            color: inkColor,
          }}
        >
          candidates:
        </p>
        <p
          style={{
            fontFamily: monoFont,
            fontSize: "clamp(8px, 1.5cqw, 13px)",
            letterSpacing: "0.04em",
            lineHeight: 1.7,
            color: inkSoft,
            marginLeft: "5%",
          }}
        >
          · Quick Capture
        </p>
        <p
          style={{
            fontFamily: monoFont,
            fontSize: "clamp(8px, 1.5cqw, 13px)",
            letterSpacing: "0.04em",
            lineHeight: 1.7,
            color: inkSoft,
            marginLeft: "5%",
          }}
        >
          · Side Spike
        </p>
        <p
          style={{
            fontFamily: monoFont,
            fontSize: "clamp(8px, 1.5cqw, 13px)",
            letterSpacing: "0.04em",
            lineHeight: 1.7,
            color: inkSoft,
            marginLeft: "5%",
          }}
        >
          · just notes.
        </p>
        <p
          style={{
            fontFamily: monoFont,
            fontSize: "clamp(8px, 1.5cqw, 13px)",
            letterSpacing: "0.06em",
            lineHeight: 1.7,
            color: inkColor,
            marginTop: "0.9em",
          }}
        >
          ship the third.
        </p>
      </div>
      {/* footer initial */}
      <p
        className="absolute"
        style={{
          bottom: "6%",
          right: "8%",
          fontFamily: monoFont,
          fontSize: "clamp(7px, 1.1cqw, 10px)",
          letterSpacing: "0.20em",
          color: inkSoft,
          textTransform: "uppercase",
        }}
      >
        cc / file
      </p>
    </div>
  );
}

export function WireframeRoute04() {
  const handFont = "var(--font-caveat), 'Caveat', 'Bradley Hand', cursive";
  const monoFont = "var(--font-jetbrains-mono), ui-monospace, monospace";
  const gridLine = "oklch(0.65 0.06 220 / 0.30)";
  return (
    <div className="relative" style={{ aspectRatio: "4 / 5" }} aria-hidden={true}>
      {/* paper body */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.96 0.010 80) 0%, oklch(0.92 0.012 78) 100%)",
          boxShadow:
            "0 16px 32px -18px oklch(0 0 0 / 0.55), 0 4px 8px -4px oklch(0 0 0 / 0.32), 0 0 0 1px oklch(0 0 0 / 0.06)",
        }}
      />
      {/* graph paper grid */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.55 }}
      >
        <defs>
          <pattern id="route04-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke={gridLine} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#route04-grid)" />
      </svg>
      {/* grain */}
      <svg
        className="absolute inset-0 pointer-events-none w-full h-full"
        style={{ mixBlendMode: "multiply", opacity: 0.06 }}
      >
        <filter id="route04-grain">
          <feTurbulence baseFrequency="0.85" numOctaves="2" />
        </filter>
        <rect width="100%" height="100%" filter="url(#route04-grain)" />
      </svg>
      {/* eyebrow */}
      <p
        className="absolute"
        style={{
          top: "5%",
          left: "8%",
          fontFamily: monoFont,
          fontSize: "clamp(6px, 1.0cqw, 9px)",
          letterSpacing: "0.22em",
          color: "oklch(0.20 0.05 60)",
          textTransform: "uppercase",
        }}
      >
        Route 04 / divider
      </p>
      {/* title */}
      <p
        className="absolute"
        style={{
          top: "10%",
          left: "8%",
          right: "8%",
          fontFamily: handFont,
          fontSize: "clamp(14px, 3.0cqw, 24px)",
          color: "oklch(0.18 0.05 60)",
          transform: "rotate(-1deg)",
        }}
      >
        index card divider
      </p>
      {/* sketch — three tabbed cards in a drawer */}
      <svg
        className="absolute"
        style={{ top: "26%", left: "8%", right: "8%", bottom: "22%", width: "84%" }}
        viewBox="0 0 200 200"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* drawer outline */}
        <rect
          x="10"
          y="20"
          width="180"
          height="160"
          fill="none"
          stroke="oklch(0.30 0.06 60)"
          strokeWidth="1.4"
          transform="rotate(-1.2 100 100)"
        />
        {/* card 1 */}
        <rect
          x="22"
          y="40"
          width="156"
          height="40"
          fill="oklch(0.85 0.02 70 / 0.5)"
          stroke="oklch(0.30 0.06 60)"
          strokeWidth="1.2"
          transform="rotate(-0.8 100 60)"
        />
        <rect
          x="34"
          y="32"
          width="36"
          height="10"
          fill="oklch(0.85 0.02 70 / 0.5)"
          stroke="oklch(0.30 0.06 60)"
          strokeWidth="1.2"
        />
        {/* card 2 */}
        <rect
          x="22"
          y="86"
          width="156"
          height="40"
          fill="oklch(0.82 0.02 70 / 0.4)"
          stroke="oklch(0.30 0.06 60)"
          strokeWidth="1.2"
        />
        <rect
          x="80"
          y="78"
          width="36"
          height="10"
          fill="oklch(0.82 0.02 70 / 0.4)"
          stroke="oklch(0.30 0.06 60)"
          strokeWidth="1.2"
        />
        {/* card 3 */}
        <rect
          x="22"
          y="132"
          width="156"
          height="40"
          fill="oklch(0.79 0.02 70 / 0.35)"
          stroke="oklch(0.30 0.06 60)"
          strokeWidth="1.2"
          transform="rotate(0.5 100 152)"
        />
        <rect
          x="128"
          y="124"
          width="36"
          height="10"
          fill="oklch(0.79 0.02 70 / 0.35)"
          stroke="oklch(0.30 0.06 60)"
          strokeWidth="1.2"
        />
        {/* annotation arrow */}
        <path
          d="M 165 30 Q 180 40 175 55"
          stroke="oklch(0.55 0.18 25 / 0.7)"
          strokeWidth="1.2"
          fill="none"
        />
        <path
          d="M 175 55 L 178 50 M 175 55 L 170 53"
          stroke="oklch(0.55 0.18 25 / 0.7)"
          strokeWidth="1.2"
          fill="none"
        />
      </svg>
      {/* margin annotation */}
      <p
        className="absolute"
        style={{
          top: "27%",
          right: "5%",
          fontFamily: handFont,
          fontSize: "clamp(9px, 1.8cqw, 14px)",
          color: "oklch(0.22 0.18 25)",
          transform: "rotate(-4deg)",
          maxWidth: "30%",
          lineHeight: 1.2,
        }}
      >
        gray, 3 tabs
      </p>
      {/* bottom caption */}
      <p
        className="absolute"
        style={{
          bottom: "8%",
          left: "8%",
          right: "8%",
          fontFamily: handFont,
          fontSize: "clamp(10px, 2.1cqw, 17px)",
          color: "oklch(0.20 0.05 60)",
          transform: "rotate(-0.7deg)",
          lineHeight: 1.25,
        }}
      >
        drawer-cabinet metaphor — physical, not stack
      </p>
    </div>
  );
}

export function ColorSwatchStrip() {
  const monoFont = "var(--font-jetbrains-mono), ui-monospace, monospace";
  const swatches = [
    { name: "vault", color: "oklch(0.07 0.005 60)" },
    { name: "manila", color: "oklch(0.84 0.04 75)" },
    { name: "ember", color: "oklch(0.68 0.18 50)" },
    { name: "paper", color: "oklch(0.96 0.012 80)" },
    { name: "ink", color: "oklch(0.22 0.04 60)" },
  ];
  /* Aspect was 5 / 6 (taller than wide), which left the 5-swatch
     row cramped — the rightmost swatch was being clipped by the
     card edge. Wider aspect (6 / 5) plus tighter horizontal
     padding (5%) and a smaller pixel-style gap (~3%) gives every
     swatch its own visible band with margin both inside the row
     and against the card frame. The parent `widthPct` in the
     manila layout map is paired up to this aspect. */
  return (
    <div className="relative" style={{ aspectRatio: "6 / 5" }} aria-hidden={true}>
      {/* paper body — backing card */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.96 0.012 80) 0%, oklch(0.91 0.014 78) 100%)",
          boxShadow:
            "0 16px 32px -18px oklch(0 0 0 / 0.55), 0 4px 8px -4px oklch(0 0 0 / 0.32), 0 0 0 1px oklch(0 0 0 / 0.06)",
        }}
      />
      {/* grain */}
      <svg
        className="absolute inset-0 pointer-events-none w-full h-full"
        style={{ mixBlendMode: "multiply", opacity: 0.06 }}
      >
        <filter id="swatch-grain">
          <feTurbulence baseFrequency="0.85" numOctaves="2" />
        </filter>
        <rect width="100%" height="100%" filter="url(#swatch-grain)" />
      </svg>
      {/* eyebrow */}
      <p
        className="absolute"
        style={{
          top: "6%",
          left: "5%",
          fontFamily: monoFont,
          fontSize: "clamp(6px, 1.0cqw, 9px)",
          letterSpacing: "0.22em",
          color: "oklch(0.22 0.04 60)",
          textTransform: "uppercase",
        }}
      >
        Palette / draft 03
      </p>
      <p
        className="absolute"
        style={{
          top: "6%",
          right: "5%",
          fontFamily: monoFont,
          fontSize: "clamp(6px, 1.0cqw, 9px)",
          letterSpacing: "0.22em",
          color: "oklch(0.26 0.04 60)",
          textTransform: "uppercase",
        }}
      >
        N.A. / 26
      </p>
      {/* swatch row */}
      <div
        className="absolute flex"
        style={{
          top: "22%",
          left: "5%",
          right: "5%",
          bottom: "30%",
          gap: "1.2cqw",
        }}
      >
        {swatches.map((s, idx) => (
          <div
            key={s.name}
            className="relative flex flex-col"
            style={{ flex: "1 1 0", minWidth: 0 }}
          >
            <div
              className="flex-1 relative"
              style={{
                background: s.color,
                boxShadow:
                  "inset 0 0 0 1px oklch(0 0 0 / 0.18), 0 2px 4px -2px oklch(0 0 0 / 0.25)",
              }}
            >
              {/* tiny inner registry tick */}
              <div
                className="absolute"
                style={{
                  top: "8%",
                  left: "12%",
                  width: "3px",
                  height: "3px",
                  background: "oklch(1 0 0 / 0.35)",
                  borderRadius: "50%",
                }}
              />
            </div>
            <p
              className="text-center"
              style={{
                marginTop: "10%",
                fontFamily: monoFont,
                fontSize: "clamp(6px, 1.0cqw, 9px)",
                letterSpacing: "0.16em",
                color: "oklch(0.22 0.04 60)",
                textTransform: "uppercase",
                lineHeight: 1.1,
              }}
            >
              {s.name}
            </p>
            <p
              className="text-center"
              style={{
                marginTop: "4%",
                fontFamily: monoFont,
                fontSize: "clamp(5px, 0.85cqw, 7px)",
                letterSpacing: "0.18em",
                color: "oklch(0.30 0.04 60)",
                textTransform: "uppercase",
                lineHeight: 1.1,
              }}
            >
              0{idx + 1}
            </p>
          </div>
        ))}
      </div>
      {/* footer rule + caption */}
      <div
        className="absolute"
        style={{
          left: "5%",
          right: "5%",
          bottom: "16%",
          borderTop: "1px solid oklch(0.22 0.04 60 / 0.30)",
        }}
      />
      <p
        className="absolute"
        style={{
          bottom: "6%",
          left: "5%",
          right: "5%",
          fontFamily: monoFont,
          fontSize: "clamp(6px, 1.0cqw, 9px)",
          letterSpacing: "0.20em",
          color: "oklch(0.22 0.04 60)",
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        five colors · one room · low light
      </p>
    </div>
  );
}

export function NapkinSketchFlow() {
  const handFont = "var(--font-caveat), 'Caveat', 'Bradley Hand', cursive";
  /* Was oklch(0.30 0.06 250) which read at ~6:1 on the translucent
     napkin paper — AA, not AAA. Pushed to L=0.20 so the labels and
     sketch lines clear ~9:1 on the same paper. */
  const inkColor = "oklch(0.20 0.06 250)";
  return (
    <div className="relative" style={{ aspectRatio: "1.2 / 1" }} aria-hidden={true}>
      {/* napkin body — translucent, soft */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(155deg, oklch(0.97 0.005 80 / 0.96) 0%, oklch(0.93 0.008 80 / 0.92) 100%)",
          boxShadow:
            "0 14px 28px -16px oklch(0 0 0 / 0.45), 0 3px 6px -3px oklch(0 0 0 / 0.25), 0 0 0 1px oklch(0 0 0 / 0.04)",
        }}
      />
      {/* napkin embossed quadrant lines (faint cross) */}
      <div
        className="absolute"
        style={{
          top: 0,
          bottom: 0,
          left: "50%",
          width: "1px",
          background: "oklch(0 0 0 / 0.04)",
        }}
      />
      <div
        className="absolute"
        style={{
          left: 0,
          right: 0,
          top: "50%",
          height: "1px",
          background: "oklch(0 0 0 / 0.04)",
        }}
      />
      {/* slightly crinkled corner shadows */}
      <div
        className="absolute top-0 right-0 w-[20%] h-[14%]"
        style={{
          background:
            "radial-gradient(ellipse at top right, oklch(0 0 0 / 0.10) 0%, transparent 70%)",
        }}
      />
      {/* grain */}
      <svg
        className="absolute inset-0 pointer-events-none w-full h-full"
        style={{ mixBlendMode: "multiply", opacity: 0.08 }}
      >
        <filter id="napkin-grain">
          <feTurbulence baseFrequency="0.85" numOctaves="2" />
        </filter>
        <rect width="100%" height="100%" filter="url(#napkin-grain)" />
      </svg>
      {/* sketch */}
      <svg
        className="absolute"
        style={{ top: "22%", left: "5%", right: "5%", width: "90%", height: "55%" }}
        viewBox="0 0 300 130"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* rect 1 */}
        <rect
          x="10"
          y="35"
          width="70"
          height="55"
          fill="none"
          stroke={inkColor}
          strokeWidth="1.6"
          transform="rotate(-1.5 45 62)"
        />
        {/* arrow 1 */}
        <path
          d="M 84 62 L 110 62"
          stroke={inkColor}
          strokeWidth="1.4"
          fill="none"
        />
        <path
          d="M 110 62 L 105 58 M 110 62 L 105 66"
          stroke={inkColor}
          strokeWidth="1.4"
          fill="none"
        />
        {/* rect 2 */}
        <rect
          x="115"
          y="35"
          width="70"
          height="55"
          fill="none"
          stroke={inkColor}
          strokeWidth="1.6"
          transform="rotate(0.8 150 62)"
        />
        {/* arrow 2 */}
        <path
          d="M 189 62 L 215 62"
          stroke={inkColor}
          strokeWidth="1.4"
          fill="none"
        />
        <path
          d="M 215 62 L 210 58 M 215 62 L 210 66"
          stroke={inkColor}
          strokeWidth="1.4"
          fill="none"
        />
        {/* rect 3 */}
        <rect
          x="220"
          y="35"
          width="70"
          height="55"
          fill="none"
          stroke={inkColor}
          strokeWidth="1.6"
          transform="rotate(-0.6 255 62)"
        />
      </svg>
      {/* labels under boxes */}
      <p
        className="absolute"
        style={{
          top: "67%",
          left: "8%",
          fontFamily: handFont,
          fontSize: "clamp(11px, 2.2cqw, 18px)",
          color: inkColor,
          transform: "rotate(-1deg)",
        }}
      >
        scroll back
      </p>
      <p
        className="absolute"
        style={{
          top: "67%",
          left: "42%",
          fontFamily: handFont,
          fontSize: "clamp(11px, 2.2cqw, 18px)",
          color: inkColor,
          transform: "rotate(0.6deg)",
        }}
      >
        highlight
      </p>
      <p
        className="absolute"
        style={{
          top: "67%",
          right: "10%",
          fontFamily: handFont,
          fontSize: "clamp(11px, 2.2cqw, 18px)",
          color: inkColor,
          transform: "rotate(-0.4deg)",
        }}
      >
        save
      </p>
      {/* small marginal note */}
      <p
        className="absolute"
        style={{
          top: "8%",
          left: "8%",
          fontFamily: handFont,
          fontSize: "clamp(9px, 1.8cqw, 14px)",
          color: "oklch(0.20 0.05 60)",
          transform: "rotate(-3deg)",
        }}
      >
        coffee, 7:42am
      </p>
    </div>
  );
}

export function MoodScrap() {
  return (
    <div className="relative" style={{ aspectRatio: "0.8 / 1" }} aria-hidden={true}>
      {/* backing card */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.94 0.012 78) 0%, oklch(0.89 0.014 76) 100%)",
          boxShadow:
            "0 16px 32px -18px oklch(0 0 0 / 0.55), 0 4px 8px -4px oklch(0 0 0 / 0.32), 0 0 0 1px oklch(0 0 0 / 0.06)",
        }}
      />
      {/* grain */}
      <svg
        className="absolute inset-0 pointer-events-none w-full h-full"
        style={{ mixBlendMode: "multiply", opacity: 0.06 }}
      >
        <filter id="moodscrap-grain">
          <feTurbulence baseFrequency="0.85" numOctaves="2" />
        </filter>
        <rect width="100%" height="100%" filter="url(#moodscrap-grain)" />
      </svg>
      {/* thumb 1 — film-grain swatch */}
      <div
        className="absolute"
        style={{
          top: "8%",
          left: "12%",
          right: "12%",
          height: "26%",
          background:
            "linear-gradient(160deg, oklch(0.20 0.02 60) 0%, oklch(0.30 0.03 50) 100%)",
          transform: "rotate(-2deg)",
          boxShadow:
            "0 6px 12px -6px oklch(0 0 0 / 0.50), 0 0 0 1px oklch(0 0 0 / 0.10)",
        }}
      >
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ mixBlendMode: "screen", opacity: 0.45 }}
        >
          <filter id="moodscrap-film">
            <feTurbulence baseFrequency="1.4" numOctaves="3" />
          </filter>
          <rect width="100%" height="100%" filter="url(#moodscrap-film)" />
        </svg>
      </div>
      {/* thumb 2 — manila tab */}
      <div
        className="absolute"
        style={{
          top: "36%",
          left: "8%",
          right: "10%",
          height: "26%",
          background:
            "linear-gradient(180deg, oklch(0.84 0.04 75) 0%, oklch(0.78 0.05 72) 100%)",
          transform: "rotate(1.2deg)",
          boxShadow:
            "0 6px 12px -6px oklch(0 0 0 / 0.50), 0 0 0 1px oklch(0 0 0 / 0.10)",
        }}
      >
        {/* tab cutout */}
        <div
          className="absolute"
          style={{
            top: "-12%",
            left: "20%",
            width: "32%",
            height: "16%",
            background:
              "linear-gradient(180deg, oklch(0.86 0.04 75) 0%, oklch(0.82 0.05 73) 100%)",
            boxShadow: "inset 0 -1px 0 oklch(0 0 0 / 0.12)",
          }}
        />
      </div>
      {/* thumb 3 — open ledger / lined */}
      <div
        className="absolute"
        style={{
          top: "65%",
          left: "14%",
          right: "8%",
          height: "26%",
          background:
            "linear-gradient(180deg, oklch(0.94 0.012 78) 0%, oklch(0.90 0.014 76) 100%)",
          transform: "rotate(-1.5deg)",
          boxShadow:
            "0 6px 12px -6px oklch(0 0 0 / 0.50), 0 0 0 1px oklch(0 0 0 / 0.10)",
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0"
            style={{
              top: `${15 + i * 14}%`,
              height: "1px",
              background: "oklch(0.65 0.05 220 / 0.30)",
            }}
          />
        ))}
        {/* center crease */}
        <div
          className="absolute top-0 bottom-0"
          style={{
            left: "50%",
            width: "1px",
            background: "oklch(0 0 0 / 0.10)",
          }}
        />
      </div>
    </div>
  );
}

export function TapeAnnotationTodo() {
  const handFont = "var(--font-caveat), 'Caveat', 'Bradley Hand', cursive";
  const monoFont = "var(--font-jetbrains-mono), ui-monospace, monospace";
  return (
    <div className="relative" style={{ aspectRatio: "1.4 / 1" }} aria-hidden={true}>
      {/* underlying paper sketch */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.95 0.012 80) 0%, oklch(0.90 0.014 78) 100%)",
          boxShadow:
            "0 16px 32px -18px oklch(0 0 0 / 0.55), 0 4px 8px -4px oklch(0 0 0 / 0.32), 0 0 0 1px oklch(0 0 0 / 0.06)",
        }}
      />
      {/* faint sketch underneath */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 200 140"
        preserveAspectRatio="xMidYMid meet"
        style={{ opacity: 0.35 }}
      >
        <rect
          x="20"
          y="30"
          width="60"
          height="80"
          fill="none"
          stroke="oklch(0.40 0.05 60)"
          strokeWidth="1"
        />
        <rect
          x="100"
          y="30"
          width="80"
          height="40"
          fill="none"
          stroke="oklch(0.40 0.05 60)"
          strokeWidth="1"
        />
        <rect
          x="100"
          y="78"
          width="80"
          height="32"
          fill="none"
          stroke="oklch(0.40 0.05 60)"
          strokeWidth="1"
        />
      </svg>
      {/* eyebrow registry */}
      <p
        className="absolute"
        style={{
          top: "5%",
          left: "5%",
          fontFamily: monoFont,
          fontSize: "clamp(6px, 1.0cqw, 9px)",
          letterSpacing: "0.22em",
          color: "oklch(0.20 0.04 60)",
          textTransform: "uppercase",
        }}
      >
        sketch / 04
      </p>
      {/* grain */}
      <svg
        className="absolute inset-0 pointer-events-none w-full h-full"
        style={{ mixBlendMode: "multiply", opacity: 0.06 }}
      >
        <filter id="tape-anno-grain">
          <feTurbulence baseFrequency="0.85" numOctaves="2" />
        </filter>
        <rect width="100%" height="100%" filter="url(#tape-anno-grain)" />
      </svg>
      {/* yellow tape strip — diagonal */}
      <div
        className="absolute"
        style={{
          top: "30%",
          left: "8%",
          width: "80%",
          height: "32%",
          background:
            "linear-gradient(180deg, oklch(0.93 0.18 95 / 0.55) 0%, oklch(0.90 0.20 92 / 0.50) 100%)",
          transform: "rotate(-7deg)",
          boxShadow:
            "0 4px 8px -4px oklch(0 0 0 / 0.30), inset 0 0 0 1px oklch(0 0 0 / 0.05)",
        }}
      >
        {/* tape striations */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "repeating-linear-gradient(90deg, transparent 0, transparent 6px, oklch(1 0 0 / 0.06) 6px, oklch(1 0 0 / 0.06) 7px)",
          }}
        />
        {/* tape edges — slightly torn */}
        <div
          className="absolute top-0 bottom-0 left-0 w-[2%]"
          style={{
            background:
              "linear-gradient(90deg, oklch(0 0 0 / 0.12) 0%, transparent 100%)",
          }}
        />
        <div
          className="absolute top-0 bottom-0 right-0 w-[2%]"
          style={{
            background:
              "linear-gradient(270deg, oklch(0 0 0 / 0.12) 0%, transparent 100%)",
          }}
        />
        {/* handwriting on the tape */}
        <p
          className="absolute inset-0 flex items-center justify-center px-[5%]"
          style={{
            fontFamily: handFont,
            fontSize: "clamp(13px, 2.8cqw, 22px)",
            color: "oklch(0.20 0.10 55)",
            lineHeight: 1.2,
            textAlign: "center",
          }}
        >
          TODO — connect this to memory shards
        </p>
      </div>
      {/* small pencil mark/arrow next to tape */}
      <svg
        className="absolute"
        style={{ bottom: "8%", left: "12%", width: "20%", height: "18%" }}
        viewBox="0 0 60 40"
      >
        <path
          d="M 5 30 Q 20 10 50 18"
          stroke="oklch(0.35 0.05 60)"
          strokeWidth="1.2"
          fill="none"
        />
        <path
          d="M 50 18 L 44 16 M 50 18 L 46 22"
          stroke="oklch(0.35 0.05 60)"
          strokeWidth="1.2"
          fill="none"
        />
      </svg>
    </div>
  );
}

export function TranscriptHighlight() {
  const monoFont = "var(--font-jetbrains-mono), ui-monospace, monospace";
  return (
    <div className="relative" style={{ aspectRatio: "5 / 4" }} aria-hidden={true}>
      {/* paper body */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.96 0.012 80) 0%, oklch(0.92 0.014 78) 100%)",
          boxShadow:
            "0 16px 32px -18px oklch(0 0 0 / 0.55), 0 4px 8px -4px oklch(0 0 0 / 0.32), 0 0 0 1px oklch(0 0 0 / 0.06)",
        }}
      />
      {/* grain */}
      <svg
        className="absolute inset-0 pointer-events-none w-full h-full"
        style={{ mixBlendMode: "multiply", opacity: 0.06 }}
      >
        <filter id="transcript-grain">
          <feTurbulence baseFrequency="0.85" numOctaves="2" />
        </filter>
        <rect width="100%" height="100%" filter="url(#transcript-grain)" />
      </svg>
      {/* eyebrow + timecode */}
      <p
        className="absolute"
        style={{
          top: "8%",
          left: "8%",
          fontFamily: monoFont,
          fontSize: "clamp(6px, 1.0cqw, 9px)",
          letterSpacing: "0.22em",
          color: "oklch(0.20 0.05 60)",
          textTransform: "uppercase",
        }}
      >
        Interview / P-07
      </p>
      <p
        className="absolute"
        style={{
          top: "8%",
          right: "8%",
          fontFamily: monoFont,
          fontSize: "clamp(6px, 1.0cqw, 9px)",
          letterSpacing: "0.18em",
          color: "oklch(0.22 0.04 60)",
        }}
      >
        00:32:14
      </p>
      {/* divider */}
      <div
        className="absolute"
        style={{
          top: "16%",
          left: "8%",
          right: "8%",
          borderTop: "1px solid oklch(0.30 0.05 60 / 0.25)",
        }}
      />
      {/* line 1 */}
      <p
        className="absolute"
        style={{
          top: "22%",
          left: "8%",
          right: "8%",
          fontFamily: monoFont,
          fontSize: "clamp(8px, 1.5cqw, 13px)",
          letterSpacing: "0.02em",
          lineHeight: 1.6,
          color: "oklch(0.22 0.04 60)",
        }}
      >
        ...the room had been arguing for forty minutes about the
      </p>
      {/* highlighted line — yellow band behind text */}
      <div
        className="absolute"
        style={{
          top: "39%",
          left: "6%",
          right: "6%",
          height: "16%",
          background:
            "linear-gradient(180deg, oklch(0.93 0.18 95 / 0.50) 0%, oklch(0.90 0.20 92 / 0.45) 100%)",
          transform: "rotate(-0.4deg)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "repeating-linear-gradient(90deg, transparent 0, transparent 4px, oklch(1 0 0 / 0.05) 4px, oklch(1 0 0 / 0.05) 5px)",
          }}
        />
      </div>
      <p
        className="absolute"
        style={{
          top: "41%",
          left: "8%",
          right: "8%",
          fontFamily: monoFont,
          fontSize: "clamp(8px, 1.5cqw, 13px)",
          letterSpacing: "0.02em",
          lineHeight: 1.6,
          color: "oklch(0.20 0.05 55)",
          fontWeight: 500,
        }}
      >
        "the line the whole room agrees to is the only line that matters"
      </p>
      {/* line 3 */}
      <p
        className="absolute"
        style={{
          top: "60%",
          left: "8%",
          right: "8%",
          fontFamily: monoFont,
          fontSize: "clamp(8px, 1.5cqw, 13px)",
          letterSpacing: "0.02em",
          lineHeight: 1.6,
          color: "oklch(0.22 0.04 60)",
        }}
      >
        — and then she said it, and we shipped that exact phrase.
      </p>
      {/* margin note */}
      <p
        className="absolute"
        style={{
          bottom: "7%",
          right: "8%",
          fontFamily: monoFont,
          fontSize: "clamp(6px, 1.0cqw, 9px)",
          letterSpacing: "0.20em",
          color: "oklch(0.20 0.04 60)",
          textTransform: "uppercase",
        }}
      >
        keep — pull-quote
      </p>
    </div>
  );
}

export function IndexCardPortrait() {
  const handFont = "var(--font-caveat), 'Caveat', 'Bradley Hand', cursive";
  const monoFont = "var(--font-jetbrains-mono), ui-monospace, monospace";
  return (
    <div className="relative" style={{ aspectRatio: "5 / 3" }} aria-hidden={true}>
      {/* paper body */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.96 0.012 80) 0%, oklch(0.92 0.014 78) 100%)",
          boxShadow:
            "0 16px 32px -18px oklch(0 0 0 / 0.55), 0 4px 8px -4px oklch(0 0 0 / 0.32), 0 0 0 1px oklch(0 0 0 / 0.06)",
        }}
      />
      {/* horizontal blue rules on right side */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: `${30 + i * 13}%`,
            left: "32%",
            right: "6%",
            height: "1px",
            background: "oklch(0.65 0.08 240 / 0.25)",
          }}
        />
      ))}
      {/* grain */}
      <svg
        className="absolute inset-0 pointer-events-none w-full h-full"
        style={{ mixBlendMode: "multiply", opacity: 0.06 }}
      >
        <filter id="indexcard-portrait-grain">
          <feTurbulence baseFrequency="0.85" numOctaves="2" />
        </filter>
        <rect width="100%" height="100%" filter="url(#indexcard-portrait-grain)" />
      </svg>
      {/* silhouette portrait — left side */}
      <svg
        className="absolute"
        style={{ top: "16%", left: "7%", width: "20%", height: "68%" }}
        viewBox="0 0 60 80"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* head */}
        <ellipse
          cx="30"
          cy="22"
          rx="13"
          ry="15"
          fill="oklch(0.30 0.04 60)"
        />
        {/* shoulders */}
        <path
          d="M 8 80 Q 8 50 30 42 Q 52 50 52 80 Z"
          fill="oklch(0.30 0.04 60)"
        />
        {/* small inner highlight */}
        <ellipse
          cx="34"
          cy="18"
          rx="2"
          ry="3"
          fill="oklch(0.45 0.04 60)"
          opacity="0.6"
        />
      </svg>
      {/* eyebrow */}
      <p
        className="absolute"
        style={{
          top: "9%",
          left: "32%",
          fontFamily: monoFont,
          fontSize: "clamp(6px, 1.0cqw, 9px)",
          letterSpacing: "0.22em",
          color: "oklch(0.20 0.05 60)",
          textTransform: "uppercase",
        }}
      >
        Talk / takeaway
      </p>
      {/* quote */}
      <p
        className="absolute"
        style={{
          top: "24%",
          left: "32%",
          right: "8%",
          fontFamily: handFont,
          fontSize: "clamp(11px, 2.4cqw, 19px)",
          color: "oklch(0.18 0.05 60)",
          lineHeight: 1.25,
          transform: "rotate(-0.4deg)",
        }}
      >
        listening, on paper.
      </p>
      {/* attribution */}
      <p
        className="absolute"
        style={{
          bottom: "10%",
          right: "8%",
          fontFamily: handFont,
          fontSize: "clamp(10px, 1.9cqw, 15px)",
          color: "oklch(0.20 0.05 60)",
          transform: "rotate(-1deg)",
        }}
      >
        — P.
      </p>
      {/* registry mark */}
      <p
        className="absolute"
        style={{
          bottom: "8%",
          left: "8%",
          fontFamily: monoFont,
          fontSize: "clamp(5px, 0.9cqw, 8px)",
          letterSpacing: "0.20em",
          color: "oklch(0.22 0.04 60)",
          textTransform: "uppercase",
        }}
      >
        N.A. / '26
      </p>
    </div>
  );
}

export function NotebookPageWeek1() {
  const handFont = "var(--font-caveat), 'Caveat', 'Bradley Hand', cursive";
  const monoFont = "var(--font-jetbrains-mono), ui-monospace, monospace";
  return (
    <div className="relative" style={{ aspectRatio: "5 / 7" }} aria-hidden={true}>
      {/* paper body */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.95 0.014 78) 0%, oklch(0.91 0.016 76) 100%)",
          boxShadow:
            "0 16px 32px -18px oklch(0 0 0 / 0.55), 0 4px 8px -4px oklch(0 0 0 / 0.32), 0 0 0 1px oklch(0 0 0 / 0.06)",
        }}
      />
      {/* hole-punched left margin — three holes */}
      {[0.18, 0.5, 0.82].map((p, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: `${p * 100}%`,
            left: "4%",
            transform: "translateY(-50%)",
            width: "3.5%",
            aspectRatio: "1 / 1",
            background: "oklch(0.05 0.005 60)",
            borderRadius: "50%",
            boxShadow:
              "inset 0 1px 2px oklch(0 0 0 / 0.6), 0 1px 0 oklch(1 0 0 / 0.4)",
          }}
        />
      ))}
      {/* red margin rule */}
      <div
        className="absolute top-0 bottom-0"
        style={{
          left: "12%",
          width: "1px",
          background: "oklch(0.55 0.18 25 / 0.4)",
        }}
      />
      {/* horizontal rules */}
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: `${15 + i * 5}%`,
            left: "12%",
            right: "6%",
            height: "1px",
            background: "oklch(0.65 0.05 220 / 0.22)",
          }}
        />
      ))}
      {/* grain */}
      <svg
        className="absolute inset-0 pointer-events-none w-full h-full"
        style={{ mixBlendMode: "multiply", opacity: 0.06 }}
      >
        <filter id="week1-grain">
          <feTurbulence baseFrequency="0.85" numOctaves="2" />
        </filter>
        <rect width="100%" height="100%" filter="url(#week1-grain)" />
      </svg>
      {/* eyebrow */}
      <p
        className="absolute"
        style={{
          top: "5%",
          left: "14%",
          fontFamily: monoFont,
          fontSize: "clamp(6px, 1.0cqw, 9px)",
          letterSpacing: "0.22em",
          color: "oklch(0.30 0.05 60)",
          textTransform: "uppercase",
        }}
      >
        Onboarding journal
      </p>
      <p
        className="absolute"
        style={{
          top: "5%",
          right: "6%",
          fontFamily: monoFont,
          fontSize: "clamp(6px, 1.0cqw, 9px)",
          letterSpacing: "0.20em",
          color: "oklch(0.34 0.04 60)",
        }}
      >
        DAY 04
      </p>
      {/* heading */}
      <p
        className="absolute"
        style={{
          top: "12%",
          left: "14%",
          right: "6%",
          fontFamily: handFont,
          fontSize: "clamp(15px, 3.4cqw, 28px)",
          color: "oklch(0.22 0.06 60)",
          transform: "rotate(-0.6deg)",
        }}
      >
        WEEK 1 ONBOARDING
      </p>
      {/* sub-heading 1 */}
      <p
        className="absolute"
        style={{
          top: "26%",
          left: "14%",
          fontFamily: handFont,
          fontSize: "clamp(11px, 2.3cqw, 19px)",
          color: "oklch(0.30 0.05 60)",
          transform: "rotate(-0.3deg)",
        }}
      >
        things confusing —
      </p>
      <p
        className="absolute"
        style={{
          top: "33%",
          left: "18%",
          right: "6%",
          fontFamily: handFont,
          fontSize: "clamp(11px, 2.2cqw, 18px)",
          color: "oklch(0.32 0.05 60)",
          transform: "rotate(0.4deg)",
          lineHeight: 1.3,
        }}
      >
        too many product names
      </p>
      <p
        className="absolute"
        style={{
          top: "41%",
          left: "18%",
          right: "6%",
          fontFamily: handFont,
          fontSize: "clamp(11px, 2.2cqw, 18px)",
          color: "oklch(0.32 0.05 60)",
          transform: "rotate(-0.4deg)",
          lineHeight: 1.3,
        }}
      >
        which notebook is THE notebook
      </p>
      {/* sub-heading 2 */}
      <p
        className="absolute"
        style={{
          top: "55%",
          left: "14%",
          fontFamily: handFont,
          fontSize: "clamp(11px, 2.3cqw, 19px)",
          color: "oklch(0.30 0.05 60)",
          transform: "rotate(-0.5deg)",
        }}
      >
        things magical —
      </p>
      <p
        className="absolute"
        style={{
          top: "62%",
          left: "18%",
          right: "6%",
          fontFamily: handFont,
          fontSize: "clamp(11px, 2.2cqw, 18px)",
          color: "oklch(0.30 0.05 60)",
          transform: "rotate(0.3deg)",
          lineHeight: 1.3,
        }}
      >
        meeting notes that just appear
      </p>
      <p
        className="absolute"
        style={{
          top: "70%",
          left: "18%",
          right: "6%",
          fontFamily: handFont,
          fontSize: "clamp(11px, 2.2cqw, 18px)",
          color: "oklch(0.30 0.05 60)",
          transform: "rotate(-0.3deg)",
          lineHeight: 1.3,
        }}
      >
        no robotic summary, just me
      </p>
      {/* small underline scribble */}
      <svg
        className="absolute"
        style={{ top: "78%", left: "16%", width: "30%", height: "3%" }}
        viewBox="0 0 100 8"
      >
        <path
          d="M 2 4 Q 25 1 50 5 T 98 4"
          stroke="oklch(0.35 0.05 60)"
          strokeWidth="1.2"
          fill="none"
        />
      </svg>
      {/* sign-off */}
      <p
        className="absolute"
        style={{
          bottom: "5%",
          right: "6%",
          fontFamily: handFont,
          fontSize: "clamp(11px, 2.0cqw, 16px)",
          color: "oklch(0.28 0.05 60)",
          transform: "rotate(-2deg)",
        }}
      >
        — N.
      </p>
    </div>
  );
}

export function BoardingPass() {
  const monoFont = "var(--font-jetbrains-mono), ui-monospace, monospace";
  const ink = "oklch(0.22 0.04 60)";
  const inkSoft = "oklch(0.32 0.04 60)";
  return (
    <div className="relative" style={{ aspectRatio: "3.4 / 1" }} aria-hidden={true}>
      {/* paper body */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.96 0.012 80) 0%, oklch(0.91 0.014 78) 100%)",
          boxShadow:
            "0 16px 32px -18px oklch(0 0 0 / 0.55), 0 4px 8px -4px oklch(0 0 0 / 0.32), 0 0 0 1px oklch(0 0 0 / 0.06)",
        }}
      />
      {/* perforated stub line */}
      <svg
        className="absolute top-0 bottom-0 pointer-events-none"
        style={{ left: "72%", width: "1.2%" }}
        viewBox="0 0 4 100"
        preserveAspectRatio="none"
      >
        {Array.from({ length: 30 }).map((_, i) => (
          <circle key={i} cx="2" cy={2 + i * 3.3} r="0.6" fill="oklch(0 0 0 / 0.18)" />
        ))}
      </svg>
      {/* grain */}
      <svg
        className="absolute inset-0 pointer-events-none w-full h-full"
        style={{ mixBlendMode: "multiply", opacity: 0.06 }}
      >
        <filter id="bp-grain">
          <feTurbulence baseFrequency="0.85" numOctaves="2" />
        </filter>
        <rect width="100%" height="100%" filter="url(#bp-grain)" />
      </svg>
      {/* top eyebrow / airline label */}
      <p
        className="absolute"
        style={{
          top: "12%",
          left: "3%",
          fontFamily: monoFont,
          fontSize: "clamp(6px, 1.6cqw, 11px)",
          letterSpacing: "0.30em",
          color: ink,
          textTransform: "uppercase",
        }}
      >
        Boarding Pass · Archive
      </p>
      <p
        className="absolute"
        style={{
          top: "12%",
          right: "30%",
          fontFamily: monoFont,
          fontSize: "clamp(6px, 1.4cqw, 10px)",
          letterSpacing: "0.20em",
          color: inkSoft,
          textTransform: "uppercase",
        }}
      >
        FLT QF1
      </p>
      {/* divider */}
      <div
        className="absolute"
        style={{
          top: "30%",
          left: "3%",
          right: "30%",
          borderTop: "1px solid oklch(0.30 0.04 60 / 0.30)",
        }}
      />
      {/* main route block */}
      <div
        className="absolute flex items-end"
        style={{ top: "38%", left: "3%", right: "30%", bottom: "12%", gap: "5%" }}
      >
        <div className="flex flex-col">
          <span
            style={{
              fontFamily: monoFont,
              fontSize: "clamp(6px, 1.2cqw, 9px)",
              letterSpacing: "0.22em",
              color: inkSoft,
              textTransform: "uppercase",
            }}
          >
            From
          </span>
          <span
            style={{
              fontFamily: monoFont,
              fontSize: "clamp(16px, 4.2cqw, 32px)",
              letterSpacing: "0.10em",
              color: ink,
              fontWeight: 600,
              lineHeight: 1,
            }}
          >
            SYD
          </span>
        </div>
        <span
          style={{
            fontFamily: monoFont,
            fontSize: "clamp(14px, 3.6cqw, 28px)",
            color: ink,
            opacity: 0.6,
            paddingBottom: "4%",
          }}
        >
          →
        </span>
        <div className="flex flex-col">
          <span
            style={{
              fontFamily: monoFont,
              fontSize: "clamp(6px, 1.2cqw, 9px)",
              letterSpacing: "0.22em",
              color: inkSoft,
              textTransform: "uppercase",
            }}
          >
            To
          </span>
          <span
            style={{
              fontFamily: monoFont,
              fontSize: "clamp(16px, 4.2cqw, 32px)",
              letterSpacing: "0.10em",
              color: ink,
              fontWeight: 600,
              lineHeight: 1,
            }}
          >
            LON
          </span>
        </div>
        <div className="flex flex-col" style={{ marginLeft: "6%" }}>
          <span
            style={{
              fontFamily: monoFont,
              fontSize: "clamp(6px, 1.2cqw, 9px)",
              letterSpacing: "0.22em",
              color: inkSoft,
              textTransform: "uppercase",
            }}
          >
            Date
          </span>
          <span
            style={{
              fontFamily: monoFont,
              fontSize: "clamp(8px, 2.0cqw, 15px)",
              letterSpacing: "0.10em",
              color: ink,
              fontWeight: 500,
              lineHeight: 1.1,
            }}
          >
            2026 · 05 · 12
          </span>
        </div>
        <div className="flex flex-col" style={{ marginLeft: "auto" }}>
          <span
            style={{
              fontFamily: monoFont,
              fontSize: "clamp(6px, 1.2cqw, 9px)",
              letterSpacing: "0.22em",
              color: inkSoft,
              textTransform: "uppercase",
            }}
          >
            Seat
          </span>
          <span
            style={{
              fontFamily: monoFont,
              fontSize: "clamp(10px, 2.6cqw, 20px)",
              letterSpacing: "0.10em",
              color: ink,
              fontWeight: 600,
              lineHeight: 1,
            }}
          >
            14A
          </span>
        </div>
      </div>
      {/* archivist line */}
      <p
        className="absolute"
        style={{
          bottom: "6%",
          left: "3%",
          fontFamily: monoFont,
          fontSize: "clamp(6px, 1.2cqw, 10px)",
          letterSpacing: "0.20em",
          color: inkSoft,
          textTransform: "uppercase",
        }}
      >
        Archivist · Nupur Aggarwal
      </p>
      {/* stub */}
      <div
        className="absolute"
        style={{ top: 0, right: 0, width: "27%", height: "100%" }}
      >
        <p
          className="absolute"
          style={{
            top: "10%",
            left: "8%",
            fontFamily: monoFont,
            fontSize: "clamp(5px, 1.0cqw, 8px)",
            letterSpacing: "0.22em",
            color: inkSoft,
            textTransform: "uppercase",
          }}
        >
          stub
        </p>
        <p
          className="absolute"
          style={{
            top: "30%",
            left: "8%",
            fontFamily: monoFont,
            fontSize: "clamp(8px, 2.0cqw, 15px)",
            letterSpacing: "0.10em",
            color: ink,
            fontWeight: 600,
            lineHeight: 1,
          }}
        >
          14A
        </p>
        <p
          className="absolute"
          style={{
            top: "55%",
            left: "8%",
            right: "6%",
            fontFamily: monoFont,
            fontSize: "clamp(6px, 1.4cqw, 10px)",
            letterSpacing: "0.16em",
            color: ink,
            textTransform: "uppercase",
          }}
        >
          SYD → LON
        </p>
        <p
          className="absolute"
          style={{
            bottom: "12%",
            left: "8%",
            fontFamily: monoFont,
            fontSize: "clamp(5px, 1.0cqw, 8px)",
            letterSpacing: "0.22em",
            color: inkSoft,
            textTransform: "uppercase",
          }}
        >
          gate · TBD
        </p>
        {/* tiny barcode */}
        <div
          className="absolute"
          style={{
            bottom: "30%",
            left: "8%",
            right: "8%",
            height: "10%",
            background:
              "repeating-linear-gradient(90deg, oklch(0.20 0.04 60) 0, oklch(0.20 0.04 60) 1px, transparent 1px, transparent 3px, oklch(0.20 0.04 60) 3px, oklch(0.20 0.04 60) 4px, transparent 4px, transparent 7px)",
          }}
        />
      </div>
    </div>
  );
}

export function DecisionReceipt() {
  const monoFont = "var(--font-jetbrains-mono), ui-monospace, monospace";
  const ink = "oklch(0.22 0.04 60)";
  const inkSoft = "oklch(0.34 0.04 60)";
  return (
    <div className="relative" style={{ aspectRatio: "1 / 3.2" }} aria-hidden={true}>
      {/* paper body */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.97 0.008 80) 0%, oklch(0.93 0.010 78) 100%)",
          boxShadow:
            "0 14px 28px -16px oklch(0 0 0 / 0.55), 0 3px 6px -3px oklch(0 0 0 / 0.30), 0 0 0 1px oklch(0 0 0 / 0.05)",
        }}
      />
      {/* zigzag bottom edge */}
      <svg
        className="absolute left-0 right-0 pointer-events-none"
        style={{ bottom: "-1%", height: "2%", width: "100%" }}
        viewBox="0 0 100 4"
        preserveAspectRatio="none"
      >
        <polygon
          points="0,0 4,4 8,0 12,4 16,0 20,4 24,0 28,4 32,0 36,4 40,0 44,4 48,0 52,4 56,0 60,4 64,0 68,4 72,0 76,4 80,0 84,4 88,0 92,4 96,0 100,4 100,0"
          fill="oklch(0.97 0.008 80)"
        />
      </svg>
      {/* zigzag top edge */}
      <svg
        className="absolute left-0 right-0 pointer-events-none"
        style={{ top: "-1%", height: "2%", width: "100%" }}
        viewBox="0 0 100 4"
        preserveAspectRatio="none"
      >
        <polygon
          points="0,4 4,0 8,4 12,0 16,4 20,0 24,4 28,0 32,4 36,0 40,4 44,0 48,4 52,0 56,4 60,0 64,4 68,0 72,4 76,0 80,4 84,0 88,4 92,0 96,4 100,0 100,4"
          fill="oklch(0.97 0.008 80)"
        />
      </svg>
      {/* grain */}
      <svg
        className="absolute inset-0 pointer-events-none w-full h-full"
        style={{ mixBlendMode: "multiply", opacity: 0.06 }}
      >
        <filter id="receipt-grain">
          <feTurbulence baseFrequency="0.85" numOctaves="2" />
        </filter>
        <rect width="100%" height="100%" filter="url(#receipt-grain)" />
      </svg>
      {/* header */}
      <div className="absolute" style={{ top: "5%", left: "8%", right: "8%" }}>
        <p
          style={{
            fontFamily: monoFont,
            fontSize: "clamp(7px, 2.4cqw, 11px)",
            letterSpacing: "0.30em",
            color: ink,
            textTransform: "uppercase",
            textAlign: "center",
            fontWeight: 600,
          }}
        >
          Decision
        </p>
        <p
          style={{
            fontFamily: monoFont,
            fontSize: "clamp(7px, 2.4cqw, 11px)",
            letterSpacing: "0.30em",
            color: ink,
            textTransform: "uppercase",
            textAlign: "center",
            fontWeight: 600,
          }}
        >
          Receipt
        </p>
      </div>
      {/* dashed divider */}
      <div
        className="absolute"
        style={{
          top: "13%",
          left: "8%",
          right: "8%",
          borderTop: "1px dashed oklch(0.30 0.04 60 / 0.40)",
        }}
      />
      {/* body — line items */}
      <div
        className="absolute"
        style={{ top: "16%", left: "8%", right: "8%", display: "flex", flexDirection: "column", gap: "3%" }}
      >
        <p
          style={{
            fontFamily: monoFont,
            fontSize: "clamp(6px, 2.0cqw, 9px)",
            letterSpacing: "0.18em",
            color: inkSoft,
            textTransform: "uppercase",
          }}
        >
          item
        </p>
        <p
          style={{
            fontFamily: monoFont,
            fontSize: "clamp(7px, 2.4cqw, 11px)",
            letterSpacing: "0.04em",
            color: ink,
            lineHeight: 1.4,
          }}
        >
          one button to dock,<br />not two
        </p>
      </div>
      <div
        className="absolute"
        style={{ top: "38%", left: "8%", right: "8%" }}
      >
        <p
          style={{
            fontFamily: monoFont,
            fontSize: "clamp(6px, 2.0cqw, 9px)",
            letterSpacing: "0.18em",
            color: inkSoft,
            textTransform: "uppercase",
          }}
        >
          cost
        </p>
        <p
          style={{
            fontFamily: monoFont,
            fontSize: "clamp(7px, 2.4cqw, 11px)",
            letterSpacing: "0.04em",
            color: ink,
            lineHeight: 1.4,
            marginTop: "1%",
          }}
        >
          4 hrs of debate
        </p>
      </div>
      <div
        className="absolute"
        style={{ top: "53%", left: "8%", right: "8%" }}
      >
        <p
          style={{
            fontFamily: monoFont,
            fontSize: "clamp(6px, 2.0cqw, 9px)",
            letterSpacing: "0.18em",
            color: inkSoft,
            textTransform: "uppercase",
          }}
        >
          benefit
        </p>
        <p
          style={{
            fontFamily: monoFont,
            fontSize: "clamp(7px, 2.4cqw, 11px)",
            letterSpacing: "0.04em",
            color: ink,
            lineHeight: 1.4,
            marginTop: "1%",
          }}
        >
          one less choice
        </p>
      </div>
      {/* dashed divider */}
      <div
        className="absolute"
        style={{
          top: "70%",
          left: "8%",
          right: "8%",
          borderTop: "1px dashed oklch(0.30 0.04 60 / 0.40)",
        }}
      />
      {/* signed */}
      <div className="absolute" style={{ top: "74%", left: "8%", right: "8%" }}>
        <p
          style={{
            fontFamily: monoFont,
            fontSize: "clamp(6px, 2.0cqw, 9px)",
            letterSpacing: "0.18em",
            color: inkSoft,
            textTransform: "uppercase",
          }}
        >
          signed
        </p>
        <p
          style={{
            fontFamily: monoFont,
            fontSize: "clamp(7px, 2.4cqw, 11px)",
            letterSpacing: "0.04em",
            color: ink,
            marginTop: "1%",
            fontWeight: 500,
          }}
        >
          N.
        </p>
      </div>
      {/* tiny barcode-like footer */}
      <div
        className="absolute"
        style={{
          bottom: "5%",
          left: "12%",
          right: "12%",
          height: "3%",
          background:
            "repeating-linear-gradient(90deg, oklch(0.20 0.04 60) 0, oklch(0.20 0.04 60) 1px, transparent 1px, transparent 2px, oklch(0.20 0.04 60) 2px, oklch(0.20 0.04 60) 3px, transparent 3px, transparent 5px)",
          opacity: 0.7,
        }}
      />
    </div>
  );
}

export function FoldedLetter() {
  const monoFont = "var(--font-jetbrains-mono), ui-monospace, monospace";
  const ink = "oklch(0.24 0.04 60)";
  const inkSoft = "oklch(0.30 0.04 60)";
  return (
    <div className="relative" style={{ aspectRatio: "5 / 7" }} aria-hidden={true}>
      {/* paper body */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.96 0.012 80) 0%, oklch(0.91 0.014 78) 100%)",
          boxShadow:
            "0 16px 32px -18px oklch(0 0 0 / 0.55), 0 4px 8px -4px oklch(0 0 0 / 0.32), 0 0 0 1px oklch(0 0 0 / 0.06)",
        }}
      />
      {/* fold crease at 1/3 from top */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: "33%",
          height: "0.4%",
          background:
            "linear-gradient(180deg, oklch(0 0 0 / 0.18) 0%, oklch(0 0 0 / 0.04) 100%)",
        }}
      />
      {/* shadow below fold suggesting depth */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: "33.4%",
          height: "5%",
          background:
            "linear-gradient(180deg, oklch(0 0 0 / 0.12) 0%, transparent 100%)",
        }}
      />
      {/* second fold crease (the bottom 1/3) */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: "66%",
          height: "0.3%",
          background: "oklch(0 0 0 / 0.10)",
        }}
      />
      {/* grain */}
      <svg
        className="absolute inset-0 pointer-events-none w-full h-full"
        style={{ mixBlendMode: "multiply", opacity: 0.06 }}
      >
        <filter id="letter-grain">
          <feTurbulence baseFrequency="0.85" numOctaves="2" />
        </filter>
        <rect width="100%" height="100%" filter="url(#letter-grain)" />
      </svg>
      {/* eyebrow */}
      <p
        className="absolute"
        style={{
          top: "5%",
          left: "9%",
          fontFamily: monoFont,
          fontSize: "clamp(6px, 1.0cqw, 9px)",
          letterSpacing: "0.22em",
          color: inkSoft,
          textTransform: "uppercase",
        }}
      >
        Letter / unsent draft
      </p>
      {/* TO + RE */}
      <p
        className="absolute"
        style={{
          top: "11%",
          left: "9%",
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "clamp(11px, 2.0cqw, 17px)",
          color: ink,
          letterSpacing: "0.04em",
        }}
      >
        TO: visiting designer
      </p>
      <p
        className="absolute"
        style={{
          top: "16%",
          left: "9%",
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "clamp(11px, 2.0cqw, 17px)",
          color: ink,
          letterSpacing: "0.04em",
        }}
      >
        RE: how we work
      </p>
      <p
        className="absolute"
        style={{
          top: "22%",
          left: "9%",
          right: "9%",
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "clamp(10px, 1.7cqw, 14px)",
          color: ink,
          lineHeight: 1.6,
        }}
      >
        I've been meaning to write this since you arrived,
        and I keep starting and putting it aside because
      </p>
      {/* below-fold body — partially cut by fold */}
      <p
        className="absolute"
        style={{
          top: "44%",
          left: "9%",
          right: "9%",
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "clamp(10px, 1.7cqw, 14px)",
          color: ink,
          lineHeight: 1.6,
          opacity: 0.55,
        }}
      >
        the honest answer is messier than I want it to be.
        Some weeks we work in the open and some weeks
      </p>
      {/* third panel — almost entirely shadowed */}
      <p
        className="absolute"
        style={{
          top: "72%",
          left: "9%",
          right: "9%",
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "clamp(10px, 1.7cqw, 14px)",
          color: ink,
          lineHeight: 1.6,
          opacity: 0.25,
        }}
      >
        [continues below fold —]
      </p>
      {/* bottom shadow gradient — third panel tucked behind */}
      <div
        className="absolute left-0 right-0"
        style={{
          bottom: 0,
          height: "30%",
          background:
            "linear-gradient(180deg, transparent 0%, oklch(0 0 0 / 0.10) 100%)",
        }}
      />
    </div>
  );
}

export function PolaroidTownHall() {
  const handFont = "var(--font-caveat), 'Caveat', 'Bradley Hand', cursive";
  return (
    <div className="relative" style={{ aspectRatio: "1 / 1.2" }} aria-hidden={true}>
      {/* polaroid body — white with warm tint */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.97 0.005 85) 0%, oklch(0.94 0.008 82) 100%)",
          boxShadow:
            "0 16px 32px -18px oklch(0 0 0 / 0.55), 0 4px 8px -4px oklch(0 0 0 / 0.32), 0 0 0 1px oklch(0 0 0 / 0.06)",
        }}
      />
      {/* photo well — empty cream square */}
      <div
        className="absolute"
        style={{
          top: "6%",
          left: "8%",
          right: "8%",
          bottom: "28%",
          background:
            "linear-gradient(160deg, oklch(0.92 0.014 80) 0%, oklch(0.86 0.018 76) 100%)",
          boxShadow:
            "inset 0 0 0 1px oklch(0 0 0 / 0.10), inset 0 4px 12px oklch(0 0 0 / 0.18)",
        }}
      >
        {/* faint scuffs in the photo well */}
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ mixBlendMode: "multiply", opacity: 0.4 }}
        >
          <filter id="polaroid-scuff">
            <feTurbulence baseFrequency="0.4" numOctaves="2" />
          </filter>
          <rect width="100%" height="100%" filter="url(#polaroid-scuff)" />
        </svg>
        {/* a soft vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 50%, oklch(0 0 0 / 0.18) 100%)",
          }}
        />
      </div>
      {/* grain overlay */}
      <svg
        className="absolute inset-0 pointer-events-none w-full h-full"
        style={{ mixBlendMode: "multiply", opacity: 0.05 }}
      >
        <filter id="polaroid-grain">
          <feTurbulence baseFrequency="0.85" numOctaves="2" />
        </filter>
        <rect width="100%" height="100%" filter="url(#polaroid-grain)" />
      </svg>
      {/* caption */}
      <p
        className="absolute"
        style={{
          bottom: "10%",
          left: "8%",
          right: "8%",
          fontFamily: handFont,
          fontSize: "clamp(11px, 2.4cqw, 19px)",
          color: "oklch(0.20 0.05 60)",
          transform: "rotate(-1.2deg)",
          lineHeight: 1.2,
        }}
      >
        Town hall Q3
      </p>
      <p
        className="absolute"
        style={{
          bottom: "4%",
          left: "8%",
          right: "8%",
          fontFamily: handFont,
          fontSize: "clamp(9px, 1.9cqw, 15px)",
          color: "oklch(0.22 0.05 60)",
          transform: "rotate(-0.8deg)",
          lineHeight: 1.2,
        }}
      >
        standing room only
      </p>
    </div>
  );
}

export function TornPaperParenthetical() {
  const monoFont = "var(--font-jetbrains-mono), ui-monospace, monospace";
  return (
    <div className="relative" style={{ aspectRatio: "5 / 2" }} aria-hidden={true}>
      {/* torn paper — irregular top edge via clip-path */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.96 0.012 80) 0%, oklch(0.92 0.014 78) 100%)",
          boxShadow:
            "0 14px 28px -16px oklch(0 0 0 / 0.55), 0 3px 6px -3px oklch(0 0 0 / 0.30)",
          clipPath:
            "polygon(0% 6%, 4% 2%, 9% 8%, 14% 3%, 19% 7%, 25% 4%, 32% 9%, 38% 5%, 44% 8%, 50% 4%, 56% 7%, 62% 5%, 68% 9%, 74% 6%, 80% 8%, 86% 4%, 92% 7%, 100% 5%, 100% 100%, 0% 100%)",
        }}
      />
      {/* soft fiber ridge along the torn edge */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: "8%",
          height: "1px",
          background:
            "linear-gradient(90deg, transparent 0%, oklch(0 0 0 / 0.10) 50%, transparent 100%)",
          opacity: 0.4,
        }}
      />
      {/* grain */}
      <svg
        className="absolute inset-0 pointer-events-none w-full h-full"
        style={{ mixBlendMode: "multiply", opacity: 0.06 }}
      >
        <filter id="torn-grain">
          <feTurbulence baseFrequency="0.85" numOctaves="2" />
        </filter>
        <rect width="100%" height="100%" filter="url(#torn-grain)" />
      </svg>
      {/* eyebrow */}
      <p
        className="absolute"
        style={{
          top: "22%",
          left: "5%",
          fontFamily: monoFont,
          fontSize: "clamp(6px, 1.0cqw, 9px)",
          letterSpacing: "0.22em",
          color: "oklch(0.32 0.04 60)",
          textTransform: "uppercase",
        }}
      >
        From retro / Q2
      </p>
      {/* the line */}
      <p
        className="absolute"
        style={{
          top: "42%",
          left: "5%",
          right: "5%",
          fontFamily: monoFont,
          fontSize: "clamp(11px, 2.4cqw, 18px)",
          letterSpacing: "0.02em",
          color: "oklch(0.22 0.05 60)",
          fontStyle: "italic",
          lineHeight: 1.4,
        }}
      >
        (this shipped because nobody said no fast enough)
      </p>
    </div>
  );
}

export function StampedMemo() {
  const monoFont = "var(--font-jetbrains-mono), ui-monospace, monospace";
  const ink = "oklch(0.22 0.04 60)";
  const inkSoft = "oklch(0.34 0.04 60)";
  /* The stamp stays red but pushed darker so the URGENT text
     reads cleanly over the cream paper underneath. */
  const stampRed = "oklch(0.36 0.20 28)";
  return (
    <div className="relative" style={{ aspectRatio: "5 / 4" }} aria-hidden={true}>
      {/* paper body */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.96 0.012 80) 0%, oklch(0.91 0.014 78) 100%)",
          boxShadow:
            "0 16px 32px -18px oklch(0 0 0 / 0.55), 0 4px 8px -4px oklch(0 0 0 / 0.32), 0 0 0 1px oklch(0 0 0 / 0.06)",
        }}
      />
      {/* grain */}
      <svg
        className="absolute inset-0 pointer-events-none w-full h-full"
        style={{ mixBlendMode: "multiply", opacity: 0.06 }}
      >
        <filter id="stamped-grain">
          <feTurbulence baseFrequency="0.85" numOctaves="2" />
        </filter>
        <rect width="100%" height="100%" filter="url(#stamped-grain)" />
      </svg>
      {/* memo header */}
      <p
        className="absolute"
        style={{
          top: "10%",
          left: "8%",
          fontFamily: monoFont,
          fontSize: "clamp(7px, 1.4cqw, 11px)",
          letterSpacing: "0.30em",
          color: ink,
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        Memorandum
      </p>
      {/* divider */}
      <div
        className="absolute"
        style={{
          top: "20%",
          left: "8%",
          right: "8%",
          borderTop: "1px solid oklch(0.30 0.04 60 / 0.30)",
        }}
      />
      {/* body lines */}
      <p
        className="absolute"
        style={{
          top: "26%",
          left: "8%",
          fontFamily: monoFont,
          fontSize: "clamp(7px, 1.3cqw, 11px)",
          letterSpacing: "0.18em",
          color: inkSoft,
          textTransform: "uppercase",
        }}
      >
        Brief
      </p>
      <p
        className="absolute"
        style={{
          top: "32%",
          left: "8%",
          right: "8%",
          fontFamily: monoFont,
          fontSize: "clamp(8px, 1.6cqw, 14px)",
          color: ink,
          letterSpacing: "0.04em",
        }}
      >
        MUSEUM BRIEF
      </p>
      <p
        className="absolute"
        style={{
          top: "46%",
          left: "8%",
          fontFamily: monoFont,
          fontSize: "clamp(7px, 1.3cqw, 11px)",
          letterSpacing: "0.18em",
          color: inkSoft,
          textTransform: "uppercase",
        }}
      >
        Due
      </p>
      <p
        className="absolute"
        style={{
          top: "52%",
          left: "8%",
          right: "8%",
          fontFamily: monoFont,
          fontSize: "clamp(8px, 1.6cqw, 14px)",
          color: ink,
          letterSpacing: "0.04em",
        }}
      >
        never
      </p>
      <p
        className="absolute"
        style={{
          top: "66%",
          left: "8%",
          fontFamily: monoFont,
          fontSize: "clamp(7px, 1.3cqw, 11px)",
          letterSpacing: "0.18em",
          color: inkSoft,
          textTransform: "uppercase",
        }}
      >
        Delivered
      </p>
      <p
        className="absolute"
        style={{
          top: "72%",
          left: "8%",
          right: "8%",
          fontFamily: monoFont,
          fontSize: "clamp(8px, 1.6cqw, 14px)",
          color: ink,
          letterSpacing: "0.04em",
        }}
      >
        today
      </p>
      {/* URGENT stamp — diagonal, top right */}
      <div
        className="absolute"
        style={{
          top: "8%",
          right: "5%",
          width: "32%",
          padding: "2.2% 4%",
          border: `2.5px solid ${stampRed}`,
          transform: "rotate(-14deg)",
          opacity: 0.85,
        }}
      >
        <p
          style={{
            fontFamily: monoFont,
            fontSize: "clamp(10px, 2.4cqw, 18px)",
            letterSpacing: "0.20em",
            color: stampRed,
            textTransform: "uppercase",
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          URGENT
        </p>
        {/* faded ink rough texture */}
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{ mixBlendMode: "screen", opacity: 0.5 }}
        >
          <filter id="urgent-rough">
            <feTurbulence baseFrequency="1.4" numOctaves="2" />
            <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#urgent-rough)" />
        </svg>
      </div>
      {/* footer initial */}
      <p
        className="absolute"
        style={{
          bottom: "6%",
          right: "8%",
          fontFamily: monoFont,
          fontSize: "clamp(6px, 1.1cqw, 10px)",
          letterSpacing: "0.20em",
          color: inkSoft,
          textTransform: "uppercase",
        }}
      >
        — N.A.
      </p>
    </div>
  );
}

export function SlackClipping() {
  const monoFont = "var(--font-jetbrains-mono), ui-monospace, monospace";
  const ink = "oklch(0.20 0.04 60)";
  const inkSoft = "oklch(0.34 0.04 60)";
  return (
    <div className="relative" style={{ aspectRatio: "5 / 3" }} aria-hidden={true}>
      {/* paper body */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.97 0.008 80) 0%, oklch(0.93 0.010 78) 100%)",
          boxShadow:
            "0 16px 32px -18px oklch(0 0 0 / 0.55), 0 4px 8px -4px oklch(0 0 0 / 0.32), 0 0 0 1px oklch(0 0 0 / 0.06)",
        }}
      />
      {/* grain */}
      <svg
        className="absolute inset-0 pointer-events-none w-full h-full"
        style={{ mixBlendMode: "multiply", opacity: 0.06 }}
      >
        <filter id="slack-grain">
          <feTurbulence baseFrequency="0.85" numOctaves="2" />
        </filter>
        <rect width="100%" height="100%" filter="url(#slack-grain)" />
      </svg>
      {/* simulated pin / push-pin shadow at top-center */}
      <div
        className="absolute"
        style={{
          top: "-3%",
          left: "47%",
          width: "6%",
          aspectRatio: "1 / 1",
          background:
            "radial-gradient(circle at 35% 35%, oklch(0.72 0.18 28) 0%, oklch(0.45 0.15 25) 70%, oklch(0.30 0.10 25) 100%)",
          borderRadius: "50%",
          boxShadow: "0 3px 6px -2px oklch(0 0 0 / 0.50)",
        }}
      />
      {/* avatar circle (initial) */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          top: "18%",
          left: "6%",
          width: "12%",
          aspectRatio: "1 / 1",
          background:
            "linear-gradient(160deg, oklch(0.68 0.18 50) 0%, oklch(0.55 0.20 40) 100%)",
          borderRadius: "20%",
          fontFamily: monoFont,
          fontSize: "clamp(10px, 2.5cqw, 18px)",
          letterSpacing: "0.04em",
          color: "oklch(0.97 0.008 80)",
          fontWeight: 700,
          boxShadow: "inset 0 0 0 1px oklch(0 0 0 / 0.10)",
        }}
      >
        M
      </div>
      {/* user + channel + time line */}
      <p
        className="absolute"
        style={{
          top: "20%",
          left: "21%",
          right: "6%",
          fontFamily: monoFont,
          fontSize: "clamp(8px, 1.6cqw, 13px)",
          letterSpacing: "0.02em",
          color: ink,
          fontWeight: 600,
        }}
      >
        Maya
        <span style={{ marginLeft: "1.2em", color: inkSoft, fontWeight: 400 }}>
          #strategy
        </span>
        <span style={{ marginLeft: "1.2em", color: inkSoft, fontWeight: 400, fontSize: "0.85em" }}>
          9:14am
        </span>
      </p>
      {/* message body */}
      <p
        className="absolute"
        style={{
          top: "38%",
          left: "21%",
          right: "6%",
          fontFamily: monoFont,
          fontSize: "clamp(9px, 1.8cqw, 15px)",
          letterSpacing: "0.01em",
          color: ink,
          lineHeight: 1.5,
          fontStyle: "italic",
        }}
      >
        "ship the version that survives a bad week,
        not the one that wins a good demo."
      </p>
      {/* reactions row */}
      <div
        className="absolute flex items-center"
        style={{
          bottom: "10%",
          left: "21%",
          gap: "3%",
        }}
      >
        <div
          className="flex items-center"
          style={{
            padding: "1.2% 3%",
            border: `1px solid ${inkSoft}`,
            borderRadius: "6px",
            background: "oklch(0.94 0.012 78)",
            opacity: 0.85,
          }}
        >
          <span
            style={{
              fontFamily: monoFont,
              fontSize: "clamp(7px, 1.4cqw, 11px)",
              letterSpacing: "0.10em",
              color: ink,
              fontWeight: 600,
            }}
          >
            +1 · 47
          </span>
        </div>
        <span
          style={{
            fontFamily: monoFont,
            fontSize: "clamp(7px, 1.3cqw, 10px)",
            letterSpacing: "0.18em",
            color: inkSoft,
            textTransform: "uppercase",
          }}
        >
          12 replies
        </span>
      </div>
      {/* small printed-from line */}
      <p
        className="absolute"
        style={{
          bottom: "4%",
          right: "6%",
          fontFamily: monoFont,
          fontSize: "clamp(5px, 1.0cqw, 8px)",
          letterSpacing: "0.22em",
          color: inkSoft,
          textTransform: "uppercase",
        }}
      >
        printed · 09:21
      </p>
    </div>
  );
}

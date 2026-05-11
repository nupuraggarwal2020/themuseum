import { ImageResponse } from "next/og";

export const alt =
  "A Museum of Notetaking · Personal. Messy. Filed but never forgotten.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Hex equivalents of the OKLCH tokens, since Satori cannot parse OKLCH. */
const C = {
  canvas: "#f3efe6",
  paper: "#faf6ed",
  ink900: "#211f1c",
  ink700: "#42403a",
  ink500: "#76726a",
  ink300: "#b3afa6",
  cherry: "#b73a2c",
};

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px",
          background: C.canvas,
          color: C.ink900,
          fontFamily: "Georgia, 'Iowan Old Style', serif",
        }}
      >
        {/* Top: case file chip + meta */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontSize: 18,
            color: C.ink500,
            fontFamily: "Menlo, monospace",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 16px",
              background: C.ink900,
              color: "#f9f4ea",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontSize: 16,
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: C.cherry,
              }}
            />
            <span>CASE FILE No. 01–04</span>
            <span style={{ color: C.ink300 }}>
              CLASSIFIED → DECLASSIFIED
            </span>
          </div>
          <span style={{ letterSpacing: "0.16em", textTransform: "uppercase" }}>
            For Granola · 2026
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          <div
            style={{
              fontSize: 132,
              lineHeight: 0.96,
              letterSpacing: "0.005em",
              textTransform: "uppercase",
              fontWeight: 400,
              maxWidth: 1040,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            <span>A&nbsp;Museum</span>
            <span>&nbsp;of&nbsp;Notetaking.</span>
          </div>
          <div
            style={{
              fontSize: 26,
              fontFamily: "Menlo, monospace",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: C.ink700,
              display: "flex",
              gap: 18,
            }}
          >
            <span>PERSONAL.</span>
            <span>MESSY.</span>
            <span style={{ color: C.cherry }}>
              FILED BUT NEVER FORGOTTEN.
            </span>
          </div>
        </div>

        {/* Footer meta */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 18,
            color: C.ink500,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            fontFamily: "Menlo, monospace",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span>ARCHIVIST · NUPUR AGGARWAL</span>
            <span>EVIDENCE · TWELVE WAYS OF NOT QUITE TAKING NOTES</span>
          </div>
          <span>museum / case 00 → 04</span>
        </div>
      </div>
    ),
    { ...size },
  );
}

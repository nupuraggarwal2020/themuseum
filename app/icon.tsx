import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#211f1c",
          fontFamily: "Menlo, monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 3,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: 999,
              background: "#b73a2c",
            }}
          />
          <span
            style={{
              fontSize: 14,
              color: "#f3efe6",
              fontWeight: 500,
              letterSpacing: "0.02em",
            }}
          >
            M
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}

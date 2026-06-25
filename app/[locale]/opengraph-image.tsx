import { ImageResponse } from "next/og";

export const alt = "Deconcept LLC — Premium Paints & Finishes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Paint-swatch accent strip — gives the share card an on-brand "colour palette" feel.
const swatches = ["#2e4a3f", "#34506b", "#7a3b2e", "#c9a24b", "#b9b2a3", "#8d6a9f"];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #2a4556 0%, #1a2820 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.72)",
            marginBottom: 24,
          }}
        >
          Premium Paints & Finishes
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 138,
            fontWeight: 700,
            letterSpacing: -2,
            lineHeight: 1,
          }}
        >
          Deconcept
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "rgba(255,255,255,0.85)",
            marginTop: 26,
          }}
        >
          Little Greene · Royal Paint · Loggia
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 48 }}>
          {swatches.map((c) => (
            <div
              key={c}
              style={{
                width: 96,
                height: 18,
                borderRadius: 9,
                background: c,
              }}
            />
          ))}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "rgba(255,255,255,0.6)",
            marginTop: 44,
          }}
        >
          Batumi, Georgia · deconcept.ge
        </div>
      </div>
    ),
    { ...size }
  );
}

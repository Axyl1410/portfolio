import { ImageResponse } from "next/og";

export const revalidate = false;

export function GET() {
  return new ImageResponse(<OGImage />, {
    width: 1200,
    height: 630,
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}

function OGImage() {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        backgroundColor: "#030401",
        padding: "80px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Top Section - Main Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "32px",
        }}
      >
        {/* Name with accent */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "72px",
              fontWeight: "500",
              color: "#fff",
              lineHeight: "1.1",
              letterSpacing: "-0.02em",
            }}
          >
            Truong Giang
          </div>
          <div
            style={{
              display: "flex",
              width: "120px",
              height: "4px",
              backgroundColor: "#ff2f00",
              borderRadius: "2px",
            }}
          />
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            fontSize: "48px",
            fontWeight: "500",
            color: "#fff",
            lineHeight: "1.2",
            maxWidth: "900px",
          }}
        >
          <span style={{ color: "#ff2f00" }}>Full-stack</span>
          <span style={{ marginLeft: "12px" }}>Developer</span>
        </div>

        {/* Description */}
        <div
          style={{
            display: "flex",
            fontSize: "28px",
            color: "#b4b4b4",
            lineHeight: "1.4",
            maxWidth: "800px",
          }}
        >
          Creative developer bridging the gap between design and technology
        </div>
      </div>

      {/* Bottom Section - Location & Email */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "24px",
            fontSize: "20px",
            color: "#666",
          }}
        >
          <div style={{ display: "flex" }}>Based in Vietnam</div>
          <div style={{ display: "flex", color: "#333" }}>•</div>
          <div style={{ display: "flex" }}>Portfolio 2025</div>
        </div>

        {/* Email Badge */}
        <div
          style={{
            display: "flex",
            padding: "12px 24px",
            border: "1px solid #333",
            borderRadius: "999px",
            fontSize: "18px",
            color: "#fff",
            fontWeight: "500",
          }}
        >
          truonggiang.axyl@gmail.com
        </div>
      </div>
    </div>
  );
}

import { ImageResponse } from "next/og";

// Quan trọng: Giữ lại runtime edge để chạy tốt trên Cloudflare
export const runtime = "edge";
export const revalidate = false;

function getCurrentYear() {
  return new Date().getFullYear();
}

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
        backgroundColor: "#030401",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        padding: "80px", // p-20 (20 * 4)
      }}
    >
      {/* Top Section - Main Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "32px", // gap-8
        }}
      >
        {/* Name with accent */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px", // gap-4
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "72px", // text-[72px]
              fontWeight: 500, // font-medium
              color: "white",
              lineHeight: 1.1, // leading-tight
              letterSpacing: "-0.02em",
            }}
          >
            Truong Giang
          </div>
          <div
            style={{
              backgroundColor: "#ff2f00",
              display: "flex",
              width: "120px",
              height: "4px", // h-1
              borderRadius: "2px", // rounded-sm
            }}
          />
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            fontSize: "48px", // text-5xl
            fontWeight: 500,
            color: "white",
            lineHeight: 1.1,
            maxWidth: "900px",
          }}
        >
          <span style={{ color: "#ff2f00" }}>Full-stack</span>
          <span style={{ marginLeft: "12px" }}>Developer</span> {/* ml-3 */}
        </div>

        {/* Description */}
        <div
          style={{
            color: "#b4b4b4",
            display: "flex",
            fontSize: "30px", // text-3xl
            lineHeight: 1.6, // leading-relaxed
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
            color: "#666",
            display: "flex",
            gap: "24px", // gap-6
            fontSize: "20px", // text-xl
          }}
        >
          <div style={{ display: "flex" }}>Based in Vietnam</div>
          <div style={{ color: "#333", display: "flex" }}>•</div>
          <div style={{ display: "flex" }}>Portfolio {getCurrentYear()}</div>
        </div>

        {/* Email Badge */}
        <div
          style={{
            border: "1px solid #333",
            display: "flex",
            padding: "12px 24px", // py-3 px-6
            borderRadius: "9999px", // rounded-full
            fontSize: "18px", // text-lg
            color: "white",
            fontWeight: 500,
          }}
        >
          truonggiang.axyl@gmail.com
        </div>
      </div>
    </div>
  );
}

import { ImageResponse } from "@takumi-rs/image-response";

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
      }}
      tw="w-full h-full flex flex-col items-start justify-between p-20"
    >
      {/* Top Section - Main Content */}
      <div tw="flex flex-col gap-8">
        {/* Name with accent */}
        <div tw="flex flex-col gap-4">
          <div
            style={{ letterSpacing: "-0.02em" }}
            tw="flex text-[72px] font-medium text-white leading-tight"
          >
            Truong Giang
          </div>
          <div
            style={{ backgroundColor: "#ff2f00" }}
            tw="flex w-[120px] h-1 rounded-sm"
          />
        </div>

        {/* Title */}
        <div tw="flex text-5xl font-medium text-white leading-tight max-w-[900px]">
          <span style={{ color: "#ff2f00" }}>Full-stack</span>
          <span tw="ml-3">Developer</span>
        </div>

        {/* Description */}
        <div
          style={{ color: "#b4b4b4" }}
          tw="flex text-3xl leading-relaxed max-w-[800px]"
        >
          Creative developer bridging the gap between design and technology
        </div>
      </div>

      {/* Bottom Section - Location & Email */}
      <div tw="flex justify-between w-full items-center">
        <div style={{ color: "#666" }} tw="flex gap-6 text-xl">
          <div tw="flex">Based in Vietnam</div>
          <div style={{ color: "#333" }} tw="flex">
            •
          </div>
          <div tw="flex">Portfolio {getCurrentYear()}</div>
        </div>

        {/* Email Badge */}
        <div
          style={{ border: "1px solid #333" }}
          tw="flex px-6 py-3 rounded-full text-lg text-white font-medium"
        >
          truonggiang.axyl@gmail.com
        </div>
      </div>
    </div>
  );
}

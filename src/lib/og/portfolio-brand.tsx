import { OG_DISPLAY_FONT_FAMILY, OG_FONT_FAMILY } from "@/lib/og/og-font";

const OG_STATUS_GREEN = "#4ade80";

interface OgPortfolioBrandProps {
  logoSrc: string;
}

/** Lockup left + availability status top-right to balance the grid. */
export function OgPortfolioBrand({ logoSrc }: OgPortfolioBrandProps) {
  return (
    <div tw="flex w-full flex-row items-center justify-between">
      <div tw="flex flex-row items-center">
        {/* biome-ignore lint/performance/noImgElement: Satori OG renderer requires <img> with data URLs */}
        <img
          alt=""
          height={52}
          src={logoSrc}
          style={{ borderRadius: 12 }}
          tw="rounded-xl"
          width={52}
        />
        <p
          style={{ fontFamily: OG_DISPLAY_FONT_FAMILY, marginLeft: 12 }}
          tw="text-white text-5xl font-medium uppercase tracking-tight"
        >
          Truong Giang
        </p>
      </div>

      <div style={{ gap: 8 }} tw="flex flex-row items-center">
        <span
          style={{ color: OG_STATUS_GREEN, fontFamily: OG_FONT_FAMILY }}
          tw="text-xl"
        >
          ●
        </span>
        <span style={{ fontFamily: OG_FONT_FAMILY }} tw="text-white/60 text-xl">
          Available for work
        </span>
      </div>
    </div>
  );
}

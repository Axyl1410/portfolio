import { ImageResponse } from "next/og";
import { getOgLogoDataUrl } from "@/lib/og/get-og-logo-data-url";
import { getOgFonts } from "@/lib/og/og-font";
import { OgImageFrame, type OgPageContent } from "@/lib/og/og-image-frame";
import { SITE_OG } from "@/lib/site";

export async function createOgImageResponse(
  content: OgPageContent = SITE_OG
): Promise<ImageResponse> {
  const [fonts, logoSrc] = await Promise.all([
    getOgFonts(),
    getOgLogoDataUrl(),
  ]);

  return new ImageResponse(<OgImageFrame {...content} logoSrc={logoSrc} />, {
    width: 1200,
    height: 630,
    fonts: [...fonts],
  });
}

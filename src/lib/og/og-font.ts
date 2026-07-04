import { readFile } from "node:fs/promises";
import path from "node:path";
import { SITE_URL } from "@/lib/site";

export const OG_FONT_FAMILY = "Helvetica Neue";
export const OG_DISPLAY_FONT_FAMILY = "Opti Romana";

const FONT_FILES = {
  body: {
    publicPath: "/fonts/HelveticaNeue/HelveticaNeueMedium.otf",
    filePath: path.join(
      process.cwd(),
      "public/fonts/HelveticaNeue/HelveticaNeueMedium.otf"
    ),
    weight: 500 as const,
  },
  display: {
    publicPath: "/fonts/OPTIRomanaRoman/OPTIRomanaRoman-Normal.otf",
    filePath: path.join(
      process.cwd(),
      "public/fonts/OPTIRomanaRoman/OPTIRomanaRoman-Normal.otf"
    ),
    weight: 400 as const,
  },
} as const;

let fontDataPromise:
  | Promise<
      readonly [
        { name: string; data: ArrayBuffer; style: "normal"; weight: 500 },
        { name: string; data: ArrayBuffer; style: "normal"; weight: 400 },
      ]
    >
  | undefined;

function toArrayBuffer(buffer: Buffer): ArrayBuffer {
  const { buffer: arrayBuffer, byteOffset, byteLength } = buffer;
  return arrayBuffer.slice(byteOffset, byteOffset + byteLength) as ArrayBuffer;
}

async function loadFontFile(
  filePath: string,
  publicPath: string
): Promise<ArrayBuffer> {
  try {
    const buffer = await readFile(filePath);
    return toArrayBuffer(buffer);
  } catch {
    const response = await fetch(`${SITE_URL}${publicPath}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch OG font (${response.status})`);
    }

    return response.arrayBuffer();
  }
}

export function getOgFonts() {
  if (!fontDataPromise) {
    fontDataPromise = Promise.all([
      loadFontFile(FONT_FILES.body.filePath, FONT_FILES.body.publicPath),
      loadFontFile(FONT_FILES.display.filePath, FONT_FILES.display.publicPath),
    ]).then(([body, display]) => [
      {
        name: OG_FONT_FAMILY,
        data: body,
        style: "normal" as const,
        weight: FONT_FILES.body.weight,
      },
      {
        name: OG_DISPLAY_FONT_FAMILY,
        data: display,
        style: "normal" as const,
        weight: FONT_FILES.display.weight,
      },
    ]);
  }

  return fontDataPromise;
}

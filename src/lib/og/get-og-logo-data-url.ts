import { readFile } from "node:fs/promises";
import path from "node:path";
import { SITE_URL } from "@/lib/site";

function getFaviconCandidatePaths(): string[] {
  return [
    path.join(/* turbopackIgnore: true */ process.cwd(), "src/app/favicon.ico"),
    path.join(/* turbopackIgnore: true */ process.cwd(), "app/favicon.ico"),
    path.join(/* turbopackIgnore: true */ process.cwd(), "public/favicon.ico"),
  ];
}

let logoDataUrlPromise: Promise<string> | undefined;

function getLogoMimeType(buffer: Buffer): string {
  if (
    buffer.length >= 4 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "image/png";
  }

  return "image/x-icon";
}

async function readFaviconBuffer(): Promise<Buffer> {
  for (const filePath of getFaviconCandidatePaths()) {
    try {
      return await readFile(filePath);
    } catch {
      // try next path
    }
  }

  const response = await fetch(`${SITE_URL}/favicon.ico`);

  if (!response.ok) {
    throw new Error(`Failed to load favicon for OG image (${response.status})`);
  }

  return Buffer.from(await response.arrayBuffer());
}

/** Inline favicon for Satori — same-origin fetches are unreliable in `next/og`. */
export function getOgLogoDataUrl(): Promise<string> {
  if (!logoDataUrlPromise) {
    logoDataUrlPromise = readFaviconBuffer().then((buffer) => {
      const mimeType = getLogoMimeType(buffer);
      return `data:${mimeType};base64,${buffer.toString("base64")}`;
    });
  }

  return logoDataUrlPromise;
}

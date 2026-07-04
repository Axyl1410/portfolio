import { createOgImageResponse } from "@/lib/og/create-og-image-response";

export const revalidate = false;

export async function GET() {
  const response = await createOgImageResponse();

  return new Response(response.body, {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": "image/png",
    },
  });
}

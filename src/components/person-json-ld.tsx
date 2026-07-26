import { personJsonLd } from "@/lib/person-json-ld";

export function PersonJsonLd() {
  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires raw script injection
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      type="application/ld+json"
    />
  );
}

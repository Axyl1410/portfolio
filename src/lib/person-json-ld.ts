import { SITE_URL } from "@/lib/site";

export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Truong Giang",
  alternateName: "Axyl",
  url: SITE_URL,
  jobTitle: "Full-Stack Developer",
  description:
    "Creative developer bridging the gap between design and technology.",
  sameAs: [
    "https://github.com/axyl1410",
    "https://x.com/axyl1410",
    "https://ui.soralabs.io.vn",
  ],
} as const;

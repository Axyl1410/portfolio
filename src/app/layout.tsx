import type { Metadata } from "next";
import Script from "next/script";
import { ViewTransitions } from "next-view-transitions";
import "./globals.css";
import PageWrapper from "@/components/layout/page-wrapper";
import {
  INTRO_LOADER_SESSION_KEY,
  INTRO_PENDING_CLASS,
} from "@/lib/intro-loader";

const introPendingScript = `(() => {
  try {
  if (sessionStorage.getItem("${INTRO_LOADER_SESSION_KEY}") !== "true") {
    document.documentElement.classList.add("${INTRO_PENDING_CLASS}");
  }
  } catch {}
})();`;

export const metadata: Metadata = {
  title: {
    default: "Truong Giang — Freelance Software Engineer",
    template: "%s — Truong Giang",
  },
  description:
    "Creative developer bridging the gap between design and technology. Services cover interactive frontend, creative coding, UI animation, web performance, mobile apps, prototyping, and technical direction.",
  openGraph: {
    title: "Truong Giang — Full-stack Developer",
    description:
      "Creative developer bridging the gap between design and technology",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "Truong Giang Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Truong Giang — Full-stack Developer",
    description:
      "Creative developer bridging the gap between design and technology",
    images: ["/og"],
  },
  metadataBase: new URL("https://nguyentruonggiang.id.vn"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <head>
          <Script id="intro-pending" strategy="beforeInteractive">
            {introPendingScript}
          </Script>
          <link
            fetchPriority="high"
            href="https://fonts.cdnfonts.com/css/pp-neue-montreal"
            rel="stylesheet"
          />
        </head>
        <body className="antialiased">
          <PageWrapper>{children}</PageWrapper>
        </body>
      </html>
    </ViewTransitions>
  );
}

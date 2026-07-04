import type { Metadata } from "next";
import { ViewTransitions } from "next-view-transitions";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { helveticaNeue, optiRomanaRoman } from "@/lib/fonts";
import { SITE_URL } from "@/lib/site";

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
  metadataBase: new URL(SITE_URL),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html
        className={`${helveticaNeue.variable} ${optiRomanaRoman.variable}`}
        lang="en"
        suppressHydrationWarning
      >
        <head />
        <body className="antialiased">
          <ThemeProvider>{children}</ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}

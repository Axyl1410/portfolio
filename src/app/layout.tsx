import type { Metadata } from "next";
import { ViewTransitions } from "next-view-transitions";
import "./globals.css";
import PageWrapper from "@/components/layout/page-wrapper";
import Menu from "@/components/menu/menu";
import Nav from "@/components/nav/nav";

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
          <link
            fetchPriority="high"
            href="https://fonts.cdnfonts.com/css/pp-neue-montreal"
            rel="stylesheet"
          />
        </head>
        <body className="antialiased">
          <PageWrapper>
            <div className="u-container u-gap flex min-h-screen flex-col">
              <Nav />
              <main className="flex flex-1 flex-col">{children}</main>
              <Menu />
            </div>
          </PageWrapper>
        </body>
      </html>
    </ViewTransitions>
  );
}

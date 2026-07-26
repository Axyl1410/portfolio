import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Works",
  description:
    "Projects built by Truong Giang, including Sora UI — a free, motion-first React component registry — and Sora Type, a browser-based font inspector.",
  alternates: {
    canonical: "/works",
  },
};

export default function WorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

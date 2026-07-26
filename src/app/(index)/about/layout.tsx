import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Truong Giang (Axyl) — full-stack developer building Sora UI and other side projects, with work referenced on GitHub and X.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

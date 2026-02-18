"use client";

import {
  NameSection,
  SitemapSection,
  SocialsSection,
  StatusSection,
} from "./nav-sections";

export default function Nav() {
  return (
    <nav className="u-gap relative flex w-full flex-wrap items-center justify-between py-[calc(var(--row-gap)-0.15em)]">
      <NameSection />
      <StatusSection />
      <SitemapSection />
      <SocialsSection />
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-px origin-left bg-(--color-border)" />
    </nav>
  );
}

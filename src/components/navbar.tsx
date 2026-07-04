"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSettings } from "@/components/settings/settings-context";
import {
  Highlight,
  HighlightItem,
} from "@/components/sora-ui/effects/highlight";
import { isTypingTarget } from "@/lib/is-typing-target";

const navLinkBaseClass =
  "relative z-10 flex items-center justify-center gap-1 rounded-xl p-2 capitalize transition-all ease-in-out active:scale-95";

const navItems = [
  {
    label: "home",
    href: "/?preLoad=false",
    shortcut: "H",
    match: (path: string) => path === "/",
  },
  {
    label: "about",
    href: "/about",
    shortcut: "A",
    match: (path: string) => path === "/about",
  },
  {
    label: "works",
    href: "/works",
    shortcut: "W",
    match: (path: string) => path === "/works",
  },
  {
    label: "contact",
    href: "/contact",
    shortcut: "C",
    match: (path: string) => path === "/contact",
  },
] as const;

function navLinkClass(isActive: boolean) {
  if (isActive) {
    return `${navLinkBaseClass} opacity-100 hover:opacity-100`;
  }

  return `${navLinkBaseClass} opacity-30 hover:opacity-55`;
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { settings } = useSettings();
  const showShortcuts = settings.showShortcuts;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      if (isTypingTarget(event.target)) {
        return;
      }

      const item = navItems.find(
        ({ shortcut }) => shortcut.toLowerCase() === event.key.toLowerCase()
      );
      if (!item) {
        return;
      }

      event.preventDefault();
      router.push(item.href);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  return (
    <nav className="fixed top-5 left-1/2 z-20 -translate-x-1/2 text-sm tracking-tight">
      <Highlight
        className="rounded-xl bg-muted"
        containerClassName="flex items-center justify-center"
        exitDelay={80}
        mode="parent"
        trigger="hover"
      >
        {navItems.map(({ label, href, shortcut, match }) => {
          const isActive = match(pathname);

          return (
            <HighlightItem asChild key={href} value={label}>
              <Link className={navLinkClass(isActive)} href={href}>
                {label}
                {showShortcuts ? (
                  <>
                    {" "}
                    <span className="hidden size-4 items-center justify-center rounded-sm border bg-background text-xs md:flex">
                      {shortcut}
                    </span>
                  </>
                ) : null}
              </Link>
            </HighlightItem>
          );
        })}
      </Highlight>
    </nav>
  );
}

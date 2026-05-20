"use client";

import { usePathname } from "next/navigation";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap-client";
import { INTRO_LOADER_SESSION_KEY } from "@/lib/intro-loader";
import { prefersReducedMotion } from "@/utils/motion";
import {
  NameSection,
  SitemapSection,
  SocialsSection,
  StatusSection,
} from "./nav-sections";

export default function Nav() {
  const navRef = useRef<HTMLElement | null>(null);
  const hasAnimatedRef = useRef(false);
  const nameRef = useRef<HTMLDivElement | null>(null);
  const statusRef = useRef<HTMLDivElement | null>(null);
  const sitemapRef = useRef<HTMLDivElement | null>(null);
  const socialsRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const { contextSafe } = useGSAP({ scope: navRef });

  const runAnimation = (delay = 0) => {
    if (!navRef.current || hasAnimatedRef.current) {
      return;
    }

    hasAnimatedRef.current = true;

    if (prefersReducedMotion()) {
      gsap.set(navRef.current, { opacity: 1, visibility: "visible" });
      return;
    }

    gsap.set(navRef.current, { opacity: 1, visibility: "visible" });

    const items = [
      nameRef.current,
      statusRef.current,
      sitemapRef.current,
      socialsRef.current,
    ].filter((item): item is HTMLDivElement => Boolean(item));

    gsap.set(items, { willChange: "transform, opacity" });
    if (lineRef.current) {
      gsap.set(lineRef.current, { willChange: "transform, opacity" });
    }

    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      delay,
    });

    if (lineRef.current) {
      tl.fromTo(
        lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.5, transformOrigin: "left" }
      );
    }

    if (items.length) {
      tl.from(
        items,
        {
          y: 20,
          opacity: 0,
          duration: 1.5,
          stagger: 0.1,
        },
        "<"
      );
    }

    tl.eventCallback("onComplete", () => {
      gsap.set(items, { clearProps: "willChange" });
      if (lineRef.current) {
        gsap.set(lineRef.current, { clearProps: "willChange" });
      }
    });
  };

  useGSAP(
    () => {
      const isHome = pathname === "/";
      const loaderPlayed =
        typeof window !== "undefined"
          ? sessionStorage.getItem(INTRO_LOADER_SESSION_KEY)
          : null;

      // Allow entrance animation again on each route; revertOnUpdate can leave
      // opacity stuck if we never reset this.
      hasAnimatedRef.current = false;

      // Restore nav when leaving home mid-intro (loader had set opacity 0).
      if (!(isHome && !loaderPlayed) && navRef.current) {
        gsap.set(navRef.current, { opacity: 1, visibility: "visible" });
      }

      const runAnimationSafe = contextSafe((delay = 0) => {
        runAnimation(delay);
      });

      if (isHome && !loaderPlayed) {
        if (typeof window !== "undefined") {
          const handler = () => {
            runAnimationSafe(0);
          };
          window.addEventListener("home-intro-complete", handler, {
            once: true,
          });
          return () => {
            window.removeEventListener("home-intro-complete", handler);
          };
        }
        return;
      }

      runAnimationSafe(1);
    },
    { scope: navRef, dependencies: [pathname], revertOnUpdate: true }
  );

  return (
    <nav
      className="u-gap relative flex w-full flex-wrap items-center justify-between py-[calc(var(--row-gap)-0.15em)]"
      ref={navRef}
    >
      <div ref={nameRef}>
        <NameSection />
      </div>
      <div ref={statusRef}>
        <StatusSection />
      </div>
      <div className="max-[860px]:hidden" ref={sitemapRef}>
        <SitemapSection />
      </div>
      <div className="max-[860px]:hidden" ref={socialsRef}>
        <SocialsSection />
      </div>
      <div
        className="pointer-events-none absolute right-0 bottom-0 left-0 h-px origin-left bg-(--color-border)"
        ref={lineRef}
      />
    </nav>
  );
}

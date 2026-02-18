"use client";

import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { NameSection, StatusSection } from "@/components/nav/nav-sections";
import { gsap, useGSAP } from "@/lib/gsap-client";
import { INTRO_LOADER_SESSION_KEY } from "@/lib/intro-loader";

function MenuOverlayContent() {
  return (
    <nav className="u-gap relative flex w-full flex-wrap items-center justify-between py-[calc(var(--row-gap)-0.15em)]">
      <NameSection variant="light" />
      <StatusSection variant="light" />
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-px origin-left bg-(--color-border)" />
    </nav>
  );
}

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuOverlayRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuTextRef = useRef<HTMLSpanElement>(null);
  const closeTextRef = useRef<HTMLSpanElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const pathname = usePathname();

  // Animation for menu button fade-in (same as page)
  useGSAP(
    () => {
      const button = buttonRef.current;
      if (!button) {
        return;
      }

      const isHome = pathname === "/";
      const loaderPlayed = sessionStorage.getItem(INTRO_LOADER_SESSION_KEY);

      // On home with loader not yet played: keep hidden,
      // the loader in home-intro-loader.tsx handles revealing it
      if (isHome && !loaderPlayed) {
        gsap.set(button, { opacity: 0 });
        return;
      }

      // Normal page transition fade-in (same timing as page)
      gsap.fromTo(button, { opacity: 0 }, { opacity: 1, delay: 1 });
    },
    { dependencies: [pathname], revertOnUpdate: true }
  );

  useGSAP(() => {
    const overlay = menuOverlayRef.current;
    const button = buttonRef.current;
    const menuText = menuTextRef.current;
    const closeText = closeTextRef.current;

    if (!(overlay && button && menuText && closeText)) {
      return;
    }

    // All links inside the overlay menu
    const links = overlay.querySelectorAll("a");

    tl.current = gsap.timeline({
      paused: true,
      onReverseComplete: () => {
        gsap.set(overlay, { display: "none", opacity: 0 });
      },
    });

    tl.current
      .set(overlay, { display: "block", opacity: 0 })
      .fromTo(
        overlay,
        { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 0.8,
          ease: "power3.inOut",
        },
        0
      )
      // Fade in the whole overlay slightly after the clipPath begins
      .to(
        overlay,
        {
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        },
        0.1
      )
      // Staggered fade / slide for individual links
      .from(
        links,
        {
          opacity: 0,
          y: 8,
          duration: 0.4,
          ease: "power2.out",
          stagger: 0.05,
        },
        0.2
      )
      .to(menuText, { y: "-100%", duration: 0.5, ease: "power3.inOut" }, 0)
      .to(closeText, { y: "0%", duration: 0.5, ease: "power3.inOut" }, 0);
  }, []);

  useGSAP(() => {
    if (isOpen) {
      tl.current?.play();
    } else {
      tl.current?.reverse();
    }
  }, [isOpen]);

  return (
    <>
      <button
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className="u-menu absolute right-0 bottom-0 z-50 cursor-pointer rounded-full border border-current bg-white font-medium text-current transition-none"
        onClick={() => setIsOpen((prev) => !prev)}
        ref={buttonRef}
        style={{ opacity: 0 }}
        type="button"
      >
        <div className="relative h-6 w-12 overflow-hidden">
          <span
            className="absolute top-0 left-0 flex h-full w-full items-center justify-center"
            ref={menuTextRef}
          >
            Menu
          </span>
          <span
            className="absolute top-0 left-0 flex h-full w-full translate-y-full items-center justify-center"
            ref={closeTextRef}
          >
            Close
          </span>
        </div>
      </button>

      <div
        aria-hidden={!isOpen}
        className="u-menu-overlay u-container fixed inset-0 z-40 hidden bg-black"
        ref={menuOverlayRef}
      >
        <MenuOverlayContent />
      </div>
    </>
  );
}

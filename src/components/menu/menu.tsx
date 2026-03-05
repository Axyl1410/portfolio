"use client";

import { usePathname } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";
import { useRef, useState } from "react";
import {
  type MenuLinkClickHandler,
  MenuOverlayContent,
} from "@/components/menu/menu-overlay-content";
import { gsap, useGSAP } from "@/lib/gsap-client";
import { INTRO_LOADER_SESSION_KEY } from "@/lib/intro-loader";
import { pageAnimationFromMenu } from "@/utils/page-animation";

export default function Menu() {
  const pathname = usePathname();
  const router = useTransitionRouter();
  const [isOpen, setIsOpen] = useState(false);

  const menuOverlayRef = useRef<HTMLDivElement>(null);
  const whiteOverlayRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuTextRef = useRef<HTMLSpanElement>(null);
  const closeTextRef = useRef<HTMLSpanElement>(null);
  const overlayTlRef = useRef<gsap.core.Timeline | null>(null);
  const pendingUrlRef = useRef<string | null>(null);

  const handleLinkClick: MenuLinkClickHandler = (event, url) => {
    event.preventDefault();

    if (pathname === url) {
      setIsOpen(false);
      return;
    }

    const white = whiteOverlayRef.current;
    if (!white) {
      return;
    }

    pendingUrlRef.current = url;
    gsap.set(white, {
      display: "block",
      pointerEvents: "auto",
      clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
    });

    gsap.to(white, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 0.75,
      ease: "power3.inOut",
      onComplete: () => {
        const menu = menuOverlayRef.current;
        if (menu) {
          gsap.set(menu, { display: "none", opacity: 0 });
        }

        const target = pendingUrlRef.current;
        pendingUrlRef.current = null;
        setIsOpen(false);

        if (!target) {
          return;
        }
        if (target.startsWith("http") || target.startsWith("mailto:")) {
          window.location.href = target;
        } else {
          router.push(target, { onTransitionReady: pageAnimationFromMenu });
        }
      },
    });
  };

  useGSAP(
    () => {
      const button = buttonRef.current;
      if (!button) {
        return;
      }

      const isHome = pathname === "/";
      const loaderPlayed = sessionStorage.getItem(INTRO_LOADER_SESSION_KEY);

      if (isHome && !loaderPlayed) {
        gsap.set(button, { opacity: 0 });
        return;
      }

      gsap.fromTo(button, { opacity: 0 }, { opacity: 1, delay: 1 });
    },
    { dependencies: [pathname], revertOnUpdate: true }
  );

  useGSAP(() => {
    const overlay = menuOverlayRef.current;
    const button = buttonRef.current;
    const menuText = menuTextRef.current;
    const closeText = closeTextRef.current;
    const refsReady = overlay && button && menuText && closeText;
    if (!refsReady) {
      return;
    }

    overlayTlRef.current = gsap
      .timeline({
        paused: true,
        onReverseComplete: () => {
          gsap.set(overlay, { display: "none", opacity: 0 });
        },
      })
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
      .to(overlay, { opacity: 1, duration: 0.4, ease: "power2.out" }, 0.1)
      .to(menuText, { y: "-100%", duration: 0.5, ease: "power3.inOut" }, 0)
      .to(closeText, { y: "0%", duration: 0.5, ease: "power3.inOut" }, 0);
  }, []);

  useGSAP(() => {
    if (isOpen) {
      overlayTlRef.current?.play();
    } else {
      overlayTlRef.current?.reverse();
    }
  }, [isOpen]);

  useGSAP(() => {
    const white = whiteOverlayRef.current;
    if (!white) {
      return;
    }
    gsap.set(white, {
      display: "none",
      pointerEvents: "none",
      clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
    });
  }, [pathname]);

  return (
    <>
      <button
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className="u-menu fixed right-0 bottom-0 z-50 cursor-pointer rounded-full border border-current bg-white font-medium text-current transition-none"
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
        <MenuOverlayContent onLinkClick={handleLinkClick} />
      </div>

      <div
        aria-hidden
        className="u-menu-nav-overlay pointer-events-none fixed inset-0 z-55 hidden bg-white"
        ref={whiteOverlayRef}
        style={{ clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" }}
      />
    </>
  );
}

"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap-client";
import { INTRO_LOADER_SESSION_KEY } from "@/lib/intro-loader";

interface HomeIntroLoaderProps {
  contentRef: React.RefObject<HTMLDivElement | null>;
  imageSrc?: string;
  imageAlt?: string;
}

export default function HomeIntroLoader({
  contentRef,
  imageSrc = "/idk.jpg",
  imageAlt = "Loading image",
}: HomeIntroLoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const loaderEl = loaderRef.current;
    const contentEl = contentRef.current;
    const navEl = document.querySelector<HTMLElement>("nav");

    if (!(loaderEl && contentEl)) {
      return;
    }

    const hasPlayed = sessionStorage.getItem(INTRO_LOADER_SESSION_KEY);

    if (hasPlayed) {
      gsap.set(contentEl, { opacity: 1 });
      if (navEl) {
        gsap.set(navEl, { opacity: 1 });
      }
      return;
    }

    if (navEl) {
      // Hide nav and content
      gsap.set(navEl, { opacity: 0 });
    }
    gsap.set(contentEl, { opacity: 0 });

    // Measure final CSS position (with CSS transform applied)
    const finalRect = loaderEl.getBoundingClientRect();

    // Measure base position (without CSS transform) to isolate the transform offset
    loaderEl.style.transform = "none";
    const baseRect = loaderEl.getBoundingClientRect();
    loaderEl.style.removeProperty("transform");

    // The CSS transform moves the element by this delta
    const cssOffsetX = finalRect.left - baseRect.left;
    const cssOffsetY = finalRect.top - baseRect.top;

    // Calculate delta from CSS final position to viewport center
    const toCenterX =
      (window.innerWidth - finalRect.width) / 2 - finalRect.left;
    const toCenterY =
      (window.innerHeight - finalRect.height) / 2 - finalRect.top;

    // Start at center: CSS transform offset + center delta
    gsap.set(loaderEl, {
      x: cssOffsetX + toCenterX,
      y: cssOffsetY + toCenterY,
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
    });

    const tl = gsap.timeline();

    tl.to(loaderEl, {
      duration: 0.5,
    });

    // Step 1: Clip-path reveal from top to bottom
    tl.to(loaderEl, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 1,
      ease: "power3.inOut",
    });

    // Step 2: Hold for 1 seconds
    tl.to(loaderEl, {
      duration: 1,
    });

    // Step 3: Fly back to CSS position (x/y = CSS offset = exact match)
    tl.to(loaderEl, {
      x: cssOffsetX,
      y: cssOffsetY,
      duration: 1.2,
      ease: "power3.inOut",
      onComplete: () => {
        gsap.set(loaderEl, { clearProps: "all" });
        document.body.style.background = "black";
        sessionStorage.setItem(INTRO_LOADER_SESSION_KEY, "true");
      },
    });

    // Step 4: Reveal nav + content at the same time
    tl.addLabel("reveal");

    const revealTargets = [navEl, contentEl].filter((el): el is HTMLElement =>
      Boolean(el)
    );

    tl.to(
      revealTargets,
      {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
      },
      "reveal"
    );
  });

  return (
    <div className="u-loader-image" ref={loaderRef}>
      <Image
        alt={imageAlt}
        className="object-cover"
        draggable={false}
        fill
        src={imageSrc}
      />
    </div>
  );
}

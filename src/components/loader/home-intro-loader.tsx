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

function setElementsVisible(elements: (HTMLElement | null)[], opacity: number) {
  for (const el of elements) {
    if (el) {
      gsap.set(el, { opacity });
    }
  }
}

function getLoaderPositions(loaderEl: HTMLDivElement) {
  const finalRect = loaderEl.getBoundingClientRect();
  loaderEl.style.transform = "none";
  const baseRect = loaderEl.getBoundingClientRect();
  loaderEl.style.removeProperty("transform");

  const cssOffsetX = finalRect.left - baseRect.left;
  const cssOffsetY = finalRect.top - baseRect.top;

  const toCenterX = (window.innerWidth - finalRect.width) / 2 - finalRect.left;
  const toCenterY = (window.innerHeight - finalRect.height) / 2 - finalRect.top;

  return {
    cssOffsetX,
    cssOffsetY,
    toCenterX,
    toCenterY,
  };
}

function createLoaderTimeline(
  loaderEl: HTMLDivElement,
  positions: ReturnType<typeof getLoaderPositions>,
  revealTargets: HTMLElement[],
  textEl: HTMLDivElement | null
) {
  const tl = gsap.timeline();

  tl.to(loaderEl, { duration: 0.5 })
    .to(loaderEl, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 1,
      ease: "power3.inOut",
    })
    .to(loaderEl, { duration: 1 })
    .to(loaderEl, {
      x: positions.cssOffsetX,
      y: positions.cssOffsetY,
      scale: 1,
      duration: 1.2,
      ease: "power3.inOut",
      onComplete: () => {
        gsap.set(loaderEl, { clearProps: "all" });
        document.body.style.background = "black";
        sessionStorage.setItem(INTRO_LOADER_SESSION_KEY, "true");
      },
    });

  tl.addLabel("reveal");
  tl.to(
    revealTargets,
    {
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
    },
    "reveal"
  );

  if (textEl) {
    tl.to(
      textEl,
      {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
      },
      "reveal"
    );
  }

  return tl;
}

function initializeLoader(
  loaderEl: HTMLDivElement,
  contentEl: HTMLDivElement,
  textEl: HTMLDivElement | null
) {
  const navEl = document.querySelector<HTMLElement>("nav");
  const menuButtonEl = document.querySelector<HTMLButtonElement>(".u-menu");
  const hasPlayed = sessionStorage.getItem(INTRO_LOADER_SESSION_KEY);

  if (hasPlayed) {
    setElementsVisible([contentEl, navEl, menuButtonEl, textEl], 1);
    document.body.style.background = "black";
    return;
  }

  setElementsVisible([navEl, menuButtonEl, contentEl, textEl], 0);

  const positions = getLoaderPositions(loaderEl);
  gsap.set(loaderEl, {
    x: positions.cssOffsetX + positions.toCenterX,
    y: positions.cssOffsetY + positions.toCenterY,
    scale: 0.8,
    clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
  });

  const revealTargets = [navEl, menuButtonEl, contentEl].filter(
    (el): el is HTMLElement => Boolean(el)
  );

  createLoaderTimeline(loaderEl, positions, revealTargets, textEl);
}

export default function HomeIntroLoader({
  contentRef,
  imageSrc = "/images/idk.jpg",
  imageAlt = "Loading image",
}: HomeIntroLoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const loaderEl = loaderRef.current;
    const contentEl = contentRef.current;
    const textEl = textRef.current;

    if (loaderEl && contentEl) {
      initializeLoader(loaderEl, contentEl, textEl);
    }
  });

  return (
    <div className="u-loader-image" ref={loaderRef}>
      <div className="u-meta u-meta-hidden text-left" ref={textRef}>
        Use menu to explore
      </div>

      <div className="u-loader-image-inner">
        <Image
          alt={imageAlt}
          className="object-cover"
          draggable={false}
          fill
          src={imageSrc}
        />
      </div>
    </div>
  );
}

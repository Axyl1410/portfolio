"use client";

import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";
import type React from "react";
import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap-client";
import { INTRO_LOADER_SESSION_KEY } from "@/lib/intro-loader";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/utils/motion";

type SplitWordsOnScrollProps = React.HTMLAttributes<HTMLDivElement> & {
  delay?: number;
  start?: string;
  end?: string;
  waitForIntro?: boolean;
};

function SplitWordsOnScroll({
  className,
  children,
  delay = 0,
  start = "top 85%",
  end = "bottom 60%",
  waitForIntro = false,
  ...props
}: SplitWordsOnScrollProps) {
  const container = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const el = container.current;
      if (!el) {
        return;
      }

      if (prefersReducedMotion()) {
        return;
      }

      // Normalize line-height so SplitText measurements match the visual glyph height
      gsap.set(el, { lineHeight: "1em" });

      const split = new SplitText(el, {
        type: "words",
        wordsClass: "u-split-word",
      });
      const words = split.words ?? [];
      if (!words.length) {
        return;
      }

      const innerWords: HTMLElement[] = [];
      for (const word of words) {
        // Ensure each word wrapper behaves like a tight mask around the text
        gsap.set(word, {
          overflow: "hidden",
          display: "inline-block",
          verticalAlign: "top",
        });

        const inner = document.createElement("div");
        inner.className = "u-split-word-inner";
        while (word.firstChild) {
          inner.appendChild(word.firstChild);
        }
        word.appendChild(inner);
        innerWords.push(inner);
      }

      const loaderPlayed =
        typeof window !== "undefined"
          ? sessionStorage.getItem(INTRO_LOADER_SESSION_KEY)
          : null;

      if (waitForIntro) {
        runIntroAwareAnimation(innerWords, split, !!loaderPlayed);
        return;
      }

      runScrollAnimation(innerWords, split, el, {
        delay,
        start,
        end,
      });
    },
    { scope: container }
  );

  return (
    <div className={cn(className)} ref={container} {...props}>
      {children}
    </div>
  );
}

function runIntroAwareAnimation(
  innerWords: HTMLElement[],
  split: SplitText,
  loaderPlayed: boolean
) {
  const effectiveDelay = loaderPlayed ? 0.8 : 0;

  const tween = gsap.fromTo(
    innerWords,
    {
      y: 100,
      rotationZ: 12,
    },
    {
      y: 0,
      rotationZ: 0,
      duration: 0.75,
      ease: "power3.out",
      stagger: 0.08,
      delay: effectiveDelay,
      paused: true,
    }
  );

  if (loaderPlayed) {
    tween.play();
    return () => {
      split.revert();
    };
  }

  if (typeof window === "undefined") {
    split.revert();
    return;
  }

  const handler = () => {
    tween.play();
  };
  window.addEventListener("home-intro-complete", handler, {
    once: true,
  });

  return () => {
    window.removeEventListener("home-intro-complete", handler);
    split.revert();
  };
}

function runScrollAnimation(
  innerWords: HTMLElement[],
  split: SplitText,
  el: HTMLDivElement,
  opts: { delay: number; start: string; end: string }
) {
  const tween = gsap.fromTo(
    innerWords,
    {
      y: 24,
      rotationZ: 12,
    },
    {
      y: 0,
      rotationZ: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.08,
      delay: opts.delay,
      scrollTrigger: {
        trigger: el,
        start: opts.start,
        end: opts.end,
        once: true,
      } as ScrollTriggerType["vars"],
    }
  );

  return () => {
    split.revert();
    tween.scrollTrigger?.kill();
  };
}

export { SplitWordsOnScroll };

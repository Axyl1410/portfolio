"use client";

import type React from "react";
import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap-client";
import { INTRO_LOADER_SESSION_KEY } from "@/lib/intro-loader";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/utils/motion";

type SplitVariant = "lines" | "words" | "chars";

const splitConfig: Record<SplitVariant, { duration: number; stagger: number }> =
  {
    lines: { duration: 0.8, stagger: 0.08 },
    words: { duration: 0.6, stagger: 0.06 },
    chars: { duration: 0.4, stagger: 0.01 },
  };

const typesToSplit: Record<SplitVariant, string> = {
  lines: "lines",
  words: "lines,words",
  chars: "lines,words,chars",
};

type MaskedTextRevealProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: SplitVariant;
  delay?: number;
  start?: string;
  waitForIntro?: boolean;
};

function createIntroTween(
  targets: Element[],
  loaderPlayed: boolean,
  introPlayedRef: React.MutableRefObject<boolean>,
  introHandlerRef: { current: (() => void) | null }
) {
  const effectiveDelay = loaderPlayed ? 0.8 : 0;
  const tween = gsap.from(targets, {
    yPercent: 110,
    duration: 0.8,
    ease: "power4.out",
    stagger: 0.08,
    delay: effectiveDelay,
    paused: true,
    onComplete() {
      introPlayedRef.current = true;
    },
  });

  if (loaderPlayed) {
    tween.play();
  } else {
    if (introHandlerRef.current) {
      window.removeEventListener(
        "home-intro-complete",
        introHandlerRef.current
      );
    }
    introHandlerRef.current = () => tween.play();
    window.addEventListener("home-intro-complete", introHandlerRef.current, {
      once: true,
    });
  }

  return tween;
}

function MaskedTextReveal({
  className,
  children,
  variant = "words",
  delay = 0,
  start = "top 85%",
  waitForIntro = false,
  ...props
}: MaskedTextRevealProps) {
  const container = useRef<HTMLDivElement | null>(null);
  const introPlayed = useRef(false);
  const introHandlerRef = useRef<(() => void) | null>(null);

  useGSAP(
    () => {
      const el = container.current;
      if (!el || prefersReducedMotion()) {
        return;
      }

      const loaderPlayed = !!sessionStorage.getItem(INTRO_LOADER_SESSION_KEY);
      const config = splitConfig[variant];

      const split = SplitText.create(el, {
        type: typesToSplit[variant],
        autoSplit: true,
        mask: "lines",
        linesClass: "line",
        wordsClass: "word",
        charsClass: "char",
        onSplit(self: SplitText) {
          const targets = self[variant] as Element[];

          if (waitForIntro) {
            if (introPlayed.current) {
              gsap.set(targets, { yPercent: 0 });
              return;
            }
            return createIntroTween(
              targets,
              loaderPlayed,
              introPlayed,
              introHandlerRef
            );
          }

          return gsap.from(targets, {
            yPercent: 110,
            duration: config.duration,
            ease: "expo.out",
            stagger: config.stagger,
            delay,
            scrollTrigger: {
              trigger: el,
              start: `clamp(${start})`,
              once: true,
            },
          });
        },
      });

      return () => {
        if (introHandlerRef.current) {
          window.removeEventListener(
            "home-intro-complete",
            introHandlerRef.current
          );
          introHandlerRef.current = null;
        }
        split.revert();
      };
    },
    {
      scope: container,
      dependencies: [variant, delay, start, waitForIntro],
      revertOnUpdate: true,
    }
  );

  return (
    <div className={cn(className)} ref={container} {...props}>
      {children}
    </div>
  );
}

const SplitWordsOnScroll = MaskedTextReveal;

export { MaskedTextReveal, SplitWordsOnScroll };
export type { MaskedTextRevealProps, SplitVariant };

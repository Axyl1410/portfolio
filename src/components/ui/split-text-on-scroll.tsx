"use client";

import type React from "react";
import { useRef } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap-client";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/utils/motion";

type SplitTextOnScrollProps = React.HTMLAttributes<HTMLDivElement> & {
  delay?: number;
  start?: string;
};

function SplitTextOnScroll({
  className,
  children,
  delay = 0,
  start = "top 85%",
  ...props
}: SplitTextOnScrollProps) {
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

      const split = new SplitText(el, { type: "chars" });
      if (!split.chars?.length) {
        split.revert();
        return;
      }

      gsap.set(split.chars, { willChange: "transform, opacity" });

      const tween = gsap.to(split.chars, {
        keyframes: [
          { x: 20, autoAlpha: 0, duration: 0.2, ease: "power2.in" },
          { x: -20, duration: 0 },
          { x: 0, autoAlpha: 1, duration: 0.2, ease: "power2.out" },
        ],
        stagger: {
          each: 0.05,
          from: "random",
        },
        paused: true,
        delay,
      });

      const st = ScrollTrigger.create({
        trigger: el,
        start,
        once: true,
        onEnter: () => {
          tween.play();
        },
      });

      return () => {
        tween.kill();
        st.kill();
        gsap.set(split.chars, { clearProps: "willChange" });
        split.revert();
      };
    },
    { scope: container, dependencies: [delay, start], revertOnUpdate: true }
  );

  return (
    <div className={cn(className)} ref={container} {...props}>
      {children}
    </div>
  );
}

export { SplitTextOnScroll };

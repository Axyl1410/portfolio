"use client";

import { useRef } from "react";
import { SplitWordsOnScroll } from "@/components/ui/split-words-on-scroll";
import { gsap, SplitText, useGSAP } from "@/lib/gsap-client";

export default function Test() {
  const textRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (!textRef.current) {
        return;
      }

      const split = new SplitText(textRef.current, { type: "words" });
      const words = split.words ?? [];

      const tween = gsap.fromTo(
        words,
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
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 85%",
            end: "bottom 60%",
            once: true,
          },
          delay: 1,
        }
      );

      return () => {
        split.revert();
        tween.scrollTrigger?.kill();
      };
    },
    { scope: textRef }
  );

  return (
    <>
      <div className="inline-block overflow-hidden leading-none" ref={textRef}>
        lorem ipsum dolor sit amet
      </div>
      <SplitWordsOnScroll delay={1}>
        lorem ipsum dolor sit amet
      </SplitWordsOnScroll>
    </>
  );
}

"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap-client";

const About = () => {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = container.current;
      if (!el) {
        return;
      }

      const split = new SplitText(el, { type: "chars" });
      if (!split.chars?.length) {
        return;
      }

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
        delay: 2,
      });

      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        onEnter: () => {
          tween.play();
        },
      });

      return () => {
        st.kill();
        split.revert();
      };
    },
    { scope: container }
  );

  return (
    <main className="overflow-hidden bg-black p-10 text-white">
      <div className="headline font-bold text-6xl uppercase" ref={container}>
        Real apps. Real impact.
      </div>
    </main>
  );
};

export default About;

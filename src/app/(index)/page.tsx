"use client";

import { useRef } from "react";
import { LatestProjectCard } from "@/components/home/latest-project-card";
import HomeIntroLoader from "@/components/loader/home-intro-loader";
import { Button } from "@/components/ui/button";
import { SplitWordsOnScroll } from "@/components/ui/split-words-on-scroll";
import { gsap, useGSAP } from "@/lib/gsap-client";
import { INTRO_LOADER_SESSION_KEY } from "@/lib/intro-loader";
export default function Home() {
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const projectRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const btn = buttonRef.current;
      const project = projectRef.current;

      if (typeof window === "undefined" || !btn || !project) {
        return;
      }

      const runAnimation = (delay: number) => {
        gsap.fromTo(
          [btn, project],
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
            stagger: 0.08,
            delay,
          }
        );
      };

      const loaderPlayed = sessionStorage.getItem(INTRO_LOADER_SESSION_KEY);
      if (!loaderPlayed) {
        const handler = () => {
          runAnimation(0);
        };
        window.addEventListener("home-intro-complete", handler, {
          once: true,
        });

        return () => {
          window.removeEventListener("home-intro-complete", handler);
        };
      }

      runAnimation(1);
    },
    { scope: contentRef }
  );

  return (
    <>
      <div
        className="flex flex-1 flex-col"
        data-intro-content
        ref={contentRef}
        style={{ opacity: 0 }}
      >
        <div className="u-hero">
          <h1 className="u-hero-title">
            <SplitWordsOnScroll waitForIntro>
              <span className="u-text-indent-hero">My</span> name is Truong
              Giang. I'm a{" "}
              <span className="u-text-primary">Full-stack Developer</span> based
              in Vietnam.
            </SplitWordsOnScroll>
          </h1>
          <div className="flex" ref={buttonRef}>
            <Button className="p-1.5 uppercase">
              truonggiang.axyl@gmail.com
            </Button>
          </div>
        </div>

        <div className="u-bottom u-project-card-container mt-auto">
          <div className="u-bottom-content" ref={projectRef}>
            <div className="font-medium text-[1.25em] leading-[1.36]">
              Latest Project
            </div>
            <LatestProjectCard />
          </div>
          <div className="u-meta">Use menu to explore</div>
        </div>
      </div>

      <HomeIntroLoader
        contentRef={contentRef}
        images={[
          { src: "/images/hero-1.jpg", alt: "Hero Image" },
          { src: "/images/hero-2.jpg", alt: "Hero Image" },
          { src: "/images/hero-3.jpg", alt: "Hero Image" },
        ]}
      />
    </>
  );
}

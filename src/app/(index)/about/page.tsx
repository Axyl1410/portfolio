"use client";

import type { UseInViewOptions } from "motion/react";
import { MaskedTextReveal } from "@/components/sora-ui/texts/text-reveal-mask";

const linkClass =
  "transition-colors transition-transform ease-in-out hover:text-foreground active:scale-95";

export default function About() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-10 px-4">
      <MaskedTextReveal
        as="h1"
        className="text-pretty text-center font-normal text-lg leading-tight tracking-tight transition-colors duration-150 ease-out has-[a:hover]:text-foreground/10 lg:text-2xl [&_a:hover]:text-foreground"
        once
        splitBy="lines"
        stagger={0.08}
        viewportMargin={"0px" as UseInViewOptions["margin"]}
        wrapperClassName="mx-auto w-full max-w-xl"
      >
        I&apos;m full-stack by trade, front-end at heart. Right now I&apos;m
        building{" "}
        <a
          className={linkClass}
          href="http://ui.soralabs.io.vn"
          rel="noopener noreferrer"
          target="_blank"
        >
          Sora UI
        </a>
        , a motion-first component library for React. I like the part where
        design meets implementation: timing, spacing, and the small details that
        make an interface feel alive. WIPs and thoughts on{" "}
        <a
          className={linkClass}
          href="https://x.com/axyl1410"
          rel="noopener noreferrer"
          target="_blank"
        >
          X
        </a>
        ; source and experiments on{" "}
        <a
          className={linkClass}
          href="https://github.com/axyl1410"
          rel="noopener noreferrer"
          target="_blank"
        >
          GitHub
        </a>
        .
      </MaskedTextReveal>
    </div>
  );
}

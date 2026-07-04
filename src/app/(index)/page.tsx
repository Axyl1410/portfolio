"use client";

import type { UseInViewOptions } from "motion/react";
import { MaskedTextReveal } from "@/components/sora-ui/texts/text-reveal-mask";

const linkClass =
  "group/link relative flex items-center justify-center uppercase transition-transform ease-in-out hover:text-foreground active:scale-95";

const heroViewportMargin = "0px" as UseInViewOptions["margin"];

const heroRevealProps = {
  once: true,
  singleLine: true,
  splitBy: "lines" as const,
  stagger: 0,
  viewportMargin: heroViewportMargin,
  wrapperClassName: "w-fit",
  yPercent: 110,
};

export default function Home() {
  return (
    <div
      className="flex flex-col items-center justify-center text-center transition-colors duration-150 ease-out has-[a:hover]:text-foreground/10"
      data-copy-wrapper="true"
      style={{ opacity: 1 }}
    >
      <MaskedTextReveal
        {...heroRevealProps}
        as="div"
        className="font-display text-3xl uppercase lg:text-6xl"
        delay={0}
        text="Yo 'm Axyl"
      />

      <MaskedTextReveal
        {...heroRevealProps}
        as="div"
        className="font-display text-3xl uppercase lg:text-6xl"
        delay={0.08}
        text="and i build stuff"
      />

      <MaskedTextReveal
        {...heroRevealProps}
        as="div"
        className="font-display text-3xl uppercase lg:text-6xl"
        delay={0.16}
        text="Archive — 26"
      />

      <MaskedTextReveal
        {...heroRevealProps}
        as="p"
        className="mt-5 font-helvetica-neue text-sm opacity-55 lg:text-base"
        delay={0.24}
        text="Creative Developer &"
      />

      <MaskedTextReveal
        {...heroRevealProps}
        as="p"
        className="mb-5 font-helvetica-neue text-sm opacity-55 lg:-mt-1 lg:text-base"
        delay={0.32}
        text="Full Stack Developer"
      />

      <a
        aria-label="[truonggiang.axyl@gmail.com]"
        className={linkClass}
        href="mailto:truonggiang.axyl@gmail.com"
        rel="noopener"
        target="_blank"
      >
        <MaskedTextReveal
          {...heroRevealProps}
          as="span"
          className="font-display text-3xl uppercase lg:text-6xl"
          delay={0.4}
          text="[say hello]"
        />
      </a>

      <a
        aria-label="[ui.soralabs.io.vn]"
        className={linkClass}
        href="http://ui.soralabs.io.vn"
        rel="noopener"
        target="_blank"
      >
        <MaskedTextReveal
          {...heroRevealProps}
          as="span"
          className="font-display text-3xl uppercase lg:text-6xl"
          delay={0.48}
          text="[ui.soralabs.io.vn]"
        />
      </a>
    </div>
  );
}

"use client";

import NumberFlow from "@number-flow/react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import {
  AnimatedRuleLine,
  LINE_STAGGER_S,
  PageTitleRule,
} from "@/components/page-title-rule";
import { ProgressiveBlur } from "@/components/sora-ui/effects/progressive-blur";
import { TextScramble } from "@/components/sora-ui/texts/text-scramble";
import { cn } from "@/lib/utils";

const WORKS = [
  {
    description: "Building Something Super Exciting",
    id: "teaser",
    status: "Current",
    title: "hehe hehe :)",
    titleClassName: "mr-2 select-none text-foreground blur",
  },
  {
    description: "A motion-first component library for React",
    href: "https://ui.soralabs.io.vn",
    id: "sora-ui",
    status: "Current",
    title: "Sora UI",
  },
] as const;

const WORKS_COUNT = WORKS.filter((work) => "href" in work).length;

const rowClassName =
  "flex w-full items-center justify-between gap-3 rounded-2xl p-4 hover:bg-muted";

const FADE_EASE = [0.19, 1, 0.22, 1] as const;
const DESCRIPTION_FADE_DURATION_S = 1;

function WorkDescription({ delay, text }: { delay: number; text: string }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.span
      animate={{ opacity: 1 }}
      className="hidden md:inline"
      initial={prefersReducedMotion ? false : { opacity: 0 }}
      transition={{
        delay: prefersReducedMotion ? 0 : delay,
        duration: prefersReducedMotion ? 0 : DESCRIPTION_FADE_DURATION_S,
        ease: FADE_EASE,
      }}
    >
      <TextScramble
        as="span"
        characterSet="abcdefghijklmnopqrstuvwxyz0123456789"
        delay={delay}
      >
        {text}
      </TextScramble>
    </motion.span>
  );
}

function WorkRow({
  lineDelay,
  work,
}: {
  lineDelay: number;
  work: (typeof WORKS)[number];
}) {
  const content = (
    <>
      <p className="text-foreground/40">
        <span
          className={cn(
            "text-foreground",
            "titleClassName" in work ? work.titleClassName : undefined
          )}
        >
          {work.title}
        </span>{" "}
        <WorkDescription delay={lineDelay} text={work.description} />
      </p>
      <AnimatedRuleLine
        className="h-px flex-1 bg-foreground/10"
        delay={lineDelay}
      />
      <p className="text-foreground/40">{work.status}</p>
    </>
  );

  if (!("href" in work)) {
    return (
      <div className={cn(rowClassName, "cursor-not-allowed")}>{content}</div>
    );
  }

  return (
    <a
      className={rowClassName}
      href={work.href}
      rel="noopener noreferrer"
      target="_blank"
    >
      {content}
    </a>
  );
}

export default function Works() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(WORKS_COUNT);
  }, []);

  return (
    <div className="flex h-dvh w-full max-w-3xl justify-center overflow-hidden">
      <div className="flex h-full min-h-0 w-full flex-col items-center pt-[20vh] pb-[10vh]">
        <h1 className="flex w-fit shrink-0 items-center justify-center gap-2 font-display text-4xl uppercase lg:text-5xl">
          Works
          <PageTitleRule delay={0} />
          <NumberFlow trend={1} value={count} />
        </h1>
        <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden">
          <ProgressiveBlur className="z-10" direction="top" />
          <ProgressiveBlur className="z-10" direction="bottom" />
          <div className="scrollbar-none h-full w-full overflow-y-auto overflow-x-hidden text-sm">
            <div className="mb-10 flex w-full flex-col gap-2 pt-20">
              {WORKS.map((work, index) => (
                <WorkRow
                  key={work.id}
                  lineDelay={(index + 1) * LINE_STAGGER_S}
                  work={work}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

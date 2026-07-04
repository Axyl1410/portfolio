"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const EXPO_OUT = [0.19, 1, 0.22, 1] as const;

/** Delay between each rule line animating, top to bottom. */
const LINE_STAGGER_S = 0.15;

const RULE_DURATION_S = 1;

interface AnimatedRuleLineProps {
  className?: string;
  delay?: number;
}

function useRuleMotion(delay = 0) {
  const prefersReducedMotion = useReducedMotion();

  return {
    animate: { scaleX: 1 as const },
    initial: prefersReducedMotion ? false : { scaleX: 0 },
    transition: {
      delay,
      duration: prefersReducedMotion ? 0 : RULE_DURATION_S,
      ease: EXPO_OUT,
    },
  };
}

function AnimatedRuleLine({ className, delay = 0 }: AnimatedRuleLineProps) {
  const motionProps = useRuleMotion(delay);

  return (
    <motion.div
      {...motionProps}
      aria-hidden
      className={cn("origin-left", className)}
      style={{ transformOrigin: "left center" }}
    />
  );
}

function PageTitleRule({ className, delay = 0 }: AnimatedRuleLineProps) {
  const motionProps = useRuleMotion(delay);

  return (
    <motion.span
      {...motionProps}
      aria-hidden
      className={cn(
        "inline-flex h-0.5 w-30 origin-left overflow-hidden bg-foreground",
        className
      )}
      style={{ transformOrigin: "left center" }}
    />
  );
}

export { AnimatedRuleLine, LINE_STAGGER_S, PageTitleRule, RULE_DURATION_S };

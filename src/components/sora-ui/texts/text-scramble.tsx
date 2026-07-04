"use client";

import { type MotionProps, motion, useReducedMotion } from "motion/react";
import type React from "react";
import {
  type ComponentType,
  type ElementType,
  type MouseEventHandler,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

const motionComponentCache = new Map<
  ElementType,
  ComponentType<MotionProps & { children?: ReactNode }>
>();

function getMotionComponent(
  Component: ElementType
): ComponentType<MotionProps & { children?: ReactNode }> {
  const cached = motionComponentCache.get(Component);
  if (cached) {
    return cached;
  }

  const created = motion.create(Component as never);
  motionComponentCache.set(Component, created);
  return created;
}

type MotionTextComponent = ComponentType<
  MotionProps & {
    children?: ReactNode;
    className?: string;
    onMouseEnter?: MouseEventHandler<Element>;
  }
>;

interface ScrambleFrame {
  revealedLength: number;
  text: string;
}

export type TextScrambleProps = {
  children: string;
  duration?: number;
  speed?: number;
  characterSet?: string;
  as?: React.ElementType;
  className?: string;
  onMouseEnter?: MouseEventHandler<Element>;
  /**
   * Color for characters still scrambling. Revealed characters keep the root
   * text color (from `className` or `style`).
   */
  scrambleColor?: string;
  /**
   * Seconds to scramble in place before the left-to-right reveal begins.
   * @default 0
   */
  holdDuration?: number;
  /**
   * When true, runs the scramble on mount or when this value changes.
   * Ignored while `triggerOnHover` is true.
   * @default true
   */
  trigger?: boolean;
  /**
   * When true, runs the scramble on hover instead of on mount.
   * Mount `trigger` is skipped automatically.
   * @default false
   */
  triggerOnHover?: boolean;
  /**
   * Seconds to wait before the scramble starts on mount.
   * @default 0
   */
  delay?: number;
  onScrambleComplete?: () => void;
} & Omit<MotionProps, "onMouseEnter">;

const defaultChars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const LOWERCASE_CHAR_RE = /[a-z]/;
const UPPERCASE_CHAR_RE = /[A-Z]/;
const DIGIT_CHAR_RE = /[0-9]/;
const NON_LOWERCASE_RE = /[^a-z]/g;
const NON_UPPERCASE_RE = /[^A-Z]/g;
const NON_DIGIT_RE = /[^0-9]/g;

function randomScrambleChar(characterSet: string): string {
  return characterSet[Math.floor(Math.random() * characterSet.length)] ?? "";
}

function randomScrambleCharForSource(
  sourceChar: string,
  characterSet: string
): string {
  if (LOWERCASE_CHAR_RE.test(sourceChar)) {
    const lowercaseChars = characterSet.replace(NON_LOWERCASE_RE, "");
    if (lowercaseChars.length > 0) {
      return randomScrambleChar(lowercaseChars);
    }
  }

  if (UPPERCASE_CHAR_RE.test(sourceChar)) {
    const uppercaseChars = characterSet.replace(NON_UPPERCASE_RE, "");
    if (uppercaseChars.length > 0) {
      return randomScrambleChar(uppercaseChars);
    }
  }

  if (DIGIT_CHAR_RE.test(sourceChar)) {
    const digitChars = characterSet.replace(NON_DIGIT_RE, "");
    if (digitChars.length > 0) {
      return randomScrambleChar(digitChars);
    }
  }

  return randomScrambleChar(characterSet);
}

function buildScrambledText(
  source: string,
  revealedLength: number,
  characterSet: string
): string {
  let scrambled = "";

  for (let i = 0; i < source.length; i++) {
    if (source[i] === " ") {
      scrambled += " ";
      continue;
    }

    if (i < revealedLength) {
      scrambled += source[i];
    } else {
      scrambled += randomScrambleCharForSource(source[i], characterSet);
    }
  }

  return scrambled;
}

export function TextScramble({
  children,
  duration = 0.8,
  speed = 0.04,
  characterSet = defaultChars,
  className,
  as: Component = "p",
  scrambleColor,
  holdDuration = 0,
  delay = 0,
  trigger = true,
  triggerOnHover = false,
  onScrambleComplete,
  onMouseEnter,
  ...props
}: TextScrambleProps) {
  const prefersReducedMotion = useReducedMotion();
  const MotionComponent = getMotionComponent(Component) as MotionTextComponent;
  const [frame, setFrame] = useState<ScrambleFrame | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const text = children;
  const shouldTriggerOnMount = trigger && !triggerOnHover;

  const clearAnimationInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const scramble = () => {
    if (prefersReducedMotion || isAnimating) {
      return;
    }

    clearAnimationInterval();
    setIsAnimating(true);

    const holdSteps = holdDuration / speed;
    const revealSteps = duration / speed;
    const totalSteps = holdSteps + revealSteps;
    let step = 0;

    intervalRef.current = setInterval(() => {
      if (step < holdSteps) {
        setFrame({
          text: buildScrambledText(text, 0, characterSet),
          revealedLength: 0,
        });
      } else {
        const revealStep = step - holdSteps;
        const progress = revealStep / revealSteps;
        const revealedLength = Math.floor(progress * text.length);

        setFrame({
          text: buildScrambledText(text, revealedLength, characterSet),
          revealedLength,
        });
      }

      step++;

      if (step > totalSteps) {
        clearAnimationInterval();
        setFrame(null);
        setIsAnimating(false);
        onScrambleComplete?.();
      }
    }, speed * 1000);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: unmount cleanup only
  useEffect(
    () => () => {
      clearAnimationInterval();
    },
    []
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-run only when mount trigger changes
  useEffect(() => {
    if (!shouldTriggerOnMount || prefersReducedMotion) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      scramble();
    }, delay * 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [shouldTriggerOnMount, trigger, delay]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-run when mount trigger changes
  useEffect(() => {
    if (!(prefersReducedMotion && shouldTriggerOnMount)) {
      return;
    }

    onScrambleComplete?.();
  }, [prefersReducedMotion, shouldTriggerOnMount, trigger, onScrambleComplete]);

  const handleMouseEnter: MouseEventHandler<Element> = (event) => {
    onMouseEnter?.(event);

    if (triggerOnHover && !prefersReducedMotion) {
      scramble();
    }
  };

  const renderContent = () => {
    if (!frame) {
      return children;
    }

    if (!scrambleColor) {
      return frame.text;
    }

    return frame.text.split("").map((char, index) => (
      <span
        // biome-ignore lint/suspicious/noArrayIndexKey: static string indices per frame
        key={index}
        style={
          index < frame.revealedLength ? undefined : { color: scrambleColor }
        }
      >
        {char}
      </span>
    ));
  };

  if (prefersReducedMotion) {
    return (
      <MotionComponent
        className={className}
        onMouseEnter={handleMouseEnter}
        {...props}
      >
        {children}
      </MotionComponent>
    );
  }

  return (
    <MotionComponent
      aria-label={frame ? text : undefined}
      className={className}
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      {renderContent()}
    </MotionComponent>
  );
}

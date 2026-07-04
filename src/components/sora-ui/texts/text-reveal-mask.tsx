"use client";

import {
  motion,
  type UseInViewOptions,
  useInView,
  useReducedMotion,
} from "motion/react";
import {
  type ElementType,
  isValidElement,
  type ReactNode,
  type RefObject,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

type SplitBy = "lines" | "words" | "chars";

const SPLIT_DEFAULTS: Record<SplitBy, { duration: number; stagger: number }> = {
  lines: { duration: 0.8, stagger: 0.08 },
  words: { duration: 0.6, stagger: 0.06 },
  chars: { duration: 0.4, stagger: 0.01 },
};

const EXPO_OUT = [0.19, 1, 0.22, 1] as const;

const WHITESPACE_RE = /\s+/;

interface WordToken {
  className?: string;
  emphasized: boolean;
  href?: string;
  linkId?: number;
  rel?: string;
  target?: string;
  text: string;
}

interface LineCharUnit {
  char: string;
  emphasized: boolean;
  staggerIndex: number;
}

export interface MaskedTextRevealProps {
  /**
   * HTML tag for the container element.
   * @default "p"
   */
  as?: keyof React.JSX.IntrinsicElements;
  /** Rich text content. Supports inline emphasis elements such as `<strong>`. */
  children?: ReactNode;
  className?: string;
  /**
   * Delay before the first unit starts animating, in seconds.
   * @default 0
   */
  delay?: number;
  /**
   * Duration of each unit's animation in seconds.
   */
  duration?: number;
  /**
   * Trigger the animation only once.
   * @default true
   */
  once?: boolean;
  /**
   * Split mode: line-by-line, word-by-word, or character-by-character.
   * @default "lines"
   */
  splitBy?: SplitBy;
  /**
   * Delay between each successive unit in seconds.
   */
  stagger?: number;
  /** Plain-text alternative to `children`. */
  text?: string;
  /**
   * Additional className applied to each animated unit.
   */
  unitClassName?: string;
  /**
   * Viewport margin that controls when the animation triggers.
   * Maps to sandbox `start: "top 75%"` by default.
   * @default "0px 0px -25% 0px"
   */
  viewportMargin?: UseInViewOptions["margin"];
  /**
   * Initial vertical offset as a percentage of the unit height.
   * @default 110
   */
  yPercent?: number;
  /**
   * Skip auto line measurement and treat all content as one reveal line.
   * Useful for short hero lines that should not wrap word-by-word.
   * @default false
   */
  singleLine?: boolean;
  /**
   * ClassName for the outer measurement wrapper.
   * @default "relative mx-auto w-full"
   */
  wrapperClassName?: string;
}

function collectWords(node: ReactNode): WordToken[] {
  let nextLinkId = 0;

  function walk(node: ReactNode, emphasized = false): WordToken[] {
    if (typeof node === "string") {
      return node
        .split(WHITESPACE_RE)
        .filter(Boolean)
        .map((text) => ({ text, emphasized }));
    }

    if (Array.isArray(node)) {
      return node.flatMap((child) => walk(child, emphasized));
    }

    if (isValidElement(node)) {
      if (node.type === "a") {
        const props = node.props as {
          children?: ReactNode;
          className?: string;
          href?: string;
          rel?: string;
          target?: string;
        };
        const linkId = nextLinkId++;

        return walk(props.children, emphasized).map((word) => ({
          ...word,
          className: props.className,
          href: props.href,
          linkId,
          rel: props.rel,
          target: props.target,
        }));
      }

      const nextEmphasis =
        emphasized || node.type === "strong" || node.type === "b";
      return walk(
        (node.props as { children?: ReactNode }).children,
        nextEmphasis
      );
    }

    return [];
  }

  return walk(node);
}

function getContentNode(
  text: string | undefined,
  children: ReactNode
): ReactNode {
  if (text) {
    return text;
  }

  return children;
}

function getAccessibleLabel(words: WordToken[]): string {
  return words.map((word) => word.text).join(" ");
}

type LineGroup = number[];

function groupWordsByLine(measureNode: HTMLDivElement): LineGroup[] {
  const measureWords = measureNode.querySelectorAll("[data-measure-word]");
  if (measureWords.length === 0) {
    return [[0]];
  }

  const groups: LineGroup[] = [];
  let currentGroup: LineGroup = [];
  let lastTop = -1;

  for (const [index, node] of measureWords.entries()) {
    const top = (node as HTMLElement).offsetTop;
    if (lastTop !== -1 && top > lastTop + 1) {
      groups.push(currentGroup);
      currentGroup = [];
    }
    currentGroup.push(index);
    lastTop = top;
  }

  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  return groups.length > 0 ? groups : [[0]];
}

function resolveContainerWidth(container: HTMLElement): number {
  let node: HTMLElement | null = container;

  while (node) {
    if (node.clientWidth > 0) {
      return node.clientWidth;
    }
    node = node.parentElement;
  }

  return 0;
}

function useLineGroups(
  words: WordToken[],
  className: string | undefined,
  containerRef: RefObject<HTMLDivElement | null>,
  enabled = true
) {
  const measureRef = useRef<HTMLDivElement>(null);
  const [lineGroups, setLineGroups] = useState<LineGroup[] | null>(null);

  const measurementKey = `${className ?? ""}:${words
    .map((word) => `${word.emphasized ? "1" : "0"}:${word.text}`)
    .join("\u0000")}`;

  // biome-ignore lint/correctness/useExhaustiveDependencies: Remeasure when text, width, or typography changes.
  useLayoutEffect(() => {
    if (!enabled) {
      return;
    }

    const container = containerRef.current;
    const measureNode = measureRef.current;
    if (!(container && measureNode)) {
      return;
    }

    let cancelled = false;

    const measureLines = () => {
      if (cancelled) {
        return;
      }

      const width = resolveContainerWidth(container);
      const measureWidth =
        width > 0 ? width : (container.parentElement?.clientWidth ?? 0);

      if (measureWidth > 0) {
        measureNode.style.width = `${measureWidth}px`;
      }

      setLineGroups(groupWordsByLine(measureNode));
    };

    measureLines();
    document.fonts.ready.then(measureLines);

    const resizeObserver = new ResizeObserver(measureLines);
    resizeObserver.observe(container);

    return () => {
      cancelled = true;
      resizeObserver.disconnect();
    };
  }, [containerRef, enabled, measurementKey]);

  const measureLayer = enabled ? (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none invisible fixed top-0 left-[-9999px] block [overflow-wrap:break-word] [word-wrap:break-word]",
        className
      )}
      ref={measureRef}
    >
      {words.map((word, index) => (
        <span
          className={cn(
            "split-word inline-block [backface-visibility:hidden]",
            index < words.length - 1 && "me-[0.25em]",
            word.emphasized && "font-medium text-foreground"
          )}
          data-measure-word
          // biome-ignore lint/suspicious/noArrayIndexKey: static measurement tokens per render
          key={index}
        >
          {word.text}
        </span>
      ))}
    </div>
  ) : null;

  return { lineGroups: enabled ? lineGroups : null, measureLayer };
}

function renderWordContent(word: WordToken, unitClassName?: string) {
  if (word.emphasized) {
    return <strong className={unitClassName}>{word.text}</strong>;
  }

  return word.text;
}

type WordCluster =
  | { indices: number[]; kind: "link"; word: WordToken }
  | { indices: number[]; kind: "text"; word: WordToken };

function clusterWordsByLink(
  group: number[],
  words: WordToken[]
): WordCluster[] {
  const clusters: WordCluster[] = [];
  let index = 0;

  while (index < group.length) {
    const wordIndex = group[index];
    const word = words[wordIndex];
    if (!word) {
      index++;
      continue;
    }

    if (word.linkId !== undefined && word.href) {
      const linkId = word.linkId;
      const indices: number[] = [];

      while (
        index < group.length &&
        words[group[index] ?? -1]?.linkId === linkId
      ) {
        const currentIndex = group[index];
        if (currentIndex !== undefined) {
          indices.push(currentIndex);
        }
        index++;
      }

      clusters.push({ kind: "link", indices, word });
      continue;
    }

    clusters.push({ kind: "text", indices: [wordIndex], word });
    index++;
  }

  return clusters;
}

function isLastWordInGroup(wordIndex: number, group: number[]): boolean {
  return wordIndex === group.at(-1);
}

function SplitLine({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "split-line block w-full overflow-hidden [backface-visibility:hidden]",
        className
      )}
    >
      {children}
    </span>
  );
}

function RevealTarget({
  animate,
  children,
  className,
  delay: unitDelay,
  display = "inline-block",
  duration: unitDuration,
  yPercent,
}: {
  animate: boolean;
  children: ReactNode;
  className?: string;
  delay: number;
  display?: "block" | "inline-block";
  duration: number;
  yPercent: number;
}) {
  const hiddenY = `${yPercent}%`;

  return (
    <motion.span
      animate={animate ? { y: "0%" } : { y: hiddenY }}
      className={cn(
        "will-change-transform [backface-visibility:hidden]",
        display === "block" ? "block w-full" : "inline-block",
        className
      )}
      initial={{ y: hiddenY }}
      transition={{
        duration: unitDuration,
        delay: unitDelay,
        ease: EXPO_OUT,
      }}
    >
      {children}
    </motion.span>
  );
}

function WordSpan({
  isLastWord,
  word,
  unitClassName,
}: {
  isLastWord: boolean;
  word: WordToken;
  unitClassName?: string;
}) {
  return (
    <span
      className={cn(
        "split-word inline-block [backface-visibility:hidden]",
        !isLastWord && "me-[0.25em]"
      )}
    >
      {renderWordContent(word, unitClassName)}
    </span>
  );
}

export function MaskedTextReveal({
  text,
  children,
  as: Tag = "p",
  splitBy = "lines",
  duration,
  stagger,
  yPercent = 110,
  delay = 0,
  once = true,
  viewportMargin = "0px 0px -25% 0px",
  className,
  unitClassName,
  singleLine = false,
  wrapperClassName = "relative mx-auto w-full",
}: MaskedTextRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isInView = useInView(rootRef, { once, margin: viewportMargin });

  const content = getContentNode(text, children);
  const words = useMemo(() => collectWords(content), [content]);
  const accessibleLabel = useMemo(() => getAccessibleLabel(words), [words]);

  const defaults = SPLIT_DEFAULTS[splitBy];
  const resolvedDuration = duration ?? defaults.duration;
  const resolvedStagger = stagger ?? defaults.stagger;

  const staticLineGroups = useMemo(
    () =>
      singleLine && words.length > 0 ? [words.map((_, index) => index)] : null,
    [singleLine, words]
  );

  const { lineGroups: measuredLineGroups, measureLayer } = useLineGroups(
    words,
    className,
    rootRef,
    !singleLine
  );

  const lineGroups = singleLine ? staticLineGroups : measuredLineGroups;

  const wordStaggerMap = useMemo(() => {
    const groups = lineGroups ?? [];
    const map = new Map<number, number>();
    let index = 0;

    for (const group of groups) {
      for (const wordIndex of group) {
        map.set(wordIndex, index);
        index++;
      }
    }

    return map;
  }, [lineGroups]);

  const lineCharGroups = useMemo(() => {
    const groups = lineGroups ?? [];
    let globalStagger = 0;

    return groups.map((group) => {
      const lineChars: LineCharUnit[] = [];

      for (const [index, wordIndex] of group.entries()) {
        const word = words[wordIndex];
        if (!word) {
          continue;
        }

        for (const char of word.text) {
          lineChars.push({
            char,
            emphasized: word.emphasized,
            staggerIndex: globalStagger,
          });
          globalStagger++;
        }

        if (index < group.length - 1) {
          lineChars.push({
            char: " ",
            emphasized: false,
            staggerIndex: globalStagger,
          });
          globalStagger++;
        }
      }

      return lineChars;
    });
  }, [lineGroups, words]);

  const Component = Tag as ElementType;
  const isReady = lineGroups !== null && lineGroups.length > 0;
  const hasContent = words.length > 0;
  const shouldAnimate = isInView && isReady && !prefersReducedMotion;

  if (prefersReducedMotion) {
    return (
      <div className={wrapperClassName} ref={rootRef}>
        <Component className={className}>{content}</Component>
      </div>
    );
  }

  if (!hasContent) {
    return (
      <div className={wrapperClassName} ref={rootRef}>
        <Component className={className}>{content}</Component>
      </div>
    );
  }

  const rootClassName = cn(
    "block [transform:translateZ(0)] [will-change:transform]",
    !isReady && "invisible",
    className
  );

  const lineContent =
    isReady &&
    lineGroups.map((group, lineIndex) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: line order is stable for static text
      <SplitLine key={lineIndex}>
        <RevealTarget
          animate={shouldAnimate}
          delay={delay + lineIndex * resolvedStagger}
          display="block"
          duration={resolvedDuration}
          yPercent={yPercent}
        >
          {clusterWordsByLink(group, words).map((cluster) => {
            if (cluster.kind === "link") {
              return (
                <a
                  className={cluster.word.className}
                  href={cluster.word.href}
                  key={`link-${cluster.word.linkId}-${cluster.indices[0]}`}
                  rel={cluster.word.rel}
                  target={cluster.word.target}
                >
                  {cluster.indices.map((wordIndex) => {
                    const word = words[wordIndex];
                    if (!word) {
                      return null;
                    }

                    return (
                      <WordSpan
                        isLastWord={isLastWordInGroup(wordIndex, group)}
                        key={wordIndex}
                        unitClassName={unitClassName}
                        word={word}
                      />
                    );
                  })}
                </a>
              );
            }

            const wordIndex = cluster.indices[0];
            const word = words[wordIndex];
            if (!word) {
              return null;
            }

            return (
              <WordSpan
                isLastWord={isLastWordInGroup(wordIndex, group)}
                key={wordIndex}
                unitClassName={unitClassName}
                word={word}
              />
            );
          })}
        </RevealTarget>
      </SplitLine>
    ));

  const wordContent =
    isReady &&
    lineGroups.map((group, lineIndex) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: line order is stable for static text
      <SplitLine key={lineIndex}>
        {clusterWordsByLink(group, words).map((cluster) => {
          if (cluster.kind === "link") {
            return (
              <a
                className={cluster.word.className}
                href={cluster.word.href}
                key={`link-${cluster.word.linkId}-${cluster.indices[0]}`}
                rel={cluster.word.rel}
                target={cluster.word.target}
              >
                {cluster.indices.map((wordIndex) => {
                  const word = words[wordIndex];
                  if (!word) {
                    return null;
                  }

                  return (
                    <RevealTarget
                      animate={shouldAnimate}
                      className={cn(
                        "split-word",
                        !isLastWordInGroup(wordIndex, group) && "me-[0.25em]",
                        unitClassName
                      )}
                      delay={
                        delay +
                        (wordStaggerMap.get(wordIndex) ?? 0) * resolvedStagger
                      }
                      duration={resolvedDuration}
                      key={wordIndex}
                      yPercent={yPercent}
                    >
                      {renderWordContent(word)}
                    </RevealTarget>
                  );
                })}
              </a>
            );
          }

          const wordIndex = cluster.indices[0];
          const word = words[wordIndex];
          if (!word) {
            return null;
          }

          return (
            <RevealTarget
              animate={shouldAnimate}
              className={cn(
                "split-word",
                !isLastWordInGroup(wordIndex, group) && "me-[0.25em]",
                unitClassName
              )}
              delay={
                delay + (wordStaggerMap.get(wordIndex) ?? 0) * resolvedStagger
              }
              duration={resolvedDuration}
              key={wordIndex}
              yPercent={yPercent}
            >
              {renderWordContent(word)}
            </RevealTarget>
          );
        })}
      </SplitLine>
    ));

  const charContent =
    isReady &&
    lineCharGroups.map((group, lineIndex) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: line order is stable for static text
      <SplitLine key={lineIndex}>
        {group.map((token, charIndex) => (
          <RevealTarget
            animate={shouldAnimate}
            className={cn(
              "split-char",
              token.emphasized && "font-medium text-foreground",
              unitClassName
            )}
            delay={delay + token.staggerIndex * resolvedStagger}
            duration={resolvedDuration}
            // biome-ignore lint/suspicious/noArrayIndexKey: static char positions per line
            key={charIndex}
            yPercent={yPercent}
          >
            {token.char === " " ? "\u00A0" : token.char}
          </RevealTarget>
        ))}
      </SplitLine>
    ));

  let splitContent = charContent;
  if (splitBy === "lines") {
    splitContent = lineContent;
  } else if (splitBy === "words") {
    splitContent = wordContent;
  }

  return (
    <div className={wrapperClassName} ref={rootRef}>
      {measureLayer}
      <Component aria-label={accessibleLabel} className={rootClassName}>
        {splitContent}
      </Component>
    </div>
  );
}

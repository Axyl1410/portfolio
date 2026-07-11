"use client";

import {
  AnimatePresence,
  type Easing,
  type MotionStyle,
  motion,
  type UseInViewOptions,
  useInView,
  useReducedMotion,
} from "motion/react";
import Image from "next/image";
import type { CSSProperties, ReactNode, RefObject } from "react";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const EXPO_OUT = [0.19, 1, 0.22, 1] as const;
const WHITESPACE_RE = /\s+/;

export interface Testimonial {
  author: {
    name: string;
    role: string;
    /** Avatar image URL, or any ReactNode to render a custom avatar (skips next/image). */
    avatar: ReactNode | string;
  };
  id: string;
  text: string;
}

export interface InlineTestimonialsClassNames {
  /** Merged onto the avatar wrapper. */
  avatar?: string;
  /** Merged onto each testimonial `<span>`. */
  item?: string;
  /** Merged onto the hover label container. */
  label?: string;
  /** Merged onto the author name label. */
  name?: string;
  /** Merged onto the author role label. */
  role?: string;
  /** Merged onto the root element. */
  root?: string;
}

export interface InlineTestimonialsAlternateConfig {
  /** Opacity applied to every other (odd-indexed) item. @default 0.7 */
  opacity?: number;
  /** Toggles the alternating opacity pattern across items. @default true */
  pattern?: boolean;
}

export interface InlineTestimonialsLabelConfig {
  /** CSS color for the author name text. @default "#f97316" */
  accentColor?: string;
  /** Easing for the reveal/exit animation. @default "easeOut" */
  ease?: Easing;
  /** Font size of the author name, in pixels. @default 12 */
  nameFontSize?: number;
  /** Horizontal offset from the avatar's left edge, in pixels. @default avatarSize / 2 */
  offsetX?: number;
  /** Vertical offset above the avatar. @default "150%" */
  offsetY?: string;
  /** CSS color for the author role text. @default "var(--muted-foreground, #6b7280)" */
  roleColor?: string;
  /** Font size of the author role, in pixels. @default 9 */
  roleFontSize?: number;
  /** Letter spacing of the author role text. @default "0.1em" */
  roleLetterSpacing?: string;
  /** Uppercase the author role text. @default true */
  roleUppercase?: boolean;
  /** Horizontal slide distance (px) for the reveal/exit animation. @default -6 */
  slideX?: number;
  /** Duration of the reveal/exit animation, in seconds. @default 0.16 */
  transitionDuration?: number;
}

/** Masked slide-up entrance — same line units as MaskedTextReveal. */
export interface InlineTestimonialsRevealConfig {
  /** Delay before the first line starts, in seconds. @default 0 */
  delay?: number;
  /** Duration of each line's reveal, in seconds. @default 0.8 */
  duration?: number;
  /** Trigger only once. @default true */
  once?: boolean;
  /** Delay between successive lines, in seconds. @default 0.08 */
  stagger?: number;
  /**
   * Viewport margin for the in-view trigger.
   * @default "0px 0px -25% 0px"
   */
  viewportMargin?: UseInViewOptions["margin"];
  /** Initial vertical offset as a percentage of the line height. @default 110 */
  yPercent?: number;
}

export interface InlineTestimonialsProps {
  /** Alternating opacity pattern applied across items. */
  alternate?: InlineTestimonialsAlternateConfig;
  /** Avatar diameter in pixels. @default 32 */
  avatarSize?: number;
  /** Blur amount applied to non-hovered items in px. @default 5 */
  blurAmount?: number;
  /** Opacity of non-hovered items (0–1). @default 0.25 */
  blurOpacity?: number;
  className?: string;
  /** Class names for individual parts of the component. */
  classNames?: InlineTestimonialsClassNames;
  /** Uncontrolled initial hovered/active testimonial id. */
  defaultHoveredId?: string | null;
  /** Font size in pixels. @default 30 */
  fontSize?: number;
  /** Controlled hovered/active testimonial id. */
  hoveredId?: string | null;
  /** Which interactions reveal the author label. @default "hover" */
  interaction?: "both" | "focus" | "hover";
  /** Styling and motion for the hover-revealed author label. */
  label?: InlineTestimonialsLabelConfig;
  /** Called whenever the hovered/active testimonial id changes (controlled or uncontrolled). */
  onHoveredIdChange?: (id: string | null) => void;
  /**
   * Masked slide-up entrance on scroll into view (line-by-line, like MaskedTextReveal).
   * Pass `true` for defaults, or a config object to tune timing.
   */
  reveal?: boolean | InlineTestimonialsRevealConfig;
  /** Overrides avatar rendering entirely; receives the testimonial and resolved size. */
  renderAvatar?: (testimonial: Testimonial, size: number) => ReactNode;
  testimonials: Testimonial[];
}

interface ResolvedLabelConfig extends Required<InlineTestimonialsLabelConfig> {}

interface ResolvedRevealConfig {
  delay: number;
  duration: number;
  once: boolean;
  stagger: number;
  viewportMargin: UseInViewOptions["margin"];
  yPercent: number;
}

function resolveLabelConfig(
  avatarSize: number,
  label?: InlineTestimonialsLabelConfig
): ResolvedLabelConfig {
  return {
    accentColor: label?.accentColor ?? "#f97316",
    ease: label?.ease ?? "easeOut",
    nameFontSize: label?.nameFontSize ?? 12,
    offsetX: label?.offsetX ?? avatarSize / 2,
    offsetY: label?.offsetY ?? "150%",
    roleColor: label?.roleColor ?? "var(--muted-foreground, #6b7280)",
    roleFontSize: label?.roleFontSize ?? 9,
    roleLetterSpacing: label?.roleLetterSpacing ?? "0.1em",
    roleUppercase: label?.roleUppercase ?? true,
    slideX: label?.slideX ?? -6,
    transitionDuration: label?.transitionDuration ?? 0.16,
  };
}

function resolveRevealConfig(
  reveal?: boolean | InlineTestimonialsRevealConfig
): ResolvedRevealConfig | null {
  if (!reveal) {
    return null;
  }

  const config = reveal === true ? {} : reveal;
  return {
    delay: config.delay ?? 0,
    duration: config.duration ?? 0.8,
    once: config.once ?? true,
    stagger: config.stagger ?? 0.08,
    viewportMargin: config.viewportMargin ?? "0px 0px -25% 0px",
    yPercent: config.yPercent ?? 110,
  };
}

interface TestimonialAvatarProps {
  avatarSize: number;
  renderAvatar?: (testimonial: Testimonial, size: number) => ReactNode;
  testimonial: Testimonial;
}

function TestimonialAvatar({
  testimonial,
  avatarSize,
  renderAvatar,
}: TestimonialAvatarProps) {
  if (renderAvatar) {
    return renderAvatar(testimonial, avatarSize);
  }

  if (typeof testimonial.author.avatar !== "string") {
    return testimonial.author.avatar;
  }

  return (
    <Image
      alt={testimonial.author.name}
      height={avatarSize}
      src={testimonial.author.avatar}
      style={{
        width: avatarSize,
        height: avatarSize,
        borderRadius: "50%",
        objectFit: "cover",
        display: "block",
      }}
      unoptimized
      width={avatarSize}
    />
  );
}

interface TestimonialLabelProps {
  classNames?: InlineTestimonialsClassNames;
  label: ResolvedLabelConfig;
  prefersReducedMotion: boolean;
  testimonial: Testimonial;
}

function TestimonialLabel({
  testimonial,
  classNames,
  label,
  prefersReducedMotion,
}: TestimonialLabelProps) {
  const labelStyle: MotionStyle = {
    position: "absolute",
    left: label.offsetX,
    bottom: label.offsetY,
    transform: "translateY(-50%)",
    display: "inline-flex",
    flexDirection: "column",
    gap: 3,
    whiteSpace: "nowrap",
    pointerEvents: "none",
    zIndex: 20,
  };
  const slideX = prefersReducedMotion ? 0 : label.slideX;
  const duration = prefersReducedMotion ? 0 : label.transitionDuration;

  return (
    <motion.span
      animate={{ opacity: 1, x: 0 }}
      className={classNames?.label}
      exit={{ opacity: 0, x: slideX }}
      initial={{ opacity: 0, x: slideX }}
      style={labelStyle}
      transition={{ duration, ease: label.ease }}
    >
      <span
        className={classNames?.name}
        style={{
          fontSize: label.nameFontSize,
          fontWeight: 500,
          color: label.accentColor,
          lineHeight: 1.2,
        }}
      >
        {testimonial.author.name}
      </span>
      <span
        className={classNames?.role}
        style={{
          fontSize: label.roleFontSize,
          fontWeight: 500,
          letterSpacing: label.roleLetterSpacing,
          textTransform: label.roleUppercase ? "uppercase" : "none",
          color: label.roleColor,
          lineHeight: 1.2,
        }}
      >
        {testimonial.author.role}
      </span>
    </motion.span>
  );
}

interface TestimonialItemProps {
  allowFocus: boolean;
  allowHover: boolean;
  alternate: Required<InlineTestimonialsAlternateConfig>;
  avatarSize: number;
  blurAmount: number;
  blurOpacity: number;
  classNames?: InlineTestimonialsClassNames;
  index: number;
  isAnyHovered: boolean;
  isHovered: boolean;
  label: ResolvedLabelConfig;
  prefersReducedMotion: boolean;
  renderAvatar?: (testimonial: Testimonial, size: number) => ReactNode;
  setHoveredId: (id: string | null) => void;
  testimonial: Testimonial;
}

function resolveItemOpacity(
  baseOpacity: number,
  isDimmed: boolean,
  isHovered: boolean,
  blurOpacity: number
): number {
  if (isDimmed) {
    return blurOpacity;
  }
  if (isHovered) {
    return 1;
  }
  return baseOpacity;
}

function itemVisualStyle(
  itemIndex: number,
  hoveredId: string | null,
  testimonialId: string,
  alternate: Required<InlineTestimonialsAlternateConfig>,
  blurAmount: number,
  blurOpacity: number,
  prefersReducedMotion: boolean
): CSSProperties {
  const isHovered = hoveredId === testimonialId;
  const isDimmed = hoveredId !== null && !isHovered;
  const isAlternate = alternate.pattern && itemIndex % 2 !== 0;
  const baseOpacity = isAlternate ? alternate.opacity : 1;

  return {
    filter:
      isDimmed && !prefersReducedMotion ? `blur(${blurAmount}px)` : "none",
    opacity: resolveItemOpacity(baseOpacity, isDimmed, isHovered, blurOpacity),
    transition: prefersReducedMotion
      ? "opacity 0.3s ease"
      : "filter 0.3s ease, opacity 0.3s ease",
    cursor: "default",
  };
}

function TestimonialItem({
  testimonial,
  index,
  isHovered,
  isAnyHovered,
  allowHover,
  allowFocus,
  alternate,
  blurAmount,
  blurOpacity,
  prefersReducedMotion,
  setHoveredId,
  classNames,
  avatarSize,
  renderAvatar,
  label,
}: TestimonialItemProps) {
  const isDimmed = isAnyHovered && !isHovered;
  const isAlternate = alternate.pattern && index % 2 !== 0;
  const baseOpacity = isAlternate ? alternate.opacity : 1;
  const itemOpacity = resolveItemOpacity(
    baseOpacity,
    isDimmed,
    isHovered,
    blurOpacity
  );

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: hover/focus reveal is decorative and progressively enhanced (interaction defaults to "hover"; tabIndex/onFocus only attach when interaction includes "focus")
    // biome-ignore lint/a11y/noNoninteractiveElementInteractions: same as above
    <span
      className={classNames?.item}
      onBlur={allowFocus ? () => setHoveredId(null) : undefined}
      onFocus={allowFocus ? () => setHoveredId(testimonial.id) : undefined}
      onMouseEnter={allowHover ? () => setHoveredId(testimonial.id) : undefined}
      onMouseLeave={allowHover ? () => setHoveredId(null) : undefined}
      style={{
        filter:
          isDimmed && !prefersReducedMotion ? `blur(${blurAmount}px)` : "none",
        opacity: itemOpacity,
        transition: prefersReducedMotion
          ? "opacity 0.3s ease"
          : "filter 0.3s ease, opacity 0.3s ease",
        cursor: "default",
      }}
      tabIndex={allowFocus ? 0 : undefined}
    >
      <span
        className={cn("relative inline-block", classNames?.avatar)}
        style={{
          width: avatarSize,
          height: avatarSize,
          verticalAlign: "middle",
          marginRight: 3,
        }}
      >
        <TestimonialAvatar
          avatarSize={avatarSize}
          renderAvatar={renderAvatar}
          testimonial={testimonial}
        />
        <AnimatePresence>
          {isHovered ? (
            <TestimonialLabel
              classNames={classNames}
              label={label}
              prefersReducedMotion={prefersReducedMotion}
              testimonial={testimonial}
            />
          ) : null}
        </AnimatePresence>
      </span>
      <span>
        {testimonial.text}{" "}
        <span className="sr-only">
          — {testimonial.author.name}, {testimonial.author.role}
        </span>{" "}
      </span>
    </span>
  );
}

type ContentToken =
  | {
      kind: "avatar";
      itemIndex: number;
      key: string;
      testimonial: Testimonial;
    }
  | {
      kind: "word";
      itemIndex: number;
      key: string;
      testimonial: Testimonial;
      text: string;
    };

function flattenTestimonials(testimonials: Testimonial[]): ContentToken[] {
  const tokens: ContentToken[] = [];

  for (const [itemIndex, testimonial] of testimonials.entries()) {
    tokens.push({
      kind: "avatar",
      itemIndex,
      key: `${testimonial.id}-avatar`,
      testimonial,
    });

    const words = testimonial.text.split(WHITESPACE_RE).filter(Boolean);
    for (const [wordIndex, text] of words.entries()) {
      tokens.push({
        kind: "word",
        itemIndex,
        key: `${testimonial.id}-w${wordIndex}`,
        testimonial,
        text,
      });
    }
  }

  return tokens;
}

function groupTokensByLine(
  measureNode: HTMLElement,
  lineHeightPx: number
): number[][] {
  const nodes = measureNode.querySelectorAll("[data-measure-token]");
  if (nodes.length === 0) {
    return [[0]];
  }

  // Avatars use vertical-align: middle while word tokens sit on the text
  // baseline, so their offsetTop can differ by a few px even on the same
  // visual line. Tolerate that jitter while still catching a real wrap
  // (a full line-height jump).
  const tolerance = lineHeightPx / 2;

  const groups: number[][] = [];
  let current: number[] = [];
  let lastTop = -1;

  for (const [index, node] of nodes.entries()) {
    const top = (node as HTMLElement).offsetTop;
    if (lastTop !== -1 && top > lastTop + tolerance) {
      groups.push(current);
      current = [];
    }
    current.push(index);
    lastTop = top;
  }

  if (current.length > 0) {
    groups.push(current);
  }

  return groups.length > 0 ? groups : [[0]];
}

function useRevealLineGroups(
  tokens: ContentToken[],
  avatarSize: number,
  fontSize: number,
  enabled: boolean,
  containerRef: RefObject<HTMLDivElement | null>
) {
  const measureRef = useRef<HTMLDivElement>(null);
  const [lineGroups, setLineGroups] = useState<number[][] | null>(null);
  const tokenKey = tokens.map((token) => token.key).join("|");

  // biome-ignore lint/correctness/useExhaustiveDependencies: remasure when layout inputs change
  useLayoutEffect(() => {
    if (!enabled) {
      setLineGroups(null);
      return;
    }

    const container = containerRef.current;
    const measureNode = measureRef.current;
    if (!(container && measureNode)) {
      return;
    }

    let cancelled = false;

    const measure = () => {
      if (cancelled) {
        return;
      }

      let width = container.clientWidth;
      let node: HTMLElement | null = container;
      while (width <= 0 && node) {
        width = node.clientWidth;
        node = node.parentElement;
      }
      if (width > 0) {
        measureNode.style.width = `${width}px`;
      }
      setLineGroups(groupTokensByLine(measureNode, fontSize * 1.35));
    };

    measure();
    document.fonts.ready.then(measure);
    const observer = new ResizeObserver(measure);
    observer.observe(container);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [avatarSize, containerRef, enabled, fontSize, tokenKey]);

  const measureLayer = enabled ? (
    <div
      aria-hidden
      className="pointer-events-none invisible fixed top-0 left-[-9999px] block font-medium tracking-tight [overflow-wrap:break-word]"
      ref={measureRef}
      style={{ fontSize: `${fontSize}px`, lineHeight: 1.35 }}
    >
      {tokens.map((token) =>
        token.kind === "avatar" ? (
          <span
            className="inline-block"
            data-measure-token
            key={token.key}
            style={{
              width: avatarSize,
              height: avatarSize,
              marginRight: 3,
              verticalAlign: "middle",
            }}
          />
        ) : (
          <span
            className="me-[0.25em] inline-block"
            data-measure-token
            key={token.key}
          >
            {token.text}
          </span>
        )
      )}
    </div>
  ) : null;

  return { lineGroups: enabled ? lineGroups : null, measureLayer };
}

function RevealToken({
  allowFocus,
  allowHover,
  alternate,
  avatarSize,
  blurAmount,
  blurOpacity,
  classNames,
  hoveredId,
  label,
  prefersReducedMotion,
  renderAvatar,
  setHoveredId,
  token,
}: {
  allowFocus: boolean;
  allowHover: boolean;
  alternate: Required<InlineTestimonialsAlternateConfig>;
  avatarSize: number;
  blurAmount: number;
  blurOpacity: number;
  classNames?: InlineTestimonialsClassNames;
  hoveredId: string | null;
  label: ResolvedLabelConfig;
  prefersReducedMotion: boolean;
  renderAvatar?: (testimonial: Testimonial, size: number) => ReactNode;
  setHoveredId: (id: string | null) => void;
  token: ContentToken;
}) {
  const isHovered = hoveredId === token.testimonial.id;
  const style = itemVisualStyle(
    token.itemIndex,
    hoveredId,
    token.testimonial.id,
    alternate,
    blurAmount,
    blurOpacity,
    prefersReducedMotion
  );

  if (token.kind === "avatar") {
    return (
      // biome-ignore lint/a11y/noStaticElementInteractions: same progressive enhancement as TestimonialItem
      // biome-ignore lint/a11y/noNoninteractiveElementInteractions: same as above
      <span
        className={cn(
          "relative inline-block",
          classNames?.avatar,
          classNames?.item
        )}
        onBlur={allowFocus ? () => setHoveredId(null) : undefined}
        onFocus={
          allowFocus ? () => setHoveredId(token.testimonial.id) : undefined
        }
        onMouseEnter={
          allowHover ? () => setHoveredId(token.testimonial.id) : undefined
        }
        onMouseLeave={allowHover ? () => setHoveredId(null) : undefined}
        style={{
          ...style,
          width: avatarSize,
          height: avatarSize,
          verticalAlign: "middle",
          marginRight: 3,
        }}
        tabIndex={allowFocus ? 0 : undefined}
      >
        <TestimonialAvatar
          avatarSize={avatarSize}
          renderAvatar={renderAvatar}
          testimonial={token.testimonial}
        />
        <AnimatePresence>
          {isHovered ? (
            <TestimonialLabel
              classNames={classNames}
              label={label}
              prefersReducedMotion={prefersReducedMotion}
              testimonial={token.testimonial}
            />
          ) : null}
        </AnimatePresence>
      </span>
    );
  }

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: same progressive enhancement as TestimonialItem
    // biome-ignore lint/a11y/noNoninteractiveElementInteractions: same as above
    <span
      className={cn("me-[0.25em] inline-block", classNames?.item)}
      onBlur={allowFocus ? () => setHoveredId(null) : undefined}
      onFocus={
        allowFocus ? () => setHoveredId(token.testimonial.id) : undefined
      }
      onMouseEnter={
        allowHover ? () => setHoveredId(token.testimonial.id) : undefined
      }
      onMouseLeave={allowHover ? () => setHoveredId(null) : undefined}
      style={style}
      tabIndex={allowFocus ? 0 : undefined}
    >
      {token.text}
    </span>
  );
}

function RevealLines({
  allowFocus,
  allowHover,
  alternate,
  avatarSize,
  blurAmount,
  blurOpacity,
  classNames,
  hoveredId,
  isInView,
  label,
  lineGroups,
  prefersReducedMotion,
  renderAvatar,
  reveal,
  setHoveredId,
  tokens,
}: {
  allowFocus: boolean;
  allowHover: boolean;
  alternate: Required<InlineTestimonialsAlternateConfig>;
  avatarSize: number;
  blurAmount: number;
  blurOpacity: number;
  classNames?: InlineTestimonialsClassNames;
  hoveredId: string | null;
  isInView: boolean;
  label: ResolvedLabelConfig;
  lineGroups: number[][];
  prefersReducedMotion: boolean;
  renderAvatar?: (testimonial: Testimonial, size: number) => ReactNode;
  reveal: ResolvedRevealConfig;
  setHoveredId: (id: string | null) => void;
  tokens: ContentToken[];
}) {
  const hiddenY = `${reveal.yPercent}%`;
  const shouldAnimate = isInView && !prefersReducedMotion;
  const [doneLines, setDoneLines] = useState<Set<number>>(() =>
    prefersReducedMotion
      ? new Set(lineGroups.map((_, index) => index))
      : new Set()
  );

  return (
    <>
      {lineGroups.map((group, lineIndex) => {
        const lineKey = group
          .map((index) => tokens[index]?.key ?? index)
          .join("|");
        const lineMaskDone = doneLines.has(lineIndex);

        return (
          <span
            className={cn(
              "block w-full [backface-visibility:hidden]",
              lineMaskDone ? "overflow-visible" : "overflow-hidden"
            )}
            key={lineKey}
          >
            <motion.span
              animate={shouldAnimate ? { y: "0%" } : { y: hiddenY }}
              className="block w-full will-change-transform [backface-visibility:hidden]"
              initial={prefersReducedMotion ? { y: "0%" } : { y: hiddenY }}
              onAnimationComplete={() => {
                if (shouldAnimate) {
                  setDoneLines((prev) => {
                    if (prev.has(lineIndex)) {
                      return prev;
                    }
                    const next = new Set(prev);
                    next.add(lineIndex);
                    return next;
                  });
                }
              }}
              transition={{
                duration: prefersReducedMotion ? 0 : reveal.duration,
                delay: prefersReducedMotion
                  ? 0
                  : reveal.delay + lineIndex * reveal.stagger,
                ease: EXPO_OUT,
              }}
            >
              {group.map((tokenIndex) => {
                const token = tokens[tokenIndex];
                if (!token) {
                  return null;
                }

                return (
                  <RevealToken
                    allowFocus={allowFocus}
                    allowHover={allowHover}
                    alternate={alternate}
                    avatarSize={avatarSize}
                    blurAmount={blurAmount}
                    blurOpacity={blurOpacity}
                    classNames={classNames}
                    hoveredId={hoveredId}
                    key={token.key}
                    label={label}
                    prefersReducedMotion={prefersReducedMotion}
                    renderAvatar={renderAvatar}
                    setHoveredId={setHoveredId}
                    token={token}
                  />
                );
              })}
            </motion.span>
          </span>
        );
      })}
      <span className="sr-only">
        {tokens
          .filter((token) => token.kind === "avatar")
          .map(
            (token) =>
              `${token.testimonial.author.name}, ${token.testimonial.author.role}`
          )
          .join(". ")}
      </span>
    </>
  );
}

export function InlineTestimonials({
  testimonials,
  blurAmount = 5,
  blurOpacity = 0.25,
  avatarSize = 32,
  fontSize = 30,
  alternate,
  interaction = "hover",
  hoveredId: controlledHoveredId,
  defaultHoveredId = null,
  onHoveredIdChange,
  renderAvatar,
  label,
  reveal,
  className,
  classNames,
}: InlineTestimonialsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [internalHoveredId, setInternalHoveredId] = useState<string | null>(
    defaultHoveredId
  );
  const prefersReducedMotion = !!useReducedMotion();
  const resolvedReveal = resolveRevealConfig(reveal);
  const isInView = useInView(rootRef, {
    once: resolvedReveal?.once ?? true,
    margin: resolvedReveal?.viewportMargin ?? "0px 0px -25% 0px",
  });

  const isControlled = controlledHoveredId !== undefined;
  const hoveredId = isControlled ? controlledHoveredId : internalHoveredId;

  const setHoveredId = useCallback(
    (id: string | null) => {
      if (!isControlled) {
        setInternalHoveredId(id);
      }
      onHoveredIdChange?.(id);
    },
    [isControlled, onHoveredIdChange]
  );

  const allowHover = interaction === "hover" || interaction === "both";
  const allowFocus = interaction === "focus" || interaction === "both";

  const resolvedAlternate = {
    pattern: alternate?.pattern ?? true,
    opacity: alternate?.opacity ?? 0.7,
  };
  const resolvedLabel = resolveLabelConfig(avatarSize, label);
  const tokens = useMemo(
    () => flattenTestimonials(testimonials),
    [testimonials]
  );
  const revealEnabled = Boolean(resolvedReveal) && !prefersReducedMotion;
  const { lineGroups, measureLayer } = useRevealLineGroups(
    tokens,
    avatarSize,
    fontSize,
    revealEnabled,
    rootRef
  );

  const items = testimonials.map((t, index) => (
    <TestimonialItem
      allowFocus={allowFocus}
      allowHover={allowHover}
      alternate={resolvedAlternate}
      avatarSize={avatarSize}
      blurAmount={blurAmount}
      blurOpacity={blurOpacity}
      classNames={classNames}
      index={index}
      isAnyHovered={hoveredId !== null}
      isHovered={hoveredId === t.id}
      key={t.id}
      label={resolvedLabel}
      prefersReducedMotion={prefersReducedMotion}
      renderAvatar={renderAvatar}
      setHoveredId={setHoveredId}
      testimonial={t}
    />
  ));

  const showReveal = revealEnabled && lineGroups !== null && resolvedReveal;
  const revealPending = revealEnabled && lineGroups === null;

  return (
    <div
      className={cn(
        "font-medium tracking-tight",
        revealPending && "invisible",
        classNames?.root,
        className
      )}
      ref={rootRef}
      style={{ fontSize: `${fontSize}px`, lineHeight: 1.35 }}
    >
      {measureLayer}
      {showReveal && resolvedReveal ? (
        <RevealLines
          allowFocus={allowFocus}
          allowHover={allowHover}
          alternate={resolvedAlternate}
          avatarSize={avatarSize}
          blurAmount={blurAmount}
          blurOpacity={blurOpacity}
          classNames={classNames}
          hoveredId={hoveredId}
          isInView={isInView}
          label={resolvedLabel}
          lineGroups={lineGroups}
          prefersReducedMotion={prefersReducedMotion}
          renderAvatar={renderAvatar}
          reveal={resolvedReveal}
          setHoveredId={setHoveredId}
          tokens={tokens}
        />
      ) : (
        items
      )}
    </div>
  );
}

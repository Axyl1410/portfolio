"use client";

import Link, { type LinkProps } from "next/link";
import type { MouseEvent, ReactNode } from "react";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap-client";

interface AnimatedLinkProps extends LinkProps {
  children: ReactNode;
  className?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

export const AnimatedLink = ({
  children,
  className,
  onClick,
  ...linkProps
}: AnimatedLinkProps) => {
  const lineRef = useRef<HTMLSpanElement | null>(null);
  const { contextSafe } = useGSAP();

  const handleEnter = contextSafe(() => {
    if (!lineRef.current) {
      return;
    }

    gsap.killTweensOf(lineRef.current);
    gsap.fromTo(
      lineRef.current,
      { scaleX: 0, transformOrigin: "left" },
      {
        scaleX: 1,
        duration: 0.3,
        ease: "power3.out",
      }
    );
  });

  const handleLeave = contextSafe(() => {
    if (!lineRef.current) {
      return;
    }

    gsap.killTweensOf(lineRef.current);
    gsap.fromTo(
      lineRef.current,
      { scaleX: 1, transformOrigin: "left" },
      {
        scaleX: 0,
        transformOrigin: "right",
        duration: 0.3,
        ease: "power3.in",
      }
    );
  });

  const combinedClassName = ["relative inline-block", className]
    .filter(Boolean)
    .join(" ");

  return (
    <Link
      {...linkProps}
      className={combinedClassName}
      onClick={onClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <span>{children}</span>
      <span
        className="pointer-events-none absolute bottom-[0.125em] left-0 h-px w-full origin-left scale-x-0 bg-(--color-primary)"
        ref={lineRef}
      />
    </Link>
  );
};

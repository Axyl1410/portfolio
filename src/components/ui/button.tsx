"use client";

import gsap from "gsap";
import type React from "react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ComponentProps<"button">;

function Button({
  className,
  children,
  onMouseEnter,
  onMouseLeave,
  ...props
}: ButtonProps) {
  const topLabelRef = useRef<HTMLSpanElement | null>(null);
  const bottomLabelRef = useRef<HTMLSpanElement | null>(null);

  const handleMouseEnter: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (topLabelRef.current && bottomLabelRef.current) {
      gsap.killTweensOf([topLabelRef.current, bottomLabelRef.current]);

      gsap.to(topLabelRef.current, {
        yPercent: -100,
        duration: 0.3,
        ease: "power2.out",
      });

      gsap.to(bottomLabelRef.current, {
        yPercent: -100,
        duration: 0.3,
        ease: "power2.out",
      });
    }

    onMouseEnter?.(e);
  };

  const handleMouseLeave: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (topLabelRef.current && bottomLabelRef.current) {
      gsap.killTweensOf([topLabelRef.current, bottomLabelRef.current]);

      gsap.to(topLabelRef.current, {
        yPercent: 0,
        duration: 0.3,
        ease: "power2.inOut",
      });

      gsap.to(bottomLabelRef.current, {
        yPercent: 0,
        duration: 0.3,
        ease: "power2.inOut",
      });
    }

    onMouseLeave?.(e);
  };

  return (
    <button
      className={cn(
        "u-pill bg-transparent transition-colors duration-300 hover:bg-black hover:text-white",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <span className="relative inline-block overflow-hidden align-middle">
        <span className="block" ref={topLabelRef}>
          {children}
        </span>
        <span
          className="pointer-events-none absolute top-0 left-0 block translate-y-full"
          ref={bottomLabelRef}
        >
          {children}
        </span>
      </span>
    </button>
  );
}

export { Button };

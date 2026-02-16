"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ReactLenis from "lenis/react";
import { usePathname } from "next/navigation";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const container = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      if (container.current && pathname) {
        gsap.fromTo(
          container.current,
          { opacity: 0 },
          { opacity: 1, delay: 1 }
        );
      }
    },
    { scope: container, dependencies: [pathname] }
  );

  return (
    <>
      <ReactLenis root />
      <div className="bg-white">
        <div ref={container}>{children}</div>
      </div>
    </>
  );
};

export default PageWrapper;

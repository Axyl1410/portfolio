"use client";

import ReactLenis from "lenis/react";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap-client";

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
    { scope: container, dependencies: [pathname], revertOnUpdate: true }
  );

  return (
    <>
      <ReactLenis root />
      <div className="bg-white">
        <div ref={container} style={{ opacity: 0 }}>
          {children}
        </div>
      </div>
    </>
  );
};

export default PageWrapper;

"use client";

import ReactLenis from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap-client";
import { INTRO_LOADER_SESSION_KEY } from "@/lib/intro-loader";

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const container = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const loaderPlayed = sessionStorage.getItem(INTRO_LOADER_SESSION_KEY);
    if (loaderPlayed) {
      document.body.style.background = "black";
    }
  }, []);

  useGSAP(
    () => {
      if (!(container.current && pathname)) {
        return;
      }

      const isHome = pathname === "/";
      const loaderPlayed = sessionStorage.getItem(INTRO_LOADER_SESSION_KEY);

      // On home with loader not yet played: set visible immediately,
      // the loader in page.tsx handles revealing content
      if (isHome && !loaderPlayed) {
        gsap.set(container.current, { opacity: 1 });
        return;
      }

      // Normal page transition fade-in
      gsap.fromTo(container.current, { opacity: 0 }, { opacity: 1, delay: 1 });
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

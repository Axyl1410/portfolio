"use client";

import { MoveLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";
import { createNavClickHandler } from "@/lib/nav-shared";

export const ConstructionPage = () => {
  const transitionRouter = useTransitionRouter();
  const pathname = usePathname();

  const handleGoBack = () => {
    transitionRouter.back();
  };

  const handleGoHome = createNavClickHandler(pathname, transitionRouter, "/");

  return (
    <section className="h-full w-full flex-1 flex-col items-start justify-center bg-white">
      <div className="w-full lg:w-1/2">
        <p className="font-medium text-(--color-primary) text-sm">
          Coming soon
        </p>
        <h1 className="mt-3 font-semibold text-2xl text-gray-800 md:text-3xl">
          Page under construction
        </h1>
        <p className="mt-4 text-gray-500">
          This page is currently under construction. Please come back later to
          explore more content.
        </p>

        <div className="mt-6 flex items-center gap-x-3">
          <button
            className="flex w-1/2 items-center justify-center gap-x-2 rounded-lg border bg-white px-5 py-2 text-gray-700 text-sm transition-colors duration-200 hover:bg-gray-100 sm:w-auto"
            onClick={handleGoBack}
            type="button"
          >
            <MoveLeft className="h-5 w-5" />
            <span>Go back</span>
          </button>

          <a
            className="w-1/2 shrink-0 rounded-lg bg-(--color-primary) px-5 py-2 text-center text-sm text-white tracking-wide transition-colors duration-200 hover:bg-(--color-primary)/80 sm:w-auto"
            href="/"
            onClick={handleGoHome}
          >
            Back to home
          </a>
        </div>
      </div>
    </section>
  );
};

"use client";

import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    document.body.style.background = "black";
  }, []);

  return (
    <section className="flex h-screen w-screen flex-1 flex-col items-center justify-center bg-white">
      <div className="px-4">
        <p className="font-medium text-(--color-primary) text-sm">404 error</p>
        <h1 className="mt-3 font-semibold text-2xl text-gray-800 md:text-3xl">
          Page not found
        </h1>
        <p className="mt-4 text-gray-500">
          Sorry, the page you are looking for doesn't exist.Here are some
          helpful links:
        </p>

        <div className="mt-6 flex items-center gap-x-3">
          <button
            className="flex w-1/2 items-center justify-center gap-x-2 rounded-lg border bg-white px-5 py-2 text-gray-700 text-sm transition-colors duration-200 hover:bg-gray-100 sm:w-auto"
            onClick={() => router.back()}
            type="button"
          >
            <MoveLeft className="h-5 w-5" />
            <span>Go back</span>
          </button>

          <Link
            className="w-1/2 shrink-0 rounded-lg bg-(--color-primary) px-5 py-2 text-center text-sm text-white tracking-wide transition-colors duration-200 hover:bg-(--color-primary)/80 sm:w-auto"
            href="/"
          >
            Take me home
          </Link>
        </div>
      </div>
    </section>
  );
}

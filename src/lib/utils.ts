import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getFirstZodError = (error: ZodError | undefined): string => {
  if (!error) {
    return "Invalid form data";
  }

  const fieldErrors = error.flatten((issue) => issue.message).fieldErrors;

  const allErrors = Object.values(fieldErrors).flat();

  return (allErrors[0] as string | undefined) ?? "Invalid form data";
};

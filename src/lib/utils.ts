import { DateTime } from "luxon";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatMonthYear = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) {
    return trimmed;
  }
  const parsed = DateTime.fromFormat(trimmed, "yyyy-MM");
  if (!parsed.isValid) {
    return trimmed;
  }
  return parsed.toFormat("LLL''yy");
};

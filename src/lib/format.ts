import { DateTime } from "luxon";

import "@/lib/time";

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

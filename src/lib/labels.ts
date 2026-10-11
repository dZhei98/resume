import { getProgress, isOngoing, monthsSince, monthsUntil } from "@/lib/dates";
import type { Title } from "@/types";

export const getTitleLabels = (title: Title, now: Date | null): string[] => {
  const labels: string[] = [];

  if (title.award) {
    labels.push(title.award.label);
  }

  if (now && title.start) {
    if (isOngoing(title.start, title.end, now)) {
      labels.push(title.end && monthsUntil(title.end, now) <= 3 ? "Final Season" : "Now Playing");
    } else if (title.end && monthsSince(title.start, now) <= 6) {
      labels.push("Recently Added");
    }
  }

  return labels;
};

export const isTitleOngoing = (title: Title, now: Date | null): boolean =>
  Boolean(now && isOngoing(title.start, title.end, now));

export const getTitleProgress = (title: Title, now: Date | null): number | null => {
  if (!now) {
    return null;
  }
  return title.end === null ? 0.5 : getProgress(title.start, title.end, now);
};

import { getTitlesByKind } from "@/lib/catalog";
import { recencyKey } from "@/lib/dates";
import type { Title } from "@/types";

const newestFirst = (titles: readonly Title[]): Title[] =>
  [...titles].sort((a, b) => recencyKey(b.start, b.end) - recencyKey(a.start, a.end));

export const getClipTitles = (): Title[] => [
  ...newestFirst(getTitlesByKind("work")),
  ...newestFirst(getTitlesByKind("education")),
];

const clipLines = (title: Title): string[] =>
  title.episodes.flatMap((episode) => (episode.text ? [episode.text] : episode.items ?? []));

export const getHighlight = (title: Title): string => clipLines(title)[0] ?? title.synopsis;

export const getBlurb = (title: Title): string | undefined => clipLines(title)[1];

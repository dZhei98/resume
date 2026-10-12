import { CATEGORIES, getCategory, KIND_LABEL } from "@/constants/categories";
import { CATALOG, getTitlesByKind } from "@/lib/catalog";
import { recencyKey } from "@/lib/dates";
import type { CategoryId, Title } from "@/types";

interface IndexedTitle {
  readonly title: Title;
  readonly words: readonly string[];
}

const tokenize = (value: string): string[] => value.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);

const indexWords = (texts: readonly (string | undefined)[]): string[] =>
  Array.from(new Set(texts.flatMap((text) => (text ? tokenize(text) : []))));

const spannedYears = (title: Title): string[] => {
  if (!title.start) {
    return [];
  }
  const from = Number(title.start.slice(0, 4));
  const to = title.end ? Number(title.end.slice(0, 4)) : from;
  return Array.from({ length: to - from + 1 }, (_, index) => String(from + index));
};

const newestFirst = (a: Title, b: Title) => recencyKey(b.start, b.end) - recencyKey(a.start, a.end);

const categoryOrder = (title: Title): number => {
  const index = CATEGORIES.findIndex((category) => category.id === title.category);
  return index === -1 ? CATEGORIES.length : index;
};

const byCategoryThenNewest = (a: Title, b: Title) =>
  categoryOrder(a) - categoryOrder(b) || newestFirst(a, b);

const INDEX: readonly IndexedTitle[] = CATALOG.filter((title) => title.kind !== "about").map(
  (title) => ({
    title,
    words: indexWords([
      title.name,
      title.domain,
      ...(title.skills ?? []).map((skill) => skill.name),
      title.subtitle,
      KIND_LABEL[title.kind],
      title.category ? getCategory(title.category).label : undefined,
      title.dateRange,
      ...spannedYears(title),
      title.synopsis,
      ...title.episodes.flatMap((episode) => [episode.text, ...(episode.items ?? [])]),
    ]),
  })
);

const matchesToken = (words: readonly string[], token: string): boolean =>
  words.some((word) => word.startsWith(token));

export const searchTitles = (query: string, category?: CategoryId): Title[] => {
  const tokens = tokenize(query);
  const pool = category ? INDEX.filter(({ title }) => title.category === category) : INDEX;
  if (!tokens.length) {
    return category ? pool.map(({ title }) => title).sort(newestFirst) : [];
  }

  return pool
    .filter(({ words }) => tokens.every((token) => matchesToken(words, token)))
    .map(({ title }) => title)
    .sort(byCategoryThenNewest);
};

export const getTopSearches = (): Title[] => getTitlesByKind("work");

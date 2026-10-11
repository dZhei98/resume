import { getCategory, KIND_LABEL } from "@/constants/categories";
import { CATALOG, getTitlesByKind } from "@/lib/catalog";
import { recencyKey } from "@/lib/dates";
import type { CategoryId, Title } from "@/types";

interface IndexedField {
  readonly words: readonly string[];
  readonly weight: number;
}

interface IndexedTitle {
  readonly title: Title;
  readonly fields: readonly IndexedField[];
}

const tokenize = (value: string): string[] => value.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);

const field = (texts: readonly (string | undefined)[], weight: number): IndexedField => ({
  words: Array.from(new Set(texts.flatMap((text) => (text ? tokenize(text) : [])))),
  weight,
});

const spannedYears = (title: Title): string[] => {
  if (!title.start) {
    return [];
  }
  const from = Number(title.start.slice(0, 4));
  const to = title.end ? Number(title.end.slice(0, 4)) : from;
  return Array.from({ length: to - from + 1 }, (_, index) => String(from + index));
};

const newestFirst = (a: Title, b: Title) => recencyKey(b.start, b.end) - recencyKey(a.start, a.end);

const INDEX: readonly IndexedTitle[] = CATALOG.filter((title) => title.kind !== "about").map(
  (title) => ({
    title,
    fields: [
      field([title.name], 5),
      field([title.domain], 3),
      field((title.skills ?? []).map((skill) => skill.name), 3),
      field([title.subtitle], 2),
      field([KIND_LABEL[title.kind], title.category ? getCategory(title.category).label : undefined], 2),
      field([title.dateRange, ...spannedYears(title)], 2),
      field([title.synopsis], 1),
      field(
        title.episodes.flatMap((episode) => [episode.text, ...(episode.items ?? [])]),
        1
      ),
    ],
  })
);

const scoreToken = (fields: readonly IndexedField[], token: string): number =>
  fields.reduce(
    (total, entry) =>
      entry.words.some((word) => word.startsWith(token)) ? total + entry.weight : total,
    0
  );

export const searchTitles = (query: string, category?: CategoryId): Title[] => {
  const tokens = tokenize(query);
  const pool = category ? INDEX.filter(({ title }) => title.category === category) : INDEX;
  if (!tokens.length) {
    return category ? pool.map(({ title }) => title).sort(newestFirst) : [];
  }

  return pool.map(({ title, fields }) => {
    let score = 0;
    for (const token of tokens) {
      const tokenScore = scoreToken(fields, token);
      if (tokenScore === 0) {
        return null;
      }
      score += tokenScore;
    }
    return { title, score };
  })
    .filter((hit): hit is { title: Title; score: number } => hit !== null)
    .sort((a, b) => b.score - a.score || newestFirst(a.title, b.title))
    .map((hit) => hit.title);
};

export const getTopSearches = (): Title[] => getTitlesByKind("work");

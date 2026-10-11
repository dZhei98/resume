const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

const SEASONS: Record<string, { start: number; end: number }> = {
  spring: { start: 1, end: 5 },
  summer: { start: 5, end: 8 },
  fall: { start: 8, end: 12 },
  autumn: { start: 8, end: 12 },
};

const pad = (month: number) => String(month).padStart(2, "0");

const parsePoint = (raw: string, side: "start" | "end"): string | null | undefined => {
  const value = raw.trim().toLowerCase();
  if (value === "present") {
    return null;
  }

  const seasonMatch = value.match(/^(spring|summer|fall|autumn)\s+(\d{4})$/);
  if (seasonMatch) {
    const season = SEASONS[seasonMatch[1]];
    return `${seasonMatch[2]}-${pad(side === "start" ? season.start : season.end)}`;
  }

  const monthMatch = value.match(/^([a-z]{3})[a-z]*\s+(\d{4})$/);
  if (monthMatch) {
    const month = MONTHS.indexOf(monthMatch[1]);
    return month === -1 ? undefined : `${monthMatch[2]}-${pad(month + 1)}`;
  }

  const yearMatch = value.match(/^(\d{4})$/);
  if (yearMatch) {
    return `${yearMatch[1]}-${side === "start" ? "01" : "12"}`;
  }

  return undefined;
};

export const parseDateRange = (
  range: string
): { start?: string; end?: string | null } => {
  const [rawStart, rawEnd] = range.split(/\s+[–—-]\s+/);
  const start = rawStart ? parsePoint(rawStart, "start") ?? undefined : undefined;
  const end = rawEnd === undefined ? start : parsePoint(rawEnd, "end");
  return { start, end };
};

const toMonthIndex = (yearMonth: string) => {
  const [year, month] = yearMonth.split("-").map(Number);
  return year * 12 + (month - 1);
};

export const formatYearLabel = (start?: string, end?: string | null): string | undefined => {
  if (!start) {
    return undefined;
  }
  const startYear = start.slice(0, 4);
  if (end === null) {
    return `${startYear}–`;
  }
  const endYear = end?.slice(0, 4) ?? startYear;
  return startYear === endYear ? startYear : `${startYear}–${endYear}`;
};

const monthStart = (yearMonth: string) => {
  const [year, month] = yearMonth.split("-").map(Number);
  return new Date(year, month - 1, 1);
};

const monthEnd = (yearMonth: string) => {
  const [year, month] = yearMonth.split("-").map(Number);
  return new Date(year, month, 0, 23, 59, 59);
};

export const isOngoing = (start: string | undefined, end: string | null | undefined, now: Date) => {
  if (!start || end === undefined) {
    return false;
  }
  return monthStart(start) <= now && (end === null || monthEnd(end) >= now);
};

export const getProgress = (start: string | undefined, end: string | null | undefined, now: Date) => {
  if (!start || !end) {
    return null;
  }
  const from = monthStart(start).getTime();
  const to = monthEnd(end).getTime();
  return Math.min(1, Math.max(0, (now.getTime() - from) / (to - from)));
};

export const monthsSince = (yearMonth: string, now: Date) =>
  now.getFullYear() * 12 + now.getMonth() - toMonthIndex(yearMonth);

export const monthsUntil = (yearMonth: string, now: Date) =>
  toMonthIndex(yearMonth) - (now.getFullYear() * 12 + now.getMonth());

export const recencyKey = (start?: string, end?: string | null): number => {
  const endKey = end === null ? 99999 : end ? toMonthIndex(end) : 0;
  const startKey = start ? toMonthIndex(start) : 0;
  return endKey * 100000 + startKey;
};

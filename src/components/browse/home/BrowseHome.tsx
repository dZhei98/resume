"use client";

import { getProfile } from "@/constants/profiles";
import { useNow } from "@/hooks/useNow";
import { ABOUT_SLUG, CATALOG, getTitle, getTitles } from "@/lib/catalog";
import { isTitleOngoing } from "@/lib/labels";
import { getCategoryRows, getProfileRows } from "@/lib/rows";
import type { CategoryId, ProfileId, RowSpec, Title } from "@/types";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import React, { useMemo } from "react";
import Billboard from "./Billboard";
import HeroCard from "./HeroCard";
import Row, { type RowKind } from "./Row";
import TintBackdrop from "./TintBackdrop";

type HomeRow = {
  id: string;
  title: string;
  kind: RowKind;
  titles: readonly Title[];
};

const toHomeRow = (row: RowSpec): HomeRow => ({
  id: row.id,
  title: row.title,
  kind: row.variant,
  titles: getTitles(row.slugs),
});

const insertRow = (rows: readonly HomeRow[], index: number, row: HomeRow): HomeRow[] => [
  ...rows.slice(0, index),
  row,
  ...rows.slice(index),
];

const sharedCategory = (titles: readonly Title[]): CategoryId | null => {
  const first = titles[0]?.category ?? null;
  return first && titles.every((title) => title.category === first) ? first : null;
};

const BrowseHome: React.FC<{ profileId: ProfileId; category?: CategoryId }> = ({
  profileId,
  category,
}) => {
  const profile = getProfile(profileId);
  const now = useNow();
  const reduceMotion = useReducedMotion();

  const { hero, staticRows } = useMemo(() => {
    const source = category
      ? getCategoryRows(category)
      : { heroSlug: ABOUT_SLUG, rows: getProfileRows(profileId) };
    return {
      hero: getTitle(source.heroSlug) ?? getTitle(ABOUT_SLUG),
      staticRows: source.rows.map(toHomeRow),
    };
  }, [category, profileId]);

  const rows = useMemo(() => {
    if (category) {
      return staticRows;
    }

    let result: HomeRow[] = [...staticRows];

    const ongoing = CATALOG.filter(
      (title) => (title.kind === "work" || title.kind === "education") && isTitleOngoing(title, now)
    );
    if (ongoing.length) {
      result = insertRow(result, 0, {
        id: "continue-watching",
        title: `Continue Watching for ${profile.name}`,
        kind: "continue",
        titles: ongoing,
      });
    }

    return result;
  }, [category, now, profile.name, staticRows]);

  const exploreHref = (titles: readonly Title[]) => {
    const shared = sharedCategory(titles);
    return shared && shared !== category ? `/${profileId}/genre/${shared}` : undefined;
  };

  return (
    <div className="relative isolate pt-[112px] md:pt-0">
      <TintBackdrop>
        {hero && <HeroCard title={hero} profile={profile} />}
        {hero && <Billboard title={hero} profile={profile} />}
        <div className="relative z-10 mt-8 space-y-6 pb-10 md:mt-[-10vw] md:space-y-[3vw] md:pb-[4vw]">
          <AnimatePresence initial={false}>
            {rows.map((row) => (
              <motion.div
                key={row.id}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Row
                  title={row.title}
                  kind={row.kind}
                  titles={row.titles}
                  now={now}
                  exploreHref={exploreHref(row.titles)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </TintBackdrop>
    </div>
  );
};

export default BrowseHome;

"use client";

import {
  EpisodeBody,
  FOCUS_RING,
  getDisplaySynopsis,
  InfoLine,
  LinkAnchor,
  PrimaryAction,
  SecondaryAction,
  SkillBars,
  TitleBadges,
  TitleMedia,
} from "@/components/browse/modal/DetailParts";
import { MetaLine } from "@/components/browse/ui/MetaLine";
import TitleArt from "@/components/browse/ui/TitleArt";
import { KIND_LABEL } from "@/constants/categories";
import { useOpenTitle } from "@/hooks/useTitleModal";
import { getTitles } from "@/lib/catalog";
import { getSimilarSlugs } from "@/lib/rows";
import type { Title } from "@/types";
import { useReducedMotion } from "framer-motion";
import React, { useId, useMemo, useRef } from "react";
import { IoClose } from "react-icons/io5";

type DesktopDetailsProps = {
  title: Title;
  headingId: string;
  onClose: () => void;
};

const SECTION_HEADING = "text-2xl font-bold text-white";

const SimilarCard: React.FC<{ title: Title; onOpen: () => void }> = ({ title, onOpen }) => (
  <li
    onClick={onOpen}
    className="cursor-pointer overflow-hidden rounded-md bg-netflix-elevated transition-colors hover:bg-[#383838]"
  >
    <button
      type="button"
      aria-label={title.name}
      className={`relative block aspect-video w-full focus-visible:-outline-offset-2 ${FOCUS_RING}`}
    >
      <TitleArt title={title} nameClassName="text-lg" sizes="280px" />
    </button>
    <div className="space-y-2 p-3">
      <MetaLine title={title} />
      <p className="line-clamp-4 text-sm leading-snug text-netflix-muted">{title.synopsis}</p>
    </div>
  </li>
);

const DesktopDetails: React.FC<DesktopDetailsProps> = ({ title, headingId, onClose }) => {
  const openTitle = useOpenTitle();
  const reduceMotion = useReducedMotion();
  const baseId = useId();
  const jumpRef = useRef<HTMLElement>(null);
  const similar = useMemo(() => getTitles(getSimilarSlugs(title.slug, 6)), [title.slug]);
  const synopsis = getDisplaySynopsis(title);

  const jump = () =>
    jumpRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });

  return (
    <>
      <div className="relative aspect-video">
        <TitleMedia title={title} sizes="850px" />
        <div className="absolute inset-0 bg-linear-to-t from-netflix-surface via-netflix-surface/20 to-transparent" />
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className={`absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-netflix-surface text-white transition-colors hover:bg-[#2a2a2a] ${FOCUS_RING}`}
        >
          <IoClose aria-hidden className="h-6 w-6" />
        </button>
        <div className="absolute bottom-12 left-12 right-12">
          <h2
            id={headingId}
            className="line-clamp-3 max-w-[85%] font-display text-6xl uppercase leading-[0.9] tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
          >
            {title.name}
          </h2>
          <div className="mt-6 flex items-center gap-2">
            <PrimaryAction title={title} size="lg" onJump={jump} />
            <SecondaryAction title={title} size="lg" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-8 px-12 pb-8">
        <div className="space-y-4">
          <MetaLine title={title} className="text-base" />
          <TitleBadges title={title} rankClassName="text-lg font-semibold" />
          {title.domain && <p className="font-semibold text-white">{title.domain}</p>}
          {title.subtitle && <p className="font-semibold text-white">{title.subtitle}</p>}
          {synopsis && <p className="text-base leading-relaxed text-white">{synopsis}</p>}
        </div>
        <div className="space-y-3 text-sm">
          {title.dateRange && <InfoLine label="Dates">{title.dateRange}</InfoLine>}
        </div>
      </div>

      {title.episodes.length > 0 && (
        <section
          ref={jumpRef}
          aria-labelledby={`${baseId}-episodes`}
          className="scroll-mt-4 px-12 pb-10"
        >
          <div className="mb-4 flex items-center justify-between gap-4">
            <h3 id={`${baseId}-episodes`} className={SECTION_HEADING}>
              Episodes
            </h3>
            <span className="rounded-sm border border-[#4d4d4d] bg-[#242424] px-4 py-2 text-base font-semibold text-white">
              {title.yearLabel ?? KIND_LABEL[title.kind]}
            </span>
          </div>
          <ol>
            {title.episodes.map((episode, index) => (
              <li
                key={index}
                className={`grid grid-cols-[3rem_8.5rem_minmax(0,1fr)] items-center gap-4 rounded-md border-b border-[#404040] px-4 py-6 ${
                  index === 0 ? "bg-[#333]" : ""
                }`}
              >
                <span className="text-center text-2xl text-netflix-muted">{index + 1}</span>
                <div className="relative aspect-video overflow-hidden rounded-sm">
                  <TitleArt title={title} showName={false} showLogoBadge={false} sizes="136px" />
                </div>
                <div className="min-w-0 space-y-1">
                  <p className="font-semibold text-white">{episode.title}</p>
                  <EpisodeBody episode={episode} className="text-sm" />
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {title.skills?.length ? (
        <section
          ref={title.episodes.length ? undefined : jumpRef}
          aria-labelledby={`${baseId}-proficiency`}
          className="scroll-mt-4 px-12 pb-10"
        >
          <h3 id={`${baseId}-proficiency`} className={`mb-4 ${SECTION_HEADING}`}>
            Proficiency
          </h3>
          <SkillBars skills={title.skills} className="grid-cols-2" />
        </section>
      ) : null}

      {title.links.length > 0 && (
        <section aria-labelledby={`${baseId}-links`} className="px-12 pb-10">
          <h3 id={`${baseId}-links`} className={`mb-4 ${SECTION_HEADING}`}>
            Links
          </h3>
          <div className="flex flex-wrap gap-3">
            {title.links.map((link) => (
              <LinkAnchor
                key={`${link.label}-${link.url}`}
                link={link}
                className="rounded-full border border-white/30 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:border-white hover:bg-white/10"
              />
            ))}
          </div>
        </section>
      )}

      {similar.length > 0 && (
        <section aria-labelledby={`${baseId}-similar`} className="px-12 pb-10">
          <h3 id={`${baseId}-similar`} className={`mb-4 ${SECTION_HEADING}`}>
            More Like This
          </h3>
          <ul className="grid grid-cols-3 gap-4">
            {similar.map((item) => (
              <SimilarCard
                key={item.slug}
                title={item}
                onOpen={() => openTitle(item.slug)}
              />
            ))}
          </ul>
        </section>
      )}

      <section
        aria-labelledby={`${baseId}-about`}
        className="mx-12 border-t-2 border-[#404040] pb-12 pt-8"
      >
        <h3 id={`${baseId}-about`} className="mb-4 text-2xl text-white">
          About <span className="font-bold">{title.name}</span>
        </h3>
        <div className="space-y-2 text-sm">
          <InfoLine label="Category">{KIND_LABEL[title.kind]}</InfoLine>
          {title.dateRange && <InfoLine label="Dates">{title.dateRange}</InfoLine>}
        </div>
      </section>
    </>
  );
};

export default DesktopDetails;

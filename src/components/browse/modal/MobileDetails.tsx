"use client";

import {
  EpisodeBody,
  FOCUS_RING,
  getDisplaySynopsis,
  getJumpLabel,
  LinkAnchor,
  PrimaryAction,
  SecondaryAction,
  SkillBars,
  TitleBadges,
  TitleMedia,
} from "@/components/browse/modal/DetailParts";
import { MetaLine } from "@/components/browse/ui/MetaLine";
import TitleArt from "@/components/browse/ui/TitleArt";
import { useOpenTitle } from "@/hooks/useTitleModal";
import { getTitles } from "@/lib/catalog";
import { getSimilarSlugs } from "@/lib/rows";
import type { Title } from "@/types";
import { useReducedMotion } from "framer-motion";
import React, { useId, useMemo, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";

type TabId = "episodes" | "proficiency" | "links" | "similar";

type MobileDetailsProps = {
  title: Title;
  headingId: string;
  onClose: () => void;
  onHeaderPointerDown: (event: React.PointerEvent<HTMLDivElement>) => void;
};

const MobileDetails: React.FC<MobileDetailsProps> = ({
  title,
  headingId,
  onClose,
  onHeaderPointerDown,
}) => {
  const openTitle = useOpenTitle();
  const reduceMotion = useReducedMotion();
  const baseId = useId();
  const tabsRef = useRef<HTMLDivElement>(null);
  const similar = useMemo(() => getTitles(getSimilarSlugs(title.slug, 6)), [title.slug]);
  const tabs = useMemo(() => {
    const list: { id: TabId; label: string }[] = [];
    if (title.episodes.length) {
      list.push({ id: "episodes", label: "Episodes" });
    }
    if (title.skills?.length) {
      list.push({ id: "proficiency", label: "Proficiency" });
    }
    if (title.links.length) {
      list.push({ id: "links", label: "Links" });
    }
    if (similar.length) {
      list.push({ id: "similar", label: "More Like This" });
    }
    return list;
  }, [title, similar]);
  const [activeTab, setActiveTab] = useState<TabId | undefined>(tabs[0]?.id);
  const synopsis = getDisplaySynopsis(title);
  const tabId = (id: TabId) => `${baseId}-tab-${id}`;
  const panelId = (id: TabId) => `${baseId}-panel-${id}`;

  const jump = () => {
    setActiveTab(getJumpLabel(title) === "Proficiency" ? "proficiency" : "episodes");
    tabsRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  };

  const onTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
      return;
    }
    event.preventDefault();
    const next = tabs[(index + (event.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
    setActiveTab(next.id);
    document.getElementById(tabId(next.id))?.focus();
  };

  return (
    <>
      <div
        onPointerDown={onHeaderPointerDown}
        onDragStart={(event) => event.preventDefault()}
        className="relative aspect-video w-full touch-pan-x select-none"
      >
        <TitleMedia title={title} sizes="100vw" />
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          onPointerDown={(event) => event.stopPropagation()}
          className={`absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white ${FOCUS_RING}`}
        >
          <IoClose aria-hidden className="h-6 w-6" />
        </button>
      </div>

      <div className="space-y-3 px-4 py-3">
        <h2 id={headingId} className="text-2xl font-bold leading-tight text-white">
          {title.name}
        </h2>
        <MetaLine title={title} />
        <TitleBadges title={title} rankClassName="text-sm font-semibold" />
        {title.domain && <p className="text-sm font-semibold text-white">{title.domain}</p>}
        <PrimaryAction title={title} size="md" onJump={jump} className="h-10 w-full" />
        <SecondaryAction title={title} size="md" className="h-10 w-full" />
        {title.subtitle && <p className="text-sm font-semibold text-white">{title.subtitle}</p>}
        {synopsis && <p className="text-sm leading-relaxed text-white">{synopsis}</p>}
      </div>

      {activeTab && (
        <div ref={tabsRef} className="px-4 pt-3">
          <div role="tablist" aria-label="Title details" className="flex gap-6 border-t border-white/15">
            {tabs.map((tab, index) => {
              const selected = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  id={tabId(tab.id)}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={panelId(tab.id)}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveTab(tab.id)}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                  className={`-mt-px border-t-4 pt-3 text-sm font-bold transition-colors ${FOCUS_RING} ${
                    selected ? "border-netflix-red text-white" : "border-transparent text-netflix-gray"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id={panelId(activeTab)}
            aria-labelledby={tabId(activeTab)}
            tabIndex={0}
            className={`rounded pt-4 ${FOCUS_RING}`}
          >
            {activeTab === "episodes" && (
              <ol className="space-y-5">
                {title.episodes.map((episode, index) => (
                  <li key={index}>
                    <div className="grid grid-cols-[7rem_minmax(0,1fr)] items-center gap-3">
                      <div className="relative aspect-video overflow-hidden rounded">
                        <TitleArt title={title} showName={false} showLogoBadge={false} sizes="112px" />
                      </div>
                      <p className="text-sm font-semibold text-white">
                        {index + 1}. {episode.title}
                      </p>
                    </div>
                    <EpisodeBody episode={episode} className="mt-2 text-xs" />
                  </li>
                ))}
              </ol>
            )}
            {activeTab === "proficiency" && title.skills && <SkillBars skills={title.skills} />}
            {activeTab === "links" && (
              <div className="flex flex-wrap gap-3">
                {title.links.map((link) => (
                  <LinkAnchor
                    key={`${link.label}-${link.url}`}
                    link={link}
                    className="rounded-full border border-white/30 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:border-white hover:bg-white/10"
                  />
                ))}
              </div>
            )}
            {activeTab === "similar" && (
              <ul className="grid grid-cols-3 gap-2">
                {similar.map((item) => (
                  <li key={item.slug}>
                    <button
                      type="button"
                      aria-label={item.name}
                      onClick={() => openTitle(item.slug)}
                      className={`relative block aspect-[2/3] w-full overflow-hidden rounded-md ${FOCUS_RING}`}
                    >
                      <TitleArt title={item} nameClassName="text-sm" sizes="33vw" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

    </>
  );
};

export default MobileDetails;

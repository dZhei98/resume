"use client";

import type { Title } from "@/types";
import { useReducedMotion } from "framer-motion";
import Link from "next/link";
import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import ContinueTile from "./ContinueTile";
import TitleTile from "./TitleTile";
import RankedTile from "./RankedTile";

export type RowKind = "standard" | "ranked" | "continue";

type RowProps = {
  title: string;
  kind: RowKind;
  titles: readonly Title[];
  now: Date | null;
  exploreHref?: string;
};

type Pager = {
  pages: number;
  page: number;
  canLeft: boolean;
  canRight: boolean;
};

const PAGE_FRACTION = 0.92;
const INITIAL_PAGER: Pager = { pages: 1, page: 0, canLeft: false, canRight: false };

const HANDLE_CLASSES =
  "group/handle absolute bottom-2 top-0 z-20 hidden w-[4%] items-center justify-center bg-black/50 text-white opacity-0 transition-[opacity,background-color] duration-200 hover:bg-black/70 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white group-hover/row:opacity-100 md:flex";

const CHEVRON_CLASSES =
  "h-[max(1.25rem,2vw)] w-[max(1.25rem,2vw)] transition-transform duration-200 group-hover/handle:scale-125 motion-reduce:transition-none";

const Row: React.FC<RowProps> = ({ title, kind, titles, now, exploreHref }) => {
  const headingId = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [pager, setPager] = useState<Pager>(INITIAL_PAGER);
  const count = titles.length;

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    const first = track.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const pageWidth = track.clientWidth * PAGE_FRACTION;
    const perPage = first ? Math.max(1, Math.round(pageWidth / (first.offsetWidth + gap))) : 1;
    const pages = Math.max(1, Math.ceil(count / perPage));
    const atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
    const next: Pager = {
      pages,
      page: atEnd ? pages - 1 : Math.min(pages - 1, Math.round(track.scrollLeft / pageWidth)),
      canLeft: track.scrollLeft > 2,
      canRight: !atEnd,
    };
    setPager((current) =>
      current.pages === next.pages &&
      current.page === next.page &&
      current.canLeft === next.canLeft &&
      current.canRight === next.canRight
        ? current
        : next
    );
  }, [count]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [measure]);

  const scrollPage = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    track.scrollBy({
      left: direction * track.clientWidth * PAGE_FRACTION,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <section aria-labelledby={headingId} className="group/row relative">
      <div className="mb-2 flex items-end justify-between gap-4 px-4 md:px-gutter">
        <div className="flex min-w-0 items-baseline gap-3">
          <h2
            id={headingId}
            className="truncate text-base font-semibold leading-normal text-netflix-light md:text-[length:max(1.05rem,1.4vw)]"
          >
            {title}
          </h2>
          {exploreHref && (
            <Link
              href={exploreHref}
              aria-label={`Explore All ${title}`}
              className="hidden shrink-0 -translate-x-2 items-center gap-0.5 text-xs font-semibold text-[#54b9c5] opacity-0 transition duration-300 focus-visible:translate-x-0 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white group-hover/row:translate-x-0 group-hover/row:opacity-100 motion-reduce:transition-none md:inline-flex md:text-[length:max(0.75rem,0.9vw)]"
            >
              Explore All
              <IoChevronForward aria-hidden className="h-[1em] w-[1em]" />
            </Link>
          )}
        </div>
        {pager.pages > 1 && (
          <div
            aria-hidden
            className="hidden shrink-0 gap-0.5 opacity-0 transition-opacity duration-300 group-hover/row:opacity-100 md:flex"
          >
            {Array.from({ length: pager.pages }, (_, index) => (
              <span
                key={index}
                className={`h-0.5 w-3 ${index === pager.page ? "bg-white" : "bg-white/30"}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="relative">
        <div
          ref={trackRef}
          onScroll={measure}
          className="flex snap-x snap-mandatory scroll-px-4 gap-1.5 overflow-x-auto px-4 pb-2 md:scroll-px-[4%] md:gap-[0.4vw] md:px-gutter"
        >
          {titles.map((item, index) =>
            kind === "ranked" ? (
              <RankedTile key={item.slug} title={item} rank={index + 1} />
            ) : kind === "continue" ? (
              <ContinueTile key={item.slug} title={item} now={now} />
            ) : (
              <TitleTile key={item.slug} title={item} now={now} />
            )
          )}
        </div>

        {pager.canLeft && (
          <button
            type="button"
            aria-label={`Scroll ${title} left`}
            onClick={() => scrollPage(-1)}
            className={`${HANDLE_CLASSES} left-0`}
          >
            <IoChevronBack aria-hidden className={CHEVRON_CLASSES} />
          </button>
        )}
        {pager.canRight && (
          <button
            type="button"
            aria-label={`Scroll ${title} right`}
            onClick={() => scrollPage(1)}
            className={`${HANDLE_CLASSES} right-0`}
          >
            <IoChevronForward aria-hidden className={CHEVRON_CLASSES} />
          </button>
        )}
      </div>
    </section>
  );
};

export default Row;

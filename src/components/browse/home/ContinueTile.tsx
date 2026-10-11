"use client";

import { LabelTag } from "@/components/browse/ui/Badges";
import TitleArt from "@/components/browse/ui/TitleArt";
import { useOpenTitle } from "@/hooks/useTitleModal";
import { getTitleLabels, getTitleProgress } from "@/lib/labels";
import type { Title } from "@/types";
import { motion, useReducedMotion } from "framer-motion";
import React from "react";
import { useHoverPreview } from "./HoverPreview";
import { FOCUS_RING, TILE_BASE, TILE_NAME, WIDE_TILE_SIZES, WIDE_TILE_WIDTH } from "./tileStyles";

const ContinueTile: React.FC<{ title: Title; now: Date | null }> = ({ title, now }) => {
  const openTitle = useOpenTitle();
  const reduceMotion = useReducedMotion();
  const { tileRef, tileProps, preview, dismiss } = useHoverPreview<HTMLButtonElement>(title);
  const [label] = getTitleLabels(title, now);
  const progress = getTitleProgress(title, now);
  const hasBar = progress !== null;

  return (
    <>
      <button
        ref={tileRef}
        type="button"
        aria-label={label ? `${title.name}, ${label}` : title.name}
        onClick={() => {
          dismiss();
          openTitle(title.slug);
        }}
        className={`${TILE_BASE} ${WIDE_TILE_WIDTH} aspect-video overflow-hidden rounded-md md:rounded-lg`}
        {...tileProps}
      >
        <TitleArt
          title={title}
          nameClassName={`text-base ${TILE_NAME} ${label || hasBar ? "bottom-6" : ""}`}
          sizes={WIDE_TILE_SIZES}
        />
        {label && (
          <LabelTag
            label={label}
            className={`absolute left-1/2 -translate-x-1/2 rounded-b-none ${hasBar ? "bottom-[3px]" : "bottom-0"}`}
          />
        )}
        {hasBar && (
          <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-white/30">
            <motion.span
              className="block h-full origin-left bg-netflix-red"
              initial={reduceMotion ? false : { scaleX: 0 }}
              animate={{ scaleX: progress }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
            />
          </span>
        )}
        <span aria-hidden className={FOCUS_RING} />
      </button>
      {preview}
    </>
  );
};

export default ContinueTile;

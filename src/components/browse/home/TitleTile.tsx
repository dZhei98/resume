"use client";

import { LabelTag, TopBadge } from "@/components/browse/ui/Badges";
import TitleArt from "@/components/browse/ui/TitleArt";
import { useOpenTitle } from "@/hooks/useTitleModal";
import { getTitleLabels } from "@/lib/labels";
import type { Title } from "@/types";
import React from "react";
import { useHoverPreview } from "./HoverPreview";
import { FOCUS_RING, TILE_BASE, TILE_NAME, TILE_SIZES, TILE_WIDTH } from "./tileStyles";

const TitleTile: React.FC<{ title: Title; now: Date | null }> = ({ title, now }) => {
  const openTitle = useOpenTitle();
  const { tileRef, tileProps, preview, dismiss } = useHoverPreview<HTMLButtonElement>(title);
  const [label] = getTitleLabels(title, now);

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
        className={`${TILE_BASE} ${TILE_WIDTH} aspect-2/3 overflow-hidden rounded-md md:aspect-video md:rounded-lg`}
        {...tileProps}
      >
        <TitleArt
          title={title}
          nameClassName={`text-lg ${TILE_NAME} ${label ? "bottom-6" : ""}`}
          sizes={TILE_SIZES}
        />
        {title.rank ? <TopBadge className="absolute right-0 top-0" /> : null}
        {label && (
          <LabelTag
            label={label}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-b-none"
          />
        )}
        <span aria-hidden className={FOCUS_RING} />
      </button>
      {preview}
    </>
  );
};

export default TitleTile;

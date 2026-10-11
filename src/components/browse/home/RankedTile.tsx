"use client";

import TitleArt from "@/components/browse/ui/TitleArt";
import { useOpenTitle } from "@/hooks/useTitleModal";
import type { Title } from "@/types";
import React from "react";
import { useHoverPreview } from "./HoverPreview";
import { FOCUS_RING, TILE_BASE } from "./tileStyles";

const RankedTile: React.FC<{ title: Title; rank: number }> = ({ title, rank }) => {
  const openTitle = useOpenTitle();
  const { tileRef, tileProps, preview, dismiss } = useHoverPreview<HTMLButtonElement>(title);

  return (
    <>
      <button
        ref={tileRef}
        type="button"
        aria-label={`#${rank} ${title.name}`}
        onClick={() => {
          dismiss();
          openTitle(title.slug);
        }}
        className={`${TILE_BASE} aspect-[10/9] w-[42vw] max-w-[14rem] overflow-hidden md:aspect-[4/3] md:w-[22.5vw] md:max-w-none lg:w-[18vw] xl:w-[15vw]`}
        {...tileProps}
      >
        <span
          aria-hidden
          className="text-stroke absolute bottom-0 left-0 translate-y-[0.13em] font-netflix text-[length:min(36vw,12.5rem)] font-black leading-none tracking-[-0.08em] md:text-[16vw] lg:text-[13vw] xl:text-[11vw]"
        >
          {rank}
        </span>
        <span className="absolute right-0 top-0 aspect-[2/3] h-full overflow-hidden rounded-md">
          <TitleArt
            title={title}
            nameClassName="text-base md:text-[length:max(0.85rem,1.1vw)]"
            sizes="(min-width: 1280px) 8vw, (min-width: 1024px) 9vw, (min-width: 768px) 12vw, 26vw"
          />
          <span aria-hidden className={FOCUS_RING} />
        </span>
      </button>
      {preview}
    </>
  );
};

export default RankedTile;

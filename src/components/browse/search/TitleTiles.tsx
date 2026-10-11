import TitleArt from "@/components/browse/ui/TitleArt";
import type { Title } from "@/types";
import React from "react";
import { IoPlayCircleOutline } from "react-icons/io5";

export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

type TileProps = {
  title: Title;
  onSelect: (slug: string) => void;
  sizes?: string;
  className?: string;
};

export const TitleListRow: React.FC<TileProps> = ({ title, onSelect, className = "" }) => (
  <button
    type="button"
    aria-label={title.name}
    onClick={() => onSelect(title.slug)}
    className={`flex w-full items-center gap-3 rounded text-left transition-colors active:bg-white/10 ${FOCUS_RING} ${className}`}
  >
    <div className="relative aspect-video w-36 shrink-0 overflow-hidden rounded">
      <TitleArt title={title} showName={false} sizes="144px" />
    </div>
    <span className="flex-1 text-sm font-semibold text-white">{title.name}</span>
    <IoPlayCircleOutline aria-hidden className="mr-1 shrink-0 text-3xl text-white" />
  </button>
);

export const LandscapeTile: React.FC<TileProps> = ({
  title,
  onSelect,
  sizes = "(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 17vw",
  className = "",
}) => (
  <button
    type="button"
    aria-label={title.name}
    onClick={() => onSelect(title.slug)}
    className={`relative block aspect-video w-full overflow-hidden rounded-md transition duration-200 ease-out hover:brightness-110 md:rounded-lg ${FOCUS_RING} ${className}`}
  >
    <TitleArt title={title} nameClassName="text-lg md:text-xl" sizes={sizes} />
  </button>
);


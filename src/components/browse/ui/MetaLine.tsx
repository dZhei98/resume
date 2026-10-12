"use client";

import { KIND_LABEL } from "@/constants/categories";
import { useNow } from "@/hooks/useNow";
import { getTitleLabels } from "@/lib/labels";
import type { Title } from "@/types";
import React from "react";

export const MetaLine: React.FC<{ title: Title; className?: string }> = ({
  title,
  className = "",
}) => {
  const now = useNow();
  const labels = getTitleLabels(title, now);

  return (
    <div
      className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-netflix-muted ${className}`}
    >
      {labels.map((label) => (
        <span key={label} className="font-semibold text-netflix-green">
          {label}
        </span>
      ))}
      {title.yearLabel && <span>{title.yearLabel}</span>}
      <span className="rounded-sm border border-white/40 px-1.5 text-[11px] uppercase leading-5">
        {KIND_LABEL[title.kind]}
      </span>
      {title.skills ? (
        <span>{title.skills.length} Tools</span>
      ) : (
        title.episodes.length > 1 && <span>{title.episodes.length} Episodes</span>
      )}
    </div>
  );
};

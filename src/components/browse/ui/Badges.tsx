import { TOP_HACKATHON_COUNT } from "@/lib/catalog";
import React from "react";

export const LabelTag: React.FC<{ label: string; className?: string }> = ({
  label,
  className = "",
}) => (
  <span
    className={`inline-block whitespace-nowrap rounded-xs bg-netflix-red px-1.5 py-0.5 text-[10px] font-semibold uppercase leading-none tracking-wide text-white shadow-sm ${className}`}
  >
    {label}
  </span>
);

export const TopBadge: React.FC<{ className?: string }> = ({ className = "" }) => (
  <span
    aria-label={`Top ${TOP_HACKATHON_COUNT}`}
    className={`inline-flex h-7 w-6 shrink-0 flex-col items-center justify-center rounded-[2px] bg-netflix-red leading-none text-white ${className}`}
  >
    <span className="text-[7px] font-bold tracking-tight">TOP</span>
    <span className="text-[11px] font-extrabold">{TOP_HACKATHON_COUNT}</span>
  </span>
);

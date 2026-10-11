"use client";

import { getBlurb, getHighlight } from "@/components/browse/clips/clips";
import { FOCUS_RING } from "@/components/browse/search/TitleTiles";
import TitleArt from "@/components/browse/ui/TitleArt";
import type { Title } from "@/types";
import { animate, motion, useMotionValue, type MotionValue } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useMemo } from "react";

const ZOOM = 0.12;

const formatClock = (seconds: number) => `0:${String(seconds).padStart(2, "0")}`;

const ClipAvatar: React.FC<{ title: Title }> = ({ title }) => (
  <span className="relative block h-10 w-10 shrink-0 overflow-hidden rounded-full bg-white ring-2 ring-white">
    {title.image ? (
      <Image
        src={title.image.src}
        alt=""
        fill
        sizes="40px"
        className={title.image.fit === "cover" ? "object-cover" : "object-contain p-1"}
      />
    ) : (
      <TitleArt title={title} showName={false} showLogoBadge={false} sizes="40px" />
    )}
  </span>
);

type ClipProps = {
  title: Title;
  index: number;
  total: number;
  active: boolean;
  progress: MotionValue<number>;
  seconds: number;
  durationSeconds: number;
  reduceMotion: boolean;
  onOpen: (slug: string) => void;
};

const Clip: React.FC<ClipProps> = ({
  title,
  index,
  total,
  active,
  progress,
  seconds,
  durationSeconds,
  reduceMotion,
  onOpen,
}) => {
  const zoom = useMotionValue(1);
  const highlight = useMemo(() => getHighlight(title), [title]);
  const blurb = useMemo(() => getBlurb(title), [title]);

  useEffect(() => {
    if (active && !reduceMotion) {
      return progress.on("change", (value) => {
        if (value > 0) {
          zoom.set(1 + ZOOM * value);
        }
      });
    }
    const controls = animate(zoom, 1, { duration: reduceMotion ? 0 : 0.4, ease: "easeOut" });
    return () => controls.stop();
  }, [active, reduceMotion, progress, zoom]);

  return (
    <article
      data-index={index}
      aria-label={`${title.name}, clip ${index + 1} of ${total}`}
      className="relative h-full snap-start snap-always overflow-hidden bg-black"
    >
      <motion.div aria-hidden className="absolute inset-0" style={{ scale: zoom }}>
        <TitleArt
          title={title}
          showName={false}
          showLogoBadge={false}
          sizes="(max-width: 768px) 100vw, 420px"
          priority={index === 0}
        />
      </motion.div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/70 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black via-black/60 to-transparent"
      />

      <div className="absolute bottom-6 left-4 right-20 space-y-2">
        <button
          type="button"
          onClick={() => onOpen(title.slug)}
          className={`flex items-center gap-2.5 rounded-full pr-2 text-left ${FOCUS_RING}`}
        >
          <ClipAvatar title={title} />
          <span className="font-bold text-white">{title.name}</span>
        </button>
        {title.domain && (
          <span className="inline-block rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] text-white backdrop-blur-sm">
            {title.domain}
          </span>
        )}
        <p className="line-clamp-3 text-sm font-semibold leading-snug text-white">{highlight}</p>
        {blurb && <p className="line-clamp-2 text-xs text-white/80">{blurb}</p>}
        <button
          type="button"
          onClick={() => onOpen(title.slug)}
          className={`rounded-sm text-xs font-semibold text-white underline-offset-2 hover:underline ${FOCUS_RING}`}
        >
          See More
        </button>
      </div>

      <div aria-hidden className="absolute inset-x-4 bottom-2 flex items-center gap-2">
        <div className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30">
          {active && (
            <motion.div className="h-full origin-left bg-white" style={{ scaleX: progress }} />
          )}
        </div>
        <span className="text-[10px] tabular-nums leading-none text-white/80">
          {formatClock(active ? seconds : 0)} / {formatClock(durationSeconds)}
        </span>
      </div>
    </article>
  );
};

export default React.memo(Clip);

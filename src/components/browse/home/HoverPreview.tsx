"use client";

import { CircleButton } from "@/components/browse/ui/Buttons";
import { MetaLine } from "@/components/browse/ui/MetaLine";
import TitleArt from "@/components/browse/ui/TitleArt";
import { useOpenTitle } from "@/hooks/useTitleModal";
import type { Title } from "@/types";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IoChevronDown, IoPlay } from "react-icons/io5";
import { useTint } from "./TintBackdrop";

const SCALE = 1.5;
const OPEN_DELAY = 350;
const CLOSE_DELAY = 120;
const PREVIEW_QUERY = "(hover: hover) and (min-width: 768px)";
const DESKTOP_QUERY = "(min-width: 768px)";

type Anchor = {
  top: number;
  left: number;
  width: number;
  origin: string;
};

const measureAnchor = (tile: HTMLElement): Anchor => {
  const rect = tile.getBoundingClientRect();
  const viewport = document.documentElement.clientWidth;
  const width = rect.width * SCALE;
  const height = (width * 9) / 16;
  const gutter = viewport * 0.04;
  const isFirst = rect.left - gutter < rect.width / 2;
  const isLast = viewport - gutter - rect.right < rect.width / 2;
  const preferred = isFirst
    ? rect.left
    : isLast
      ? rect.right - width
      : rect.left + (rect.width - width) / 2;
  const left = Math.min(Math.max(preferred, 8), viewport - width - 8);
  const top = rect.top + (rect.height - height) / 2;
  const factor = SCALE / (SCALE - 1);

  return {
    top: top + window.scrollY,
    left: left + window.scrollX,
    width,
    origin: `${(rect.left - left) * factor}px ${(rect.top - top) * factor}px`,
  };
};

type HoverPreviewCardProps = {
  title: Title;
  anchor: Anchor;
  onEnter: () => void;
  onLeave: () => void;
  onClose: () => void;
};

const HoverPreviewCard: React.FC<HoverPreviewCardProps> = ({
  title,
  anchor,
  onEnter,
  onLeave,
  onClose,
}) => {
  const reduceMotion = useReducedMotion();
  const openTitle = useOpenTitle();
  const router = useRouter();
  const hidden = reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1 / SCALE };

  const openDetails = () => {
    onClose();
    openTitle(title.slug);
  };

  const play = () => {
    onClose();
    if (title.href) {
      router.push(title.href);
      return;
    }
    openTitle(title.slug);
  };

  return createPortal(
    <motion.div
      initial={hidden}
      animate={{ opacity: 1, scale: 1 }}
      exit={hidden}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={openDetails}
      className="absolute z-50 cursor-pointer overflow-hidden rounded-lg bg-netflix-surface font-netflix text-white shadow-[0_3px_10px_rgba(0,0,0,0.75)]"
      style={{
        top: anchor.top,
        left: anchor.left,
        width: anchor.width,
        transformOrigin: anchor.origin,
      }}
    >
      <div className="relative aspect-video">
        <TitleArt
          title={title}
          nameClassName="text-2xl md:text-[max(1.25rem,1.9vw)]"
          sizes="(min-width: 1280px) 23vw, (min-width: 1024px) 27vw, 34vw"
        />
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-center gap-2">
          <CircleButton solid label={title.href ? `Open ${title.name}` : `Play ${title.name}`} onClick={play}>
            <IoPlay aria-hidden className="ml-0.5" />
          </CircleButton>
          <CircleButton label={`More info about ${title.name}`} onClick={openDetails} className="ml-auto">
            <IoChevronDown aria-hidden />
          </CircleButton>
        </div>
        <MetaLine title={title} />
        {title.domain && <p className="text-sm text-white">{title.domain}</p>}
      </div>
    </motion.div>,
    document.body
  );
};

export const useHoverPreview = <T extends HTMLElement>(title: Title) => {
  const owner = useId();
  const tileRef = useRef<T>(null);
  const timers = useRef({ open: 0, close: 0 });
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const { show, hide } = useTint();
  const isOpen = anchor !== null;

  const dismiss = useCallback(() => {
    window.clearTimeout(timers.current.open);
    window.clearTimeout(timers.current.close);
    setAnchor(null);
    hide(owner);
  }, [hide, owner]);

  const cancelClose = useCallback(() => {
    window.clearTimeout(timers.current.close);
  }, []);

  const handleEnter = useCallback(() => {
    if (!window.matchMedia(PREVIEW_QUERY).matches) {
      return;
    }
    window.clearTimeout(timers.current.close);
    window.clearTimeout(timers.current.open);
    show(owner, title.tint);
    timers.current.open = window.setTimeout(() => {
      const tile = tileRef.current;
      if (tile) {
        setAnchor((current) => current ?? measureAnchor(tile));
      }
    }, OPEN_DELAY);
  }, [owner, show, title.tint]);

  const handleLeave = useCallback(() => {
    window.clearTimeout(timers.current.open);
    window.clearTimeout(timers.current.close);
    timers.current.close = window.setTimeout(dismiss, CLOSE_DELAY);
  }, [dismiss]);

  const handleFocus = useCallback(() => {
    if (window.matchMedia(DESKTOP_QUERY).matches) {
      show(owner, title.tint);
    }
  }, [owner, show, title.tint]);

  const handleBlur = useCallback(() => {
    if (!isOpen) {
      hide(owner);
    }
  }, [hide, isOpen, owner]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dismiss();
      }
    };
    window.addEventListener("scroll", dismiss, true);
    window.addEventListener("resize", dismiss);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", dismiss, true);
      window.removeEventListener("resize", dismiss);
      window.removeEventListener("keydown", onKey);
    };
  }, [dismiss, isOpen]);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      window.clearTimeout(pending.open);
      window.clearTimeout(pending.close);
      hide(owner);
    };
  }, [hide, owner]);

  return {
    tileRef,
    dismiss,
    tileProps: {
      onMouseEnter: handleEnter,
      onMouseLeave: handleLeave,
      onFocus: handleFocus,
      onBlur: handleBlur,
    },
    preview: (
      <AnimatePresence>
        {anchor && (
          <HoverPreviewCard
            key="preview"
            title={title}
            anchor={anchor}
            onEnter={cancelClose}
            onLeave={handleLeave}
            onClose={dismiss}
          />
        )}
      </AnimatePresence>
    ),
  };
};

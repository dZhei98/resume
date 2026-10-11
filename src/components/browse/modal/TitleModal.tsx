"use client";

import DesktopDetails from "@/components/browse/modal/DesktopDetails";
import MobileDetails from "@/components/browse/modal/MobileDetails";
import { useIsDesktop } from "@/components/browse/modal/useIsDesktop";
import { useActiveTitleSlug, useCloseTitle } from "@/hooks/useTitleModal";
import { getTitle } from "@/lib/catalog";
import type { ProfileId, Title } from "@/types";
import {
  AnimatePresence,
  motion,
  useDragControls,
  useIsPresent,
  useReducedMotion,
  type HTMLMotionProps,
} from "framer-motion";
import React, { useCallback, useEffect, useId, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const SHEET_EASE = [0.32, 0.72, 0, 1] as const;

const SWIPE_CLOSE_OFFSET = 120;

type MotionPreset = Pick<HTMLMotionProps<"div">, "initial" | "animate" | "exit" | "transition">;

const FADE: MotionPreset = {
  initial: { opacity: 0, y: 0 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
  transition: { duration: 0.2, ease: "easeOut" },
};

const SHEET: MotionPreset = {
  initial: { y: "100%" },
  animate: { y: 0 },
  exit: { y: "100%" },
  transition: { duration: 0.3, ease: SHEET_EASE },
};

const PANEL: MotionPreset = {
  initial: { opacity: 0, scale: 0.94, y: 32 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96, y: 24 },
  transition: { duration: 0.25, ease: "easeOut" },
};

type ModalShellProps = {
  title: Title;
  isDesktop: boolean;
  onClose: () => void;
};

const ModalShell: React.FC<ModalShellProps> = ({ title, isDesktop, onClose }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const backdropPressRef = useRef(false);
  const closingRef = useRef(false);
  const isPresent = useIsPresent();
  const reduceMotion = useReducedMotion();
  const dragControls = useDragControls();
  const headingId = useId();

  const requestClose = useCallback(() => {
    if (!isPresent || closingRef.current) {
      return;
    }
    closingRef.current = true;
    onClose();
  }, [isPresent, onClose]);

  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";

    return () => {
      root.style.overflow = overflow;
      if (previous?.isConnected) {
        previous.focus({ preventScroll: true });
      }
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    dialogRef.current?.focus({ preventScroll: true });
  }, [title.slug]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        requestClose();
        return;
      }

      const dialog = dialogRef.current;
      if (event.key !== "Tab" || !dialog) {
        return;
      }

      const items = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (item) => item.getClientRects().length > 0
      );
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (!first || !last) {
        event.preventDefault();
        dialog.focus();
      } else if (!dialog.contains(active)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && (active === first || active === dialog)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [requestClose]);

  const containerMotion = isDesktop || reduceMotion ? FADE : SHEET;
  const panelMotion = isDesktop && !reduceMotion ? PANEL : {};

  return (
    <motion.div
      ref={scrollRef}
      {...containerMotion}
      drag={isDesktop ? false : "y"}
      dragListener={false}
      dragControls={dragControls}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.6 }}
      onDragEnd={(_event, info) => {
        if (info.offset.y > SWIPE_CLOSE_OFFSET) {
          requestClose();
        }
      }}
      onPointerDown={(event) => {
        backdropPressRef.current = event.target === event.currentTarget;
      }}
      onClick={(event) => {
        if (isDesktop && backdropPressRef.current && event.target === event.currentTarget) {
          requestClose();
        }
      }}
      className={`fixed inset-0 z-[60] overflow-y-auto overscroll-contain ${
        isDesktop ? "bg-black/70" : "bg-netflix-bg"
      }`}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        tabIndex={-1}
        {...panelMotion}
        className={
          isDesktop
            ? "relative mx-auto my-8 w-[min(850px,94vw)] overflow-hidden rounded-lg bg-netflix-surface shadow-2xl outline-none"
            : "min-h-full pb-10 outline-none"
        }
      >
        {isDesktop ? (
          <DesktopDetails key={title.slug} title={title} headingId={headingId} onClose={requestClose} />
        ) : (
          <MobileDetails
            key={title.slug}
            title={title}
            headingId={headingId}
            onClose={requestClose}
            onHeaderPointerDown={(event) => dragControls.start(event)}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

const TitleModal: React.FC<{ profileId: ProfileId }> = () => {
  const slug = useActiveTitleSlug();
  const title = slug ? getTitle(slug) : undefined;
  const close = useCloseTitle();
  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (slug && !title) {
      close();
    }
  }, [slug, title, close]);

  return (
    <AnimatePresence>
      {title && <ModalShell key="title-modal" title={title} isDesktop={isDesktop} onClose={close} />}
    </AnimatePresence>
  );
};

export default TitleModal;

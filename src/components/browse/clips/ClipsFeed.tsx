"use client";

import Clip from "@/components/browse/clips/Clip";
import { getClipTitles } from "@/components/browse/clips/clips";
import { FOCUS_RING } from "@/components/browse/search/TitleTiles";
import { useActiveTitleSlug, useOpenTitle } from "@/hooks/useTitleModal";
import { useMotionValue, useReducedMotion } from "framer-motion";
import React, { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

const CLIP_MS = 8000;

const ModalWatcher: React.FC<{ onChange: (open: boolean) => void }> = ({ onChange }) => {
  const open = Boolean(useActiveTitleSlug());
  useEffect(() => onChange(open), [open, onChange]);
  return null;
};

const StepButton: React.FC<{
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ label, onClick, children }) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    onClick={onClick}
    className={`flex h-12 w-12 items-center justify-center rounded-full bg-netflix-elevated text-2xl text-white transition-colors hover:bg-[#454545] ${FOCUS_RING}`}
  >
    {children}
  </button>
);

const CLIPS = getClipTitles();

const ClipsFeed: React.FC = () => {
  const clips = CLIPS;
  const openTitle = useOpenTitle();
  const reduceMotion = Boolean(useReducedMotion());
  const progress = useMotionValue(0);
  const feedRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const elapsedRef = useRef(0);
  const [active, setActive] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const activate = useCallback(
    (index: number) => {
      if (index === activeRef.current) {
        return;
      }
      activeRef.current = index;
      elapsedRef.current = 0;
      progress.set(0);
      setSeconds(0);
      setActive(index);
    },
    [progress]
  );

  const scrollToClip = useCallback(
    (index: number) => {
      const feed = feedRef.current;
      const target = feed?.querySelector<HTMLElement>(`[data-index="${index}"]`);
      if (feed && target) {
        feed.scrollTo({ top: target.offsetTop, behavior: reduceMotion ? "auto" : "smooth" });
      }
    },
    [reduceMotion]
  );

  useEffect(() => {
    const feed = feedRef.current;
    if (!feed) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            activate(Number((entry.target as HTMLElement).dataset.index));
          }
        });
      },
      { root: feed, threshold: 0.6 }
    );
    feed.querySelectorAll<HTMLElement>("[data-index]").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [clips, activate]);

  useEffect(() => {
    const update = () => setHidden(document.visibilityState === "hidden");
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  const paused = pressed || hovered || hidden || modalOpen;

  useEffect(() => {
    if (paused || elapsedRef.current >= CLIP_MS) {
      return;
    }
    let frame = 0;
    let last: number | null = null;
    const tick = (time: number) => {
      if (last !== null) {
        elapsedRef.current = Math.min(CLIP_MS, elapsedRef.current + time - last);
      }
      last = time;
      progress.set(elapsedRef.current / CLIP_MS);
      setSeconds(Math.floor(elapsedRef.current / 1000));
      if (elapsedRef.current < CLIP_MS) {
        frame = window.requestAnimationFrame(tick);
      } else if (!reduceMotion && clips.length > 1) {
        scrollToClip((active + 1) % clips.length);
      }
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [paused, active, clips.length, reduceMotion, progress, scrollToClip]);

  const release = () => setPressed(false);

  return (
    <div className="md:relative md:mx-auto md:mt-24 md:w-[min(420px,100%)]">
      <Suspense fallback={null}>
        <ModalWatcher onChange={setModalOpen} />
      </Suspense>

      <div
        ref={feedRef}
        onPointerDown={() => setPressed(true)}
        onPointerUp={release}
        onPointerCancel={release}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") {
            setHovered(true);
          }
        }}
        onPointerLeave={(event) => {
          release();
          if (event.pointerType === "mouse") {
            setHovered(false);
          }
        }}
        className="fixed inset-x-0 bottom-16 top-0 z-30 snap-y snap-mandatory overflow-y-auto overscroll-contain bg-black md:relative md:inset-auto md:z-auto md:h-[calc(100vh-8rem)] md:rounded-xl"
      >
        <div className="pointer-events-none sticky top-0 z-10 h-0">
          <h1 className="px-4 pt-3 text-xl font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
            Clips
          </h1>
        </div>
        {clips.map((title, index) => (
          <Clip
            key={title.slug}
            title={title}
            index={index}
            total={clips.length}
            active={index === active}
            progress={progress}
            seconds={index === active ? seconds : 0}
            durationSeconds={CLIP_MS / 1000}
            reduceMotion={reduceMotion}
            onOpen={openTitle}
          />
        ))}
      </div>

      <div className="absolute left-full top-1/2 ml-6 hidden -translate-y-1/2 flex-col gap-3 md:flex">
        <StepButton
          label="Previous clip"
          onClick={() => scrollToClip((active - 1 + clips.length) % clips.length)}
        >
          <IoChevronUp aria-hidden />
        </StepButton>
        <StepButton
          label="Next clip"
          onClick={() => scrollToClip((active + 1) % clips.length)}
        >
          <IoChevronDown aria-hidden />
        </StepButton>
      </div>

    </div>
  );
};

export default ClipsFeed;

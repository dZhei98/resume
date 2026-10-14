"use client";

import { useHydrated } from "@/hooks/useHydrated";
import { motion, type Variants } from "framer-motion";
import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";

const BURST_START = 1.35;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const LETTERS = "JOSHUA NEE".split("");
const CENTER = (LETTERS.length - 1) / 2;

const STREAK_COLORS = [
  "#E50914",
  "#FF1E2D",
  "#B20710",
  "#FF3D5A",
  "#F2167A",
  "#E01FD0",
  "#B624F0",
  "#8A2BE2",
  "#6A3DF0",
  "#E50914",
  "#FF4545",
  "#3B6BFF",
  "#C3125F",
  "#1FA2FF",
];

const noise = (index: number, salt: number) => {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
};

const STREAKS = Array.from({ length: 46 }, (_, index) => {
  const wide = noise(index, 2) > 0.82;
  return {
    left: 1 + noise(index, 1) * 98,
    width: wide ? 6 + noise(index, 3) * 8 : 1 + noise(index, 3) * 2.5,
    color: STREAK_COLORS[Math.floor(noise(index, 4) * STREAK_COLORS.length)],
    opacity: wide ? 0.25 + noise(index, 5) * 0.25 : 0.55 + noise(index, 5) * 0.45,
    head: 8 + noise(index, 6) * 30,
    tail: 62 + noise(index, 7) * 30,
    delay: noise(index, 8) * 0.2,
  };
});

const OVERLAY: Variants = {
  idle: { opacity: 1 },
  play: { opacity: 0, transition: { delay: 2.05, duration: 0.35, ease: "easeOut" } },
  skip: { opacity: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

type Phase = "idle" | "play" | "skip";

const Ident: React.FC = () => (
  <div className="relative">
    <motion.div
      className="flex items-center font-display text-[min(19vw,9rem)] leading-none"
      style={{ originX: 0.5, originY: 0.5 }}
      initial={{ scale: 1, opacity: 1 }}
      animate={{ scale: [1, 1.06, 13], opacity: [1, 1, 0] }}
      transition={{
        scale: { duration: 2, times: [0, 0.55, 1], ease: ["linear", [0.7, 0, 0.9, 0.4]] },
        opacity: { duration: 1.85, times: [0, 0.8, 1], ease: "easeIn" },
      }}
    >
      {LETTERS.map((letter, index) =>
        letter === " " ? (
          <span key={index} className="w-[0.22em]" />
        ) : (
          <span
            key={index}
            className="inline-block"
            style={{ transform: `scaleY(${(1 + 0.017 * (index - CENTER) ** 2).toFixed(3)})` }}
          >
            <motion.span
              className="inline-block bg-gradient-to-b from-[#FF1E2D] via-netflix-red to-netflix-red-dark bg-clip-text text-transparent drop-shadow-[0_3px_4px_rgba(0,0,0,0.6)]"
              style={{ originY: 1 }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ delay: 0.1 + index * 0.06, duration: 0.36, ease: [0.65, 0, 0.35, 1] }}
            >
              {letter}
            </motion.span>
          </span>
        )
      )}
    </motion.div>
    <motion.div
      className="absolute h-[170vh] w-[170vw]"
      style={{ left: "50%", top: "50%", x: "-50%", y: "-50%" }}
      initial={{ scaleX: 0.05, opacity: 0 }}
      animate={{ scaleX: [0.05, 1, 1.9], opacity: [0, 1, 1, 0] }}
      transition={{
        scaleX: {
          delay: BURST_START,
          duration: 0.9,
          times: [0, 0.55, 1],
          ease: ["easeIn", "easeOut"],
        },
        opacity: { delay: BURST_START, duration: 0.9, times: [0, 0.22, 0.7, 1] },
      }}
    >
      {STREAKS.map((streak, index) => (
        <motion.span
          key={index}
          className="absolute top-0 block h-full rounded-full mix-blend-screen"
          style={{
            left: `${streak.left}%`,
            width: streak.width,
            background: `linear-gradient(to bottom, transparent ${streak.head}%, ${streak.color} 50%, transparent ${streak.tail}%)`,
          }}
          initial={{ scaleY: 0.2, opacity: 0 }}
          animate={{ scaleY: 1, opacity: streak.opacity }}
          transition={{ delay: BURST_START + streak.delay, duration: 0.5, ease: "easeOut" }}
        />
      ))}
    </motion.div>
  </div>
);

const IntroTadum: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const hydrated = useHydrated();
  const motionAllowed = hydrated && !window.matchMedia(REDUCED_MOTION_QUERY).matches;
  const [skipped, setSkipped] = useState(false);
  const phase: Phase = !motionAllowed ? "idle" : skipped ? "skip" : "play";

  const skip = useCallback(() => setSkipped(true), []);

  useLayoutEffect(() => {
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
      onDone();
    }
  }, [onDone]);

  useEffect(() => {
    window.addEventListener("keydown", skip);
    return () => window.removeEventListener("keydown", skip);
  }, [skip]);

  return (
    <motion.div
      aria-hidden
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-hidden bg-black"
      variants={OVERLAY}
      initial="idle"
      animate={phase}
      onClick={skip}
      onAnimationComplete={(definition) => {
        if (definition === "play" || definition === "skip") {
          onDone();
        }
      }}
    >
      {phase !== "idle" && <Ident />}
    </motion.div>
  );
};

export default IntroTadum;

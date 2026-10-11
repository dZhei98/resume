"use client";

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

type TintApi = {
  show: (owner: string, color: string) => void;
  hide: (owner: string) => void;
};

const TintContext = createContext<TintApi>({
  show: () => undefined,
  hide: () => undefined,
});

export const useTint = () => useContext(TintContext);

export const tintAlpha = (color: string, alpha: number) =>
  `color-mix(in srgb, ${color} ${Math.round(alpha * 100)}%, transparent)`;

const MASK = "radial-gradient(120% 90% at 50% 55%, #000 0%, transparent 80%)";
const HIDE_DELAY = 250;

const TintBackdrop: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [color, setColor] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const owner = useRef<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const api = useMemo<TintApi>(
    () => ({
      show: (id, next) => {
        window.clearTimeout(timer.current);
        owner.current = id;
        setColor(next);
        setVisible(true);
      },
      hide: (id) => {
        if (owner.current !== id) {
          return;
        }
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => {
          if (owner.current === id) {
            owner.current = null;
            setVisible(false);
          }
        }, HIDE_DELAY);
      },
    }),
    []
  );

  useEffect(() => {
    const pending = timer;
    return () => window.clearTimeout(pending.current);
  }, []);

  return (
    <TintContext.Provider value={api}>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 hidden transition-[background-color,opacity] duration-700 ease-out motion-reduce:transition-none md:block"
        style={{
          backgroundColor: color ?? "transparent",
          opacity: visible ? 0.2 : 0,
          maskImage: MASK,
          WebkitMaskImage: MASK,
        }}
      />
      {children}
    </TintContext.Provider>
  );
};

export default TintBackdrop;

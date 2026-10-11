"use client";

import { useEffect, useState } from "react";

const COLLAPSE_OFFSET = 104;
const DIRECTION_THRESHOLD = 6;

type ScrollState = {
  scrolled: boolean;
  scrollingDown: boolean;
};

export const useScrollState = (): ScrollState => {
  const [state, setState] = useState<ScrollState>({ scrolled: false, scrollingDown: false });

  useEffect(() => {
    let anchor = Math.max(0, window.scrollY);

    const update = () => {
      const y = Math.max(0, window.scrollY);
      const delta = y - anchor;
      const settled = y <= COLLAPSE_OFFSET || Math.abs(delta) >= DIRECTION_THRESHOLD;
      if (settled) {
        anchor = y;
      }

      setState((previous) => {
        const scrolled = y > 0;
        const scrollingDown =
          y <= COLLAPSE_OFFSET ? false : settled ? delta > 0 : previous.scrollingDown;
        return previous.scrolled === scrolled && previous.scrollingDown === scrollingDown
          ? previous
          : { scrolled, scrollingDown };
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return state;
};

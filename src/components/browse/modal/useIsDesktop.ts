"use client";

import { useSyncExternalStore } from "react";

const DESKTOP_QUERY = "(min-width: 768px)";

const subscribe = (listener: () => void) => {
  const media = window.matchMedia(DESKTOP_QUERY);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
};

const getSnapshot = () => window.matchMedia(DESKTOP_QUERY).matches;

const getServerSnapshot = () => false;

export const useIsDesktop = (): boolean =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

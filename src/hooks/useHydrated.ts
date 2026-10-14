"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

export const useHydrated = (): boolean =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

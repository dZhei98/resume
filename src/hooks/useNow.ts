"use client";

import { useHydrated } from "@/hooks/useHydrated";
import { useState } from "react";

export const useNow = (): Date | null => {
  const hydrated = useHydrated();
  const [now] = useState(() => new Date());

  return hydrated ? now : null;
};

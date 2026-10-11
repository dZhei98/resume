"use client";

import { useEffect, useState } from "react";

export const useNow = (): Date | null => {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
  }, []);

  return now;
};

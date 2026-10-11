"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export const TITLE_PARAM = "title";

let pushedUrl: string | null = null;

export const useOpenTitle = () => {
  const router = useRouter();
  const pathname = usePathname();

  return useCallback(
    (slug: string) => {
      const params = new URLSearchParams(window.location.search);
      const alreadyOpen = params.has(TITLE_PARAM);
      params.set(TITLE_PARAM, slug);
      const url = `${pathname}?${params.toString()}`;

      if (alreadyOpen) {
        if (pushedUrl) {
          pushedUrl = url;
        }
        router.replace(url, { scroll: false });
        return;
      }
      pushedUrl = url;
      router.push(url, { scroll: false });
    },
    [router, pathname]
  );
};

export const useCloseTitle = () => {
  const router = useRouter();
  const pathname = usePathname();

  return useCallback(() => {
    const current = `${window.location.pathname}${window.location.search}`;
    const wasPushed = pushedUrl === current;
    pushedUrl = null;
    if (wasPushed) {
      router.back();
      return;
    }
    const params = new URLSearchParams(window.location.search);
    params.delete(TITLE_PARAM);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [router, pathname]);
};

export const useActiveTitleSlug = (): string | null => useSearchParams().get(TITLE_PARAM);

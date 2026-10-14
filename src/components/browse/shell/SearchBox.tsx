"use client";

import { FOCUS_RING_INSET } from "@/components/browse/shell/styles";
import { useHydrated } from "@/hooks/useHydrated";
import type { ProfileId } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { IoClose, IoSearchOutline } from "react-icons/io5";

const DEBOUNCE_MS = 250;

const SearchBox: React.FC<{ profileId: ProfileId }> = ({ profileId }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchPath = `/${profileId}/search`;
  const onSearchRoute = pathname === searchPath;
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [pendingQuery, setPendingQuery] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const expanded = open || onSearchRoute || value !== "";

  const navigate = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      const target = trimmed ? `${searchPath}?q=${encodeURIComponent(trimmed)}` : searchPath;
      if (window.location.pathname === searchPath) {
        router.replace(target, { scroll: false });
      } else if (trimmed) {
        router.push(target);
      }
    },
    [router, searchPath]
  );

  useEffect(() => {
    if (pendingQuery === null) {
      return;
    }
    const timer = window.setTimeout(() => {
      setPendingQuery(null);
      navigate(pendingQuery);
    }, DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [pendingQuery, navigate]);

  const syncPathname = useHydrated() ? pathname : null;
  const [syncedPathname, setSyncedPathname] = useState<string | null>(null);

  if (syncPathname !== syncedPathname) {
    setSyncedPathname(syncPathname);
    if (syncPathname === searchPath) {
      const query = new URLSearchParams(window.location.search).get("q") ?? "";
      setValue((current) => current || query);
    } else if (syncPathname !== null) {
      setPendingQuery(null);
      setValue("");
      setOpen(false);
    }
  }

  const handleOpen = () => {
    setOpen(true);
    inputRef.current?.focus();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    setPendingQuery(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPendingQuery(null);
    navigate(value);
  };

  const handleClear = () => {
    setValue("");
    setPendingQuery(null);
    navigate("");
    inputRef.current?.focus();
  };

  const keepInputFocus = (event: React.MouseEvent) => {
    if (expanded) {
      event.preventDefault();
    }
  };

  return (
    <div className="relative h-9 w-9 shrink-0">
      <form
        role="search"
        onSubmit={handleSubmit}
        className={`absolute right-0 top-0 flex h-9 items-center overflow-hidden border transition-[width,background-color,border-color] duration-300 ease-out motion-reduce:transition-none ${
          expanded ? "w-64 border-white bg-black/75" : "w-9 border-transparent bg-transparent"
        }`}
      >
        <button
          type="button"
          aria-label="Search"
          onMouseDown={keepInputFocus}
          onClick={handleOpen}
          className={`flex h-full w-9 shrink-0 items-center justify-center text-white ${FOCUS_RING_INSET}`}
        >
          <IoSearchOutline aria-hidden className="h-6 w-6" />
        </button>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            if (!value) {
              setOpen(false);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.currentTarget.blur();
            }
          }}
          tabIndex={expanded ? 0 : -1}
          aria-label="Search titles"
          placeholder="Keyword, category, or date"
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="search"
          className="h-full min-w-0 flex-1 bg-transparent pr-2 text-sm text-white placeholder:text-netflix-muted focus:outline-none"
        />
        {value && (
          <button
            type="button"
            aria-label="Clear search"
            onMouseDown={keepInputFocus}
            onClick={handleClear}
            className={`flex h-full w-9 shrink-0 items-center justify-center text-white ${FOCUS_RING_INSET}`}
          >
            <IoClose aria-hidden className="h-5 w-5" />
          </button>
        )}
      </form>
    </div>
  );
};

export default SearchBox;

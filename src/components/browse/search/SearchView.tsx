"use client";

import { FOCUS_RING, LandscapeTile, TitleListRow } from "@/components/browse/search/TitleTiles";
import { CATEGORIES, isCategoryId } from "@/constants/categories";
import { TITLE_PARAM, useOpenTitle } from "@/hooks/useTitleModal";
import { getTopSearches, searchTitles } from "@/lib/search";
import type { CategoryId, ProfileId, Title } from "@/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IoClose, IoSearch } from "react-icons/io5";

const QUERY_PARAM = "q";
const CATEGORY_PARAM = "c";
const DEBOUNCE_MS = 200;
const TOP_SEARCHES = getTopSearches();

type SelectHandler = (slug: string) => void;

const TitleList: React.FC<{ titles: readonly Title[]; onSelect: SelectHandler }> = ({
  titles,
  onSelect,
}) => (
  <ul className="flex flex-col gap-2 md:hidden">
    {titles.map((title) => (
      <li key={title.slug}>
        <TitleListRow title={title} onSelect={onSelect} />
      </li>
    ))}
  </ul>
);

const TopSearches: React.FC<{ onSelect: SelectHandler }> = ({ onSelect }) => (
  <section aria-labelledby="top-searches-heading">
    <h2 id="top-searches-heading" className="mb-3 text-lg font-bold text-white md:mb-4">
      Top Searches
    </h2>
    <TitleList titles={TOP_SEARCHES} onSelect={onSelect} />
    <ul className="hidden gap-2 md:grid md:grid-cols-4 lg:grid-cols-6">
      {TOP_SEARCHES.map((title) => (
        <li key={title.slug}>
          <LandscapeTile title={title} onSelect={onSelect} />
        </li>
      ))}
    </ul>
  </section>
);

const CategoryBar: React.FC<{
  active: CategoryId | null;
  onToggle: (category: CategoryId) => void;
}> = ({ active, onToggle }) => (
  <div className="mb-6 flex items-center gap-x-2 gap-y-1 overflow-x-auto whitespace-nowrap text-sm md:flex-wrap">
    <span className="text-netflix-gray">Explore titles related to:</span>
    {CATEGORIES.map((category, index) => (
      <React.Fragment key={category.id}>
        {index > 0 && (
          <span aria-hidden className="text-netflix-gray">
            |
          </span>
        )}
        <button
          type="button"
          aria-pressed={active === category.id}
          onClick={() => onToggle(category.id)}
          className={`rounded-sm hover:underline ${
            active === category.id ? "font-semibold text-white underline" : "text-netflix-light"
          } ${FOCUS_RING}`}
        >
          {category.label}
        </button>
      </React.Fragment>
    ))}
  </div>
);

const Results: React.FC<{ titles: readonly Title[]; onSelect: SelectHandler }> = ({
  titles,
  onSelect,
}) => (
  <section aria-label="Search results">
    <h2 className="mb-3 text-lg font-bold text-white md:hidden">Top Results</h2>
    <TitleList titles={titles} onSelect={onSelect} />
    <ul className="hidden grid-cols-2 gap-2 md:grid md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {titles.map((title) => (
        <li key={title.slug}>
          <LandscapeTile title={title} onSelect={onSelect} />
        </li>
      ))}
    </ul>
  </section>
);

const NoResults: React.FC<{ query: string }> = ({ query }) => (
  <div className="py-6 text-sm text-netflix-light md:mx-auto md:max-w-xl md:py-16 md:text-base">
    <p>Your search for "{query}" did not have any matches.</p>
    <p className="mt-4">Suggestions:</p>
    <ul className="mt-2 list-disc space-y-1 pl-8">
      <li>Try different keywords</li>
      <li>Looking for a skill? Try "Golang" or "React"</li>
      <li>Try a company or school name</li>
      <li>Try a year, like "2024", or a month, like "Sep 2024"</li>
    </ul>
  </div>
);

const SearchScreen: React.FC<{ urlQuery: string; category: CategoryId | null }> = ({
  urlQuery,
  category,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const openTitle = useOpenTitle();
  const inputRef = useRef<HTMLInputElement>(null);
  const pending = useRef<string | null>(null);
  const [value, setValue] = useState(urlQuery);
  const [query, setQuery] = useState(urlQuery);

  const commit = useCallback(
    (next: string) => {
      setQuery(next);
      const trimmed = next.trim();
      const params = new URLSearchParams(window.location.search);
      if ((params.get(QUERY_PARAM) ?? "") === trimmed) {
        return;
      }
      if (trimmed) {
        params.set(QUERY_PARAM, trimmed);
      } else {
        params.delete(QUERY_PARAM);
      }
      pending.current = trimmed;
      const search = params.toString();
      router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
    },
    [router, pathname]
  );

  useEffect(() => {
    if (pending.current !== null) {
      if (pending.current === urlQuery) {
        pending.current = null;
      }
      return;
    }
    setValue(urlQuery);
    setQuery(urlQuery);
  }, [urlQuery]);

  useEffect(() => {
    if (value === query) {
      return;
    }
    const timer = window.setTimeout(() => commit(value), DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [value, query, commit]);

  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has(TITLE_PARAM)) {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, []);

  const trimmed = query.trim();
  const results = useMemo(() => searchTitles(trimmed, category ?? undefined), [trimmed, category]);

  const clear = () => {
    setValue("");
    commit("");
    inputRef.current?.focus();
  };

  const toggleCategory = (next: CategoryId) => {
    const params = new URLSearchParams(window.location.search);
    if (category === next) {
      params.delete(CATEGORY_PARAM);
    } else {
      params.set(CATEGORY_PARAM, next);
    }
    const search = params.toString();
    router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    commit(value);
    inputRef.current?.blur();
  };

  return (
    <div className="pb-8 md:pt-24">
      <div className="sticky top-0 z-30 bg-netflix-bg px-4 pb-3 pt-3 md:static md:bg-transparent md:px-gutter md:pb-8 md:pt-0">
        <form role="search" onSubmit={submit} className="relative md:max-w-3xl">
          <label htmlFor="title-search" className="sr-only">
            Search titles
          </label>
          <IoSearch
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xl text-netflix-muted md:left-4 md:text-2xl"
          />
          <input
            ref={inputRef}
            id="title-search"
            type="text"
            inputMode="search"
            enterKeyHint="search"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Search by keyword, category, or date"
            className="h-10 w-full rounded bg-[#333] pl-10 pr-10 text-base text-white placeholder:text-netflix-muted focus:outline-none focus:ring-1 focus:ring-white/50 md:h-14 md:pl-14 md:pr-14 md:text-lg"
          />
          {value && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={clear}
              className={`absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-xl text-netflix-muted transition-colors hover:text-white md:right-3 md:h-10 md:w-10 md:text-2xl ${FOCUS_RING}`}
            >
              <IoClose aria-hidden />
            </button>
          )}
        </form>
      </div>

      <div className="px-4 md:px-gutter">
        <CategoryBar active={category} onToggle={toggleCategory} />
        {!trimmed && !category ? (
          <TopSearches onSelect={openTitle} />
        ) : results.length ? (
          <Results titles={results} onSelect={openTitle} />
        ) : (
          <NoResults query={trimmed} />
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {trimmed || category
          ? `${results.length} ${results.length === 1 ? "result" : "results"}`
          : ""}
      </p>
    </div>
  );
};

const SearchWithParams: React.FC = () => {
  const params = useSearchParams();
  const urlQuery = params.get(QUERY_PARAM) ?? "";
  const rawCategory = params.get(CATEGORY_PARAM) ?? "";
  return <SearchScreen urlQuery={urlQuery} category={isCategoryId(rawCategory) ? rawCategory : null} />;
};

const SearchView: React.FC<{ profileId: ProfileId }> = () => (
  <Suspense fallback={<SearchScreen urlQuery="" category={null} />}>
    <SearchWithParams />
  </Suspense>
);

export default SearchView;

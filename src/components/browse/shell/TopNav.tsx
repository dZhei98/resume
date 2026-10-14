"use client";

import BrowseMenu, { type NavItem } from "@/components/browse/shell/BrowseMenu";
import MobileHeader from "@/components/browse/shell/MobileHeader";
import NotificationsMenu from "@/components/browse/shell/NotificationsMenu";
import ProfileMenu from "@/components/browse/shell/ProfileMenu";
import SearchBox from "@/components/browse/shell/SearchBox";
import { FOCUS_RING } from "@/components/browse/shell/styles";
import { useScrollState } from "@/components/browse/shell/useScrollState";
import { Wordmark } from "@/components/browse/ui/Brand";
import { CATEGORIES, isCategoryId } from "@/constants/categories";
import type { ProfileId } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const TopNav: React.FC<{ profileId: ProfileId }> = ({ profileId }) => {
  const pathname = usePathname();
  const { scrolled, scrollingDown } = useScrollState();
  const base = `/${profileId}`;
  const genrePrefix = `${base}/genre/`;
  const genre = pathname.startsWith(genrePrefix) ? pathname.slice(genrePrefix.length) : "";
  const activeCategory = isCategoryId(genre) ? genre : null;

  const items: NavItem[] = [
    { href: base, label: "Home" },
    ...CATEGORIES.map((category) => ({ href: `${genrePrefix}${category.id}`, label: category.label })),
  ].map((item) => ({ ...item, active: pathname === item.href }));

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 hidden bg-linear-to-b from-black/80 to-transparent transition-colors duration-400 md:block ${
          scrolled ? "bg-netflix-bg" : ""
        }`}
      >
        <div className="flex h-16 items-center px-gutter lg:h-[68px]">
          <Link
            href={base}
            aria-label="Joshua Nee home"
            className={`mr-6 shrink-0 rounded-xs lg:mr-8 ${FOCUS_RING}`}
          >
            <Wordmark className="text-[1.75rem] lg:text-[2.1rem]" />
          </Link>

          <nav aria-label="Primary">
            <BrowseMenu items={items} className="lg:hidden" />
            <ul className="hidden items-center gap-4 lg:flex xl:gap-5">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={item.active ? "page" : undefined}
                    className={`whitespace-nowrap rounded-xs text-sm transition-colors duration-400 ${
                      item.active
                        ? "cursor-default font-semibold text-white"
                        : "text-netflix-light hover:text-netflix-muted"
                    } ${FOCUS_RING}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-4 pl-4 lg:gap-5">
            <SearchBox profileId={profileId} />
            <NotificationsMenu />
            <ProfileMenu profileId={profileId} />
          </div>
        </div>
      </header>

      {(pathname === base || activeCategory) && (
        <MobileHeader
          profileId={profileId}
          activeCategory={activeCategory}
          scrolled={scrolled}
          collapsed={scrollingDown}
        />
      )}
    </>
  );
};

export default TopNav;

"use client";

import { FOCUS_RING } from "@/components/browse/shell/styles";
import { Monogram, ProfileAvatar } from "@/components/browse/ui/Brand";
import { CATEGORIES, getCategory } from "@/constants/categories";
import { getProfile } from "@/constants/profiles";
import type { CategoryId, ProfileId } from "@/types";
import Link from "next/link";
import React from "react";
import { IoClose } from "react-icons/io5";

type MobileHeaderProps = {
  profileId: ProfileId;
  activeCategory: CategoryId | null;
  scrolled: boolean;
  collapsed: boolean;
};

const SURFACE = "bg-netflix-bg/95 backdrop-blur";

const MobileHeader: React.FC<MobileHeaderProps> = ({
  profileId,
  activeCategory,
  scrolled,
  collapsed,
}) => {
  const profile = getProfile(profileId);
  const base = `/${profileId}`;
  const categories = activeCategory
    ? [getCategory(activeCategory), ...CATEGORIES.filter((category) => category.id !== activeCategory)]
    : CATEGORIES;

  return (
    <header className="fixed inset-x-0 top-0 z-40 md:hidden">
      <div
        className={`relative z-10 flex h-14 items-center justify-between gap-3 px-4 transition-colors duration-300 ${
          scrolled ? SURFACE : "bg-transparent"
        }`}
      >
        <Link href={base} className={`flex min-w-0 items-center gap-2.5 rounded-sm ${FOCUS_RING}`}>
          <Monogram className="text-4xl" />
          <span className="truncate text-lg font-bold text-white">For {profile.name}s</span>
        </Link>
        <Link
          href="/"
          aria-label="Switch profiles"
          className={`shrink-0 rounded ${FOCUS_RING}`}
        >
          <ProfileAvatar profile={profile} size={28} />
        </Link>
      </div>

      <nav
        aria-label="Categories"
        className={`flex h-12 items-center gap-2 overflow-x-auto px-4 transition-[transform,opacity,background-color] duration-300 ease-out motion-reduce:transition-none focus-within:translate-y-0 focus-within:opacity-100 ${
          scrolled ? SURFACE : "bg-transparent"
        } ${collapsed ? "pointer-events-none -translate-y-full opacity-0" : ""}`}
      >
        {activeCategory && (
          <Link
            href={base}
            aria-label="Clear category"
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/40 text-white ${FOCUS_RING}`}
          >
            <IoClose aria-hidden className="h-4 w-4" />
          </Link>
        )}
        {categories.map((category) => {
          const active = category.id === activeCategory;
          return (
            <Link
              key={category.id}
              href={`${base}/genre/${category.id}`}
              aria-current={active ? "page" : undefined}
              className={`inline-flex h-8 shrink-0 items-center whitespace-nowrap rounded-full border px-3.5 text-sm text-white transition-colors ${
                active ? "border-white bg-white/15" : "border-white/40"
              } ${FOCUS_RING}`}
            >
              {category.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
};

export default MobileHeader;

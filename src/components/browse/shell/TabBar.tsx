"use client";

import { FOCUS_RING_INSET } from "@/components/browse/shell/styles";
import type { ProfileId } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import type { IconType } from "react-icons";
import {
  IoHome,
  IoHomeOutline,
  IoPlayCircle,
  IoPlayCircleOutline,
  IoSearch,
  IoSearchOutline,
} from "react-icons/io5";

type Tab = {
  href: string;
  label: string;
  active: boolean;
  icon: IconType;
  activeIcon: IconType;
};

const TabBar: React.FC<{ profileId: ProfileId }> = ({ profileId }) => {
  const pathname = usePathname();
  const base = `/${profileId}`;

  const tabs: Tab[] = [
    {
      href: base,
      label: "Home",
      active: pathname === base || pathname.startsWith(`${base}/genre/`),
      icon: IoHomeOutline,
      activeIcon: IoHome,
    },
    {
      href: `${base}/clips`,
      label: "Clips",
      active: pathname === `${base}/clips`,
      icon: IoPlayCircleOutline,
      activeIcon: IoPlayCircle,
    },
    {
      href: `${base}/search`,
      label: "Search",
      active: pathname === `${base}/search`,
      icon: IoSearchOutline,
      activeIcon: IoSearch,
    },
  ];

  return (
    <nav
      aria-label="Tabs"
      className="fixed inset-x-0 bottom-0 z-40 h-16 border-t border-white/5 bg-netflix-bg/95 backdrop-blur md:hidden"
    >
      <ul className="grid h-full grid-cols-3">
        {tabs.map(({ href, label, active, icon, activeIcon }) => {
          const Icon = active ? activeIcon : icon;
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex h-full flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors ${
                  active ? "text-white" : "text-netflix-gray"
                } ${FOCUS_RING_INSET}`}
              >
                <Icon aria-hidden className="h-6 w-6" />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default TabBar;

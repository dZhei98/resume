"use client";

import { Dropdown } from "@/components/browse/shell/Dropdown";
import { FOCUS_RING, FOCUS_RING_INSET } from "@/components/browse/shell/styles";
import { useMenu } from "@/components/browse/shell/useMenu";
import TitleArt from "@/components/browse/ui/TitleArt";
import { useOpenTitle } from "@/hooks/useTitleModal";
import { getTitlesByKind } from "@/lib/catalog";
import { recencyKey } from "@/lib/dates";
import type { Title } from "@/types";
import React from "react";
import { IoNotificationsOutline } from "react-icons/io5";

const latest = (titles: readonly Title[]): Title | undefined =>
  [...titles].sort((a, b) => recencyKey(b.start, b.end) - recencyKey(a.start, a.end))[0];

const NOTIFICATIONS = [
  { label: "Latest Experience", title: latest(getTitlesByKind("work")) },
  { label: "Latest Education", title: latest(getTitlesByKind("education")) },
].flatMap(({ label, title }) => (title ? [{ label, title }] : []));

const NotificationsMenu: React.FC = () => {
  const openTitle = useOpenTitle();
  const { open, close, rootProps, triggerProps } = useMenu();

  const notifications = NOTIFICATIONS;
  const count = notifications.length;

  return (
    <div {...rootProps} className="md:relative">
      <button
        {...triggerProps}
        aria-label={count ? `Notifications, ${count} new` : "Notifications"}
        className={`relative flex h-9 w-9 items-center justify-center rounded-xs text-white ${FOCUS_RING}`}
      >
        <IoNotificationsOutline aria-hidden className="h-6 w-6" />
        {count > 0 && (
          <span
            aria-hidden
            className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-netflix-red px-1 text-[10px] font-bold leading-none text-white"
          >
            {count}
          </span>
        )}
      </button>

      <Dropdown
        open={open}
        className="inset-x-4 md:inset-x-auto md:right-0 md:w-88"
        caretClassName="right-[51px] md:right-[11px]"
      >
        {count ? (
          <ul className="max-h-[min(70vh,30rem)] overflow-y-auto">
            {notifications.map(({ title, label }) => (
              <li key={title.slug} className="border-b border-white/10 last:border-b-0">
                <button
                  type="button"
                  onClick={() => {
                    close();
                    openTitle(title.slug);
                  }}
                  className={`flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-white/5 ${FOCUS_RING_INSET}`}
                >
                  <span className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-sm">
                    <TitleArt title={title} showName={false} sizes="112px" />
                  </span>
                  <span className="min-w-0 text-sm leading-snug">
                    <span className="block text-netflix-light">{label}</span>
                    <span className="block truncate font-semibold text-white">{title.name}</span>
                    {title.dateRange && (
                      <span className="mt-0.5 block text-xs text-netflix-gray">
                        {title.dateRange}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-4 py-6 text-center text-sm text-netflix-muted">No new notifications</p>
        )}
      </Dropdown>
    </div>
  );
};

export default NotificationsMenu;

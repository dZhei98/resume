"use client";

import { Dropdown } from "@/components/browse/shell/Dropdown";
import { FOCUS_RING, FOCUS_RING_INSET } from "@/components/browse/shell/styles";
import { useMenu } from "@/components/browse/shell/useMenu";
import Link from "next/link";
import React from "react";
import { IoCaretDown } from "react-icons/io5";

export type NavItem = {
  href: string;
  label: string;
  active: boolean;
};

const BrowseMenu: React.FC<{ items: readonly NavItem[]; className?: string }> = ({
  items,
  className = "",
}) => {
  const { open, close, rootProps, triggerProps } = useMenu();

  return (
    <div {...rootProps} className={`relative ${className}`}>
      <button
        {...triggerProps}
        className={`flex items-center gap-1.5 rounded-xs text-sm font-semibold text-white ${FOCUS_RING}`}
      >
        Browse
        <IoCaretDown
          aria-hidden
          className={`h-3 w-3 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <Dropdown open={open} className="left-1/2 -ml-32 w-64" caretClassName="left-1/2 ml-[-7px]">
        <ul className="py-1.5">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={close}
                aria-current={item.active ? "page" : undefined}
                className={`flex h-12 items-center justify-center text-sm transition-colors ${
                  item.active
                    ? "cursor-default font-semibold text-white"
                    : "text-netflix-muted hover:bg-white/5 hover:text-white"
                } ${FOCUS_RING_INSET}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </Dropdown>
    </div>
  );
};

export default BrowseMenu;

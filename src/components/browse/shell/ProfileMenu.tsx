"use client";

import { Dropdown } from "@/components/browse/shell/Dropdown";
import { FOCUS_RING } from "@/components/browse/shell/styles";
import { useMenu } from "@/components/browse/shell/useMenu";
import { ProfileAvatar } from "@/components/browse/ui/Brand";
import { getProfile, PROFILES, RESUME_HREF } from "@/constants/profiles";
import { getGitHubUrl, getLinkedInUrl } from "@/lib/links";
import type { ProfileId } from "@/types";
import Link from "next/link";
import React from "react";
import {
  IoCaretDown,
  IoDocumentTextOutline,
  IoLogoGithub,
  IoLogoLinkedin,
  IoSwapHorizontal,
} from "react-icons/io5";

const ITEM_CLASSES = `flex items-center gap-2.5 rounded-xs px-3 py-1.5 text-[13px] text-white hover:underline ${FOCUS_RING}`;

const ProfileMenu: React.FC<{ profileId: ProfileId; compact?: boolean }> = ({
  profileId,
  compact = false,
}) => {
  const profile = getProfile(profileId);
  const others = PROFILES.filter((candidate) => candidate.id !== profileId);
  const { open, close, rootProps, triggerProps } = useMenu();

  return (
    <div {...rootProps} className="relative">
      <button
        {...triggerProps}
        aria-label={`Account menu, ${profile.name}`}
        className={`flex items-center gap-2.5 rounded-sm ${FOCUS_RING}`}
      >
        <ProfileAvatar profile={profile} size={compact ? 28 : 32} />
        {!compact && (
          <IoCaretDown
            aria-hidden
            className={`h-3.5 w-3.5 text-white transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      <Dropdown
        open={open}
        className="right-0 w-56"
        caretClassName={compact ? "right-[7px]" : "right-[33px]"}
      >
        <ul className="space-y-1 px-1 py-2.5">
          {others.map((other) => (
            <li key={other.id}>
              <Link href={other.href} onClick={close} className={ITEM_CLASSES}>
                <ProfileAvatar profile={other} size={32} />
                <span>{other.name}</span>
              </Link>
            </li>
          ))}
        </ul>
        <ul className="space-y-1 border-t border-white/25 px-1 py-2.5">
          <li>
            <Link href="/" onClick={close} className={ITEM_CLASSES}>
              <span className="flex h-8 w-8 items-center justify-center">
                <IoSwapHorizontal aria-hidden className="h-5 w-5 text-netflix-muted" />
              </span>
              <span>Switch Profiles</span>
            </Link>
          </li>
          <li>
            <a
              href={RESUME_HREF}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              className={ITEM_CLASSES}
            >
              <span className="flex h-8 w-8 items-center justify-center">
                <IoDocumentTextOutline aria-hidden className="h-5 w-5 text-netflix-muted" />
              </span>
              <span>Résumé</span>
            </a>
          </li>
          <li>
            <a
              href={getLinkedInUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              className={ITEM_CLASSES}
            >
              <span className="flex h-8 w-8 items-center justify-center">
                <IoLogoLinkedin aria-hidden className="h-5 w-5 text-netflix-muted" />
              </span>
              <span>LinkedIn</span>
            </a>
          </li>
          <li>
            <a
              href={getGitHubUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              className={ITEM_CLASSES}
            >
              <span className="flex h-8 w-8 items-center justify-center">
                <IoLogoGithub aria-hidden className="h-5 w-5 text-netflix-muted" />
              </span>
              <span>GitHub</span>
            </a>
          </li>
        </ul>
      </Dropdown>
    </div>
  );
};

export default ProfileMenu;

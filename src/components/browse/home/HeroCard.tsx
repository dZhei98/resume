"use client";

import { NfButton } from "@/components/browse/ui/Buttons";
import TitleArt from "@/components/browse/ui/TitleArt";
import { useOpenTitle } from "@/hooks/useTitleModal";
import type { ProfileConfig, Title } from "@/types";
import Image from "next/image";
import React from "react";
import { IoInformationCircleOutline, IoPlay } from "react-icons/io5";
import { tintAlpha } from "./TintBackdrop";
import { FOCUS_RING } from "./tileStyles";

const HeroCard: React.FC<{ title: Title; profile: ProfileConfig }> = ({ title, profile }) => {
  const openTitle = useOpenTitle();
  const isAbout = title.kind === "about";

  return (
    <div className="px-4 md:hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-screen"
        style={{
          background: `linear-gradient(180deg, ${tintAlpha(title.tint, 0.55)} 0%, #141414 70vh)`,
        }}
      />
      <div className="relative mx-auto aspect-2/3 w-[86%] max-w-sm overflow-hidden rounded-lg border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        <button
          type="button"
          aria-label={`More info about ${title.name}`}
          onClick={() => openTitle(title.slug)}
          className="group/tile absolute inset-0 rounded-[inherit] focus-visible:outline-hidden"
        >
          {isAbout && title.image ? (
            <Image
              src={title.image.src}
              alt=""
              fill
              priority
              sizes="(max-width: 446px) 86vw, 384px"
              className="object-cover object-top"
            />
          ) : (
            <TitleArt title={title} showName={false} priority sizes="(max-width: 446px) 86vw, 384px" />
          )}
          <span
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-black via-black/60 to-transparent"
          />
          <span aria-hidden className={FOCUS_RING} />
        </button>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 text-center">
          <h1 className="text-balance px-4 font-display text-5xl uppercase leading-none text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
            {title.name}
          </h1>
          {title.domain && <p className="px-4 text-xs text-white">{title.domain}</p>}
          <div className="pointer-events-auto flex w-full gap-2 px-3 pb-3">
            <NfButton
              href={profile.heroAction.href}
              icon={<IoPlay aria-hidden />}
              className="flex-1"
            >
              {profile.heroAction.label}
            </NfButton>
            <NfButton
              variant="secondary"
              onClick={() => openTitle(title.slug)}
              icon={<IoInformationCircleOutline aria-hidden />}
              className="flex-1"
            >
              More Info
            </NfButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroCard;

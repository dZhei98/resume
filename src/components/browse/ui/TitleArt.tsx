import type { Title } from "@/types";
import Image from "next/image";
import React from "react";

type TitleArtProps = {
  title: Title;
  showName?: boolean;
  nameClassName?: string;
  showLogoBadge?: boolean;
  logoBadgeClassName?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

const TitleArt: React.FC<TitleArtProps> = ({
  title,
  showName = true,
  nameClassName = "text-xl md:text-2xl",
  showLogoBadge = true,
  logoBadgeClassName = "left-1.5 top-1.5 h-6 w-6 rounded-[3px] md:h-7 md:w-7",
  sizes = "(max-width: 768px) 40vw, 20vw",
  priority = false,
  className = "",
}) => {
  const coverSrc = title.art ?? (title.image?.fit === "cover" ? title.image.src : undefined);
  const logo = title.image?.fit === "contain" ? title.image : undefined;

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ background: `linear-gradient(160deg, ${title.tint} 0%, #141414 95%)` }}
    >
      {coverSrc ? (
        <Image
          src={coverSrc}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : logo || title.emoji ? (
        <div className="absolute inset-x-0 top-0 flex h-[68%] items-center justify-center">
          <div className="relative flex aspect-square h-[62%] max-h-30 items-center justify-center rounded-md bg-white shadow-lg @container-size lg:max-h-44">
            {logo ? (
              <Image src={logo.src} alt={logo.alt} fill sizes="(min-width: 1024px) 176px, 120px" className="object-contain p-[12%]" />
            ) : (
              <span aria-hidden className="text-[60cqh] leading-none">
                {title.emoji}
              </span>
            )}
          </div>
        </div>
      ) : null}

      {coverSrc && logo && showLogoBadge && (
        <div className={`absolute overflow-hidden bg-white shadow-sm ${logoBadgeClassName}`}>
          <Image src={logo.src} alt={logo.alt} fill sizes="64px" className="object-contain p-[6%]" />
        </div>
      )}

      {showName && (
        <>
          <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/10 to-transparent" />
          <span
            className={`absolute inset-x-2 bottom-2 line-clamp-3 font-display uppercase leading-[0.92] tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${nameClassName}`}
          >
            {title.name}
          </span>
        </>
      )}
    </div>
  );
};

export default TitleArt;

import { FOCUS_RING } from "@/components/browse/shell/styles";
import { RESUME_HREF } from "@/constants/profiles";
import { getGitHubUrl, getLinkedInUrl, getTwitterUrl } from "@/lib/links";
import Link from "next/link";
import React from "react";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";

const SOURCE_URL = "https://github.com/dzhei98/resume";

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: getLinkedInUrl(), icon: FaLinkedin },
  { label: "GitHub", href: getGitHubUrl(), icon: FaGithub },
  { label: "X (Twitter)", href: getTwitterUrl(), icon: FaXTwitter },
];

const FOOTER_LINKS = [
  { label: "Résumé", href: RESUME_HREF, newTab: true },
  { label: "LinkedIn", href: getLinkedInUrl(), newTab: true },
  { label: "GitHub", href: getGitHubUrl(), newTab: true },
  { label: "X / Twitter", href: getTwitterUrl(), newTab: true },
  { label: "Source Code", href: SOURCE_URL, newTab: true },
  { label: "Switch Profiles", href: "/", newTab: false },
];

const Footer: React.FC = () => (
  <footer className="mx-auto w-full max-w-[980px] px-4 pb-24 pt-12 text-[13px] text-netflix-gray md:px-gutter md:pb-12">
    <ul className="mb-4 flex items-center gap-4">
      {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={`block rounded-xs text-white transition-colors hover:text-netflix-gray ${FOCUS_RING}`}
          >
            <Icon aria-hidden className="h-6 w-6" />
          </a>
        </li>
      ))}
    </ul>

    <ul className="mb-6 grid grid-cols-2 gap-x-4 gap-y-3 md:grid-cols-4">
      {FOOTER_LINKS.map(({ label, href, newTab }) => (
        <li key={label}>
          {newTab ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`rounded-xs hover:underline ${FOCUS_RING}`}
            >
              {label}
            </a>
          ) : (
            <Link href={href} className={`rounded-xs hover:underline ${FOCUS_RING}`}>
              {label}
            </Link>
          )}
        </li>
      ))}
    </ul>

    <p className="text-[11px]">&copy; {new Date().getFullYear()} Joshua Nee</p>
  </footer>
);

export default Footer;

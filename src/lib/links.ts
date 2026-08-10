import linksData from "@/data/personal/links.json";

type SocialLink = {
  label: string;
  url: string;
  description: string;
};

type LinksData = {
  title: string;
  links: SocialLink[];
};

const links = linksData as LinksData;

export const getLink = (label: string): string => {
  const link = links.links.find(
    (l) => l.label.toLowerCase() === label.toLowerCase(),
  );
  return link?.url ?? "";
};

export const getLinkedInUrl = (): string => getLink("LinkedIn");
export const getGitHubUrl = (): string => getLink("GitHub");
export const getTwitterUrl = (): string => getLink("Twitter");

export const getAllLinks = () => links.links;

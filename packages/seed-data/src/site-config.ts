import type { SeedHomepageSection, SeedNavItem, SeedSiteSettings } from "./types";

/**
 * Homepage configuration — mirrors the CMS "Homepage Configuration" single type.
 * Editors reorder, enable/disable and curate sections here (or in Strapi) without code changes.
 * Only real-data sections exist: news comes from the live RSS wire, games from RAWG.
 */
export const homepageSections: SeedHomepageSection[] = [
  { kind: "hero", title: "Featured", enabled: true, order: 1, curatedSlugs: [], maxItems: 1 },
  { kind: "trending", title: "Trending Now", enabled: true, order: 2, curatedSlugs: [], maxItems: 6 },
  { kind: "latest", title: "Latest News", enabled: true, order: 3, curatedSlugs: [], maxItems: 9 },
  { kind: "upcoming-releases", title: "Upcoming Releases", enabled: true, order: 4, curatedSlugs: [], maxItems: 10 },
  { kind: "newsletter", title: "The Pulse Briefing", enabled: true, order: 5, curatedSlugs: [], maxItems: 0 },
];

/** Navigation configuration — mirrors the CMS "Navigation Configuration" single type. */
export const navigation: { primary: SeedNavItem[]; footer: SeedNavItem[] } = {
  primary: [
    { label: "News", href: "/news" },
    { label: "Latest", href: "/latest" },
    { label: "Trending", href: "/trending" },
    { label: "Games", href: "/games" },
    { label: "Upcoming", href: "/upcoming-games" },
  ],
  footer: [
    { label: "About Gaming Pulse", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Advertise", href: "/advertise" },
    { label: "Submit a Tip", href: "/submit-tip" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

/** Site settings — mirrors the CMS "Site Settings" single type. */
export const siteSettings: SeedSiteSettings = {
  siteName: "Gaming Pulse",
  tagline: "Real gaming news and games data, refreshed hourly.",
  demoNotice:
    "News is aggregated live from public RSS feeds (Eurogamer, PC Gamer, GameSpot, Rock Paper Shotgun, VG247, Destructoid, Nintendo Life). Game data is from RAWG. Everything refreshes automatically about once an hour.",
  socialLinks: [],
  newsletterHeading: "The Pulse Briefing",
  newsletterSubheading: "A roundup of the day's real gaming headlines, straight to your inbox.",
};

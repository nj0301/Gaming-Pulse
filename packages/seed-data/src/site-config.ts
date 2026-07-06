import type { SeedHomepageSection, SeedNavItem, SeedSiteSettings } from "./types";

/**
 * Homepage configuration — mirrors the CMS "Homepage Configuration" single type.
 * Editors reorder, enable/disable and curate sections here (or in Strapi) without code changes.
 */
export const homepageSections: SeedHomepageSection[] = [
  { kind: "breaking-ticker", title: "Breaking", enabled: true, order: 1, curatedSlugs: [], maxItems: 5 },
  { kind: "hero", title: "Featured", enabled: true, order: 2, curatedSlugs: ["skybound-legends-tempest-expansion-october"], maxItems: 1 },
  { kind: "trending", title: "Trending Now", enabled: true, order: 3, curatedSlugs: [], maxItems: 6 },
  { kind: "latest", title: "Latest News", enabled: true, order: 4, curatedSlugs: [], maxItems: 9 },
  { kind: "release-timeline", title: "Upcoming Releases", enabled: true, order: 5, curatedSlugs: [], maxItems: 8 },
  { kind: "platform-pulse", title: "Platform Pulse", enabled: true, order: 6, curatedSlugs: [], maxItems: 4 },
  { kind: "videos", title: "New Trailers & Videos", enabled: true, order: 7, curatedSlugs: [], maxItems: 4 },
  { kind: "insights", title: "Industry Insights", enabled: true, order: 8, curatedSlugs: [], maxItems: 3 },
  { kind: "reviews", title: "Reviews & Recommendations", enabled: true, order: 9, curatedSlugs: [], maxItems: 3 },
  { kind: "esports", title: "Esports", enabled: true, order: 10, curatedSlugs: [], maxItems: 3 },
  { kind: "hardware", title: "Hardware", enabled: true, order: 11, curatedSlugs: [], maxItems: 3 },
  { kind: "deals", title: "Free Games & Deals", enabled: true, order: 12, curatedSlugs: [], maxItems: 4 },
  { kind: "newsletter", title: "The Pulse Briefing", enabled: true, order: 13, curatedSlugs: [], maxItems: 0 },
];

/** Navigation configuration — mirrors the CMS "Navigation Configuration" single type. */
export const navigation: { primary: SeedNavItem[]; footer: SeedNavItem[] } = {
  primary: [
    { label: "News", href: "/news" },
    { label: "Latest", href: "/latest" },
    { label: "Trending", href: "/trending" },
    {
      label: "Platforms",
      href: "/platform/pc",
      children: [
        { label: "PC", href: "/platform/pc" },
        { label: "PlayStation", href: "/platform/playstation" },
        { label: "Xbox", href: "/platform/xbox" },
        { label: "Nintendo", href: "/platform/nintendo" },
        { label: "Mobile", href: "/platform/mobile" },
        { label: "Handheld", href: "/platform/handheld" },
        { label: "VR & AR", href: "/platform/vr" },
        { label: "Cloud Gaming", href: "/platform/cloud-gaming" },
      ],
    },
    { label: "Upcoming", href: "/upcoming-games" },
    { label: "Reviews", href: "/reviews" },
    { label: "Guides", href: "/guides" },
    { label: "Esports", href: "/esports" },
    { label: "Hardware", href: "/hardware" },
    { label: "Deals", href: "/deals" },
    { label: "Videos", href: "/videos" },
    { label: "Insights", href: "/insights" },
  ],
  footer: [
    { label: "About Gaming Pulse", href: "/about" },
    { label: "Our Team", href: "/team" },
    { label: "Editorial Policy", href: "/editorial-policy" },
    { label: "Review Policy", href: "/review-policy" },
    { label: "Corrections", href: "/corrections" },
    { label: "Contact", href: "/contact" },
    { label: "Advertise", href: "/advertise" },
    { label: "Submit a Tip", href: "/submit-tip" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
  ],
};

/** Site settings — mirrors the CMS "Site Settings" single type. */
export const siteSettings: SeedSiteSettings = {
  siteName: "Gaming Pulse",
  tagline: "The signal in gaming's noise.",
  demoNotice:
    "Demo build: every game, studio, person, date, score and story on this site is fictional, created to demonstrate the Gaming Pulse platform.",
  socialLinks: [
    { label: "RSS", url: "/rss.xml" },
    { label: "Atom", url: "/atom.xml" },
  ],
  newsletterHeading: "The Pulse Briefing",
  newsletterSubheading:
    "One tight email, three times a week: the stories that matter, the dates that moved, and zero filler.",
};

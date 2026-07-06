/**
 * Site configuration model (nav, site settings, homepage layout).
 *
 * This is the ONLY thing the CMS layer is responsible for now — actual
 * content (news, games) comes from real live sources: the RSS wire
 * (@/lib/news-feed) and RAWG (@/lib/rawg). The CMS adapter never supplies
 * article/game/deal/video content anymore.
 */
export type {
  SeedHomepageSection as HomepageSection,
  SeedNavItem as NavItem,
  SeedSiteSettings as SiteSettings,
} from "@gaming-pulse/seed-data";

export interface CmsAdapter {
  readonly source: "fixtures" | "strapi";
  getSiteSettings(): Promise<import("@gaming-pulse/seed-data").SeedSiteSettings>;
  getNavigation(): Promise<{
    primary: import("@gaming-pulse/seed-data").SeedNavItem[];
    footer: import("@gaming-pulse/seed-data").SeedNavItem[];
  }>;
  getHomepageSections(): Promise<import("@gaming-pulse/seed-data").SeedHomepageSection[]>;
}

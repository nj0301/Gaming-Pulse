/**
 * Fixture adapter: serves bundled site configuration (nav, settings,
 * homepage layout) when CMS_URL is unset, or as the fallback when a live
 * CMS call fails. This is site scaffolding, not content — all actual
 * content on the site comes from real sources (news wire + RAWG).
 */
import { homepageSections, navigation, siteSettings } from "@gaming-pulse/seed-data";
import type { CmsAdapter } from "./types";

export const fixtureAdapter: CmsAdapter = {
  source: "fixtures",

  async getSiteSettings() {
    return siteSettings;
  },

  async getNavigation() {
    return navigation;
  },

  async getHomepageSections() {
    return [...homepageSections].sort((a, b) => a.order - b.order);
  },
};

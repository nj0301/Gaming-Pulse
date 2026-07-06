import { describe, expect, it } from "vitest";
import { fixtureAdapter } from "@/lib/cms/fixtures";

/**
 * The CMS layer now only supplies site configuration (nav, settings,
 * homepage layout) — real content comes from the news wire and RAWG.
 */
describe("fixture CMS adapter (site configuration only)", () => {
  it("provides site settings", async () => {
    const settings = await fixtureAdapter.getSiteSettings();
    expect(settings.siteName).toBeTruthy();
    expect(settings.tagline).toBeTruthy();
  });

  it("provides primary and footer navigation with valid hrefs", async () => {
    const nav = await fixtureAdapter.getNavigation();
    expect(nav.primary.length).toBeGreaterThan(0);
    expect(nav.footer.length).toBeGreaterThan(0);
    for (const item of [...nav.primary, ...nav.footer]) {
      expect(item.href.startsWith("/")).toBe(true);
    }
  });

  it("provides enabled homepage sections in order, all backed by real data sources", async () => {
    const sections = await fixtureAdapter.getHomepageSections();
    expect(sections.length).toBeGreaterThan(0);
    const orders = sections.map((s) => s.order);
    expect([...orders].sort((a, b) => a - b)).toEqual(orders);

    const realDataKinds = ["breaking-ticker", "hero", "trending", "latest", "upcoming-releases", "newsletter"];
    for (const section of sections) {
      expect(realDataKinds).toContain(section.kind);
    }
  });
});

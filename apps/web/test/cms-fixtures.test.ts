import { describe, expect, it } from "vitest";
import { fixtureAdapter } from "@/lib/cms/fixtures";

describe("fixture CMS adapter (content API integration)", () => {
  it("serves the required demo volume", async () => {
    const [articles, games, releaseDates, trends, videos, deals] = await Promise.all([
      fixtureAdapter.getArticles({ limit: 100 }),
      fixtureAdapter.getGames(),
      fixtureAdapter.getReleaseDates(),
      fixtureAdapter.getTrends(),
      fixtureAdapter.getVideos(),
      fixtureAdapter.getDeals(),
    ]);
    expect(articles.length).toBeGreaterThanOrEqual(12);
    expect(games.length).toBeGreaterThanOrEqual(10);
    expect(releaseDates.length).toBeGreaterThanOrEqual(15);
    expect(trends.length).toBeGreaterThanOrEqual(5);
    expect(videos.length).toBeGreaterThanOrEqual(4);
    expect(deals.length).toBeGreaterThanOrEqual(4);
  });

  it("filters articles by category, platform, tag and author consistently", async () => {
    const reviews = await fixtureAdapter.getArticles({ categorySlug: "reviews" });
    expect(reviews.length).toBeGreaterThan(0);
    expect(reviews.every((a) => a.categorySlug === "reviews")).toBe(true);

    const pc = await fixtureAdapter.getArticles({ platformSlug: "pc" });
    expect(pc.every((a) => a.platformSlugs.includes("pc"))).toBe(true);

    const byAuthor = await fixtureAdapter.getArticles({ authorSlug: "lin-zhao" });
    expect(byAuthor.every((a) => a.authorSlug === "lin-zhao")).toBe(true);
  });

  it("returns null for unknown slugs instead of throwing", async () => {
    expect(await fixtureAdapter.getArticleBySlug("does-not-exist")).toBeNull();
    expect(await fixtureAdapter.getGameBySlug("does-not-exist")).toBeNull();
    expect(await fixtureAdapter.getAuthorBySlug("does-not-exist")).toBeNull();
  });

  it("orders trends pinned-first then by score", async () => {
    const trends = await fixtureAdapter.getTrends();
    const firstUnpinnedIndex = trends.findIndex((t) => !t.pinned);
    expect(trends.slice(0, firstUnpinnedIndex).every((t) => t.pinned)).toBe(true);
    const scores = trends.slice(firstUnpinnedIndex).map((t) => t.score);
    expect([...scores].sort((a, b) => b - a)).toEqual(scores);
  });

  it("provides a why-trending explanation for every trend", async () => {
    const trends = await fixtureAdapter.getTrends();
    expect(trends.every((t) => t.whyTrending.length > 20)).toBe(true);
  });

  it("searches across entity types with sensible empty handling", async () => {
    const results = await fixtureAdapter.search("petal");
    expect(results.articles.length).toBeGreaterThan(0);
    expect(results.games.length).toBeGreaterThan(0);

    const empty = await fixtureAdapter.search("x");
    expect(empty.articles).toEqual([]);
  });

  it("keeps every article publish-ready (sources, hero, seo present)", async () => {
    const articles = await fixtureAdapter.getArticles({ limit: 100 });
    for (const article of articles) {
      expect(article.sources.length, article.slug).toBeGreaterThan(0);
      expect(article.heroImage.src, article.slug).toBeTruthy();
      expect(article.heroImage.alt, article.slug).toBeTruthy();
      expect(article.seoTitle, article.slug).toBeTruthy();
      expect(article.seoDescription, article.slug).toBeTruthy();
      if (article.isSponsored) expect(article.sponsorName, article.slug).toBeTruthy();
    }
  });
});

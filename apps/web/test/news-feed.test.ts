import { describe, expect, it } from "vitest";
import { computeTrendingTopics } from "@/lib/news-feed";
import type { WireArticle } from "@/lib/news-feed";

const item = (overrides: Partial<WireArticle>): WireArticle => ({
  id: overrides.id ?? Math.random().toString(36),
  title: "",
  excerpt: "",
  link: "https://example.com",
  imageUrl: null,
  sourceName: "Test Outlet",
  publishedAt: new Date().toISOString(),
  ...overrides,
});

describe("computeTrendingTopics (real cross-outlet signal)", () => {
  it("only surfaces a topic covered by 2+ distinct outlets", () => {
    const articles = [
      item({ title: "Elden Ring Nightreign gets a surprise update", sourceName: "Eurogamer" }),
      item({ title: "Elden Ring Nightreign patch notes are here", sourceName: "PC Gamer" }),
      item({ title: "Some unrelated headline about Cats", sourceName: "GameSpot" }),
    ];
    const topics = computeTrendingTopics(articles);
    expect(topics.some((t) => t.keyword.includes("Elden Ring"))).toBe(true);
    expect(topics.every((t) => t.sourceCount >= 2)).toBe(true);
  });

  it("does not surface a topic mentioned by only one outlet", () => {
    const articles = [item({ title: "Starfield Shattered Space arrives next week", sourceName: "IGN" })];
    const topics = computeTrendingTopics(articles);
    expect(topics.length).toBe(0);
  });

  it("ranks topics by outlet count, most-covered first", () => {
    const articles = [
      item({ title: "Baldurs Gate patch fixes bugs", sourceName: "A" }),
      item({ title: "Baldurs Gate patch notes revealed", sourceName: "B" }),
      item({ title: "Baldurs Gate hotfix rolls out today", sourceName: "C" }),
      item({ title: "Cyberpunk Phantom Liberty sale starts", sourceName: "A" }),
      item({ title: "Cyberpunk Phantom Liberty discount live", sourceName: "B" }),
    ];
    const topics = computeTrendingTopics(articles);
    expect(topics[0].sourceCount).toBeGreaterThanOrEqual(topics[topics.length - 1].sourceCount);
  });

  it("respects the limit", () => {
    const articles = Array.from({ length: 10 }, (_, i) => [
      item({ title: `Topic Number ${i} launches today`, sourceName: "A" }),
      item({ title: `Topic Number ${i} review is out`, sourceName: "B" }),
    ]).flat();
    const topics = computeTrendingTopics(articles, 3);
    expect(topics.length).toBeLessThanOrEqual(3);
  });

  it("ignores stopword-led phrases like 'The Best' or 'How To'", () => {
    const articles = [
      item({ title: "The Best Deals This Week are huge", sourceName: "A" }),
      item({ title: "The Best Deals This Week continue", sourceName: "B" }),
    ];
    const topics = computeTrendingTopics(articles);
    expect(topics.some((t) => t.keyword.startsWith("The Best"))).toBe(false);
  });
});

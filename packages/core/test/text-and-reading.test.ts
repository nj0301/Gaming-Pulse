import { describe, expect, it } from "vitest";
import { estimateReadingTime, countWords } from "../src/reading-time";
import { slugify, timeAgo, truncate } from "../src/text";
import { isSpeculative, validateArticleForPublish } from "../src/editorial";

describe("reading time", () => {
  it("counts words through markup", () => {
    expect(countWords("<p>Hello <strong>brave</strong> new world</p>")).toBe(4);
  });
  it("never reports less than one minute", () => {
    expect(estimateReadingTime("Short.").minutes).toBe(1);
  });
  it("scales with length and images", () => {
    const words = Array.from({ length: 900 }, () => "word").join(" ");
    const noImages = estimateReadingTime(words, 0);
    const withImages = estimateReadingTime(words, 12);
    expect(noImages.minutes).toBe(4);
    expect(withImages.minutes).toBeGreaterThan(noImages.minutes);
  });
});

describe("slugify", () => {
  it("handles punctuation, case and ampersands", () => {
    expect(slugify("Starfall: Vanguard — Preview & Impressions!")).toBe(
      "starfall-vanguard-preview-and-impressions",
    );
  });
});

describe("truncate", () => {
  it("keeps short strings intact", () => {
    expect(truncate("short", 20)).toBe("short");
  });
  it("cuts on a word boundary with ellipsis", () => {
    const out = truncate("the quick brown fox jumps over the lazy dog", 20);
    expect(out.length).toBeLessThanOrEqual(20);
    expect(out.endsWith("…")).toBe(true);
  });
});

describe("timeAgo", () => {
  const now = new Date("2026-07-05T12:00:00Z");
  it("renders hours", () => {
    expect(timeAgo("2026-07-05T09:00:00Z", now)).toBe("3 hours ago");
  });
  it("renders just now", () => {
    expect(timeAgo("2026-07-05T11:59:40Z", now)).toBe("just now");
  });
});

describe("editorial", () => {
  it("marks rumor/leak/opinion as speculative", () => {
    expect(isSpeculative("rumor")).toBe(true);
    expect(isSpeculative("leak")).toBe(true);
    expect(isSpeculative("opinion")).toBe(true);
    expect(isSpeculative("news", "confirmed")).toBe(false);
    expect(isSpeculative("news", "unconfirmed")).toBe(true);
  });

  it("blocks publishing without sources, author, hero or SEO fields", () => {
    const problems = validateArticleForPublish({ title: "T", articleType: "news" });
    expect(problems.join(" ")).toMatch(/author/i);
    expect(problems.join(" ")).toMatch(/hero/i);
    expect(problems.join(" ")).toMatch(/source/i);
    expect(problems.join(" ")).toMatch(/SEO title/i);
  });

  it("requires sponsor disclosure for sponsored articles", () => {
    const problems = validateArticleForPublish({
      title: "T",
      articleType: "sponsored",
      author: {},
      heroMedia: {},
      sources: [{}],
      seoTitle: "t",
      seoDescription: "d",
      isSponsored: true,
      sponsorName: "",
    });
    expect(problems).toEqual(["Sponsored articles must disclose a sponsor name."]);
  });

  it("passes a complete article", () => {
    expect(
      validateArticleForPublish({
        title: "T",
        articleType: "news",
        author: {},
        heroMedia: {},
        sources: [{}],
        seoTitle: "t",
        seoDescription: "d",
      }),
    ).toEqual([]);
  });
});

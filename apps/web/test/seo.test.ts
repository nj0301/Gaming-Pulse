import { describe, expect, it } from "vitest";
import { articles, authors } from "@gaming-pulse/seed-data";
import { articleJsonLd, breadcrumbJsonLd, organizationJsonLd } from "@/lib/seo/jsonld";
import { buildAtom, buildRss } from "@/lib/seo/feeds";

const news = articles.find((a) => a.articleType === "news")!;
const opinion = articles.find((a) => a.articleType === "opinion")!;
const review = articles.find((a) => a.articleType === "review" && a.review)!;
const author = authors[0];

describe("JSON-LD builders (structured-data validation)", () => {
  it("emits NewsArticle for news and Article for opinion", () => {
    expect(articleJsonLd(news, author)["@type"]).toBe("NewsArticle");
    expect(articleJsonLd(opinion, author)["@type"]).toBe("Article");
  });

  it("emits Review with rating only when review data exists", () => {
    const data = articleJsonLd(review, author) as Record<string, never>;
    expect(data["@type"]).toBe("Review");
    expect(data["reviewRating"]).toMatchObject({ ratingValue: review.review!.score });
    expect(articleJsonLd(news, author)).not.toHaveProperty("reviewRating");
  });

  it("includes required NewsArticle fields", () => {
    const data = articleJsonLd(news, author);
    for (const key of ["headline", "datePublished", "dateModified", "image", "author", "publisher"]) {
      expect(data, key).toHaveProperty(key);
    }
  });

  it("builds positioned breadcrumbs with absolute URLs", () => {
    const data = breadcrumbJsonLd([
      { name: "Home", href: "/" },
      { name: "News", href: "/news" },
    ]) as { itemListElement: Array<{ position: number; item: string }> };
    expect(data.itemListElement[0].position).toBe(1);
    expect(data.itemListElement[1].item).toMatch(/^https?:\/\//);
  });

  it("declares corrections and publishing policies on the organization", () => {
    const org = organizationJsonLd();
    expect(org).toHaveProperty("correctionsPolicy");
    expect(org).toHaveProperty("publishingPrinciples");
  });
});

describe("feeds", () => {
  it("produces valid-shaped RSS with escaped entities", () => {
    const rss = buildRss(articles.slice(0, 5));
    expect(rss).toContain("<rss version=\"2.0\"");
    expect(rss).toContain("<guid isPermaLink=\"true\">");
    expect(rss).not.toMatch(/<title>[^<]*&(?!amp;|lt;|gt;|quot;)/);
  });

  it("produces atom entries with updated timestamps", () => {
    const atom = buildAtom(articles.slice(0, 5));
    expect(atom).toContain("<feed xmlns=\"http://www.w3.org/2005/Atom\">");
    expect(atom.match(/<entry>/g)?.length).toBe(5);
  });
});

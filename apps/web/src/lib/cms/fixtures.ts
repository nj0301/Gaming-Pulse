/**
 * Fixture adapter: serves the bundled fictional demo content.
 *
 * Active when CMS_URL is unset, and used as the graceful fallback when the
 * CMS is unreachable — API failures degrade to demo content plus a logged
 * warning instead of a broken page.
 */
import {
  articles,
  authors,
  categories,
  companies,
  deals,
  games,
  homepageSections,
  navigation,
  platforms,
  releaseDates,
  siteSettings,
  tags,
  trends,
  videos,
} from "@gaming-pulse/seed-data";
import type { ArticleQuery, CmsAdapter, SearchResults } from "./types";

const contains = (haystack: string | undefined, needle: string) =>
  (haystack ?? "").toLowerCase().includes(needle.toLowerCase());

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

  async getArticles(query: ArticleQuery = {}) {
    let result = articles;
    if (query.categorySlug) result = result.filter((a) => a.categorySlug === query.categorySlug);
    if (query.platformSlug) result = result.filter((a) => a.platformSlugs.includes(query.platformSlug!));
    if (query.tagSlug) result = result.filter((a) => a.tagSlugs.includes(query.tagSlug!));
    if (query.authorSlug) result = result.filter((a) => a.authorSlug === query.authorSlug);
    if (query.gameSlug) result = result.filter((a) => a.relatedGameSlugs.includes(query.gameSlug!));
    if (query.articleTypes?.length) result = result.filter((a) => query.articleTypes!.includes(a.articleType));
    if (query.breakingOnly) result = result.filter((a) => a.isBreaking);
    if (query.featuredOnly) result = result.filter((a) => a.isFeatured);
    const offset = query.offset ?? 0;
    return result.slice(offset, offset + (query.limit ?? 24));
  },

  async getArticleBySlug(slug) {
    return articles.find((a) => a.slug === slug) ?? null;
  },

  async getGames(options = {}) {
    let result = games;
    if (options.status) result = result.filter((g) => g.releaseStatus === options.status);
    return result.slice(0, options.limit ?? 50);
  },

  async getGameBySlug(slug) {
    return games.find((g) => g.slug === slug) ?? null;
  },

  async getReleaseDates() {
    return releaseDates;
  },

  async getTrends() {
    return [...trends]
      .filter((t) => !t.hidden)
      .sort((a, b) => (Number(b.pinned) - Number(a.pinned)) || b.score - a.score);
  },

  async getVideos(options = {}) {
    return [...videos]
      .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
      .slice(0, options.limit ?? 12);
  },

  async getVideoBySlug(slug) {
    return videos.find((v) => v.slug === slug) ?? null;
  },

  async getDeals() {
    return deals;
  },

  async getAuthors() {
    return authors;
  },

  async getAuthorBySlug(slug) {
    return authors.find((a) => a.slug === slug) ?? null;
  },

  async getCategories() {
    return categories;
  },

  async getPlatforms() {
    return platforms;
  },

  async getPlatformBySlug(slug) {
    return platforms.find((p) => p.slug === slug) ?? null;
  },

  async getTags() {
    return tags;
  },

  async getCompanies() {
    return companies;
  },

  async search(query): Promise<SearchResults> {
    const q = query.trim();
    if (q.length < 2) {
      return { query: q, articles: [], games: [], companies: [], authors: [], platforms: [], categories: [], tags: [] };
    }
    return {
      query: q,
      articles: articles
        .filter((a) => contains(a.title, q) || contains(a.excerpt, q) || contains(a.subtitle, q))
        .slice(0, 10)
        .map((a) => ({ title: a.title, slug: a.slug, excerpt: a.excerpt, articleType: a.articleType })),
      games: games
        .filter((g) => contains(g.name, q) || contains(g.summary, q))
        .slice(0, 10)
        .map((g) => ({ name: g.name, slug: g.slug, summary: g.summary })),
      companies: companies.filter((c) => contains(c.name, q)).slice(0, 5).map((c) => ({ name: c.name, slug: c.slug })),
      authors: authors.filter((a) => contains(a.name, q)).slice(0, 5).map((a) => ({ name: a.name, slug: a.slug })),
      platforms: platforms.filter((p) => contains(p.name, q)).slice(0, 5).map((p) => ({ name: p.name, slug: p.slug })),
      categories: categories.filter((c) => contains(c.name, q)).slice(0, 5).map((c) => ({ name: c.name, slug: c.slug })),
      tags: tags.filter((t) => contains(t.name, q)).slice(0, 5).map((t) => ({ name: t.name, slug: t.slug })),
    };
  },
};

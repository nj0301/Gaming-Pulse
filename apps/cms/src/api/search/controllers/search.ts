/**
 * Universal search across articles, games, companies, authors, platforms,
 * categories and tags.
 *
 * First-release implementation uses case-insensitive contains queries, which
 * work identically on SQLite (dev) and PostgreSQL (prod). The controller is
 * the abstraction seam: swap the internals for Postgres full-text search,
 * Meilisearch or Typesense without changing the route contract.
 */
import type { Core } from "@strapi/strapi";
import type { Context } from "koa";

const MAX_LIMIT = 20;

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async query(ctx: Context) {
    const q = String(ctx.query.q ?? "").trim();
    const limit = Math.min(Number(ctx.query.limit) || 10, MAX_LIMIT);

    if (q.length < 2) {
      ctx.body = { query: q, results: [], message: "Query must be at least 2 characters." };
      return;
    }
    if (q.length > 100) {
      ctx.throw(400, "Query too long.");
    }

    const [articles, games, companies, authors, platforms, categories, tags] = await Promise.all([
      strapi.documents("api::article.article").findMany({
        status: "published",
        filters: {
          $or: [{ title: { $containsi: q } }, { excerpt: { $containsi: q } }, { subtitle: { $containsi: q } }],
        },
        fields: ["title", "slug", "excerpt", "articleType", "publishedAt"],
        sort: { publishedAt: "desc" },
        limit,
      }),
      strapi.documents("api::game.game").findMany({
        status: "published",
        filters: { $or: [{ name: { $containsi: q } }, { summary: { $containsi: q } }] },
        fields: ["name", "slug", "summary", "releaseStatus"],
        limit,
      }),
      strapi.documents("api::company.company").findMany({
        filters: { name: { $containsi: q } },
        fields: ["name", "slug", "role"],
        limit,
      }),
      strapi.documents("api::author.author").findMany({
        filters: { name: { $containsi: q } },
        fields: ["name", "slug", "role"],
        limit,
      }),
      strapi.documents("api::platform.platform").findMany({
        filters: { name: { $containsi: q } },
        fields: ["name", "slug"],
        limit,
      }),
      strapi.documents("api::category.category").findMany({
        filters: { name: { $containsi: q } },
        fields: ["name", "slug"],
        limit,
      }),
      strapi.documents("api::tag.tag").findMany({
        filters: { name: { $containsi: q } },
        fields: ["name", "slug"],
        limit,
      }),
    ]);

    ctx.body = { query: q, results: { articles, games, companies, authors, platforms, categories, tags } };
  },
});

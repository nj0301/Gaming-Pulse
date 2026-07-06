import type { MetadataRoute } from "next";
import { cms } from "@/lib/cms";
import { SITE_URL } from "@/lib/config";
import { staticPages } from "@/lib/static-pages";

/**
 * Standard XML sitemap: all indexable routes. News-specific freshness lives
 * in /news-sitemap.xml; articles stay here permanently either way.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, games, categories, tags, platforms, authors] = await Promise.all([
    cms.getArticles({ limit: 100 }),
    cms.getGames(),
    cms.getCategories(),
    cms.getTags(),
    cms.getPlatforms(),
    cms.getAuthors(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/latest",
    "/trending",
    "/news",
    "/upcoming-games",
    "/games",
    "/reviews",
    "/guides",
    "/esports",
    "/hardware",
    "/deals",
    "/videos",
    "/industry",
    "/insights",
    "/team",
    ...Object.keys(staticPages).map((slug) => `/${slug}`),
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === "" ? "hourly" : "daily",
    priority: path === "" ? 1 : 0.6,
  }));

  return [
    ...staticRoutes,
    ...articles.map((article) => ({
      url: `${SITE_URL}/news/${article.slug}`,
      lastModified: article.updatedAtEditorial,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...games.map((game) => ({
      url: `${SITE_URL}/games/${game.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...platforms.map((p) => ({ url: `${SITE_URL}/platform/${p.slug}`, changeFrequency: "daily" as const, priority: 0.6 })),
    ...categories.map((c) => ({ url: `${SITE_URL}/category/${c.slug}`, changeFrequency: "daily" as const, priority: 0.5 })),
    ...tags.map((t) => ({ url: `${SITE_URL}/tag/${t.slug}`, changeFrequency: "weekly" as const, priority: 0.4 })),
    ...authors.map((a) => ({ url: `${SITE_URL}/author/${a.slug}`, changeFrequency: "weekly" as const, priority: 0.4 })),
  ];
}

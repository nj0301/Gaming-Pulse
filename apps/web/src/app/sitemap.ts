import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";
import { staticPages } from "@/lib/static-pages";
import { getPopularGames, isRawgEnabled } from "@/lib/rawg";

/** Standard XML sitemap: static real routes plus currently-popular real game pages. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const games = isRawgEnabled() ? await getPopularGames(50) : [];

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/latest",
    "/trending",
    "/news",
    "/upcoming-games",
    "/games",
    ...Object.keys(staticPages).map((slug) => `/${slug}`),
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === "" ? "hourly" : "daily",
    priority: path === "" ? 1 : 0.6,
  }));

  return [
    ...staticRoutes,
    ...games.map((game) => ({
      url: `${SITE_URL}/games/${game.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}

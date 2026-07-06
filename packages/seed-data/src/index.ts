/**
 * @gaming-pulse/seed-data
 *
 * FICTIONAL DEMO CONTENT. Every studio, game, person, quote, date, score,
 * price and story exported from this package is invented for demonstration.
 */

import { newsArticles } from "./articles-news";
import { featureArticles } from "./articles-features";
import type { SeedArticle } from "./types";

export * from "./types";
export { platforms, categories, tags, companies, authors } from "./taxonomies";
export { games, releaseDates } from "./games";
export { videos, deals, trends } from "./discovery";
export { homepageSections, navigation, siteSettings } from "./site-config";

/** All articles, newest first. */
export const articles: SeedArticle[] = [...newsArticles, ...featureArticles].sort(
  (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt),
);

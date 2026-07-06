/**
 * Web domain model.
 *
 * The seed-data shapes ARE the domain model: the fixture adapter returns them
 * verbatim and the Strapi adapter maps REST responses into them. Components
 * and pages depend only on these types, never on a specific backend.
 */
export type {
  SeedArticle as Article,
  SeedAuthor as Author,
  SeedCategory as Category,
  SeedCompany as Company,
  SeedDeal as Deal,
  SeedGame as Game,
  SeedHomepageSection as HomepageSection,
  SeedImage as Image,
  SeedNavItem as NavItem,
  SeedPlatform as Platform,
  SeedReleaseDate as ReleaseDate,
  SeedSiteSettings as SiteSettings,
  SeedSource as Source,
  SeedTag as Tag,
  SeedTrend as Trend,
  SeedVideo as Video,
} from "@gaming-pulse/seed-data";

export interface ArticleQuery {
  categorySlug?: string;
  platformSlug?: string;
  tagSlug?: string;
  authorSlug?: string;
  gameSlug?: string;
  articleTypes?: string[];
  breakingOnly?: boolean;
  featuredOnly?: boolean;
  limit?: number;
  offset?: number;
}

export interface SearchResults {
  query: string;
  articles: Array<{ title: string; slug: string; excerpt: string; articleType: string }>;
  games: Array<{ name: string; slug: string; summary: string }>;
  companies: Array<{ name: string; slug: string }>;
  authors: Array<{ name: string; slug: string }>;
  platforms: Array<{ name: string; slug: string }>;
  categories: Array<{ name: string; slug: string }>;
  tags: Array<{ name: string; slug: string }>;
}

export interface CmsAdapter {
  readonly source: "fixtures" | "strapi";
  getSiteSettings(): Promise<import("@gaming-pulse/seed-data").SeedSiteSettings>;
  getNavigation(): Promise<{
    primary: import("@gaming-pulse/seed-data").SeedNavItem[];
    footer: import("@gaming-pulse/seed-data").SeedNavItem[];
  }>;
  getHomepageSections(): Promise<import("@gaming-pulse/seed-data").SeedHomepageSection[]>;
  getArticles(query?: ArticleQuery): Promise<import("@gaming-pulse/seed-data").SeedArticle[]>;
  getArticleBySlug(slug: string): Promise<import("@gaming-pulse/seed-data").SeedArticle | null>;
  getGames(options?: { limit?: number; status?: string }): Promise<import("@gaming-pulse/seed-data").SeedGame[]>;
  getGameBySlug(slug: string): Promise<import("@gaming-pulse/seed-data").SeedGame | null>;
  getReleaseDates(): Promise<import("@gaming-pulse/seed-data").SeedReleaseDate[]>;
  getTrends(): Promise<import("@gaming-pulse/seed-data").SeedTrend[]>;
  getVideos(options?: { limit?: number }): Promise<import("@gaming-pulse/seed-data").SeedVideo[]>;
  getVideoBySlug(slug: string): Promise<import("@gaming-pulse/seed-data").SeedVideo | null>;
  getDeals(): Promise<import("@gaming-pulse/seed-data").SeedDeal[]>;
  getAuthors(): Promise<import("@gaming-pulse/seed-data").SeedAuthor[]>;
  getAuthorBySlug(slug: string): Promise<import("@gaming-pulse/seed-data").SeedAuthor | null>;
  getCategories(): Promise<import("@gaming-pulse/seed-data").SeedCategory[]>;
  getPlatforms(): Promise<import("@gaming-pulse/seed-data").SeedPlatform[]>;
  getPlatformBySlug(slug: string): Promise<import("@gaming-pulse/seed-data").SeedPlatform | null>;
  getTags(): Promise<import("@gaming-pulse/seed-data").SeedTag[]>;
  getCompanies(): Promise<import("@gaming-pulse/seed-data").SeedCompany[]>;
  search(query: string): Promise<SearchResults>;
}

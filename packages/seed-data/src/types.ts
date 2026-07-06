/**
 * Seed entity shapes. These mirror the Strapi content types (docs/ARCHITECTURE.md)
 * and are consumed both by the CMS seed script and by the web app's
 * fixture-fallback CMS adapter.
 *
 * ALL CONTENT BUILT FROM THESE TYPES IS FICTIONAL DEMO CONTENT.
 */

import type { ArticleType, FactStatus, ReleasePrecision, ReleaseKind } from "@gaming-pulse/core";

export interface SeedImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  credit?: string;
}

export interface SeedPlatform {
  name: string;
  slug: string;
  shortName: string;
  description: string;
  accent: "cyan" | "violet" | "magenta" | "green" | "warning";
}

export interface SeedCompany {
  name: string;
  slug: string;
  role: "developer" | "publisher" | "both";
  country: string;
  founded: number;
  description: string;
}

export interface SeedAuthor {
  name: string;
  slug: string;
  role: string;
  bio: string;
  avatar: SeedImage;
  expertise: string[];
}

export interface SeedCategory {
  name: string;
  slug: string;
  description: string;
}

export interface SeedTag {
  name: string;
  slug: string;
}

export interface SeedSource {
  publisher: string;
  sourceUrl: string;
  sourceType:
    | "official-blog"
    | "press-release"
    | "interview"
    | "social-post"
    | "news-report"
    | "store-listing"
    | "video"
    | "financial-filing";
  originalPublicationDate: string;
  accessedAt: string;
  authorityLevel: 1 | 2 | 3 | 4 | 5;
  officialSource: boolean;
  verifiedBy?: string;
  notes?: string;
}

export interface SeedStoreLink {
  store: string;
  url: string;
}

export interface SeedReleaseDate {
  id: string;
  gameSlug: string;
  platformSlugs: string[];
  region: "worldwide" | "na" | "eu" | "jp";
  date: string | null;
  precision: ReleasePrecision;
  kind: ReleaseKind;
  confirmed: boolean;
  note?: string;
}

export interface SeedGame {
  name: string;
  slug: string;
  externalDatabaseId: string | null;
  summary: string;
  description: string;
  cover: SeedImage;
  heroArtwork: SeedImage;
  screenshots: SeedImage[];
  trailerSlugs: string[];
  genres: string[];
  themes: string[];
  platformSlugs: string[];
  developerSlug: string;
  publisherSlug: string;
  franchise: string | null;
  releaseStatus: "released" | "upcoming" | "early-access" | "tba";
  ageRatings: string[];
  gameModes: string[];
  officialWebsite: string;
  storeLinks: SeedStoreLink[];
  trendingScore: number;
  dataSource: "manual-demo";
  lastSynchronizedAt: string;
}

export interface SeedCorrection {
  date: string;
  note: string;
}

export interface SeedReviewData {
  score: number;
  scoreMax: 10;
  verdict: string;
  pros: string[];
  cons: string[];
  reviewedOnPlatform: string;
  copyProvidedBy: string;
}

export interface SeedArticle {
  title: string;
  slug: string;
  subtitle: string;
  excerpt: string;
  /** Markdown body. */
  body: string;
  articleType: ArticleType;
  factStatus: FactStatus;
  categorySlug: string;
  platformSlugs: string[];
  relatedGameSlugs: string[];
  tagSlugs: string[];
  authorSlug: string;
  reviewerSlug?: string;
  heroImage: SeedImage;
  gallery?: SeedImage[];
  videoSlugs?: string[];
  publishedAt: string;
  updatedAtEditorial: string;
  isBreaking: boolean;
  isFeatured: boolean;
  isSponsored: boolean;
  sponsorName?: string;
  sources: SeedSource[];
  keyPoints: string[];
  confirmedFacts: string[];
  unconfirmedPoints: string[];
  correctionLog: SeedCorrection[];
  review?: SeedReviewData;
  seoTitle: string;
  seoDescription: string;
  aiAssisted: boolean;
  humanReviewed: boolean;
  newsletterPlacement: "none" | "inline" | "footer";
}

export interface SeedVideo {
  title: string;
  slug: string;
  kind: "trailer" | "gameplay" | "interview" | "showcase";
  provider: "demo-local";
  /** Local poster frame; no third-party embeds in demo content. */
  poster: SeedImage;
  durationSeconds: number;
  publishedAt: string;
  relatedGameSlug: string | null;
  description: string;
}

export interface SeedDeal {
  title: string;
  slug: string;
  gameSlug: string | null;
  retailer: string;
  url: string;
  price: number | null;
  originalPrice: number | null;
  currency: "USD";
  discountPercent: number | null;
  isFree: boolean;
  startsAt: string;
  endsAt: string;
  platformSlugs: string[];
  note: string;
}

export interface SeedTrend {
  title: string;
  slug: string;
  /** Plain-language explanation of why this is trending. */
  whyTrending: string;
  context: string;
  score: number;
  pinned: boolean;
  hidden: boolean;
  manualAdjustment: number;
  expiresAt: string | null;
  relatedArticleSlugs: string[];
  relatedGameSlugs: string[];
}

export type HomepageSectionKind =
  | "breaking-ticker"
  | "hero"
  | "trending"
  | "latest"
  | "upcoming-releases"
  | "newsletter";

export interface SeedHomepageSection {
  kind: HomepageSectionKind;
  title: string;
  enabled: boolean;
  order: number;
  /** Optional curated slugs; empty = automatic query. */
  curatedSlugs: string[];
  maxItems: number;
}

export interface SeedNavItem {
  label: string;
  href: string;
  children?: SeedNavItem[];
}

export interface SeedSiteSettings {
  siteName: string;
  tagline: string;
  demoNotice: string;
  socialLinks: { label: string; url: string }[];
  newsletterHeading: string;
  newsletterSubheading: string;
}

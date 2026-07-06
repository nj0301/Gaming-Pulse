/**
 * Strapi adapter: maps the CMS REST API into the web domain model.
 *
 * Every method degrades gracefully — on any fetch/mapping failure it logs a
 * warning and delegates to the fixture adapter, so a CMS outage renders the
 * bundled demo content rather than an error page.
 */
import { CMS_TOKEN, CMS_URL, REVALIDATE_SECONDS } from "../config";
import { fixtureAdapter } from "./fixtures";
import type { ArticleQuery, CmsAdapter, SearchResults } from "./types";
import type {
  SeedArticle,
  SeedGame,
  SeedImage,
  SeedReleaseDate,
} from "@gaming-pulse/seed-data";

interface StrapiMedia {
  url?: string;
  alternativeText?: string | null;
  caption?: string | null;
  width?: number | null;
  height?: number | null;
}

type Entity = Record<string, unknown>;

function absoluteMediaUrl(url: string | undefined): string {
  if (!url) return "/media/og-default.svg";
  return url.startsWith("http") ? url : `${CMS_URL}${url}`;
}

function mapImage(media: StrapiMedia | null | undefined, fallbackAlt = ""): SeedImage {
  return {
    src: absoluteMediaUrl(media?.url),
    alt: media?.alternativeText ?? fallbackAlt,
    width: media?.width ?? 1280,
    height: media?.height ?? 720,
    caption: media?.caption ?? undefined,
  };
}

async function cmsFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`/api${path}`, CMS_URL!);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  const response = await fetch(url, {
    headers: CMS_TOKEN ? { Authorization: `Bearer ${CMS_TOKEN}` } : undefined,
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!response.ok) throw new Error(`CMS responded ${response.status} for ${path}`);
  return response.json() as Promise<T>;
}

const slugsOf = (rel: unknown): string[] =>
  Array.isArray(rel) ? rel.map((r) => (r as Entity).slug as string).filter(Boolean) : [];

function mapArticle(entity: Entity): SeedArticle {
  const seo = (entity.seo ?? {}) as Entity;
  const author = entity.author as Entity | null;
  const reviewer = entity.reviewer as Entity | null;
  const category = entity.category as Entity | null;
  const review = entity.review as Entity | null;
  return {
    title: String(entity.title ?? ""),
    slug: String(entity.slug ?? ""),
    subtitle: String(entity.subtitle ?? ""),
    excerpt: String(entity.excerpt ?? ""),
    body: String(entity.body ?? ""),
    articleType: (entity.articleType ?? "news") as SeedArticle["articleType"],
    factStatus: (entity.factStatus ?? "reported") as SeedArticle["factStatus"],
    categorySlug: String(category?.slug ?? "news"),
    platformSlugs: slugsOf(entity.platforms),
    relatedGameSlugs: slugsOf(entity.relatedGames),
    tagSlugs: slugsOf(entity.tags),
    authorSlug: String(author?.slug ?? ""),
    reviewerSlug: reviewer?.slug ? String(reviewer.slug) : undefined,
    heroImage: mapImage(entity.heroMedia as StrapiMedia, String(entity.title ?? "")),
    gallery: Array.isArray(entity.gallery)
      ? (entity.gallery as Entity[]).map((g) => ({
          ...mapImage(g.image as StrapiMedia),
          caption: (g.caption as string) ?? undefined,
          credit: (g.credit as string) ?? undefined,
        }))
      : undefined,
    videoSlugs: slugsOf(entity.videos),
    publishedAt: String(entity.publishedAt ?? new Date().toISOString()),
    updatedAtEditorial: String(entity.updatedAt ?? entity.publishedAt ?? new Date().toISOString()),
    isBreaking: Boolean(entity.isBreaking),
    isFeatured: Boolean(entity.isFeatured),
    isSponsored: Boolean(entity.isSponsored),
    sponsorName: (entity.sponsorName as string) ?? undefined,
    sources: Array.isArray(entity.sources) ? (entity.sources as SeedArticle["sources"]) : [],
    keyPoints: (entity.keyPoints as string[]) ?? [],
    confirmedFacts: (entity.confirmedFacts as string[]) ?? [],
    unconfirmedPoints: (entity.unconfirmedPoints as string[]) ?? [],
    correctionLog: Array.isArray(entity.correctionLog)
      ? (entity.correctionLog as SeedArticle["correctionLog"])
      : [],
    review: review
      ? {
          score: Number(review.score ?? 0),
          scoreMax: 10,
          verdict: String(review.verdict ?? ""),
          pros: (review.pros as string[]) ?? [],
          cons: (review.cons as string[]) ?? [],
          reviewedOnPlatform: String(review.reviewedOnPlatform ?? ""),
          copyProvidedBy: String(review.copyProvidedBy ?? ""),
        }
      : undefined,
    seoTitle: String(seo.seoTitle ?? entity.title ?? ""),
    seoDescription: String(seo.seoDescription ?? entity.excerpt ?? ""),
    aiAssisted: Boolean(entity.aiAssisted),
    humanReviewed: Boolean(entity.humanReviewed ?? true),
    newsletterPlacement: (entity.newsletterPlacement ?? "none") as SeedArticle["newsletterPlacement"],
  };
}

function mapGame(entity: Entity): SeedGame {
  const developer = entity.developer as Entity | null;
  const publisher = entity.publisher as Entity | null;
  return {
    name: String(entity.name ?? ""),
    slug: String(entity.slug ?? ""),
    externalDatabaseId: (entity.externalDatabaseId as string) ?? null,
    summary: String(entity.summary ?? ""),
    description: String(entity.description ?? ""),
    cover: mapImage(entity.cover as StrapiMedia, String(entity.name ?? "")),
    heroArtwork: mapImage(entity.heroArtwork as StrapiMedia, String(entity.name ?? "")),
    screenshots: Array.isArray(entity.screenshots)
      ? (entity.screenshots as StrapiMedia[]).map((s) => mapImage(s))
      : [],
    trailerSlugs: slugsOf(entity.trailers),
    genres: Array.isArray(entity.genres) ? (entity.genres as Entity[]).map((g) => String(g.name)) : [],
    themes: (entity.themes as string[]) ?? [],
    platformSlugs: slugsOf(entity.platforms),
    developerSlug: String(developer?.slug ?? ""),
    publisherSlug: String(publisher?.slug ?? ""),
    franchise: (entity.franchise as string) ?? null,
    releaseStatus: (entity.releaseStatus ?? "tba") as SeedGame["releaseStatus"],
    ageRatings: (entity.ageRatings as string[]) ?? [],
    gameModes: (entity.gameModes as string[]) ?? [],
    officialWebsite: String(entity.officialWebsite ?? ""),
    storeLinks: Array.isArray(entity.storeLinks) ? (entity.storeLinks as SeedGame["storeLinks"]) : [],
    trendingScore: Number(entity.trendingScore ?? 0),
    dataSource: "manual-demo",
    lastSynchronizedAt: String(entity.lastSynchronizedAt ?? ""),
  };
}

const ARTICLE_POPULATE =
  "populate[author]=true&populate[reviewer]=true&populate[category]=true&populate[platforms]=true&populate[relatedGames]=true&populate[tags]=true&populate[heroMedia]=true&populate[gallery][populate]=image&populate[videos]=true&populate[sources]=true&populate[correctionLog]=true&populate[review]=true&populate[seo]=true";

function articleFilters(query: ArticleQuery): string {
  const parts: string[] = [];
  if (query.categorySlug) parts.push(`filters[category][slug][$eq]=${encodeURIComponent(query.categorySlug)}`);
  if (query.platformSlug) parts.push(`filters[platforms][slug][$eq]=${encodeURIComponent(query.platformSlug)}`);
  if (query.tagSlug) parts.push(`filters[tags][slug][$eq]=${encodeURIComponent(query.tagSlug)}`);
  if (query.authorSlug) parts.push(`filters[author][slug][$eq]=${encodeURIComponent(query.authorSlug)}`);
  if (query.gameSlug) parts.push(`filters[relatedGames][slug][$eq]=${encodeURIComponent(query.gameSlug)}`);
  if (query.breakingOnly) parts.push("filters[isBreaking][$eq]=true");
  if (query.featuredOnly) parts.push("filters[isFeatured][$eq]=true");
  for (const [i, t] of (query.articleTypes ?? []).entries()) {
    parts.push(`filters[articleType][$in][${i}]=${encodeURIComponent(t)}`);
  }
  parts.push(`pagination[limit]=${query.limit ?? 24}`);
  parts.push(`pagination[start]=${query.offset ?? 0}`);
  parts.push("sort=publishedAt:desc");
  return parts.join("&");
}

async function listFromCms<T>(path: string, qs: string, map: (e: Entity) => T): Promise<T[]> {
  const data = await cmsFetch<{ data: Entity[] }>(`${path}?${qs}`);
  return data.data.map(map);
}

/** Wrap a Strapi call with fixture fallback. */
async function withFallback<T>(label: string, strapiCall: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
  try {
    return await strapiCall();
  } catch (error) {
    console.warn(`[cms] ${label} failed (${(error as Error).message}); serving fixture content.`);
    return fallback();
  }
}

export const strapiAdapter: CmsAdapter = {
  source: "strapi",

  getSiteSettings: () =>
    withFallback(
      "site-settings",
      async () => {
        const data = await cmsFetch<{ data: Entity }>("/site-setting");
        const s = data.data;
        const fixture = await fixtureAdapter.getSiteSettings();
        return {
          ...fixture,
          siteName: String(s.siteName ?? fixture.siteName),
          tagline: String(s.tagline ?? fixture.tagline),
          demoNotice: String(s.demoNotice ?? fixture.demoNotice),
          newsletterHeading: String(s.newsletterHeading ?? fixture.newsletterHeading),
          newsletterSubheading: String(s.newsletterSubheading ?? fixture.newsletterSubheading),
        };
      },
      fixtureAdapter.getSiteSettings,
    ),

  getNavigation: () =>
    withFallback(
      "navigation",
      async () => {
        const data = await cmsFetch<{ data: Entity }>(
          "/navigation-config?populate[primary][populate]=children&populate[footer][populate]=children",
        );
        const mapItems = (items: unknown): import("@gaming-pulse/seed-data").SeedNavItem[] =>
          Array.isArray(items)
            ? items.map((i: Entity) => ({
                label: String(i.label),
                href: String(i.href),
                children: Array.isArray(i.children) && i.children.length
                  ? (i.children as Entity[]).map((c) => ({ label: String(c.label), href: String(c.href) }))
                  : undefined,
              }))
            : [];
        return { primary: mapItems(data.data.primary), footer: mapItems(data.data.footer) };
      },
      fixtureAdapter.getNavigation,
    ),

  getHomepageSections: () =>
    withFallback(
      "homepage-config",
      async () => {
        const data = await cmsFetch<{ data: Entity }>("/homepage-config?populate=sections");
        const sections = (data.data.sections ?? []) as Entity[];
        return sections
          .map((s) => ({
            kind: s.kind as never,
            title: String(s.title),
            enabled: Boolean(s.enabled),
            order: Number(s.order),
            curatedSlugs: (s.curatedSlugs as string[]) ?? [],
            maxItems: Number(s.maxItems ?? 6),
          }))
          .sort((a, b) => a.order - b.order);
      },
      fixtureAdapter.getHomepageSections,
    ),

  getArticles: (query = {}) =>
    withFallback(
      "articles",
      () => listFromCms("/articles", `${articleFilters(query)}&${ARTICLE_POPULATE}`, mapArticle),
      () => fixtureAdapter.getArticles(query),
    ),

  getArticleBySlug: (slug) =>
    withFallback(
      `article:${slug}`,
      async () => {
        const list = await listFromCms(
          "/articles",
          `filters[slug][$eq]=${encodeURIComponent(slug)}&${ARTICLE_POPULATE}`,
          mapArticle,
        );
        return list[0] ?? null;
      },
      () => fixtureAdapter.getArticleBySlug(slug),
    ),

  getGames: (options = {}) =>
    withFallback(
      "games",
      () =>
        listFromCms(
          "/games",
          `${options.status ? `filters[releaseStatus][$eq]=${options.status}&` : ""}pagination[limit]=${options.limit ?? 50}&populate=*`,
          mapGame,
        ),
      () => fixtureAdapter.getGames(options),
    ),

  getGameBySlug: (slug) =>
    withFallback(
      `game:${slug}`,
      async () => {
        const list = await listFromCms(
          "/games",
          `filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`,
          mapGame,
        );
        return list[0] ?? null;
      },
      () => fixtureAdapter.getGameBySlug(slug),
    ),

  getReleaseDates: () =>
    withFallback(
      "release-dates",
      () =>
        listFromCms("/release-dates", "populate=*&pagination[limit]=100", (e): SeedReleaseDate => {
          const game = e.game as Entity | null;
          return {
            id: String(e.documentId ?? e.id),
            gameSlug: String(game?.slug ?? ""),
            platformSlugs: slugsOf(e.platforms),
            region: (e.region ?? "worldwide") as SeedReleaseDate["region"],
            date: (e.date as string) ?? null,
            precision: (e.precision ?? "tba") as SeedReleaseDate["precision"],
            kind: (e.kind ?? "full") as SeedReleaseDate["kind"],
            confirmed: Boolean(e.confirmed),
            note: (e.note as string) ?? undefined,
          };
        }),
      fixtureAdapter.getReleaseDates,
    ),

  getTrends: () =>
    withFallback(
      "trends",
      () =>
        listFromCms(
          "/trends",
          "filters[hidden][$eq]=false&populate[relatedArticles]=true&populate[relatedGames]=true&sort[0]=pinned:desc&sort[1]=score:desc&pagination[limit]=20",
          (e) => ({
            title: String(e.title),
            slug: String(e.slug),
            whyTrending: String(e.whyTrending ?? ""),
            context: String(e.context ?? ""),
            score: Number(e.score ?? 0),
            pinned: Boolean(e.pinned),
            hidden: Boolean(e.hidden),
            manualAdjustment: Number(e.manualAdjustment ?? 0),
            expiresAt: (e.expiresAt as string) ?? null,
            relatedArticleSlugs: slugsOf(e.relatedArticles),
            relatedGameSlugs: slugsOf(e.relatedGames),
          }),
        ),
      fixtureAdapter.getTrends,
    ),

  getVideos: (options = {}) =>
    withFallback(
      "videos",
      () =>
        listFromCms(
          "/videos",
          `populate=*&sort=publishedAt:desc&pagination[limit]=${options.limit ?? 12}`,
          (e) => {
            const game = (e.relatedGame ?? null) as Entity | null;
            return {
              title: String(e.title),
              slug: String(e.slug),
              kind: (e.kind ?? "trailer") as "trailer",
              provider: "demo-local" as const,
              poster: mapImage(e.poster as StrapiMedia, String(e.title)),
              durationSeconds: Number(e.durationSeconds ?? 0),
              publishedAt: String(e.publishedAt ?? ""),
              relatedGameSlug: game?.slug ? String(game.slug) : null,
              description: String(e.description ?? ""),
            };
          },
        ),
      () => fixtureAdapter.getVideos(options),
    ),

  getVideoBySlug: (slug) =>
    withFallback(
      `video:${slug}`,
      async () => {
        const all = await strapiAdapter.getVideos({ limit: 100 });
        return all.find((v) => v.slug === slug) ?? null;
      },
      () => fixtureAdapter.getVideoBySlug(slug),
    ),

  getDeals: () =>
    withFallback(
      "deals",
      () =>
        listFromCms("/deals", "populate=*&pagination[limit]=20", (e) => {
          const game = e.game as Entity | null;
          return {
            title: String(e.title),
            slug: String(e.slug),
            gameSlug: game?.slug ? String(game.slug) : null,
            retailer: String(e.retailer ?? ""),
            url: String(e.url ?? "#"),
            price: e.price === null ? null : Number(e.price),
            originalPrice: e.originalPrice === null ? null : Number(e.originalPrice),
            currency: "USD" as const,
            discountPercent: e.discountPercent === null ? null : Number(e.discountPercent),
            isFree: Boolean(e.isFree),
            startsAt: String(e.startsAt ?? ""),
            endsAt: String(e.endsAt ?? ""),
            platformSlugs: slugsOf(e.platforms),
            note: String(e.note ?? ""),
          };
        }),
      fixtureAdapter.getDeals,
    ),

  getAuthors: () =>
    withFallback(
      "authors",
      () =>
        listFromCms("/authors", "populate=avatar&pagination[limit]=50", (e) => ({
          name: String(e.name),
          slug: String(e.slug),
          role: String(e.role ?? ""),
          bio: String(e.bio ?? ""),
          avatar: mapImage(e.avatar as StrapiMedia, String(e.name)),
          expertise: (e.expertise as string[]) ?? [],
        })),
      fixtureAdapter.getAuthors,
    ),

  getAuthorBySlug: (slug) =>
    withFallback(
      `author:${slug}`,
      async () => {
        const all = await strapiAdapter.getAuthors();
        return all.find((a) => a.slug === slug) ?? null;
      },
      () => fixtureAdapter.getAuthorBySlug(slug),
    ),

  getCategories: () =>
    withFallback(
      "categories",
      () =>
        listFromCms("/categories", "pagination[limit]=50", (e) => ({
          name: String(e.name),
          slug: String(e.slug),
          description: String(e.description ?? ""),
        })),
      fixtureAdapter.getCategories,
    ),

  getPlatforms: () =>
    withFallback(
      "platforms",
      () =>
        listFromCms("/platforms", "pagination[limit]=20", (e) => ({
          name: String(e.name),
          slug: String(e.slug),
          shortName: String(e.shortName ?? ""),
          description: String(e.description ?? ""),
          accent: (e.accent ?? "cyan") as "cyan",
        })),
      fixtureAdapter.getPlatforms,
    ),

  getPlatformBySlug: (slug) =>
    withFallback(
      `platform:${slug}`,
      async () => {
        const all = await strapiAdapter.getPlatforms();
        return all.find((p) => p.slug === slug) ?? null;
      },
      () => fixtureAdapter.getPlatformBySlug(slug),
    ),

  getTags: () =>
    withFallback(
      "tags",
      () =>
        listFromCms("/tags", "pagination[limit]=100", (e) => ({
          name: String(e.name),
          slug: String(e.slug),
        })),
      fixtureAdapter.getTags,
    ),

  getCompanies: () =>
    withFallback(
      "companies",
      () =>
        listFromCms("/companies", "pagination[limit]=100", (e) => ({
          name: String(e.name),
          slug: String(e.slug),
          role: (e.role ?? "developer") as "developer",
          country: String(e.country ?? ""),
          founded: Number(e.founded ?? 0),
          description: String(e.description ?? ""),
        })),
      fixtureAdapter.getCompanies,
    ),

  search: (query) =>
    withFallback(
      "search",
      async () => {
        const data = await cmsFetch<{
          query: string;
          results: {
            articles: Entity[];
            games: Entity[];
            companies: Entity[];
            authors: Entity[];
            platforms: Entity[];
            categories: Entity[];
            tags: Entity[];
          };
        }>(`/search?q=${encodeURIComponent(query)}`);
        const r = data.results;
        return {
          query,
          articles: (r.articles ?? []).map((a) => ({
            title: String(a.title),
            slug: String(a.slug),
            excerpt: String(a.excerpt ?? ""),
            articleType: String(a.articleType ?? "news"),
          })),
          games: (r.games ?? []).map((g) => ({ name: String(g.name), slug: String(g.slug), summary: String(g.summary ?? "") })),
          companies: (r.companies ?? []).map((c) => ({ name: String(c.name), slug: String(c.slug) })),
          authors: (r.authors ?? []).map((a) => ({ name: String(a.name), slug: String(a.slug) })),
          platforms: (r.platforms ?? []).map((p) => ({ name: String(p.name), slug: String(p.slug) })),
          categories: (r.categories ?? []).map((c) => ({ name: String(c.name), slug: String(c.slug) })),
          tags: (r.tags ?? []).map((t) => ({ name: String(t.name), slug: String(t.slug) })),
        } satisfies SearchResults;
      },
      () => fixtureAdapter.search(query),
    ),
};

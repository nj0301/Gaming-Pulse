/**
 * RAWG adapter — real games, real cover art, real release dates.
 *
 * Free tier: sign up at https://rawg.io/apidocs for a key (no cost, generous
 * quota). Set RAWG_API_KEY in apps/web/.env.local to enable. Without a key,
 * callers fall back to the bundled fictional demo games (clearly labeled) —
 * nothing here ever fabricates data to look real.
 */

const API_BASE = "https://api.rawg.io/api";
const REVALIDATE_SECONDS = 3600;

export interface RawgImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  credit: string;
}

export interface RawgGame {
  slug: string;
  name: string;
  summary: string;
  cover: RawgImage;
  heroArtwork: RawgImage;
  screenshots: RawgImage[];
  genres: string[];
  platformNames: string[];
  releaseStatus: "released" | "upcoming" | "tba";
  releaseDate: string | null;
  rating: number;
  website: string;
  storeLinks: Array<{ store: string; url: string }>;
}

export function isRawgEnabled(): boolean {
  return Boolean(process.env.RAWG_API_KEY);
}

function img(url: string | null, alt: string): RawgImage {
  return {
    src: url ?? "/media/og-default.svg",
    alt,
    width: 1280,
    height: 720,
    credit: "Cover art via RAWG (rawg.io)",
  };
}

function releaseStatusOf(released: string | null): "released" | "upcoming" | "tba" {
  if (!released) return "tba";
  return new Date(released).getTime() <= Date.now() ? "released" : "upcoming";
}

interface RawgListItem {
  id: number;
  slug: string;
  name: string;
  background_image: string | null;
  released: string | null;
  rating: number;
  genres?: Array<{ name: string }>;
  platforms?: Array<{ platform: { name: string } }>;
}

async function rawgFetch<T>(path: string, params: Record<string, string> = {}): Promise<T | null> {
  const key = process.env.RAWG_API_KEY;
  if (!key) return null;
  const url = new URL(`${API_BASE}${path}`);
  url.searchParams.set("key", key);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function mapListItem(item: RawgListItem): RawgGame {
  return {
    slug: item.slug,
    name: item.name,
    summary: "",
    cover: img(item.background_image, `${item.name} cover art`),
    heroArtwork: img(item.background_image, `${item.name} key art`),
    screenshots: [],
    genres: (item.genres ?? []).map((g) => g.name),
    platformNames: (item.platforms ?? []).map((p) => p.platform.name),
    releaseStatus: releaseStatusOf(item.released),
    releaseDate: item.released,
    rating: item.rating,
    website: "",
    storeLinks: [],
  };
}

/** Real, currently-popular games (ordered by community activity), with real cover art. */
export async function getPopularGames(limit = 20): Promise<RawgGame[]> {
  const data = await rawgFetch<{ results: RawgListItem[] }>("/games", {
    page_size: String(limit),
    ordering: "-added",
  });
  return data?.results.map(mapListItem) ?? [];
}

/** Real upcoming releases, ordered by release date, for the calendar. */
export async function getUpcomingGames(limit = 40): Promise<RawgGame[]> {
  const today = new Date().toISOString().slice(0, 10);
  const future = new Date(Date.now() + 365 * 86_400_000).toISOString().slice(0, 10);
  const data = await rawgFetch<{ results: RawgListItem[] }>("/games", {
    page_size: String(limit),
    ordering: "released",
    dates: `${today},${future}`,
  });
  return data?.results.map(mapListItem) ?? [];
}

interface RawgDetail {
  id: number;
  slug: string;
  name: string;
  description_raw?: string;
  background_image: string | null;
  background_image_additional?: string | null;
  released: string | null;
  rating: number;
  website?: string;
  genres?: Array<{ name: string }>;
  platforms?: Array<{ platform: { name: string } }>;
  stores?: Array<{ store: { name: string }; url?: string }>;
}

/** Full detail for a real game by RAWG slug, including screenshots. */
export async function getRawgGameBySlug(slug: string): Promise<RawgGame | null> {
  const [detail, shots] = await Promise.all([
    rawgFetch<RawgDetail>(`/games/${slug}`),
    rawgFetch<{ results: Array<{ image: string }> }>(`/games/${slug}/screenshots`),
  ]);
  if (!detail) return null;

  return {
    slug: detail.slug,
    name: detail.name,
    summary: (detail.description_raw ?? "").split("\n")[0]?.slice(0, 300) ?? "",
    cover: img(detail.background_image, `${detail.name} cover art`),
    heroArtwork: img(detail.background_image_additional ?? detail.background_image, `${detail.name} key art`),
    screenshots: (shots?.results ?? []).slice(0, 6).map((s) => img(s.image, `${detail.name} screenshot`)),
    genres: (detail.genres ?? []).map((g) => g.name),
    platformNames: (detail.platforms ?? []).map((p) => p.platform.name),
    releaseStatus: releaseStatusOf(detail.released),
    releaseDate: detail.released,
    rating: detail.rating,
    website: detail.website ?? "",
    storeLinks: (detail.stores ?? [])
      .filter((s) => s.url)
      .map((s) => ({ store: s.store.name, url: s.url! })),
  };
}

/** Case-insensitive game name search, for the universal search bar. */
export async function searchRawgGames(query: string, limit = 8): Promise<RawgGame[]> {
  const data = await rawgFetch<{ results: RawgListItem[] }>("/games", {
    search: query,
    page_size: String(limit),
  });
  return data?.results.map(mapListItem) ?? [];
}

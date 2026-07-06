/**
 * Live gaming news aggregator.
 *
 * Pulls real, current headlines directly from public RSS feeds published by
 * major gaming outlets — no API key, no quota, no cost. This is the site's
 * actual news source: no fictional articles are involved.
 *
 * Legal model: aggregator/index behavior only (like Google News) — we display
 * the outlet's own headline, excerpt and thumbnail image with full
 * attribution, and every "read more" links back to the original source.
 * Nothing is republished in full.
 */

export interface WireArticle {
  id: string;
  title: string;
  excerpt: string;
  link: string;
  imageUrl: string | null;
  sourceName: string;
  publishedAt: string;
}

interface FeedSource {
  name: string;
  url: string;
}

/** Curated set of outlets with reliable, unauthenticated public RSS feeds. */
const FEEDS: FeedSource[] = [
  { name: "Eurogamer", url: "https://www.eurogamer.net/feed" },
  { name: "PC Gamer", url: "https://www.pcgamer.com/rss/" },
  { name: "GameSpot", url: "https://www.gamespot.com/feeds/game-news/" },
  { name: "Rock Paper Shotgun", url: "https://www.rockpapershotgun.com/feed" },
  { name: "VG247", url: "https://www.vg247.com/feed" },
  { name: "Destructoid", url: "https://www.destructoid.com/feed/" },
  { name: "Nintendo Life", url: "https://www.nintendolife.com/feeds/latest" },
];

const FETCH_TIMEOUT_MS = 8_000;
const CACHE_TTL_MS = 60 * 60_000; // 1 hour

let cache: { items: WireArticle[]; expiresAt: number } | null = null;

function decodeEntities(input: string): string {
  return input
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function stripCdata(input: string): string {
  const match = /^<!\[CDATA\[([\s\S]*)\]\]>$/.exec(input.trim());
  return match ? match[1] : input;
}

function stripHtml(input: string): string {
  return decodeEntities(input.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function extractTag(block: string, tag: string): string | null {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const match = re.exec(block);
  return match ? stripCdata(match[1]).trim() : null;
}

function extractImage(block: string): string | null {
  // Try media:content, then enclosure, then the first <img> inside description/content.
  const media = /<media:content[^>]*url="([^"]+)"/i.exec(block);
  if (media) return decodeEntities(media[1]);
  const enclosure = /<enclosure[^>]*url="([^"]+)"[^>]*type="image/i.exec(block);
  if (enclosure) return decodeEntities(enclosure[1]);
  const img = /<img[^>]+src="([^"]+)"/i.exec(block);
  if (img) return decodeEntities(img[1]);
  return null;
}

function parseFeed(xml: string, source: FeedSource): WireArticle[] {
  const items: WireArticle[] = [];
  const blocks = xml.match(/<item[\s\S]*?<\/item>/g) ?? [];
  for (const block of blocks.slice(0, 15)) {
    const rawTitle = extractTag(block, "title");
    const link = extractTag(block, "link");
    if (!rawTitle || !link) continue;

    const description = extractTag(block, "description") ?? "";
    const pubDate = extractTag(block, "pubDate");
    const publishedAt = pubDate ? new Date(pubDate).toISOString() : new Date().toISOString();

    items.push({
      id: link,
      title: decodeEntities(rawTitle),
      excerpt: stripHtml(description).slice(0, 220),
      link,
      imageUrl: extractImage(block),
      sourceName: source.name,
      publishedAt,
    });
  }
  return items;
}

async function fetchFeed(source: FeedSource): Promise<WireArticle[]> {
  try {
    const response = await fetch(source.url, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: { "User-Agent": "GamingPulse-NewsAggregator/1.0 (+https://example.com)" },
      next: { revalidate: 3600 },
    });
    if (!response.ok) return [];
    return parseFeed(await response.text(), source);
  } catch {
    // One outlet being down never blocks the rest.
    return [];
  }
}

/** All live headlines, newest first, deduplicated by link. */
export async function getWireArticles(): Promise<WireArticle[]> {
  if (cache && cache.expiresAt > Date.now()) return cache.items;

  const results = await Promise.all(FEEDS.map(fetchFeed));
  const seen = new Set<string>();
  const merged = results
    .flat()
    .filter((item) => {
      if (seen.has(item.link)) return false;
      seen.add(item.link);
      return true;
    })
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));

  cache = { items: merged, expiresAt: Date.now() + CACHE_TTL_MS };
  return merged;
}

export async function getWireArticle(id: string): Promise<WireArticle | null> {
  const all = await getWireArticles();
  return all.find((item) => item.id === id) ?? null;
}

/** Simple case-insensitive contains search over the live wire. */
export async function searchWireArticles(query: string, limit = 10): Promise<WireArticle[]> {
  const q = query.toLowerCase();
  const all = await getWireArticles();
  return all.filter((item) => item.title.toLowerCase().includes(q) || item.excerpt.toLowerCase().includes(q)).slice(0, limit);
}

export interface TrendingTopic {
  keyword: string;
  sourceCount: number;
  sources: string[];
  article: WireArticle;
}

const STOPWORDS = new Set([
  "The", "A", "An", "This", "That", "New", "How", "Why", "What", "Is", "Are", "Was",
  "I", "You", "We", "It", "In", "On", "At", "To", "For", "Of", "And", "But", "Or",
  "Watch", "Review", "Guide", "Best", "Top", "First", "One", "My", "Its",
]);

/**
 * Pure computation half of trending-topic extraction — separated from the
 * network fetch so it can be unit-tested with fixed input.
 */
export function computeTrendingTopics(all: WireArticle[], limit = 6): TrendingTopic[] {
  const byKeyword = new Map<string, { sources: Set<string>; article: WireArticle }>();

  for (const item of all) {
    // Sequences of 2-4 consecutive capitalized words, e.g. "Elden Ring", "Nintendo Switch 2".
    const matches = item.title.match(/\b([A-Z][\w'’:-]*(?:\s+[A-Z0-9][\w'’:-]*){1,3})\b/g) ?? [];
    for (const raw of matches) {
      const words = raw.split(/\s+/);
      if (STOPWORDS.has(words[0])) continue;
      const keyword = raw.trim();
      if (keyword.length < 5) continue;
      const existing = byKeyword.get(keyword);
      if (existing) {
        existing.sources.add(item.sourceName);
      } else {
        byKeyword.set(keyword, { sources: new Set([item.sourceName]), article: item });
      }
    }
  }

  return [...byKeyword.entries()]
    .map(([keyword, data]) => ({
      keyword,
      sourceCount: data.sources.size,
      sources: [...data.sources],
      article: data.article,
    }))
    .filter((topic) => topic.sourceCount >= 2)
    .sort((a, b) => b.sourceCount - a.sourceCount || +new Date(b.article.publishedAt) - +new Date(a.article.publishedAt))
    .slice(0, limit);
}

/**
 * Real trending topics: proper-noun-like phrases (game/company/platform names)
 * mentioned by multiple *different* outlets in the current live wire. This is
 * an actual cross-outlet-coverage signal, not a fabricated score — "trending"
 * literally means several real newsrooms are covering the same thing right now.
 */
export async function getTrendingTopics(limit = 6): Promise<TrendingTopic[]> {
  const all = await getWireArticles();
  return computeTrendingTopics(all, limit);
}

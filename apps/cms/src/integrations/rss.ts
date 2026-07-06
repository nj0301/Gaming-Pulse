/**
 * RSS/press-feed adapter.
 *
 * Polls an editor-configured allowlist of publisher press feeds (RSS_FEEDS
 * env: comma-separated URLs) and surfaces new items as *story leads* in the
 * Strapi log / future editorial dashboard. It deliberately does NOT create
 * article entries: Gaming Pulse policy forbids automatic article copying —
 * feeds are inputs for human reporting, never output.
 */
import { fetchJson, IntegrationError } from "./base";

export interface FeedLead {
  feedUrl: string;
  title: string;
  link: string;
  publishedAt: string | null;
}

export function configuredFeeds(): string[] {
  return (process.env.RSS_FEEDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Extremely small RSS/Atom title+link extractor; swap for a parser lib if feeds get complex. */
function parseFeed(xml: string, feedUrl: string): FeedLead[] {
  const items: FeedLead[] = [];
  const itemBlocks = xml.match(/<(item|entry)[\s\S]*?<\/\1>/g) ?? [];
  for (const block of itemBlocks.slice(0, 20)) {
    const title = /<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/.exec(block)?.[1]?.trim();
    const link =
      /<link[^>]*href="([^"]+)"/.exec(block)?.[1] ?? /<link[^>]*>([\s\S]*?)<\/link>/.exec(block)?.[1]?.trim();
    const date = /<(pubDate|published|updated)[^>]*>([\s\S]*?)<\/\1>/.exec(block)?.[2]?.trim() ?? null;
    if (title && link) items.push({ feedUrl, title, link, publishedAt: date });
  }
  return items;
}

export async function pollFeeds(): Promise<FeedLead[]> {
  const leads: FeedLead[] = [];
  for (const feedUrl of configuredFeeds()) {
    try {
      const response = await fetch(feedUrl, { signal: AbortSignal.timeout(10_000) });
      if (!response.ok) throw new IntegrationError(`Feed responded ${response.status}`, "rss", response.status);
      leads.push(...parseFeed(await response.text(), feedUrl));
    } catch {
      // Graceful per-feed failure: one broken feed never blocks the rest.
    }
  }
  return leads;
}

// Re-export for callers that want typed JSON fetching alongside feeds.
export { fetchJson };

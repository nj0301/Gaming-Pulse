/**
 * YouTube Data API adapter (disabled until YOUTUBE_API_KEY is configured).
 *
 * Used to hydrate Video entries with metadata (duration, publish date) for
 * videos editors have explicitly added by external id. Never auto-creates
 * published content. Quota-aware: responses cached 6h.
 */
import { fetchJson } from "./base";

const API_URL = "https://www.googleapis.com/youtube/v3";

export interface YoutubeVideoMeta {
  id: string;
  title: string;
  publishedAt: string;
  durationIso8601: string;
  thumbnailUrl: string;
}

export function isEnabled(): boolean {
  return Boolean(process.env.YOUTUBE_API_KEY);
}

export async function getVideoMeta(videoId: string): Promise<YoutubeVideoMeta | null> {
  if (!isEnabled()) return null;
  const data = await fetchJson<{
    items: Array<{
      id: string;
      snippet: { title: string; publishedAt: string; thumbnails: { high?: { url: string } } };
      contentDetails: { duration: string };
    }>;
  }>(
    "youtube",
    `${API_URL}/videos?part=snippet,contentDetails&id=${encodeURIComponent(videoId)}&key=${process.env.YOUTUBE_API_KEY}`,
    { cacheKey: `yt:video:${videoId}`, cacheTtlSeconds: 21_600 },
  );

  const item = data.items[0];
  if (!item) return null;
  return {
    id: item.id,
    title: item.snippet.title,
    publishedAt: item.snippet.publishedAt,
    durationIso8601: item.contentDetails.duration,
    thumbnailUrl: item.snippet.thumbnails.high?.url ?? "",
  };
}

import { cms } from "@/lib/cms";
import { SITE_NAME, SITE_URL } from "@/lib/config";

export const revalidate = 300;

const NEWS_WINDOW_HOURS = 48;
const NEWS_TYPES = new Set(["breaking", "news", "official-announcement", "report"]);

const escapeXml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Google News sitemap: only news-type articles from the last 48 hours.
 * Older entries drop out automatically; the articles remain in the standard
 * sitemap regardless.
 */
export async function GET() {
  const articles = await cms.getArticles({ limit: 100 });
  const cutoff = Date.now() - NEWS_WINDOW_HOURS * 3_600_000;
  const eligible = articles.filter(
    (a) => NEWS_TYPES.has(a.articleType) && +new Date(a.publishedAt) >= cutoff && !a.isSponsored,
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${eligible
  .map(
    (article) => `  <url>
    <loc>${SITE_URL}/news/${article.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(SITE_NAME)}</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${article.publishedAt}</news:publication_date>
      <news:title>${escapeXml(article.title)}</news:title>
    </news:news>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=300" },
  });
}

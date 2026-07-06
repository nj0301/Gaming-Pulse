import type { Article } from "@/lib/cms/types";
import { SITE_NAME, SITE_URL } from "@/lib/config";

const escapeXml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function buildRss(articles: Article[]): string {
  const lastBuild = articles[0]?.publishedAt ?? new Date().toISOString();
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>Gaming news, releases, reviews and industry insight. (Demo build with fictional content.)</description>
    <language>en</language>
    <lastBuildDate>${new Date(lastBuild).toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${articles
  .map(
    (article) => `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${SITE_URL}/news/${article.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/news/${article.slug}</guid>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      <description>${escapeXml(article.excerpt)}</description>
      <category>${escapeXml(article.articleType)}</category>
    </item>`,
  )
  .join("\n")}
  </channel>
</rss>`;
}

export function buildAtom(articles: Article[]): string {
  const updated = articles[0]?.updatedAtEditorial ?? new Date().toISOString();
  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(SITE_NAME)}</title>
  <link href="${SITE_URL}"/>
  <link href="${SITE_URL}/atom.xml" rel="self"/>
  <id>${SITE_URL}/</id>
  <updated>${updated}</updated>
${articles
  .map(
    (article) => `  <entry>
    <title>${escapeXml(article.title)}</title>
    <link href="${SITE_URL}/news/${article.slug}"/>
    <id>${SITE_URL}/news/${article.slug}</id>
    <published>${article.publishedAt}</published>
    <updated>${article.updatedAtEditorial}</updated>
    <summary>${escapeXml(article.excerpt)}</summary>
  </entry>`,
  )
  .join("\n")}
</feed>`;
}

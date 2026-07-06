import { cms } from "@/lib/cms";
import { SITE_URL } from "@/lib/config";

export const revalidate = 3600;

const escapeXml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const abs = (src: string) => (src.startsWith("http") ? src : `${SITE_URL}${src}`);

/** Image sitemap: hero images per article and cover/hero art per game. */
export async function GET() {
  const [articles, games] = await Promise.all([cms.getArticles({ limit: 100 }), cms.getGames()]);

  const urls = [
    ...articles.map((article) => ({
      loc: `${SITE_URL}/news/${article.slug}`,
      images: [article.heroImage, ...(article.gallery ?? [])],
    })),
    ...games.map((game) => ({
      loc: `${SITE_URL}/games/${game.slug}`,
      images: [game.cover, game.heroArtwork, ...game.screenshots],
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
${url.images
  .map(
    (image) => `    <image:image>
      <image:loc>${escapeXml(abs(image.src))}</image:loc>
      <image:title>${escapeXml(image.alt)}</image:title>
    </image:image>`,
  )
  .join("\n")}
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
  });
}

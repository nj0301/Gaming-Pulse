import { cms } from "@/lib/cms";
import { SITE_URL } from "@/lib/config";

export const revalidate = 3600;

const escapeXml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const abs = (src: string) => (src.startsWith("http") ? src : `${SITE_URL}${src}`);

/** Video sitemap for the /videos catalog. */
export async function GET() {
  const videos = await cms.getVideos({ limit: 100 });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <url>
    <loc>${SITE_URL}/videos</loc>
${videos
  .map(
    (video) => `    <video:video>
      <video:thumbnail_loc>${escapeXml(abs(video.poster.src))}</video:thumbnail_loc>
      <video:title>${escapeXml(video.title)}</video:title>
      <video:description>${escapeXml(video.description)}</video:description>
      <video:duration>${video.durationSeconds}</video:duration>
      <video:publication_date>${video.publishedAt}</video:publication_date>
    </video:video>`,
  )
  .join("\n")}
  </url>
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
  });
}

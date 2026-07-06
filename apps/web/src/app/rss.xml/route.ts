import { cms } from "@/lib/cms";
import { buildRss } from "@/lib/seo/feeds";

export const revalidate = 300;

export async function GET() {
  const articles = await cms.getArticles({ limit: 30 });
  return new Response(buildRss(articles), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=300" },
  });
}

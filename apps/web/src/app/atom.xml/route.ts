import { cms } from "@/lib/cms";
import { buildAtom } from "@/lib/seo/feeds";

export const revalidate = 300;

export async function GET() {
  const articles = await cms.getArticles({ limit: 30 });
  return new Response(buildAtom(articles), {
    headers: { "Content-Type": "application/atom+xml; charset=utf-8", "Cache-Control": "public, max-age=300" },
  });
}

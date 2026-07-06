import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { REVALIDATE_SECRET } from "@/lib/config";

/**
 * On-demand revalidation webhook, called by Strapi on publish/update.
 * Configure a Strapi webhook to POST here with the shared secret header:
 *   x-revalidate-secret: $REVALIDATE_SECRET
 */
export async function POST(request: NextRequest) {
  if (!REVALIDATE_SECRET || request.headers.get("x-revalidate-secret") !== REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: { model?: string; entry?: { slug?: string } };
  try {
    payload = await request.json();
  } catch {
    payload = {};
  }

  const paths = new Set<string>(["/", "/latest", "/news", "/trending"]);
  const slug = payload.entry?.slug;
  switch (payload.model) {
    case "article":
      if (slug) paths.add(`/news/${slug}`);
      break;
    case "game":
      if (slug) paths.add(`/games/${slug}`);
      paths.add("/games");
      paths.add("/upcoming-games");
      break;
    case "release-date":
      paths.add("/upcoming-games");
      break;
    case "homepage-config":
    case "navigation-config":
    case "site-setting":
      break; // root paths already included
  }

  for (const path of paths) revalidatePath(path);
  return NextResponse.json({ revalidated: [...paths] });
}

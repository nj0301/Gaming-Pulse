import { NextRequest, NextResponse } from "next/server";
import { cms } from "@/lib/cms";
import { searchWireArticles } from "@/lib/news-feed";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.slice(0, 100) ?? "";
  try {
    const [results, wire] = await Promise.all([cms.search(q), searchWireArticles(q, 6)]);
    return NextResponse.json(
      { ...results, wire },
      { headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=300" } },
    );
  } catch {
    return NextResponse.json({ error: "Search unavailable" }, { status: 503 });
  }
}

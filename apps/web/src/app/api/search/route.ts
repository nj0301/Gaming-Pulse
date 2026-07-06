import { NextRequest, NextResponse } from "next/server";
import { searchWireArticles } from "@/lib/news-feed";
import { isRawgEnabled, searchRawgGames } from "@/lib/rawg";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.slice(0, 100) ?? "";
  try {
    const [wire, games] = await Promise.all([
      searchWireArticles(q, 6),
      isRawgEnabled() ? searchRawgGames(q, 6) : Promise.resolve([]),
    ]);
    return NextResponse.json(
      { wire, games: games.map((g) => ({ name: g.name, slug: g.slug })) },
      { headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=300" } },
    );
  } catch {
    return NextResponse.json({ error: "Search unavailable" }, { status: 503 });
  }
}

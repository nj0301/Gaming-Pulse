import { NextRequest, NextResponse } from "next/server";
import { cms } from "@/lib/cms";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.slice(0, 100) ?? "";
  try {
    const results = await cms.search(q);
    return NextResponse.json(results, {
      headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=300" },
    });
  } catch {
    return NextResponse.json({ error: "Search unavailable" }, { status: 503 });
  }
}

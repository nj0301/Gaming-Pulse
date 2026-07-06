import type { Metadata } from "next";
import { ArticleListing, parsePage } from "@/components/article-listing";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Esports",
  description: "Tournaments, rosters and the business of competitive gaming.",
  alternates: { canonical: "/esports" },
};

export default async function EsportsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = parsePage(await searchParams);
  return (
    <ArticleListing
      title="Esports"
      description="Competitive gaming — tournaments, rosters, formats and the money behind them."
      query={{ categorySlug: "esports" }}
      basePath="/esports"
      page={page}
    />
  );
}

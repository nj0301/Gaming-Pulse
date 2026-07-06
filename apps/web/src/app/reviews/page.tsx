import type { Metadata } from "next";
import { ArticleListing, parsePage } from "@/components/article-listing";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Game reviews",
  description: "Scored verdicts from the Gaming Pulse reviews desk, under a published review policy.",
  alternates: { canonical: "/reviews" },
};

export default async function ReviewsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = parsePage(await searchParams);
  return (
    <ArticleListing
      title="Reviews & Recommendations"
      description="Scored verdicts and hands-on previews, produced under our review policy."
      query={{ categorySlug: "reviews" }}
      basePath="/reviews"
      page={page}
    />
  );
}

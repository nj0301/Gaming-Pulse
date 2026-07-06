import type { Metadata } from "next";
import { ArticleListing, parsePage } from "@/components/article-listing";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Insights & opinion",
  description: "Original analysis and clearly-labeled opinion on where gaming is heading.",
  alternates: { canonical: "/insights" },
};

export default async function InsightsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = parsePage(await searchParams);
  return (
    <ArticleListing
      title="Insights"
      description="Analysis and opinion — always labeled, never disguised as news."
      query={{ categorySlug: "insights" }}
      basePath="/insights"
      page={page}
    />
  );
}

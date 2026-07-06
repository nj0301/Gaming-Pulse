import type { Metadata } from "next";
import { ArticleListing, parsePage } from "@/components/article-listing";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Gameplay guides",
  description: "Guides and tips written from real playthroughs.",
  alternates: { canonical: "/guides" },
};

export default async function GuidesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = parsePage(await searchParams);
  return (
    <ArticleListing
      title="Guides"
      description="Written from real playthroughs — build verified, version noted."
      query={{ categorySlug: "guides" }}
      basePath="/guides"
      page={page}
    />
  );
}

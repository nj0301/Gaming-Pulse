import type { Metadata } from "next";
import { ArticleListing, parsePage } from "@/components/article-listing";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Industry",
  description: "Studios, publishers, acquisitions and the people who make games.",
  alternates: { canonical: "/industry" },
};

export default async function IndustryPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = parsePage(await searchParams);
  return (
    <ArticleListing
      title="Industry"
      description="Studios, publishers, funding and the structural stories behind the games."
      query={{ categorySlug: "industry" }}
      basePath="/industry"
      page={page}
    />
  );
}

import type { Metadata } from "next";
import { ArticleListing, parsePage } from "@/components/article-listing";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Gaming news",
  description: "Breaking stories and confirmed reporting from across the gaming industry.",
  alternates: { canonical: "/news" },
};

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = parsePage(await searchParams);
  return (
    <ArticleListing
      title="News"
      description="Breaking stories and confirmed reporting. Rumors and leaks are always labeled."
      query={{ categorySlug: "news" }}
      basePath="/news"
      page={page}
    />
  );
}

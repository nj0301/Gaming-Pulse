import type { Metadata } from "next";
import { ArticleListing, parsePage } from "@/components/article-listing";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Latest gaming news",
  description: "Every Gaming Pulse story, newest first — news, reviews, guides and analysis.",
  alternates: { canonical: "/latest" },
};

export default async function LatestPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = parsePage(await searchParams);
  return (
    <ArticleListing
      title="Latest"
      description="Everything we've published, newest first."
      query={{}}
      basePath="/latest"
      page={page}
    />
  );
}

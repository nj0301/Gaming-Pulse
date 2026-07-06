import type { Metadata } from "next";
import { ArticleListing, parsePage } from "@/components/article-listing";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Gaming hardware",
  description: "Consoles, handhelds, GPUs and peripherals — benchmarked and explained.",
  alternates: { canonical: "/hardware" },
};

export default async function HardwarePage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = parsePage(await searchParams);
  return (
    <ArticleListing
      title="Hardware"
      description="Consoles, handhelds, GPUs and peripherals. Sponsored coverage is always labeled."
      query={{ categorySlug: "hardware" }}
      basePath="/hardware"
      page={page}
    />
  );
}

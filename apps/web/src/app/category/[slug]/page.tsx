import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cms } from "@/lib/cms";
import { ArticleListing, parsePage } from "@/components/article-listing";

export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  const categories = await cms.getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = (await cms.getCategories()).find((c) => c.slug === slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/category/${category.slug}` },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const category = (await cms.getCategories()).find((c) => c.slug === slug);
  if (!category) notFound();
  const page = parsePage(await searchParams);
  return (
    <ArticleListing
      title={category.name}
      description={category.description}
      query={{ categorySlug: slug }}
      basePath={`/category/${slug}`}
      page={page}
    />
  );
}

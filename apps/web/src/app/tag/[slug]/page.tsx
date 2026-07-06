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
  const tags = await cms.getTags();
  return tags.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = (await cms.getTags()).find((t) => t.slug === slug);
  if (!tag) return {};
  return {
    title: `${tag.name} coverage`,
    description: `All Gaming Pulse stories tagged ${tag.name}.`,
    alternates: { canonical: `/tag/${tag.slug}` },
  };
}

export default async function TagPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const tag = (await cms.getTags()).find((t) => t.slug === slug);
  if (!tag) notFound();
  const page = parsePage(await searchParams);
  return (
    <ArticleListing
      title={`#${tag.name}`}
      description={`Stories tagged ${tag.name}.`}
      query={{ tagSlug: slug }}
      basePath={`/tag/${slug}`}
      page={page}
    />
  );
}

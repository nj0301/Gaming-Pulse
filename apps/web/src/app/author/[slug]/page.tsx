import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cms } from "@/lib/cms";
import { ArticleListing, parsePage } from "@/components/article-listing";
import { Container } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";

export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  const authors = await cms.getAuthors();
  return authors.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const author = await cms.getAuthorBySlug(slug);
  if (!author) return {};
  return {
    title: `${author.name} — ${author.role}`,
    description: author.bio,
    alternates: { canonical: `/author/${author.slug}` },
  };
}

export default async function AuthorPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const author = await cms.getAuthorBySlug(slug);
  if (!author) notFound();
  const page = parsePage(await searchParams);

  return (
    <>
      <Container className="pt-10">
        <div className="flex items-start gap-5 rounded-xl border border-edge bg-surface p-6">
          <Image
            src={author.avatar.src}
            alt={author.avatar.alt}
            width={72}
            height={72}
            className="rounded-full border border-edge"
          />
          <div>
            <h1 className="font-display text-2xl font-bold text-fg">{author.name}</h1>
            <p className="font-label text-sm font-semibold uppercase tracking-wider text-cyan">{author.role}</p>
            <p className="mt-2 max-w-2xl text-sm text-fg-secondary">{author.bio}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {author.expertise.map((topic) => (
                <Badge key={topic} tone="neutral">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Container>
      <ArticleListing
        title={`Stories by ${author.name}`}
        query={{ authorSlug: slug }}
        basePath={`/author/${slug}`}
        page={page}
      />
    </>
  );
}

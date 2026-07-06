import type { Metadata } from "next";
import { staticPages } from "@/lib/static-pages";
import { Container } from "@/components/ui/section";
import { ArticleBody } from "@/components/article/article-body";

export function staticPageMetadata(slug: string): Metadata {
  const page = staticPages[slug];
  if (!page) return {};
  return { title: page.title, description: page.description, alternates: { canonical: `/${page.slug}` } };
}

export function StaticPage({ slug }: { slug: string }) {
  const page = staticPages[slug];
  if (!page) return null;
  return (
    <Container className="max-w-3xl py-12">
      <h1 className="font-display text-3xl font-bold text-fg">{page.title}</h1>
      <div className="mt-6">
        <ArticleBody body={page.body} />
      </div>
    </Container>
  );
}

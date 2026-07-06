import { cms, type ArticleQuery } from "@/lib/cms";
import { ArticleCard } from "@/components/cards/article-card";
import { Container, EmptyState } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import Link from "next/link";

const PAGE_SIZE = 12;

/**
 * Shared article listing with page-based pagination. Used by /latest, /news,
 * category, tag, platform and author pages.
 */
export async function ArticleListing({
  title,
  description,
  query,
  basePath,
  page = 1,
}: {
  title: string;
  description?: string;
  query: ArticleQuery;
  basePath: string;
  page?: number;
}) {
  const offset = (page - 1) * PAGE_SIZE;
  // Fetch one extra to know whether a next page exists.
  const articles = await cms.getArticles({ ...query, limit: PAGE_SIZE + 1, offset });
  const hasNext = articles.length > PAGE_SIZE;
  const visible = articles.slice(0, PAGE_SIZE);

  return (
    <Container className="py-10">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold text-fg">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-fg-secondary">{description}</p>}
      </header>

      {visible.length === 0 ? (
        <EmptyState title="No stories here yet" hint="Check back soon — or explore the latest news." />
      ) : (
        <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((article, index) => (
            <Reveal key={article.slug} delay={(index % 3) * 0.05}>
              <ArticleCard article={article} priority={index < 3 && page === 1} />
            </Reveal>
          ))}
        </div>
      )}

      {(page > 1 || hasNext) && (
        <nav aria-label="Pagination" className="mt-10 flex items-center justify-between">
          {page > 1 ? (
            <Link
              href={`${basePath}${page - 1 > 1 ? `?page=${page - 1}` : ""}`}
              rel="prev"
              className="rounded border border-edge bg-surface px-4 py-2 font-label text-sm font-semibold uppercase tracking-wider text-fg-secondary hover:text-cyan"
            >
              ← Newer
            </Link>
          ) : (
            <span aria-hidden />
          )}
          <span className="text-sm text-fg-muted">Page {page}</span>
          {hasNext ? (
            <Link
              href={`${basePath}?page=${page + 1}`}
              rel="next"
              className="rounded border border-edge bg-surface px-4 py-2 font-label text-sm font-semibold uppercase tracking-wider text-fg-secondary hover:text-cyan"
            >
              Older →
            </Link>
          ) : (
            <span aria-hidden />
          )}
        </nav>
      )}
    </Container>
  );
}

export function parsePage(searchParams: { page?: string }): number {
  const page = Number(searchParams.page ?? "1");
  return Number.isInteger(page) && page > 0 ? page : 1;
}

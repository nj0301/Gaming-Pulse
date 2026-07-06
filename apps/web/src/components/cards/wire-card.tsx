import { timeAgo } from "@gaming-pulse/core";
import type { WireArticle } from "@/lib/news-feed";
import { Badge } from "@/components/ui/badge";

/**
 * Real live-news card. Images are hotlinked directly from the source
 * outlet's own CDN (aggregator/index model, like Google News) — a plain
 * <img> is used instead of next/image since the source host is not known
 * in advance across dozens of outlets.
 */
export function WireCard({ article, variant = "default" }: { article: WireArticle; variant?: "default" | "compact" }) {
  if (variant === "compact") {
    return (
      <article className="flex items-start gap-3 border-b border-edge py-3 last:border-0">
        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <Badge tone="cyan">{article.sourceName}</Badge>
            <time dateTime={article.publishedAt} className="text-xs text-fg-muted">
              {timeAgo(article.publishedAt)}
            </time>
          </div>
          <h3 className="font-display text-sm font-semibold leading-snug text-fg">
            <a href={article.link} target="_blank" rel="noopener nofollow" className="hover:text-cyan">
              {article.title}
            </a>
          </h3>
        </div>
      </article>
    );
  }

  return (
    <article className="gp-panel group flex h-full flex-col overflow-hidden transition-colors hover:border-cyan/60">
      <a href={article.link} target="_blank" rel="noopener nofollow" aria-label={article.title} className="flex h-full flex-col">
        <div className="relative aspect-video shrink-0 overflow-hidden bg-surface-elevated">
          {article.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={article.imageUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-fg-muted">
              <span className="font-label text-xs uppercase tracking-widest">{article.sourceName}</span>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-4">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge tone="cyan">{article.sourceName}</Badge>
            <time dateTime={article.publishedAt} className="text-xs text-fg-muted">
              {timeAgo(article.publishedAt)}
            </time>
          </div>
          <h3 className="line-clamp-2 font-display text-base font-bold leading-snug text-fg transition-colors group-hover:text-cyan">
            {article.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-fg-secondary">{article.excerpt}</p>
          <span className="mt-auto pt-3 font-label text-xs font-semibold uppercase tracking-wider text-fg-muted">
            Read at {article.sourceName} ↗
          </span>
        </div>
      </a>
    </article>
  );
}

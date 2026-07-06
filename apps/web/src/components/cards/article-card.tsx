import Image from "next/image";
import Link from "next/link";
import { timeAgo } from "@gaming-pulse/core";
import type { Article } from "@/lib/cms/types";
import { Badge, articleTypeTone } from "@/components/ui/badge";

const typeLabel: Record<string, string> = {
  "official-announcement": "Official",
  breaking: "Breaking",
  rumor: "Rumor",
  leak: "Leak",
  opinion: "Opinion",
  analysis: "Analysis",
  review: "Review",
  guide: "Guide",
  interview: "Interview",
  feature: "Feature",
  sponsored: "Sponsored",
  report: "Report",
  news: "News",
};

export function ArticleCard({
  article,
  variant = "default",
  priority = false,
}: {
  article: Article;
  variant?: "default" | "compact";
  priority?: boolean;
}) {
  const href = `/news/${article.slug}`;

  if (variant === "compact") {
    return (
      <article className="group flex items-start gap-3 border-b border-edge py-3 last:border-0">
        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <Badge tone={articleTypeTone(article.articleType)}>{typeLabel[article.articleType]}</Badge>
            <time dateTime={article.publishedAt} className="text-xs text-fg-muted">
              {timeAgo(article.publishedAt)}
            </time>
          </div>
          <h3 className="font-display text-sm font-semibold leading-snug text-fg group-hover:text-cyan">
            <Link href={href} className="focus-visible:outline-cyan">
              {article.title}
            </Link>
          </h3>
        </div>
      </article>
    );
  }

  return (
    <article className="gp-panel group flex h-full flex-col overflow-hidden transition-colors hover:border-cyan/60">
      <Link href={href} className="block shrink-0" aria-label={article.title}>
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={article.heroImage.src}
            alt={article.heroImage.alt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
          {article.isSponsored && (
            <span className="absolute left-2 top-2 bg-magenta px-2 py-0.5 font-label text-xs font-bold uppercase tracking-wider text-bg">
              Sponsored
            </span>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge tone={articleTypeTone(article.articleType)}>{typeLabel[article.articleType]}</Badge>
          {article.review && (
            <Badge tone="green">
              {article.review.score.toFixed(1)}/{article.review.scoreMax}
            </Badge>
          )}
          <time dateTime={article.publishedAt} className="text-xs text-fg-muted">
            {timeAgo(article.publishedAt)}
          </time>
        </div>
        <h3 className="line-clamp-2 font-display text-base font-bold leading-snug text-fg transition-colors group-hover:text-cyan">
          <Link href={href}>{article.title}</Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-fg-secondary">{article.excerpt}</p>
      </div>
    </article>
  );
}

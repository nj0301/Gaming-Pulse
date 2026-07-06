import { timeAgo } from "@gaming-pulse/core";
import { getTrendingTopics, getWireArticles } from "@/lib/news-feed";
import { Badge } from "@/components/ui/badge";
import { Container, SectionHeading } from "@/components/ui/section";

/**
 * Real trending: topics currently covered by multiple different real outlets
 * at once (an actual cross-newsroom signal, computed from the live wire —
 * see getTrendingTopics). If too few cross-outlet topics exist right now,
 * the freshest single-source headlines fill the remainder, labeled "Just in"
 * so nothing is presented as trending that isn't.
 */
export async function TrendingSection({ title, maxItems }: { title: string; maxItems: number }) {
  const topics = await getTrendingTopics(maxItems);
  const fillCount = maxItems - topics.length;
  const recentFill = fillCount > 0 ? (await getWireArticles()).slice(0, fillCount) : [];

  if (topics.length === 0 && recentFill.length === 0) return null;

  return (
    <section aria-label={title}>
      <Container>
        <SectionHeading title={title} href="/trending" accent="magenta" />
        <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <article key={topic.keyword} className="gp-panel gp-panel-magenta flex h-full flex-col p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="font-label text-sm font-bold text-magenta">{topic.sourceCount} outlets</span>
                <span className="h-1 max-w-20 flex-1 bg-surface-elevated">
                  <span
                    className="block h-full bg-magenta"
                    style={{ width: `${Math.min(100, topic.sourceCount * 25)}%` }}
                  />
                </span>
              </div>
              <h3 className="mt-3 font-display text-base font-bold text-fg">
                <a href={topic.article.link} target="_blank" rel="noopener nofollow" className="hover:text-magenta">
                  {topic.keyword}
                </a>
              </h3>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-fg-secondary">
                <span className="font-semibold text-fg-muted">Covered right now by: </span>
                {topic.sources.join(", ")}
              </p>
              <p className="mt-auto pt-3 text-xs text-fg-muted">Latest: {topic.article.title}</p>
            </article>
          ))}
          {recentFill.map((item) => (
            <article key={item.id} className="gp-panel flex h-full flex-col p-5">
              <Badge tone="neutral">Just in</Badge>
              <h3 className="mt-3 font-display text-base font-bold text-fg">
                <a href={item.link} target="_blank" rel="noopener nofollow" className="hover:text-cyan">
                  {item.title}
                </a>
              </h3>
              <p className="mt-auto pt-3 text-xs text-fg-muted">
                {item.sourceName} · {timeAgo(item.publishedAt)}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

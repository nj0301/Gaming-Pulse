import type { Metadata } from "next";
import { timeAgo } from "@gaming-pulse/core";
import { getTrendingTopics } from "@/lib/news-feed";
import { Container, EmptyState } from "@/components/ui/section";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Trending in gaming",
  description: "What the gaming world is talking about right now — topics multiple real outlets are covering at once.",
  alternates: { canonical: "/trending" },
};

export default async function TrendingPage() {
  const topics = await getTrendingTopics(20);

  return (
    <Container className="py-10">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold text-fg">Trending now</h1>
        <p className="mt-2 max-w-2xl text-fg-secondary">
          Computed from the live news wire: topics that multiple different real outlets are covering at the same
          time. No fabricated scores — this is an actual cross-newsroom signal.
        </p>
      </header>

      {topics.length === 0 ? (
        <EmptyState
          title="No cross-outlet trends detected right now"
          hint="This happens when outlets haven't yet converged on the same story — check /latest for the freshest individual headlines."
        />
      ) : (
        <ol className="space-y-4">
          {topics.map((topic, index) => (
            <li key={topic.keyword} className="gp-panel gp-panel-magenta p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="font-display text-3xl font-bold text-fg-muted">#{index + 1}</span>
                  <div>
                    <h2 className="font-display text-xl font-bold text-fg">{topic.keyword}</h2>
                    <p className="mt-1 font-label text-xs font-semibold uppercase tracking-wider text-magenta">
                      Covered by {topic.sourceCount} outlets right now
                    </p>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-fg-secondary">
                <span className="font-semibold text-fg">Sources: </span>
                {topic.sources.join(", ")}
              </p>
              <a
                href={topic.article.link}
                target="_blank"
                rel="noopener nofollow"
                className="mt-3 inline-block text-sm text-cyan hover:underline"
              >
                {topic.article.title} — {timeAgo(topic.article.publishedAt)} ↗
              </a>
            </li>
          ))}
        </ol>
      )}
    </Container>
  );
}

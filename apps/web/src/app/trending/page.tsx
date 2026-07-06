import type { Metadata } from "next";
import Link from "next/link";
import { cms } from "@/lib/cms";
import { Container, EmptyState } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Trending in gaming",
  description: "What the gaming world is talking about right now — and why.",
  alternates: { canonical: "/trending" },
};

export default async function TrendingPage() {
  const [trends, articles, games] = await Promise.all([
    cms.getTrends(),
    cms.getArticles({ limit: 100 }),
    cms.getGames(),
  ]);
  const articleBySlug = new Map(articles.map((a) => [a.slug, a]));
  const gameBySlug = new Map(games.map((g) => [g.slug, g]));

  return (
    <Container className="py-10">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold text-fg">Trending now</h1>
        <p className="mt-2 max-w-2xl text-fg-secondary">
          Ranked by our trend score — recency, engagement, search interest, source authority, platform reach and
          editorial judgment. Every entry explains why it&rsquo;s here.
        </p>
      </header>

      {trends.length === 0 ? (
        <EmptyState title="Nothing trending right now" />
      ) : (
        <ol className="space-y-4">
          {trends.map((trend, index) => (
            <Reveal key={trend.slug} as="li" delay={index * 0.05}>
              <article
                className={`rounded-xl border bg-surface p-6 ${
                  trend.pinned ? "border-magenta/50" : "border-edge"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="font-display text-3xl font-bold text-fg-muted">#{index + 1}</span>
                    <div>
                      <h2 className="font-display text-xl font-bold text-fg">{trend.title}</h2>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <Badge tone="magenta">Score {Math.round(trend.score)}</Badge>
                        {trend.pinned && <Badge tone="violet">Pinned by editorial</Badge>}
                        {trend.manualAdjustment !== 0 && (
                          <Badge tone="neutral">
                            Editorial adjustment {trend.manualAdjustment > 0 ? "+" : ""}
                            {trend.manualAdjustment}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-fg-secondary">
                  <span className="font-semibold text-fg">Why it&rsquo;s trending: </span>
                  {trend.whyTrending}
                </p>
                {trend.context && <p className="mt-2 text-xs text-fg-muted">{trend.context}</p>}

                {(trend.relatedArticleSlugs.length > 0 || trend.relatedGameSlugs.length > 0) && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {trend.relatedArticleSlugs.map((slug) => {
                      const article = articleBySlug.get(slug);
                      return article ? (
                        <Link
                          key={slug}
                          href={`/news/${slug}`}
                          className="rounded border border-edge bg-bg-secondary px-3 py-1.5 text-xs text-fg-secondary transition-colors hover:border-cyan/50 hover:text-cyan"
                        >
                          📰 {article.title}
                        </Link>
                      ) : null;
                    })}
                    {trend.relatedGameSlugs.map((slug) => {
                      const game = gameBySlug.get(slug);
                      return game ? (
                        <Link
                          key={slug}
                          href={`/games/${slug}`}
                          className="rounded border border-edge bg-bg-secondary px-3 py-1.5 text-xs text-fg-secondary transition-colors hover:border-violet/50 hover:text-violet"
                        >
                          🎮 {game.name}
                        </Link>
                      ) : null;
                    })}
                  </div>
                )}
              </article>
            </Reveal>
          ))}
        </ol>
      )}
    </Container>
  );
}

import Link from "next/link";
import { cms } from "@/lib/cms";
import { Container, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";

/** Trending-now cards, each with its required "why is this trending" line. */
export async function TrendingSection({ title, maxItems }: { title: string; maxItems: number }) {
  const trends = (await cms.getTrends()).slice(0, maxItems);
  if (trends.length === 0) return null;

  return (
    <section aria-label={title}>
      <Container>
        <SectionHeading title={title} href="/trending" accent="magenta" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trends.map((trend, index) => (
            <Reveal key={trend.slug} delay={index * 0.06}>
              <article
                className={`h-full rounded-lg border bg-surface p-5 transition-colors hover:border-magenta/60 ${
                  trend.pinned ? "border-magenta/50 gp-glow-violet" : "border-edge"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <PulseLine score={trend.score} />
                  <span className="font-label text-sm font-bold text-magenta">{Math.round(trend.score)}</span>
                </div>
                <h3 className="mt-3 font-display text-base font-bold text-fg">
                  {trend.relatedArticleSlugs[0] ? (
                    <Link href={`/news/${trend.relatedArticleSlugs[0]}`} className="hover:text-magenta">
                      {trend.title}
                    </Link>
                  ) : (
                    trend.title
                  )}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-secondary">
                  <span className="font-semibold text-fg-muted">Why it&rsquo;s trending: </span>
                  {trend.whyTrending}
                </p>
                {trend.pinned && (
                  <p className="mt-3 font-label text-xs font-semibold uppercase tracking-wider text-magenta">
                    Pinned by editorial
                  </p>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function PulseLine({ score }: { score: number }) {
  const amplitude = 4 + (score / 100) * 8;
  return (
    <svg width="80" height="24" viewBox="0 0 80 24" aria-hidden className="text-magenta">
      <path
        d={`M0 12 H16 L22 ${12 - amplitude} L30 ${12 + amplitude} L38 ${12 - amplitude * 0.6} L44 12 H80`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="gp-pulse-line"
      />
    </svg>
  );
}

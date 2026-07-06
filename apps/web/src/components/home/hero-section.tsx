import { timeAgo } from "@gaming-pulse/core";
import { getWireArticles } from "@/lib/news-feed";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/section";

/** Featured-story hero, sourced from the real live news wire. Static panel — no motion. */
export async function HeroSection() {
  const items = await getWireArticles();
  const [lead, ...rest] = items;
  if (!lead) return null;
  const sidebar = rest.slice(0, 2);

  return (
    <section aria-label="Featured story" className="gp-wash gp-grid-bg relative border-b border-edge">
      <Container className="relative py-10 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-[3fr_1fr]">
          <article className="gp-panel group relative overflow-hidden">
            <a href={lead.link} target="_blank" rel="noopener nofollow" className="block" aria-label={lead.title}>
              <div className="relative aspect-[16/8] overflow-hidden bg-surface-elevated">
                {lead.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={lead.imageUrl} alt="" className="h-full w-full object-cover" />
                ) : null}
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge tone="cyan">{lead.sourceName}</Badge>
                  <time dateTime={lead.publishedAt} className="text-xs text-fg-secondary">
                    {timeAgo(lead.publishedAt)}
                  </time>
                </div>
                <h1 className="max-w-3xl font-display text-2xl font-bold leading-tight text-fg transition-colors group-hover:text-cyan sm:text-3xl lg:text-4xl">
                  {lead.title}
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-fg-secondary sm:text-base">{lead.excerpt}</p>
                <p className="mt-3 font-label text-xs font-semibold uppercase tracking-wider text-fg-muted">
                  Read at {lead.sourceName} ↗
                </p>
              </div>
            </a>
          </article>

          <div className="flex flex-col gap-4">
            <p className="font-label text-xs font-semibold uppercase tracking-widest text-fg-muted">Also live now</p>
            {sidebar.map((item) => (
              <a
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noopener nofollow"
                className="gp-panel group block p-4 transition-colors hover:border-cyan/60"
              >
                <Badge tone="cyan">{item.sourceName}</Badge>
                <h2 className="mt-2 line-clamp-3 font-display text-sm font-bold leading-snug text-fg group-hover:text-cyan">
                  {item.title}
                </h2>
              </a>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

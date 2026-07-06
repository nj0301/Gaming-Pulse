import { getWireArticles } from "@/lib/news-feed";

/**
 * Live breaking-news strip sourced from real RSS feeds. Static row (no
 * auto-scroll animation) — the freshest real headlines, linking straight
 * to the source.
 */
export async function BreakingTicker({ maxItems }: { maxItems: number }) {
  const items = (await getWireArticles()).slice(0, maxItems);
  if (items.length === 0) return null;

  return (
    <aside aria-label="Breaking news" className="border-b border-edge bg-surface">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2.5 sm:px-6 lg:px-8">
        <span className="shrink-0 bg-magenta px-2 py-0.5 font-label text-xs font-bold uppercase tracking-widest text-bg">
          Live
        </span>
        {items.map((item) => (
          <a
            key={item.id}
            href={item.link}
            target="_blank"
            rel="noopener nofollow"
            className="whitespace-nowrap text-sm text-fg-secondary transition-colors hover:text-cyan"
          >
            {item.title}
          </a>
        ))}
      </div>
    </aside>
  );
}

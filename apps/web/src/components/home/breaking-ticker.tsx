import Link from "next/link";
import { cms } from "@/lib/cms";

/**
 * Breaking-news ticker. CSS marquee (transform-only, pauses on hover/focus,
 * static under reduced effects). Renders nothing when no story is marked
 * breaking — editors control this via the isBreaking flag.
 */
export async function BreakingTicker({ maxItems }: { maxItems: number }) {
  const breaking = await cms.getArticles({ breakingOnly: true, limit: maxItems });
  if (breaking.length === 0) return null;

  const items = [...breaking, ...breaking]; // duplicated for seamless loop

  return (
    <aside aria-label="Breaking news" className="border-b border-red-500/30 bg-red-500/10">
      <div className="flex items-center overflow-hidden">
        <span className="z-10 shrink-0 bg-red-500 px-3 py-2 font-label text-xs font-bold uppercase tracking-widest text-white">
          Breaking
        </span>
        <div className="relative flex-1 overflow-hidden py-2">
          <ul className="gp-ticker-track flex w-max items-center gap-10 pl-6">
            {items.map((article, index) => (
              <li key={`${article.slug}-${index}`} aria-hidden={index >= breaking.length}>
                <Link
                  href={`/news/${article.slug}`}
                  className="whitespace-nowrap text-sm text-fg transition-colors hover:text-cyan"
                  tabIndex={index >= breaking.length ? -1 : undefined}
                >
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}

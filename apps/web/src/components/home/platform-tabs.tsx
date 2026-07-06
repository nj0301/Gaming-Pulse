"use client";

/** Accessible animated tabs for the Platform Pulse section. */
import Link from "next/link";
import { useId, useRef, useState } from "react";
import { motion } from "motion/react";
import { timeAgo } from "@gaming-pulse/core";
import { Badge, articleTypeTone } from "@/components/ui/badge";
import { useEffects } from "@/components/motion/effects-provider";

interface TabData {
  platform: { name: string; slug: string; shortName: string };
  articles: Array<{ title: string; slug: string; articleType: string; publishedAt: string; excerpt: string }>;
}

export function PlatformTabs({ tabs }: { tabs: TabData[] }) {
  const [active, setActive] = useState(0);
  const { reduced } = useEffects();
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function onKeyDown(event: React.KeyboardEvent) {
    const last = tabs.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowRight") next = active === last ? 0 : active + 1;
    if (event.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = last;
    if (next !== null) {
      event.preventDefault();
      setActive(next);
      tabRefs.current[next]?.focus();
    }
  }

  const current = tabs[active];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Platforms"
        onKeyDown={onKeyDown}
        className="flex flex-wrap gap-1 rounded-lg border border-edge bg-surface p-1"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.platform.slug}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            role="tab"
            id={`${baseId}-tab-${index}`}
            aria-selected={index === active}
            aria-controls={`${baseId}-panel-${index}`}
            tabIndex={index === active ? 0 : -1}
            onClick={() => setActive(index)}
            className={`relative rounded px-3 py-2 font-label text-sm font-semibold uppercase tracking-wider transition-colors ${
              index === active ? "text-bg" : "text-fg-secondary hover:text-fg"
            }`}
          >
            {index === active && (
              <motion.span
                layoutId={`${baseId}-active-tab`}
                aria-hidden
                transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 32 }}
                className="absolute inset-0 rounded bg-violet"
              />
            )}
            <span className="relative">{tab.platform.name}</span>
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel-${active}`}
        aria-labelledby={`${baseId}-tab-${active}`}
        className="mt-4 grid gap-3 sm:grid-cols-2"
      >
        {current.articles.map((article) => (
          <Link
            key={article.slug}
            href={`/news/${article.slug}`}
            className="group rounded-lg border border-edge bg-surface p-4 transition-colors hover:border-violet/50"
          >
            <div className="flex items-center gap-2">
              <Badge tone={articleTypeTone(article.articleType)}>{article.articleType.replace(/-/g, " ")}</Badge>
              <time dateTime={article.publishedAt} className="text-xs text-fg-muted">
                {timeAgo(article.publishedAt)}
              </time>
            </div>
            <h3 className="mt-2 font-display text-sm font-bold leading-snug text-fg group-hover:text-violet">
              {article.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm text-fg-secondary">{article.excerpt}</p>
          </Link>
        ))}
        <Link
          href={`/platform/${current.platform.slug}`}
          className="flex items-center justify-center rounded-lg border border-dashed border-edge p-4 font-label text-sm font-semibold uppercase tracking-wider text-fg-muted transition-colors hover:border-violet/50 hover:text-violet"
        >
          All {current.platform.name} coverage →
        </Link>
      </div>
    </div>
  );
}

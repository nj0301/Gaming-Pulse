"use client";

import type { Deal } from "@/lib/cms/types";
import { track } from "@/lib/analytics";
import { Badge } from "@/components/ui/badge";

export function DealCard({ deal }: { deal: Deal }) {
  return (
    <article className="flex flex-col justify-between rounded-lg border border-edge bg-surface p-4 transition-colors hover:border-signal/50">
      <div>
        <div className="flex items-center justify-between gap-2">
          <Badge tone={deal.isFree ? "green" : "cyan"}>{deal.isFree ? "Free" : `-${deal.discountPercent}%`}</Badge>
          <span className="text-xs text-fg-muted">{deal.retailer}</span>
        </div>
        <h3 className="mt-3 font-display text-sm font-bold leading-snug text-fg">{deal.title}</h3>
        <p className="mt-2 text-xs text-fg-muted">{deal.note}</p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="font-display text-lg font-bold text-fg">
          {deal.isFree ? (
            <span className="text-signal">$0.00</span>
          ) : (
            <>
              ${deal.price?.toFixed(2)}{" "}
              <span className="text-sm font-normal text-fg-muted line-through">${deal.originalPrice?.toFixed(2)}</span>
            </>
          )}
        </p>
        <a
          href={deal.url}
          rel="nofollow sponsored noopener"
          target="_blank"
          onClick={() => track({ name: "deal_click", slug: deal.slug, retailer: deal.retailer })}
          className="rounded bg-signal px-3 py-1.5 font-label text-xs font-bold uppercase tracking-wider text-bg transition-transform hover:scale-105"
        >
          Get deal
        </a>
      </div>
    </article>
  );
}

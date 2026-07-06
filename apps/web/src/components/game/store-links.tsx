"use client";

import { track } from "@/lib/analytics";
import type { RawgGame } from "@/lib/rawg";

export function StoreLinks({ gameSlug, links }: { gameSlug: string; links: RawgGame["storeLinks"] }) {
  return (
    <div className="gp-panel p-5">
      <h2 className="font-label text-sm font-bold uppercase tracking-widest text-fg-muted">Where to get it</h2>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.url}>
            <a
              href={link.url}
              rel="nofollow sponsored noopener"
              target="_blank"
              onClick={() => track({ name: "outbound_store_click", gameSlug, store: link.store })}
              className="flex items-center justify-between border border-edge bg-bg-secondary px-3 py-2 text-sm text-fg-secondary transition-colors hover:border-cyan/50 hover:text-cyan"
            >
              {link.store} <span aria-hidden>↗</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

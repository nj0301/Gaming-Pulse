"use client";

import Image from "next/image";
import type { Video } from "@/lib/cms/types";
import { track } from "@/lib/analytics";
import { Badge } from "@/components/ui/badge";

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Demo videos have no external embed (no third-party hotlinking); the card
 * shows the poster with a play affordance and tracks the play intent.
 */
export function VideoCard({ video }: { video: Video }) {
  return (
    <article className="gp-zoom-parent group overflow-hidden rounded-lg border border-edge bg-surface transition-colors hover:border-magenta/50">
      <button
        type="button"
        className="block w-full text-left"
        onClick={() => track({ name: "trailer_play", slug: video.slug })}
        aria-label={`Play ${video.title} (demo poster only)`}
      >
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={video.poster.src}
            alt={video.poster.alt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="gp-zoom object-cover"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-bg/70 text-fg backdrop-blur transition-transform group-hover:scale-110">
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                <path d="M5 3l8 5-8 5V3z" fill="currentColor" />
              </svg>
            </span>
          </span>
          <span className="absolute bottom-2 right-2 rounded bg-bg/80 px-1.5 py-0.5 font-mono text-xs text-fg">
            {formatDuration(video.durationSeconds)}
          </span>
        </div>
        <div className="p-3">
          <Badge tone="magenta">{video.kind}</Badge>
          <h3 className="mt-2 font-display text-sm font-bold leading-snug text-fg">{video.title}</h3>
        </div>
      </button>
    </article>
  );
}

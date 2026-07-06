import Image from "next/image";
import Link from "next/link";
import type { Game } from "@/lib/cms/types";
import { Badge } from "@/components/ui/badge";

const statusLabel: Record<Game["releaseStatus"], { label: string; tone: "green" | "cyan" | "warning" | "neutral" }> = {
  released: { label: "Released", tone: "green" },
  upcoming: { label: "Upcoming", tone: "cyan" },
  "early-access": { label: "Early Access", tone: "warning" },
  tba: { label: "TBA", tone: "neutral" },
};

export function GameCard({ game }: { game: Game }) {
  const status = statusLabel[game.releaseStatus];
  return (
    <article className="gp-zoom-parent group overflow-hidden rounded-lg border border-edge bg-surface transition-colors hover:border-violet/50">
      <Link href={`/games/${game.slug}`} aria-label={game.name} className="block">
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={game.cover.src}
            alt={game.cover.alt}
            fill
            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
            className="gp-zoom object-cover"
          />
        </div>
        <div className="p-3">
          <Badge tone={status.tone}>{status.label}</Badge>
          <h3 className="mt-2 font-display text-sm font-bold leading-snug text-fg transition-colors group-hover:text-violet">
            {game.name}
          </h3>
          <p className="mt-1 text-xs text-fg-muted">{game.genres.join(" · ")}</p>
        </div>
      </Link>
    </article>
  );
}

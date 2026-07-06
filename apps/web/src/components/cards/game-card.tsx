import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export interface GameCardData {
  slug: string;
  name: string;
  cover: { src: string; alt: string };
  releaseStatus: "released" | "upcoming" | "early-access" | "tba";
  genres: string[];
}

const statusLabel: Record<GameCardData["releaseStatus"], { label: string; tone: "green" | "cyan" | "warning" | "neutral" }> = {
  released: { label: "Released", tone: "green" },
  upcoming: { label: "Upcoming", tone: "cyan" },
  "early-access": { label: "Early Access", tone: "warning" },
  tba: { label: "TBA", tone: "neutral" },
};

export function GameCard({ game }: { game: GameCardData }) {
  const status = statusLabel[game.releaseStatus];
  return (
    <article className="gp-panel gp-panel-violet group flex h-full flex-col overflow-hidden transition-colors hover:border-violet/60">
      <Link href={`/games/${game.slug}`} aria-label={game.name} className="flex h-full flex-col">
        <div className="relative aspect-[3/4] shrink-0 overflow-hidden">
          <Image
            src={game.cover.src}
            alt={game.cover.alt}
            fill
            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col p-3">
          <Badge tone={status.tone}>{status.label}</Badge>
          <h3 className="mt-2 line-clamp-2 font-display text-sm font-bold leading-snug text-fg transition-colors group-hover:text-violet">
            {game.name}
          </h3>
          <p className="mt-auto line-clamp-1 pt-1 text-xs text-fg-muted">{game.genres.join(" · ") || "—"}</p>
        </div>
      </Link>
    </article>
  );
}

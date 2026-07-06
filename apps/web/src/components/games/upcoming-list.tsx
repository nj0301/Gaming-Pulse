"use client";

/**
 * Real upcoming-releases list/grid with platform and genre filters, all
 * derived directly from RAWG data (no fictional precision/kind/region
 * concepts — RAWG gives exact real dates or nothing).
 */
import { useMemo, useState } from "react";
import type { RawgGame } from "@/lib/rawg";
import { track } from "@/lib/analytics";
import { GameCard } from "@/components/cards/game-card";
import { EmptyState } from "@/components/ui/section";

export function UpcomingList({ games }: { games: RawgGame[] }) {
  const [platform, setPlatform] = useState("all");
  const [genre, setGenre] = useState("all");

  const platforms = useMemo(() => [...new Set(games.flatMap((g) => g.platformNames))].sort(), [games]);
  const genres = useMemo(() => [...new Set(games.flatMap((g) => g.genres))].sort(), [games]);

  const filtered = useMemo(
    () =>
      games
        .filter((g) => platform === "all" || g.platformNames.includes(platform))
        .filter((g) => genre === "all" || g.genres.includes(genre)),
    [games, platform, genre],
  );

  const select = "border border-edge bg-surface px-3 py-2 text-sm text-fg-secondary focus:border-cyan";

  return (
    <div>
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs text-fg-muted">
          Platform
          <select
            value={platform}
            onChange={(e) => {
              setPlatform(e.target.value);
              track({ name: "release_filter", filter: "platform", value: e.target.value });
            }}
            className={select}
          >
            <option value="all">All platforms</option>
            {platforms.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-fg-muted">
          Genre
          <select
            value={genre}
            onChange={(e) => {
              setGenre(e.target.value);
              track({ name: "release_filter", filter: "genre", value: e.target.value });
            }}
            className={select}
          >
            <option value="all">All genres</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mb-4 text-sm text-fg-muted" aria-live="polite">
        {filtered.length} upcoming release{filtered.length === 1 ? "" : "s"}
      </p>

      {filtered.length === 0 ? (
        <EmptyState title="No releases match those filters" hint="Try removing a filter." />
      ) : (
        <div className="grid auto-rows-fr grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {filtered.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}

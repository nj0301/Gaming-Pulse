import type { Metadata } from "next";
import Link from "next/link";
import { getPopularGamesPage, isRawgEnabled } from "@/lib/rawg";
import { Container, EmptyState } from "@/components/ui/section";
import { GameCard } from "@/components/cards/game-card";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Games database",
  description: "Real, current games with real cover art, via RAWG.",
  alternates: { canonical: "/games" },
};

function parsePage(value: string | undefined): number {
  const page = Number(value ?? "1");
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export default async function GamesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: pageParam } = await searchParams;
  const page = parsePage(pageParam);
  const { games, hasNextPage, hasPreviousPage } = isRawgEnabled()
    ? await getPopularGamesPage(page, 40)
    : { games: [], hasNextPage: false, hasPreviousPage: false };

  return (
    <Container className="py-10">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold text-fg">Games</h1>
        <p className="mt-2 max-w-2xl text-fg-secondary">Real, currently-popular games with real cover art via RAWG.</p>
      </header>
      {games.length === 0 ? (
        <EmptyState
          title={isRawgEnabled() ? "No games available right now" : "Games database not configured"}
          hint={
            isRawgEnabled()
              ? "RAWG may be temporarily unreachable — check back shortly."
              : "Add a free RAWG_API_KEY (sign up at rawg.io/apidocs) to apps/web/.env.local to enable this page."
          }
        />
      ) : (
        <>
          <div className="grid auto-rows-fr grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {games.map((game) => (
              <GameCard key={game.slug} game={game} />
            ))}
          </div>

          {(page > 1 || hasNextPage) && (
            <nav aria-label="Pagination" className="mt-10 flex items-center justify-between">
              {page > 1 && hasPreviousPage ? (
                <Link
                  href={`/games${page - 1 > 1 ? `?page=${page - 1}` : ""}`}
                  rel="prev"
                  className="border border-edge bg-surface px-4 py-2 font-label text-sm font-semibold uppercase tracking-wider text-fg-secondary hover:text-cyan"
                >
                  ← Newer
                </Link>
              ) : (
                <span aria-hidden />
              )}
              <span className="text-sm text-fg-muted">Page {page}</span>
              {hasNextPage ? (
                <Link
                  href={`/games?page=${page + 1}`}
                  rel="next"
                  className="border border-edge bg-surface px-4 py-2 font-label text-sm font-semibold uppercase tracking-wider text-fg-secondary hover:text-cyan"
                >
                  Older →
                </Link>
              ) : (
                <span aria-hidden />
              )}
            </nav>
          )}
        </>
      )}
    </Container>
  );
}

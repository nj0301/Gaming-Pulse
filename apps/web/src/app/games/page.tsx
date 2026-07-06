import type { Metadata } from "next";
import { getPopularGames, isRawgEnabled } from "@/lib/rawg";
import { Container, EmptyState } from "@/components/ui/section";
import { GameCard } from "@/components/cards/game-card";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Games database",
  description: "Real, current games with real cover art, via RAWG.",
  alternates: { canonical: "/games" },
};

export default async function GamesPage() {
  const games = isRawgEnabled() ? await getPopularGames(30) : [];

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
        <div className="grid auto-rows-fr grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {games.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      )}
    </Container>
  );
}

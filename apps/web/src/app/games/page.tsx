import type { Metadata } from "next";
import { cms } from "@/lib/cms";
import { getPopularGames, isRawgEnabled } from "@/lib/rawg";
import { Container, EmptyState } from "@/components/ui/section";
import { GameCard } from "@/components/cards/game-card";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Games database",
  description: "Profiles, release dates and coverage for the games we track.",
  alternates: { canonical: "/games" },
};

export default async function GamesPage() {
  const [rawgGames, demoGames] = await Promise.all([
    isRawgEnabled() ? getPopularGames(30) : Promise.resolve([]),
    cms.getGames(),
  ]);

  return (
    <Container className="py-10">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold text-fg">Games</h1>
        <p className="mt-2 max-w-2xl text-fg-secondary">
          {isRawgEnabled()
            ? "Real, current games and cover art via RAWG."
            : "Demo build: showing fictional placeholder games. Add a free RAWG_API_KEY to show real games with real cover art — see apps/web/.env.example."}
        </p>
      </header>
      {rawgGames.length > 0 ? (
        <div className="grid auto-rows-fr grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {rawgGames.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      ) : demoGames.length === 0 ? (
        <EmptyState title="No games in the database yet" />
      ) : (
        <div className="grid auto-rows-fr grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {demoGames.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      )}
    </Container>
  );
}

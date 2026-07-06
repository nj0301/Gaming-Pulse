import type { Metadata } from "next";
import { cms } from "@/lib/cms";
import { Container, EmptyState } from "@/components/ui/section";
import { GameCard } from "@/components/cards/game-card";
import { Reveal } from "@/components/motion/reveal";
import { TiltCard } from "@/components/motion/tilt-card";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Games database",
  description: "Profiles, release dates and coverage for the games we track.",
  alternates: { canonical: "/games" },
};

export default async function GamesPage() {
  const games = await cms.getGames();

  return (
    <Container className="py-10">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold text-fg">Games</h1>
        <p className="mt-2 max-w-2xl text-fg-secondary">
          Every game in the Gaming Pulse database, with releases, coverage and trailers. (Demo build: all games are
          fictional.)
        </p>
      </header>
      {games.length === 0 ? (
        <EmptyState title="No games in the database yet" />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {games.map((game, index) => (
            <Reveal key={game.slug} delay={(index % 5) * 0.04}>
              <TiltCard>
                <GameCard game={game} />
              </TiltCard>
            </Reveal>
          ))}
        </div>
      )}
    </Container>
  );
}

import { getUpcomingGames, isRawgEnabled } from "@/lib/rawg";
import { GameCard } from "@/components/cards/game-card";
import { Container, SectionHeading } from "@/components/ui/section";

/** Real upcoming releases teaser for the homepage, via RAWG. */
export async function UpcomingSection({ title, maxItems }: { title: string; maxItems: number }) {
  if (!isRawgEnabled()) return null;
  const games = await getUpcomingGames(maxItems);
  if (games.length === 0) return null;

  return (
    <section aria-label={title}>
      <Container>
        <SectionHeading title={title} href="/upcoming-games" accent="cyan" />
        <div className="grid auto-rows-fr grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {games.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      </Container>
    </section>
  );
}

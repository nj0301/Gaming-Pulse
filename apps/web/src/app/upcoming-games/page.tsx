import type { Metadata } from "next";
import { getUpcomingGames, isRawgEnabled } from "@/lib/rawg";
import { Container, EmptyState } from "@/components/ui/section";
import { UpcomingList } from "@/components/games/upcoming-list";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Upcoming game releases",
  description: "Real upcoming game releases, dated and sourced via RAWG.",
  alternates: { canonical: "/upcoming-games" },
};

export default async function UpcomingGamesPage() {
  const games = isRawgEnabled() ? await getUpcomingGames(60) : [];

  return (
    <Container className="py-10">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold text-fg">Upcoming releases</h1>
        <p className="mt-2 max-w-2xl text-fg-secondary">Real upcoming games, sorted by release date, via RAWG.</p>
      </header>
      {games.length === 0 ? (
        <EmptyState
          title={isRawgEnabled() ? "No upcoming releases available right now" : "Upcoming releases not configured"}
          hint={
            isRawgEnabled()
              ? "RAWG may be temporarily unreachable — check back shortly."
              : "Add a free RAWG_API_KEY (sign up at rawg.io/apidocs) to apps/web/.env.local to enable this page."
          }
        />
      ) : (
        <UpcomingList games={games} />
      )}
    </Container>
  );
}

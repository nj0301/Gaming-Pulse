import type { Metadata } from "next";
import { isUpcoming, releaseSortKey } from "@gaming-pulse/core";
import { cms } from "@/lib/cms";
import { Container } from "@/components/ui/section";
import { ReleaseCalendar } from "@/components/calendar/release-calendar";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Upcoming game releases",
  description:
    "Every upcoming release we track — filter by platform, genre, region, type and date confidence. Calendar, timeline and list views.",
  alternates: { canonical: "/upcoming-games" },
};

export default async function UpcomingGamesPage() {
  const [releaseDates, games, platforms, companies] = await Promise.all([
    cms.getReleaseDates(),
    cms.getGames(),
    cms.getPlatforms(),
    cms.getCompanies(),
  ]);

  const gameBySlug = new Map(games.map((g) => [g.slug, g]));

  const entries = releaseDates
    .filter((rd) => isUpcoming(rd))
    .sort((a, b) => releaseSortKey(a) - releaseSortKey(b))
    .map((rd) => {
      const game = gameBySlug.get(rd.gameSlug);
      return {
        ...rd,
        gameName: game?.name ?? rd.gameSlug,
        genres: game?.genres ?? [],
        developerSlug: game?.developerSlug ?? "",
        publisherSlug: game?.publisherSlug ?? "",
        cover: game?.cover ?? null,
      };
    });

  return (
    <Container className="py-10">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold text-fg">Upcoming releases</h1>
        <p className="mt-2 max-w-2xl text-fg-secondary">
          Dates shown at the precision we actually know — a Q3 window never masquerades as a day. Unconfirmed windows
          are labeled. (Demo build: all releases are fictional.)
        </p>
      </header>
      <ReleaseCalendar
        entries={entries}
        platforms={platforms.map((p) => ({ name: p.name, slug: p.slug, shortName: p.shortName }))}
        genres={[...new Set(games.flatMap((g) => g.genres))].sort()}
        companies={companies.map((c) => ({ name: c.name, slug: c.slug }))}
      />
    </Container>
  );
}

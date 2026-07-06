import type { Metadata } from "next";
import Link from "next/link";
import { getUpcomingGamesPage, isRawgEnabled } from "@/lib/rawg";
import { Container, EmptyState } from "@/components/ui/section";
import { UpcomingList } from "@/components/games/upcoming-list";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Upcoming game releases",
  description: "Real upcoming game releases, dated and sourced via RAWG.",
  alternates: { canonical: "/upcoming-games" },
};

function parsePage(value: string | undefined): number {
  const page = Number(value ?? "1");
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export default async function UpcomingGamesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: pageParam } = await searchParams;
  const page = parsePage(pageParam);
  const { games, hasNextPage, hasPreviousPage } = isRawgEnabled()
    ? await getUpcomingGamesPage(page, 40)
    : { games: [], hasNextPage: false, hasPreviousPage: false };

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
        <>
          <UpcomingList games={games} />

          {(page > 1 || hasNextPage) && (
            <nav aria-label="Pagination" className="mt-10 flex items-center justify-between">
              {page > 1 && hasPreviousPage ? (
                <Link
                  href={`/upcoming-games${page - 1 > 1 ? `?page=${page - 1}` : ""}`}
                  rel="prev"
                  className="border border-edge bg-surface px-4 py-2 font-label text-sm font-semibold uppercase tracking-wider text-fg-secondary hover:text-cyan"
                >
                  ← Sooner
                </Link>
              ) : (
                <span aria-hidden />
              )}
              <span className="text-sm text-fg-muted">Page {page}</span>
              {hasNextPage ? (
                <Link
                  href={`/upcoming-games?page=${page + 1}`}
                  rel="next"
                  className="border border-edge bg-surface px-4 py-2 font-label text-sm font-semibold uppercase tracking-wider text-fg-secondary hover:text-cyan"
                >
                  Later →
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

import type { Metadata } from "next";
import { getWireArticles } from "@/lib/news-feed";
import { WireCard } from "@/components/cards/wire-card";
import { Container, EmptyState } from "@/components/ui/section";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Gaming news",
  description: "Live gaming headlines aggregated from major outlets.",
  alternates: { canonical: "/news" },
};

export default async function NewsPage() {
  const items = await getWireArticles();
  return (
    <Container className="py-10">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold text-fg">News</h1>
        <p className="mt-2 max-w-2xl text-fg-secondary">
          Real, live headlines aggregated from Eurogamer, PC Gamer, GameSpot, Rock Paper Shotgun, VG247, Destructoid
          and Nintendo Life. Every card links to the original story at the source.
        </p>
      </header>
      {items.length === 0 ? (
        <EmptyState title="No headlines available right now" hint="Outlet feeds may be temporarily unreachable — check back shortly." />
      ) : (
        <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <WireCard key={item.id} article={item} />
          ))}
        </div>
      )}
    </Container>
  );
}

import type { Metadata } from "next";
import { getWireArticles } from "@/lib/news-feed";
import { WireCard } from "@/components/cards/wire-card";
import { Container, EmptyState } from "@/components/ui/section";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Latest gaming news",
  description: "Every live headline, newest first, aggregated from major gaming outlets.",
  alternates: { canonical: "/latest" },
};

export default async function LatestPage() {
  const items = await getWireArticles();
  return (
    <Container className="py-10">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold text-fg">Latest</h1>
        <p className="mt-2 max-w-2xl text-fg-secondary">Real headlines, newest first, refreshed every few minutes.</p>
      </header>
      {items.length === 0 ? (
        <EmptyState title="No headlines available right now" />
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

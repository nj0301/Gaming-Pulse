import { getWireArticles } from "@/lib/news-feed";
import { WireCard } from "@/components/cards/wire-card";
import { Container, SectionHeading } from "@/components/ui/section";

export async function LatestGrid({ title, maxItems }: { title: string; maxItems: number }) {
  const items = (await getWireArticles()).slice(0, maxItems);
  if (items.length === 0) return null;

  return (
    <section aria-label={title}>
      <Container>
        <SectionHeading title={title} href="/latest" accent="cyan" />
        <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <WireCard key={item.id} article={item} />
          ))}
        </div>
      </Container>
    </section>
  );
}

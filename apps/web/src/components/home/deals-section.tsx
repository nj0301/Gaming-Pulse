import { cms } from "@/lib/cms";
import { DealCard } from "@/components/cards/deal-card";
import { Container, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";

export async function DealsSection({ title, maxItems }: { title: string; maxItems: number }) {
  const now = new Date();
  const deals = (await cms.getDeals())
    .filter((deal) => !deal.endsAt || new Date(deal.endsAt) > now)
    .slice(0, maxItems);
  if (deals.length === 0) return null;

  return (
    <section aria-label={title}>
      <Container>
        <SectionHeading title={title} href="/deals" accent="green" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {deals.map((deal, index) => (
            <Reveal key={deal.slug} delay={index * 0.05}>
              <DealCard deal={deal} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

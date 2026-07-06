import type { Metadata } from "next";
import { cms } from "@/lib/cms";
import { Container, EmptyState } from "@/components/ui/section";
import { DealCard } from "@/components/cards/deal-card";
import { Reveal } from "@/components/motion/reveal";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Free games & deals",
  description: "Free games and genuinely good discounts, checked by humans. Affiliate links are disclosed.",
  alternates: { canonical: "/deals" },
};

export default async function DealsPage() {
  const now = new Date();
  const deals = await cms.getDeals();
  const active = deals.filter((d) => !d.endsAt || new Date(d.endsAt) > now);
  const expired = deals.filter((d) => d.endsAt && new Date(d.endsAt) <= now);

  return (
    <Container className="py-10">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold text-fg">Free games &amp; deals</h1>
        <p className="mt-2 max-w-2xl text-fg-secondary">
          Checked by humans before listing. Some links are affiliate links — see our affiliate disclosure. Demo
          build: all prices and retailers are fictional.
        </p>
      </header>

      {active.length === 0 ? (
        <EmptyState title="No live deals right now" hint="New deals are added as editors verify them." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {active.map((deal, index) => (
            <Reveal key={deal.slug} delay={index * 0.05}>
              <DealCard deal={deal} />
            </Reveal>
          ))}
        </div>
      )}

      {expired.length > 0 && (
        <section aria-label="Expired deals" className="mt-12">
          <h2 className="mb-4 font-display text-lg font-bold text-fg-muted">Recently expired</h2>
          <div className="grid gap-4 opacity-60 sm:grid-cols-2 lg:grid-cols-4">
            {expired.map((deal) => (
              <DealCard key={deal.slug} deal={deal} />
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}

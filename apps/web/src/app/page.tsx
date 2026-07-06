import { cms } from "@/lib/cms";
import type { HomepageSection } from "@/lib/cms/types";
import { HeroSection } from "@/components/home/hero-section";
import { TrendingSection } from "@/components/home/trending-section";
import { LatestGrid } from "@/components/home/latest-grid";
import { UpcomingSection } from "@/components/home/upcoming-section";
import { NewsletterSection } from "@/components/home/newsletter-section";

export const revalidate = 3600;

/**
 * The homepage is CMS-driven for section order/visibility (Homepage
 * Configuration single type). Every section pulls real data: news from the
 * live RSS wire (@/lib/news-feed), games from RAWG (@/lib/rawg).
 */
export default async function HomePage() {
  const sections = await cms.getHomepageSections();

  return (
    <div className="space-y-14 pb-10">
      {sections
        .filter((section) => section.enabled)
        .map((section) => (
          <SectionRenderer key={section.kind} section={section} />
        ))}
    </div>
  );
}

async function SectionRenderer({ section }: { section: HomepageSection }) {
  switch (section.kind) {
    case "hero":
      return <HeroSection />;
    case "trending":
      return <TrendingSection title={section.title} maxItems={section.maxItems} />;
    case "latest":
      return <LatestGrid title={section.title} maxItems={section.maxItems} />;
    case "upcoming-releases":
      return <UpcomingSection title={section.title} maxItems={section.maxItems} />;
    case "newsletter":
      return <NewsletterSection />;
    default:
      return null;
  }
}

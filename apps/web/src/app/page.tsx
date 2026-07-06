import { cms } from "@/lib/cms";
import type { HomepageSection } from "@/lib/cms/types";
import { BreakingTicker } from "@/components/home/breaking-ticker";
import { HeroSection } from "@/components/home/hero-section";
import { TrendingSection } from "@/components/home/trending-section";
import { LatestGrid } from "@/components/home/latest-grid";
import { ReleaseTimeline } from "@/components/home/release-timeline";
import { PlatformPulse } from "@/components/home/platform-pulse";
import { VideosSection } from "@/components/home/videos-section";
import { CategoryStrip } from "@/components/home/category-strip";
import { DealsSection } from "@/components/home/deals-section";
import { NewsletterSection } from "@/components/home/newsletter-section";

export const revalidate = 300;

/**
 * The homepage is fully CMS-driven: section order, visibility, curation and
 * item counts come from the Homepage Configuration single type. Editors
 * reorder or hide sections without code changes.
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
    case "breaking-ticker":
      return <BreakingTicker maxItems={section.maxItems} />;
    case "hero":
      return <HeroSection curatedSlugs={section.curatedSlugs} />;
    case "trending":
      return <TrendingSection title={section.title} maxItems={section.maxItems} />;
    case "latest":
      return <LatestGrid title={section.title} maxItems={section.maxItems} />;
    case "release-timeline":
      return <ReleaseTimeline title={section.title} maxItems={section.maxItems} />;
    case "platform-pulse":
      return <PlatformPulse title={section.title} maxItems={section.maxItems} />;
    case "videos":
      return <VideosSection title={section.title} maxItems={section.maxItems} />;
    case "insights":
      return (
        <CategoryStrip
          title={section.title}
          categorySlug="insights"
          href="/insights"
          accent="violet"
          maxItems={section.maxItems}
        />
      );
    case "reviews":
      return (
        <CategoryStrip
          title={section.title}
          categorySlug="reviews"
          href="/reviews"
          accent="green"
          maxItems={section.maxItems}
        />
      );
    case "esports":
      return (
        <CategoryStrip
          title={section.title}
          categorySlug="esports"
          href="/esports"
          accent="magenta"
          maxItems={section.maxItems}
        />
      );
    case "hardware":
      return (
        <CategoryStrip
          title={section.title}
          categorySlug="hardware"
          href="/hardware"
          accent="warning"
          maxItems={section.maxItems}
        />
      );
    case "deals":
      return <DealsSection title={section.title} maxItems={section.maxItems} />;
    case "newsletter":
      return <NewsletterSection />;
    default:
      return null;
  }
}

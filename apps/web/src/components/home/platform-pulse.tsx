import { cms } from "@/lib/cms";
import { Container, SectionHeading } from "@/components/ui/section";
import { PlatformTabs } from "./platform-tabs";

/** Platform Pulse: animated tabs (client) over server-fetched per-platform stories. */
export async function PlatformPulse({ title, maxItems }: { title: string; maxItems: number }) {
  const platforms = await cms.getPlatforms();
  const tabs = await Promise.all(
    platforms.map(async (platform) => ({
      platform: { name: platform.name, slug: platform.slug, shortName: platform.shortName },
      articles: (await cms.getArticles({ platformSlug: platform.slug, limit: maxItems })).map((a) => ({
        title: a.title,
        slug: a.slug,
        articleType: a.articleType,
        publishedAt: a.publishedAt,
        excerpt: a.excerpt,
      })),
    })),
  );

  const withContent = tabs.filter((tab) => tab.articles.length > 0);
  if (withContent.length === 0) return null;

  return (
    <section aria-label={title}>
      <Container>
        <SectionHeading title={title} accent="violet" />
        <PlatformTabs tabs={withContent} />
      </Container>
    </section>
  );
}

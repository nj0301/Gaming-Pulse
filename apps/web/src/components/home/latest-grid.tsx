import { cms } from "@/lib/cms";
import { ArticleCard } from "@/components/cards/article-card";
import { Container, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";

export async function LatestGrid({ title, maxItems }: { title: string; maxItems: number }) {
  const articles = await cms.getArticles({ limit: maxItems });
  if (articles.length === 0) return null;

  return (
    <section aria-label={title}>
      <Container>
        <SectionHeading title={title} href="/latest" accent="cyan" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <Reveal key={article.slug} delay={(index % 3) * 0.06}>
              <ArticleCard article={article} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

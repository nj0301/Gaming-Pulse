import { cms } from "@/lib/cms";
import { ArticleCard } from "@/components/cards/article-card";
import { Container, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";

/** Reusable homepage strip for a category (insights, reviews, esports, hardware). */
export async function CategoryStrip({
  title,
  categorySlug,
  href,
  accent,
  maxItems,
}: {
  title: string;
  categorySlug: string;
  href: string;
  accent: "cyan" | "violet" | "magenta" | "green" | "warning";
  maxItems: number;
}) {
  const articles = await cms.getArticles({ categorySlug, limit: maxItems });
  if (articles.length === 0) return null;

  return (
    <section aria-label={title}>
      <Container>
        <SectionHeading title={title} href={href} accent={accent} />
        <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <Reveal key={article.slug} delay={index * 0.06}>
              <ArticleCard article={article} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

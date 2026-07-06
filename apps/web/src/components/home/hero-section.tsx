import Image from "next/image";
import Link from "next/link";
import { timeAgo } from "@gaming-pulse/core";
import { cms } from "@/lib/cms";
import { Badge, articleTypeTone } from "@/components/ui/badge";
import { Container } from "@/components/ui/section";

/**
 * Cinematic featured-story hero. Editors curate via Homepage Configuration
 * (curatedSlugs); falls back to the newest featured article.
 */
export async function HeroSection({ curatedSlugs }: { curatedSlugs: string[] }) {
  const article =
    (curatedSlugs[0] ? await cms.getArticleBySlug(curatedSlugs[0]) : null) ??
    (await cms.getArticles({ featuredOnly: true, limit: 1 }))[0];
  if (!article) return null;

  const [author, secondary] = await Promise.all([
    cms.getAuthorBySlug(article.authorSlug),
    cms.getArticles({ featuredOnly: true, limit: 3 }),
  ]);
  const sidebar = secondary.filter((a) => a.slug !== article.slug).slice(0, 2);

  return (
    <section aria-label="Featured story" className="relative overflow-hidden border-b border-edge">
      {/* Decorative layers: animated mesh + grid, both pure CSS */}
      <div aria-hidden className="gp-mesh absolute inset-0" />
      <div aria-hidden className="gp-grid-bg absolute inset-0" />

      <Container className="relative py-10 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[3fr_1fr]">
          <article className="gp-zoom-parent group relative overflow-hidden rounded-xl border border-edge bg-surface">
            <Link href={`/news/${article.slug}`} className="block" aria-label={article.title}>
              <div className="relative aspect-[16/8] overflow-hidden">
                <Image
                  src={article.heroImage.src}
                  alt={article.heroImage.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 72vw, 100vw"
                  className="gp-zoom object-cover"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge tone={articleTypeTone(article.articleType)}>{article.articleType.replace(/-/g, " ")}</Badge>
                  <time dateTime={article.publishedAt} className="text-xs text-fg-secondary">
                    {timeAgo(article.publishedAt)}
                  </time>
                </div>
                <h1 className="max-w-3xl font-display text-2xl font-bold leading-tight text-fg transition-colors group-hover:text-cyan sm:text-3xl lg:text-4xl">
                  {article.title}
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-fg-secondary sm:text-base">{article.subtitle}</p>
                {author && <p className="mt-3 text-xs text-fg-muted">By {author.name}</p>}
              </div>
            </Link>
          </article>

          <div className="flex flex-col gap-4">
            <p className="font-label text-xs font-semibold uppercase tracking-widest text-fg-muted">Also featured</p>
            {sidebar.map((item) => (
              <Link
                key={item.slug}
                href={`/news/${item.slug}`}
                className="group rounded-lg border border-edge bg-surface p-4 transition-colors hover:border-cyan/40"
              >
                <Badge tone={articleTypeTone(item.articleType)}>{item.articleType.replace(/-/g, " ")}</Badge>
                <h2 className="mt-2 font-display text-sm font-bold leading-snug text-fg group-hover:text-cyan">
                  {item.title}
                </h2>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

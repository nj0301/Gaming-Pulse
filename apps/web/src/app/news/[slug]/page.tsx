import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { estimateReadingTime } from "@gaming-pulse/core";
import { cms } from "@/lib/cms";
import { Badge, articleTypeTone, factStatusTone } from "@/components/ui/badge";
import { Container } from "@/components/ui/section";
import { ArticleBody } from "@/components/article/article-body";
import { ReadingProgress } from "@/components/article/reading-progress";
import { ShareButtons } from "@/components/article/share-buttons";
import {
  CorrectionLog,
  FactPanel,
  KeyPoints,
  ReviewVerdict,
  SourceList,
  SpeculativeBanner,
} from "@/components/article/editorial-panels";
import { ArticleCard } from "@/components/cards/article-card";
import { VideoCard } from "@/components/cards/video-card";
import { JsonLd } from "@/components/seo/json-ld";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = await cms.getArticles({ limit: 100 });
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await cms.getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.seoTitle,
    description: article.seoDescription,
    alternates: { canonical: `/news/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.seoTitle,
      description: article.seoDescription,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAtEditorial,
      images: [{ url: article.heroImage.src, width: article.heroImage.width, height: article.heroImage.height }],
    },
    twitter: { card: "summary_large_image", title: article.seoTitle, description: article.seoDescription },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await cms.getArticleBySlug(slug);
  if (!article) notFound();

  const [author, reviewer, categories, platforms, relatedGames, siblingArticles] = await Promise.all([
    cms.getAuthorBySlug(article.authorSlug),
    article.reviewerSlug ? cms.getAuthorBySlug(article.reviewerSlug) : Promise.resolve(null),
    cms.getCategories(),
    cms.getPlatforms(),
    Promise.all(article.relatedGameSlugs.map((s) => cms.getGameBySlug(s))),
    cms.getArticles({ limit: 100 }),
  ]);

  const category = categories.find((c) => c.slug === article.categorySlug);
  const articlePlatforms = platforms.filter((p) => article.platformSlugs.includes(p.slug));
  const games = relatedGames.filter((g) => g !== null);
  const videos = (await Promise.all((article.videoSlugs ?? []).map((s) => cms.getVideoBySlug(s)))).filter(
    (v) => v !== null,
  );

  const index = siblingArticles.findIndex((a) => a.slug === article.slug);
  const previous = index > 0 ? siblingArticles[index - 1] : null;
  const next = index >= 0 && index < siblingArticles.length - 1 ? siblingArticles[index + 1] : null;
  const related = siblingArticles
    .filter(
      (a) =>
        a.slug !== article.slug &&
        (a.categorySlug === article.categorySlug ||
          a.relatedGameSlugs.some((g) => article.relatedGameSlugs.includes(g))),
    )
    .slice(0, 3);

  const reading = estimateReadingTime(article.body, article.gallery?.length ?? 0);

  const crumbs = [
    { name: "Home", href: "/" },
    { name: category?.name ?? "News", href: `/category/${article.categorySlug}` },
    { name: article.title, href: `/news/${article.slug}` },
  ];

  return (
    <>
      <ReadingProgress slug={article.slug} />
      <JsonLd data={articleJsonLd(article, author)} />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <article>
        <Container className="max-w-4xl py-8">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1 text-xs text-fg-muted">
              {crumbs.map((crumb, i) => (
                <li key={crumb.href} className="flex items-center gap-1">
                  {i > 0 && <span aria-hidden>/</span>}
                  {i < crumbs.length - 1 ? (
                    <Link href={crumb.href} className="hover:text-cyan">
                      {crumb.name}
                    </Link>
                  ) : (
                    <span aria-current="page" className="line-clamp-1 max-w-60 text-fg-secondary">
                      {crumb.name}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          {/* Labels */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Badge tone={articleTypeTone(article.articleType)}>{article.articleType.replace(/-/g, " ")}</Badge>
            <Badge tone={factStatusTone(article.factStatus)}>Fact status: {article.factStatus}</Badge>
            {articlePlatforms.map((platform) => (
              <Link key={platform.slug} href={`/platform/${platform.slug}`}>
                <Badge tone="neutral">{platform.shortName}</Badge>
              </Link>
            ))}
            {article.isSponsored && <Badge tone="magenta">Sponsored · {article.sponsorName}</Badge>}
          </div>

          {/* Headline */}
          <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-fg sm:text-4xl">{article.title}</h1>
          <p className="mt-3 text-lg text-fg-secondary">{article.subtitle}</p>

          {/* Byline */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-edge py-4">
            <div className="flex items-center gap-3">
              {author && (
                <>
                  <Image
                    src={author.avatar.src}
                    alt=""
                    width={40}
                    height={40}
                    className="rounded-full border border-edge"
                  />
                  <div>
                    <Link href={`/author/${author.slug}`} className="font-semibold text-fg hover:text-cyan">
                      {author.name}
                    </Link>
                    <p className="text-xs text-fg-muted">
                      {author.role}
                      {reviewer && <> · Fact-checked by {reviewer.name}</>}
                    </p>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right text-xs text-fg-muted">
                <p>
                  Published{" "}
                  <time dateTime={article.publishedAt}>
                    {new Date(article.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </p>
                {article.updatedAtEditorial !== article.publishedAt && (
                  <p>
                    Updated{" "}
                    <time dateTime={article.updatedAtEditorial}>
                      {new Date(article.updatedAtEditorial).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                  </p>
                )}
                <p>{reading.label}</p>
              </div>
              <ShareButtons slug={article.slug} title={article.title} />
            </div>
          </div>

          {/* Hero media */}
          <figure className="mt-8 overflow-hidden rounded-xl border border-edge">
            <Image
              src={article.heroImage.src}
              alt={article.heroImage.alt}
              width={article.heroImage.width}
              height={article.heroImage.height}
              priority
              sizes="(min-width: 1024px) 896px, 100vw"
              className="w-full object-cover"
            />
            {(article.heroImage.caption || article.heroImage.credit) && (
              <figcaption className="bg-surface px-4 py-2 text-xs text-fg-muted">
                {article.heroImage.caption} {article.heroImage.credit && <>— {article.heroImage.credit}</>}
              </figcaption>
            )}
          </figure>

          <div className="mt-8 space-y-8">
            <SpeculativeBanner articleType={article.articleType} />
            <KeyPoints points={article.keyPoints} />
            {article.review && <ReviewVerdict review={article.review} />}

            <ArticleBody body={article.body} />

            {/* Gallery */}
            {article.gallery && article.gallery.length > 0 && (
              <section aria-label="Gallery" className="grid gap-4 sm:grid-cols-2">
                {article.gallery.map((image) => (
                  <figure key={image.src} className="overflow-hidden rounded-lg border border-edge">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="w-full object-cover"
                    />
                    {image.caption && (
                      <figcaption className="bg-surface px-3 py-2 text-xs text-fg-muted">{image.caption}</figcaption>
                    )}
                  </figure>
                ))}
              </section>
            )}

            {/* Videos */}
            {videos.length > 0 && (
              <section aria-label="Related videos" className="grid gap-4 sm:grid-cols-2">
                {videos.map((video) => (
                  <VideoCard key={video.slug} video={video} />
                ))}
              </section>
            )}

            <FactPanel article={article} />
            <SourceList sources={article.sources} />
            <CorrectionLog corrections={article.correctionLog} />

            {/* Transparency line */}
            <p className="text-xs text-fg-muted">
              {article.aiAssisted ? "AI-assisted draft, human-reviewed before publication." : "Written by humans."}
              {article.humanReviewed && " Reviewed under the Gaming Pulse editorial policy."}
              {article.isSponsored &&
                ` Sponsored content: produced in partnership with ${article.sponsorName}; see our editorial policy for how paid content is handled.`}
            </p>

            {/* Related game(s) */}
            {games.length > 0 && (
              <section aria-label="Related games" className="rounded-lg border border-violet/30 bg-surface p-5">
                <h2 className="font-label text-sm font-bold uppercase tracking-widest text-violet">Related games</h2>
                <ul className="mt-3 space-y-2">
                  {games.map((game) => (
                    <li key={game.slug}>
                      <Link href={`/games/${game.slug}`} className="font-display font-semibold text-fg hover:text-violet">
                        {game.name}
                      </Link>
                      <span className="ml-2 text-sm text-fg-muted">{game.summary.slice(0, 90)}…</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </Container>

        {/* Related stories + prev/next */}
        <Container className="max-w-6xl border-t border-edge py-10">
          {related.length > 0 && (
            <>
              <h2 className="mb-5 font-display text-xl font-bold text-fg">Related stories</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <ArticleCard key={item.slug} article={item} />
                ))}
              </div>
            </>
          )}
          <nav aria-label="Article navigation" className="mt-10 grid gap-4 sm:grid-cols-2">
            {previous ? (
              <Link
                href={`/news/${previous.slug}`}
                className="group rounded-lg border border-edge bg-surface p-4 transition-colors hover:border-cyan/50"
              >
                <p className="font-label text-xs font-semibold uppercase tracking-widest text-fg-muted">← Newer</p>
                <p className="mt-1 font-display font-semibold text-fg group-hover:text-cyan">{previous.title}</p>
              </Link>
            ) : (
              <span aria-hidden />
            )}
            {next && (
              <Link
                href={`/news/${next.slug}`}
                className="group rounded-lg border border-edge bg-surface p-4 text-right transition-colors hover:border-cyan/50"
              >
                <p className="font-label text-xs font-semibold uppercase tracking-widest text-fg-muted">Older →</p>
                <p className="mt-1 font-display font-semibold text-fg group-hover:text-cyan">{next.title}</p>
              </Link>
            )}
          </nav>
        </Container>
      </article>
    </>
  );
}

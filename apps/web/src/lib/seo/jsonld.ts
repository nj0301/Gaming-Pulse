/** JSON-LD builders. All URLs are absolute; all data comes from the CMS layer. */
import type { Article, Author, Game, Video } from "@/lib/cms/types";
import { SITE_NAME, SITE_URL } from "@/lib/config";

const abs = (path: string) => (path.startsWith("http") ? path : `${SITE_URL}${path}`);

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: abs("/media/og-default.svg"),
    publishingPrinciples: abs("/editorial-policy"),
    correctionsPolicy: abs("/corrections"),
  };
}

export function articleJsonLd(article: Article, author: Author | null) {
  const isNews = ["breaking", "news", "official-announcement", "report"].includes(article.articleType);
  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": isNews ? "NewsArticle" : "Article",
    headline: article.title,
    description: article.seoDescription,
    image: [abs(article.heroImage.src)],
    datePublished: article.publishedAt,
    dateModified: article.updatedAtEditorial,
    mainEntityOfPage: abs(`/news/${article.slug}`),
    author: author
      ? { "@type": "Person", name: author.name, url: abs(`/author/${author.slug}`) }
      : { "@type": "Organization", name: SITE_NAME },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: abs("/media/og-default.svg") },
    },
  };
  if (article.isSponsored && article.sponsorName) {
    base.sponsor = { "@type": "Organization", name: article.sponsorName };
  }
  // Review structured data only when a real review payload exists.
  if (article.articleType === "review" && article.review) {
    return {
      "@context": "https://schema.org",
      "@type": "Review",
      itemReviewed: {
        "@type": "VideoGame",
        name: article.relatedGameSlugs[0]?.replace(/-/g, " ") ?? article.title,
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: article.review.score,
        bestRating: article.review.scoreMax,
        worstRating: 0,
      },
      name: article.title,
      author: author ? { "@type": "Person", name: author.name } : undefined,
      datePublished: article.publishedAt,
      publisher: { "@type": "Organization", name: SITE_NAME },
    };
  }
  return base;
}

export function breadcrumbJsonLd(items: Array<{ name: string; href: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: abs(item.href),
    })),
  };
}

export function gameJsonLd(game: Game) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.name,
    description: game.summary,
    image: abs(game.cover.src),
    url: abs(`/games/${game.slug}`),
    genre: game.genres,
    gamePlatform: game.platformSlugs,
    playMode: game.gameModes,
  };
}

export function videoJsonLd(video: Video) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description,
    thumbnailUrl: abs(video.poster.src),
    uploadDate: video.publishedAt,
    duration: `PT${Math.floor(video.durationSeconds / 60)}M${video.durationSeconds % 60}S`,
  };
}

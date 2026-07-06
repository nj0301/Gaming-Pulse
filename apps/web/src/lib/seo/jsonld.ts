/** JSON-LD builders. All URLs are absolute; all data is real (news wire / RAWG). */
import type { RawgGame } from "@/lib/rawg";
import { SITE_NAME, SITE_URL } from "@/lib/config";

const abs = (path: string) => (path.startsWith("http") ? path : `${SITE_URL}${path}`);

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: abs("/media/og-default.svg"),
  };
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

export function gameJsonLd(game: RawgGame) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.name,
    description: game.summary,
    image: abs(game.cover.src),
    url: abs(`/games/${game.slug}`),
    genre: game.genres,
    gamePlatform: game.platformNames,
    ...(game.releaseDate ? { datePublished: game.releaseDate } : {}),
    ...(game.rating ? { aggregateRating: { "@type": "AggregateRating", ratingValue: game.rating, bestRating: 5, worstRating: 0 } } : {}),
  };
}

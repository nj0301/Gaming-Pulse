import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatReleaseDate, releaseSortKey } from "@gaming-pulse/core";
import { cms } from "@/lib/cms";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/section";
import { ArticleCard } from "@/components/cards/article-card";
import { GameCard } from "@/components/cards/game-card";
import { VideoCard } from "@/components/cards/video-card";
import { StoreLinks } from "@/components/game/store-links";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd, gameJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const games = await cms.getGames();
  return games.map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const game = await cms.getGameBySlug(slug);
  if (!game) return {};
  return {
    title: `${game.name} — news, release date, platforms`,
    description: game.summary,
    alternates: { canonical: `/games/${game.slug}` },
    openGraph: { images: [{ url: game.heroArtwork.src }] },
  };
}

export default async function GamePage({ params }: Props) {
  const { slug } = await params;
  const game = await cms.getGameBySlug(slug);
  if (!game) notFound();

  const [releaseDates, articles, allGames, companies, platforms, videos] = await Promise.all([
    cms.getReleaseDates(),
    cms.getArticles({ gameSlug: slug, limit: 30 }),
    cms.getGames(),
    cms.getCompanies(),
    cms.getPlatforms(),
    Promise.all(game.trailerSlugs.map((s) => cms.getVideoBySlug(s))),
  ]);

  const gameReleases = releaseDates
    .filter((rd) => rd.gameSlug === slug)
    .sort((a, b) => releaseSortKey(a) - releaseSortKey(b));
  const developer = companies.find((c) => c.slug === game.developerSlug);
  const publisher = companies.find((c) => c.slug === game.publisherSlug);
  const gamePlatforms = platforms.filter((p) => game.platformSlugs.includes(p.slug));
  const trailers = videos.filter((v) => v !== null);
  const reviews = articles.filter((a) => a.articleType === "review");
  const guides = articles.filter((a) => a.articleType === "guide");
  const news = articles.filter((a) => a.articleType !== "review" && a.articleType !== "guide");
  const similar = allGames
    .filter((g) => g.slug !== slug && g.genres.some((genre) => game.genres.includes(genre)))
    .slice(0, 5);

  return (
    <>
      <JsonLd data={gameJsonLd(game)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", href: "/" },
          { name: "Games", href: "/games" },
          { name: game.name, href: `/games/${game.slug}` },
        ])}
      />

      {/* Cinematic hero */}
      <section className="relative border-b border-edge">
        <div className="relative h-64 overflow-hidden sm:h-80 lg:h-96">
          <Image
            src={game.heroArtwork.src}
            alt={game.heroArtwork.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-transparent" />
        </div>
        <Container className="relative -mt-28 pb-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
            <div className="relative aspect-[3/4] w-36 shrink-0 overflow-hidden rounded-lg border border-edge shadow-2xl sm:w-44">
              <Image src={game.cover.src} alt={game.cover.alt} fill sizes="176px" className="object-cover" />
            </div>
            <div className="pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={game.releaseStatus === "released" ? "green" : "cyan"}>
                  {game.releaseStatus.replace(/-/g, " ")}
                </Badge>
                {game.franchise && <Badge tone="violet">{game.franchise} series</Badge>}
              </div>
              <h1 className="mt-2 font-display text-3xl font-bold text-fg sm:text-4xl">{game.name}</h1>
              <p className="mt-2 max-w-2xl text-fg-secondary">{game.summary}</p>
            </div>
          </div>
        </Container>
      </section>

      <Container className="grid gap-10 py-10 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-10">
          {/* About */}
          <section aria-label="About">
            <h2 className="mb-3 font-display text-xl font-bold text-fg">About</h2>
            <p className="leading-relaxed text-fg-secondary">{game.description}</p>
          </section>

          {/* Release dates */}
          {gameReleases.length > 0 && (
            <section aria-label="Release dates">
              <h2 className="mb-3 font-display text-xl font-bold text-fg">Release dates</h2>
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-edge text-left font-label text-xs uppercase tracking-wider text-fg-muted">
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Type</th>
                    <th className="py-2 pr-4">Platforms</th>
                    <th className="py-2 pr-4">Region</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {gameReleases.map((entry) => (
                    <tr key={entry.id} className="border-b border-edge/60">
                      <td className="py-2.5 pr-4 font-semibold text-cyan">{formatReleaseDate(entry)}</td>
                      <td className="py-2.5 pr-4 text-fg-secondary">{entry.kind.replace(/-/g, " ")}</td>
                      <td className="py-2.5 pr-4 text-fg-secondary">{entry.platformSlugs.join(", ")}</td>
                      <td className="py-2.5 pr-4 uppercase text-fg-muted">{entry.region}</td>
                      <td className="py-2.5">
                        <Badge tone={entry.confirmed ? "green" : "warning"}>
                          {entry.confirmed ? "Confirmed" : "Window"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {/* Trailer + screenshots */}
          {trailers.length > 0 && (
            <section aria-label="Trailers">
              <h2 className="mb-3 font-display text-xl font-bold text-fg">Trailers</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {trailers.map((video) => (
                  <VideoCard key={video.slug} video={video} />
                ))}
              </div>
            </section>
          )}

          {game.screenshots.length > 0 && (
            <section aria-label="Screenshots">
              <h2 className="mb-3 font-display text-xl font-bold text-fg">Screenshots</h2>
              <div className="grid grid-cols-2 gap-3">
                {game.screenshots.map((shot) => (
                  <Image
                    key={shot.src}
                    src={shot.src}
                    alt={shot.alt}
                    width={shot.width}
                    height={shot.height}
                    sizes="(min-width: 1024px) 33vw, 50vw"
                    className="rounded-lg border border-edge object-cover"
                  />
                ))}
              </div>
            </section>
          )}

          {/* Coverage */}
          {reviews.length > 0 && (
            <section aria-label="Reviews">
              <h2 className="mb-3 font-display text-xl font-bold text-fg">Our reviews</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {reviews.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            </section>
          )}
          {guides.length > 0 && (
            <section aria-label="Guides">
              <h2 className="mb-3 font-display text-xl font-bold text-fg">Guides</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {guides.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            </section>
          )}
          {news.length > 0 && (
            <section aria-label="Latest news">
              <h2 className="mb-3 font-display text-xl font-bold text-fg">Latest news</h2>
              <div className="rounded-lg border border-edge bg-surface px-4">
                {news.slice(0, 6).map((article) => (
                  <ArticleCard key={article.slug} article={article} variant="compact" />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Facts sidebar */}
        <aside aria-label="Game details" className="space-y-6">
          <div className="rounded-lg border border-edge bg-surface p-5">
            <h2 className="font-label text-sm font-bold uppercase tracking-widest text-fg-muted">Details</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <FactRow label="Developer" value={developer?.name ?? "—"} />
              <FactRow label="Publisher" value={publisher?.name ?? "—"} />
              <FactRow label="Genres" value={game.genres.join(", ")} />
              <FactRow label="Themes" value={game.themes.join(", ")} />
              <FactRow label="Modes" value={game.gameModes.join(", ")} />
              <FactRow label="Age ratings" value={game.ageRatings.join(", ")} />
              <div>
                <dt className="font-label text-xs uppercase tracking-wider text-fg-muted">Platforms</dt>
                <dd className="mt-1 flex flex-wrap gap-1.5">
                  {gamePlatforms.map((platform) => (
                    <Link key={platform.slug} href={`/platform/${platform.slug}`}>
                      <Badge tone="neutral">{platform.shortName}</Badge>
                    </Link>
                  ))}
                </dd>
              </div>
            </dl>
            {game.officialWebsite && (
              <a
                href={game.officialWebsite}
                rel="nofollow noopener"
                target="_blank"
                className="mt-4 block text-center text-sm font-semibold text-cyan underline underline-offset-4"
              >
                Official website ↗
              </a>
            )}
          </div>

          {game.storeLinks.length > 0 && <StoreLinks gameSlug={game.slug} links={game.storeLinks} />}

          {/* Watchlist placeholder — future phase */}
          <button
            type="button"
            disabled
            title="Watchlists arrive in a future release"
            className="w-full cursor-not-allowed rounded-lg border border-dashed border-edge p-3 font-label text-sm font-semibold uppercase tracking-wider text-fg-muted"
          >
            ☆ Follow (coming soon)
          </button>

          {similar.length > 0 && (
            <div>
              <h2 className="mb-3 font-label text-sm font-bold uppercase tracking-widest text-fg-muted">
                Similar games
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {similar.slice(0, 4).map((g) => (
                  <GameCard key={g.slug} game={g} />
                ))}
              </div>
            </div>
          )}
        </aside>
      </Container>
    </>
  );
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-label text-xs uppercase tracking-wider text-fg-muted">{label}</dt>
      <dd className="mt-0.5 text-fg-secondary">{value || "—"}</dd>
    </div>
  );
}

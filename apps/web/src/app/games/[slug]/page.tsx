import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getRawgGameBySlug, getSimilarGames, isRawgEnabled } from "@/lib/rawg";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/section";
import { GameCard } from "@/components/cards/game-card";
import { StoreLinks } from "@/components/game/store-links";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd, gameJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isRawgEnabled()) return {};
  const { slug } = await params;
  const game = await getRawgGameBySlug(slug);
  if (!game) return {};
  return {
    title: `${game.name} — release date, platforms, where to buy`,
    description: game.summary || `Real game data for ${game.name} via RAWG.`,
    alternates: { canonical: `/games/${game.slug}` },
    openGraph: { images: [{ url: game.heroArtwork.src }] },
  };
}

export default async function GamePage({ params }: Props) {
  if (!isRawgEnabled()) notFound();
  const { slug } = await params;
  const game = await getRawgGameBySlug(slug);
  if (!game) notFound();

  const similar = game.genreSlugs[0] ? await getSimilarGames(game.genreSlugs[0], game.slug, 4) : [];

  const releaseLabel = game.releaseDate
    ? new Date(game.releaseDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "TBA";

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

      {/* Hero */}
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
            <div className="relative aspect-[3/4] w-36 shrink-0 overflow-hidden border border-edge shadow-2xl sm:w-44">
              <Image src={game.cover.src} alt={game.cover.alt} fill sizes="176px" className="object-cover" />
            </div>
            <div className="pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={game.releaseStatus === "released" ? "green" : "cyan"}>
                  {game.releaseStatus.replace(/-/g, " ")}
                </Badge>
                {game.rating > 0 && <Badge tone="warning">★ {game.rating.toFixed(1)}/5</Badge>}
              </div>
              <h1 className="mt-2 font-display text-3xl font-bold text-fg sm:text-4xl">{game.name}</h1>
              {game.summary && <p className="mt-2 max-w-2xl text-fg-secondary">{game.summary}</p>}
            </div>
          </div>
        </Container>
      </section>

      <Container className="grid gap-10 py-10 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-10">
          {game.description && (
            <section aria-label="About">
              <h2 className="mb-3 font-display text-xl font-bold text-fg">About</h2>
              <p className="whitespace-pre-line leading-relaxed text-fg-secondary">{game.description}</p>
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
                    className="border border-edge object-cover"
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Facts sidebar */}
        <aside aria-label="Game details" className="space-y-6">
          <div className="gp-panel p-5">
            <h2 className="font-label text-sm font-bold uppercase tracking-widest text-fg-muted">Details</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <FactRow label="Release date" value={releaseLabel} />
              <FactRow label="Genres" value={game.genres.join(", ")} />
              <FactRow label="Platforms" value={game.platformNames.join(", ")} />
              {game.rating > 0 && <FactRow label="RAWG rating" value={`${game.rating.toFixed(1)} / 5`} />}
            </dl>
            {game.website && (
              <a
                href={game.website}
                rel="nofollow noopener"
                target="_blank"
                className="mt-4 block text-center text-sm font-semibold text-cyan underline underline-offset-4"
              >
                Official website ↗
              </a>
            )}
          </div>

          {game.storeLinks.length > 0 && <StoreLinks gameSlug={game.slug} links={game.storeLinks} />}

          {similar.length > 0 && (
            <div>
              <h2 className="mb-3 font-label text-sm font-bold uppercase tracking-widest text-fg-muted">
                Similar games
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {similar.map((g) => (
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

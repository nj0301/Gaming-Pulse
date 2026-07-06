import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cms } from "@/lib/cms";
import { ArticleListing, parsePage } from "@/components/article-listing";
import { Container } from "@/components/ui/section";
import { GameCard } from "@/components/cards/game-card";

export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  const platforms = await cms.getPlatforms();
  return platforms.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const platform = await cms.getPlatformBySlug(slug);
  if (!platform) return {};
  return {
    title: `${platform.name} news and games`,
    description: platform.description,
    alternates: { canonical: `/platform/${platform.slug}` },
  };
}

export default async function PlatformPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const platform = await cms.getPlatformBySlug(slug);
  if (!platform) notFound();
  const page = parsePage(await searchParams);

  const games = (await cms.getGames()).filter((g) => g.platformSlugs.includes(slug)).slice(0, 6);

  return (
    <>
      <ArticleListing
        title={platform.name}
        description={platform.description}
        query={{ platformSlug: slug }}
        basePath={`/platform/${slug}`}
        page={page}
      />
      {games.length > 0 && page === 1 && (
        <Container className="pb-14">
          <h2 className="mb-5 font-display text-xl font-bold text-fg">{platform.name} games we track</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {games.map((game) => (
              <GameCard key={game.slug} game={game} />
            ))}
          </div>
        </Container>
      )}
    </>
  );
}

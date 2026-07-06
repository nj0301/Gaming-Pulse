import type { Metadata } from "next";
import { cms } from "@/lib/cms";
import { Container, EmptyState } from "@/components/ui/section";
import { VideoCard } from "@/components/cards/video-card";
import { Reveal } from "@/components/motion/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { videoJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Trailers & videos",
  description: "New trailers, gameplay premieres and interviews.",
  alternates: { canonical: "/videos" },
};

export default async function VideosPage() {
  const videos = await cms.getVideos({ limit: 24 });

  return (
    <Container className="py-10">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold text-fg">Trailers &amp; videos</h1>
        <p className="mt-2 max-w-2xl text-fg-secondary">
          Demo build: posters only, no embedded third-party players.
        </p>
      </header>
      {videos.map((video) => (
        <JsonLd key={video.slug} data={videoJsonLd(video)} />
      ))}
      {videos.length === 0 ? (
        <EmptyState title="No videos yet" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video, index) => (
            <Reveal key={video.slug} delay={(index % 3) * 0.05}>
              <VideoCard video={video} />
            </Reveal>
          ))}
        </div>
      )}
    </Container>
  );
}

import { cms } from "@/lib/cms";
import { VideoCard } from "@/components/cards/video-card";
import { Container, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";

export async function VideosSection({ title, maxItems }: { title: string; maxItems: number }) {
  const videos = await cms.getVideos({ limit: maxItems });
  if (videos.length === 0) return null;

  return (
    <section aria-label={title}>
      <Container>
        <SectionHeading title={title} href="/videos" accent="magenta" />
        <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {videos.map((video, index) => (
            <Reveal key={video.slug} delay={(index % 4) * 0.05}>
              <VideoCard video={video} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

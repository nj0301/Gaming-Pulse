import Link from "next/link";
import { formatReleaseDate, isUpcoming, releaseSortKey } from "@gaming-pulse/core";
import { cms } from "@/lib/cms";
import { Badge } from "@/components/ui/badge";
import { Container, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";

/** Upcoming-release timeline: next N windows in chronological order. */
export async function ReleaseTimeline({ title, maxItems }: { title: string; maxItems: number }) {
  const [releaseDates, games, platforms] = await Promise.all([
    cms.getReleaseDates(),
    cms.getGames(),
    cms.getPlatforms(),
  ]);

  const gameBySlug = new Map(games.map((g) => [g.slug, g]));
  const platformBySlug = new Map(platforms.map((p) => [p.slug, p]));

  const upcoming = releaseDates
    .filter((rd) => isUpcoming(rd))
    .sort((a, b) => releaseSortKey(a) - releaseSortKey(b))
    .slice(0, maxItems);

  if (upcoming.length === 0) return null;

  return (
    <section aria-label={title}>
      <Container>
        <SectionHeading title={title} href="/upcoming-games" accent="cyan" />
        <ol className="relative space-y-0 border-l-2 border-edge pl-6">
          {upcoming.map((entry, index) => {
            const game = gameBySlug.get(entry.gameSlug);
            return (
              <Reveal key={entry.id} as="li" delay={index * 0.05} className="relative pb-6 last:pb-0">
                {/* Timeline node */}
                <span
                  aria-hidden
                  className={`absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 ${
                    entry.confirmed ? "border-cyan bg-cyan/40" : "border-warning bg-warning/30"
                  }`}
                />
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <time className="w-36 shrink-0 font-label text-sm font-bold uppercase tracking-wide text-cyan">
                    {formatReleaseDate(entry)}
                  </time>
                  <Link
                    href={game ? `/games/${game.slug}` : "/upcoming-games"}
                    className="font-display font-semibold text-fg transition-colors hover:text-cyan"
                  >
                    {game?.name ?? entry.gameSlug}
                  </Link>
                  {entry.kind !== "full" && <Badge tone="violet">{entry.kind.replace(/-/g, " ")}</Badge>}
                  {!entry.confirmed && <Badge tone="warning">window</Badge>}
                  <span className="text-xs text-fg-muted">
                    {entry.platformSlugs.map((s) => platformBySlug.get(s)?.shortName ?? s).join(" · ")}
                  </span>
                </div>
                {entry.note && <p className="mt-1 text-sm text-fg-muted">{entry.note}</p>}
              </Reveal>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}

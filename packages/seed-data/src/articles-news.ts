import type { SeedArticle } from "./types";

const heroImg = (slug: string, alt: string) => ({
  src: `/media/articles/${slug}.svg`,
  alt,
  width: 1600,
  height: 900,
  credit: "Demo placeholder art — Gaming Pulse",
});

/**
 * FICTIONAL DEMO ARTICLES — news, announcements, rumors, leaks and industry.
 * Every studio, person, quote, date and event is invented.
 */
export const newsArticles: SeedArticle[] = [
  {
    title: "Skybound Legends' 'Tempest' expansion lands October 6 with storm-chasing world events",
    slug: "skybound-legends-tempest-expansion-october",
    subtitle: "Horizonworks' biggest drop since launch adds the Stormcaller class, guild airship raids and a weather system that rewrites the world map weekly.",
    excerpt: "Horizonworks has dated Skybound Legends' Tempest expansion for October 6, 2026, headlined by the first new class since launch and dynamic storm events. (Fictional demo story.)",
    body: `**Demo notice: this is a fictional story about invented games and studios, created to demonstrate the Gaming Pulse platform.**

Horizonworks ended months of teasing today: **Tempest**, the third and largest expansion for its sky-island MMO *Skybound Legends*, arrives **October 6, 2026** on PC, PlayStation, Xbox and cloud.

## What Tempest adds

The headline feature is the **Stormcaller**, the game's first new class since launch. Stormcallers channel the expansion's roaming weather systems directly — the studio describes them as "a support class that turns the map itself into a cooldown."

Beyond the class, the expansion centers on **living storms**: server-wide weather fronts that migrate across the world map on a weekly cadence, tearing up established flight routes and exposing sunken islands that only surface in a storm's wake.

> "We wanted the map to stop being a solved problem. When a tempest front moves through your guild's territory, your Tuesday changes." — Rhea Calloway, game director (fictional)

Guilds also get **airship raids**, eight-to-twelve-player encounters fought from the deck of a guild-built vessel, with damage persisting between attempts until weekly reset.

## Pricing and access

Tempest ships in two editions. The base expansion is a paid upgrade; the deluxe adds a Stormcaller early-unlock and cosmetics. Horizonworks confirmed the level cap rises to 70 and that a free trial region opens for all players the same day.

## The bigger picture

Three years in, *Skybound Legends* has become the fictional studio's flagship, and Tempest reads like a confidence play: systems-first content designed to churn the meta rather than a one-and-done story drop. Our full hands-on preview is planned closer to launch.`,
    articleType: "official-announcement",
    factStatus: "confirmed",
    categorySlug: "news",
    platformSlugs: ["pc", "playstation", "xbox", "cloud-gaming"],
    relatedGameSlugs: ["skybound-legends"],
    tagSlugs: ["expansions", "live-service", "release-dates"],
    authorSlug: "dario-vance",
    reviewerSlug: "sam-kowalczyk",
    heroImage: heroImg("skybound-tempest", "Storm front rolling across floating islands — Tempest expansion key art (demo placeholder)"),
    videoSlugs: ["skybound-legends-tempest-announce"],
    publishedAt: "2026-07-04T14:05:00.000Z",
    updatedAtEditorial: "2026-07-04T16:40:00.000Z",
    isBreaking: true,
    isFeatured: true,
    isSponsored: false,
    sources: [
      { publisher: "Horizonworks (demo)", sourceUrl: "https://example.com/horizonworks/tempest-announce", sourceType: "official-blog", originalPublicationDate: "2026-07-04T13:30:00.000Z", accessedAt: "2026-07-04T13:45:00.000Z", authorityLevel: 5, officialSource: true, verifiedBy: "sam-kowalczyk", notes: "Official announcement post with date, editions and class details." },
      { publisher: "Tempest reveal stream (demo)", sourceUrl: "https://example.com/horizonworks/reveal-stream", sourceType: "video", originalPublicationDate: "2026-07-04T13:00:00.000Z", accessedAt: "2026-07-04T13:40:00.000Z", authorityLevel: 5, officialSource: true },
    ],
    keyPoints: [
      "Tempest launches October 6, 2026 on all current platforms including cloud.",
      "The Stormcaller is the first new class since launch.",
      "Weekly migrating storm fronts permanently reshape flight routes.",
      "Guild airship raids support 8–12 players with persistent boss damage.",
    ],
    confirmedFacts: [
      "Release date of October 6, 2026 confirmed in the official announcement.",
      "Level cap increase to 70 confirmed by the studio.",
      "Two editions confirmed, with class early-unlock in deluxe.",
    ],
    unconfirmedPoints: [
      "Pricing for individual regions has not been published yet.",
      "The studio declined to say whether airship raids will have a matchmaking queue.",
    ],
    correctionLog: [
      { date: "2026-07-04T16:40:00.000Z", note: "Clarified that the free trial region opens to all players, not only expansion owners." },
    ],
    seoTitle: "Skybound Legends Tempest expansion release date: October 6, 2026",
    seoDescription: "Tempest brings the Stormcaller class, guild airship raids and migrating storm world events to Skybound Legends on October 6, 2026. (Fictional demo.)",
    aiAssisted: false,
    humanReviewed: true,
    newsletterPlacement: "inline",
  },
  {
    title: "Petal & Blade locks in August 14 worldwide release across five platforms",
    slug: "petal-and-blade-august-release-date",
    subtitle: "Studio Lantern's hand-drawn metroidvania arrives day-and-date on PC, PlayStation, Xbox, Nintendo and handheld PCs.",
    excerpt: "After a quiet spring, Studio Lantern confirmed Petal & Blade ships August 14, 2026 everywhere at once — with a performance mode targeting 120 fps. (Fictional demo story.)",
    body: `**Demo notice: this is a fictional story about invented games and studios, created to demonstrate the Gaming Pulse platform.**

Studio Lantern has confirmed that *Petal & Blade* launches **August 14, 2026**, simultaneously on PC, PlayStation, Xbox, Nintendo hardware and verified handheld PCs.

## Why the date matters

The hand-drawn metroidvania was originally pencilled in for "summer 2026" and had gone quiet since its spring showcase appearance, prompting slip speculation. Today's release-date trailer answers that directly — and commits to a **no-staggered-launch** policy the studio says it fought for.

## Performance promises

The trailer's fine print is unusually specific for the genre:

| Platform | Target |
| --- | --- |
| PC / current-gen consoles | 120 fps performance mode |
| Nintendo hardware | 60 fps docked and portable |
| Handheld PCs | Verified, 40 fps battery preset |

Animation director Hana Seo (fictional) has previously described the game's frame-by-frame art as "the whole point," so the studio building performance modes around animation smoothness tracks with everything we've seen.

## What we're watching

Two things remain open: the exact preload window, and whether the post-launch story chapter — listed in a storefront database in a Q1 2027 window — gets acknowledged before launch. Studio Lantern declined to comment on post-launch plans.

Our review is planned for launch week, following the Gaming Pulse review policy: finished retail build, minimum 20 hours, no score on unfinished content.`,
    articleType: "news",
    factStatus: "confirmed",
    categorySlug: "news",
    platformSlugs: ["pc", "playstation", "xbox", "nintendo", "handheld"],
    relatedGameSlugs: ["petal-and-blade"],
    tagSlugs: ["release-dates", "metroidvania"],
    authorSlug: "dario-vance",
    reviewerSlug: "sam-kowalczyk",
    heroImage: heroImg("petal-blade-date", "Cherry-branch sword blooming over a painted landscape — Petal & Blade key art (demo placeholder)"),
    videoSlugs: ["petal-and-blade-release-date-trailer"],
    publishedAt: "2026-07-03T09:12:00.000Z",
    updatedAtEditorial: "2026-07-03T09:12:00.000Z",
    isBreaking: false,
    isFeatured: true,
    isSponsored: false,
    sources: [
      { publisher: "Studio Lantern (demo)", sourceUrl: "https://example.com/studio-lantern/release-date", sourceType: "press-release", originalPublicationDate: "2026-07-03T08:00:00.000Z", accessedAt: "2026-07-03T08:20:00.000Z", authorityLevel: 5, officialSource: true, verifiedBy: "sam-kowalczyk" },
      { publisher: "PlayPort storefront listing (demo)", sourceUrl: "https://example.com/store/petal-and-blade", sourceType: "store-listing", originalPublicationDate: "2026-07-03T08:05:00.000Z", accessedAt: "2026-07-03T08:25:00.000Z", authorityLevel: 4, officialSource: true, notes: "Q1 2027 DLC window appears here, not in the press release." },
    ],
    keyPoints: [
      "Petal & Blade launches August 14, 2026 on five platform families at once.",
      "120 fps performance mode on PC and current-gen consoles.",
      "A Q1 2027 story DLC window appears in storefront data but is unannounced.",
    ],
    confirmedFacts: [
      "August 14, 2026 worldwide date confirmed by press release and trailer.",
      "Handheld PC verification confirmed by the studio.",
    ],
    unconfirmedPoints: [
      "The Q1 2027 post-launch chapter is storefront data only; the studio declined to comment.",
    ],
    correctionLog: [],
    seoTitle: "Petal & Blade release date confirmed: August 14, 2026",
    seoDescription: "Studio Lantern's hand-drawn metroidvania Petal & Blade launches August 14, 2026 on PC, PlayStation, Xbox, Nintendo and handhelds. (Fictional demo.)",
    aiAssisted: false,
    humanReviewed: true,
    newsletterPlacement: "footer",
  },
  {
    title: "Report: Chrono Drift may slip to early 2027 as Redline Arcadia rebuilds its netcode",
    slug: "chrono-drift-delay-report",
    subtitle: "Two people familiar with development say the time-loop racer's multiplayer echoes don't survive real-world latency — yet.",
    excerpt: "Chrono Drift's Q4 2026 window is reportedly in doubt, with development sources pointing to multiplayer netcode as the blocker. Publisher and studio declined to comment. (Fictional demo story.)",
    body: `**Demo notice: this is a fictional story about invented games and studios, created to demonstrate the Gaming Pulse platform. It exists to show how Gaming Pulse visually separates reporting from confirmed news.**

*Chrono Drift*, Redline Arcadia's time-loop racer, may miss its Q4 2026 window, according to two people familiar with the project's development who spoke on condition of anonymity.

## What the sources say

Both sources point at the same system: **multiplayer echoes**. In single-player, the game records your previous laps and replays them as physical "echo" cars you must weave through. Online, every player brings up to seven echoes each — and reconciling dozens of recorded ghosts under real-world latency has reportedly produced what one source called "slideshow paradoxes" in internal playtests.

One source said an internal target of **February 2027** has been discussed; the second would only confirm that Q4 2026 is "not being planned around anymore."

## What the companies say

Neither fictional company engaged with the substance. Redline Arcadia declined to comment. Publisher Meridian Interactive pointed us to its last earnings statement, which lists *Chrono Drift* as "FY2026/27" — a window wide enough to cover both outcomes.

## Our read

This story is **reporting, not an announcement** — treat the February target as tentative. That said, the technical explanation is consistent with what the studio has shown publicly: every hands-on demo to date has been offline, and the one multiplayer trailer used same-couch splitscreen. We've asked both companies for comment and will update this story if they respond.`,
    articleType: "report",
    factStatus: "unconfirmed",
    categorySlug: "news",
    platformSlugs: ["pc", "playstation", "xbox"],
    relatedGameSlugs: ["chrono-drift"],
    tagSlugs: ["release-dates", "racing"],
    authorSlug: "maya-okafor",
    reviewerSlug: "sam-kowalczyk",
    heroImage: heroImg("chrono-drift-report", "Neon race car fragmenting into echoes — Chrono Drift report illustration (demo placeholder)"),
    publishedAt: "2026-07-02T17:30:00.000Z",
    updatedAtEditorial: "2026-07-02T17:30:00.000Z",
    isBreaking: false,
    isFeatured: false,
    isSponsored: false,
    sources: [
      { publisher: "Person familiar with development (demo)", sourceUrl: "https://example.com/sources/anonymous", sourceType: "news-report", originalPublicationDate: "2026-07-01T00:00:00.000Z", accessedAt: "2026-07-01T00:00:00.000Z", authorityLevel: 2, officialSource: false, notes: "Anonymous; identity known to the editor. Corroborated by a second source." },
      { publisher: "Meridian Interactive FY2026 earnings (demo)", sourceUrl: "https://example.com/meridian/earnings", sourceType: "financial-filing", originalPublicationDate: "2026-05-15T00:00:00.000Z", accessedAt: "2026-07-02T10:00:00.000Z", authorityLevel: 4, officialSource: true },
    ],
    keyPoints: [
      "Two development sources say Chrono Drift's Q4 2026 window is no longer the internal plan.",
      "Multiplayer echo netcode is reportedly the blocker.",
      "Neither the studio nor the publisher would comment.",
    ],
    confirmedFacts: [
      "Meridian's earnings materials list Chrono Drift under a broad FY2026/27 window.",
      "All public multiplayer showings to date have been local, not online.",
    ],
    unconfirmedPoints: [
      "The delay itself — no official statement exists.",
      "The reported February 2027 internal target.",
    ],
    correctionLog: [],
    seoTitle: "Report: Chrono Drift delay to early 2027 under discussion",
    seoDescription: "Sources say Chrono Drift's multiplayer echo netcode has put its Q4 2026 window in doubt. Unconfirmed reporting, clearly labeled. (Fictional demo.)",
    aiAssisted: false,
    humanReviewed: true,
    newsletterPlacement: "none",
  },
  {
    title: "Alleged Ashen Covenant footage leaks, showing adaptive fortress system in action",
    slug: "ashen-covenant-footage-leak",
    subtitle: "Ninety seconds of off-screen video appear to show the soulslike's covenant rebuilding a boss arena between player deaths.",
    excerpt: "Unverified off-screen footage claiming to show Ashen Covenant surfaced overnight. Blackspire Forge has not commented. Here's what the clip shows — and what we can't verify. (Fictional demo story.)",
    body: `**Demo notice: this is a fictional story about invented games and studios, created to demonstrate the Gaming Pulse platform. It exists to show how leak coverage is visually and editorially separated from confirmed news.**

A ninety-second clip claiming to show *Ashen Covenant* — Blackspire Forge's secretive dark-fantasy action RPG — circulated on social platforms overnight. **Gaming Pulse has not been able to verify the footage**, and the fictional studio did not respond to a request for comment before publication.

## What the clip appears to show

The off-screen recording shows a player dying to a spear-wielding boss, followed by a load screen — and then the same arena, rebuilt: new pillar placements, a raised gallery of archers, and the boss wielding the player's own dropped weapon.

If genuine, that matches the one concrete thing Blackspire has said publicly: that the covenant "grows stronger from your failures."

## Reasons for caution

- The footage is off-screen, low-light and never shows a HUD for more than a second.
- The build's UI font differs from the studio's official artwork.
- The account that first posted it was created two weeks ago and has posted nothing else.

Leaked pre-release footage — even when real — typically shows unfinished work without context. We're publishing because the clip is already widely circulating and readers deserve a sourced assessment rather than silence.

## What's actually confirmed

Very little. *Ashen Covenant* has a 2027 target per the publisher's earnings materials, no rating, and no announced platforms beyond PC and current-gen consoles. We will update this story if the studio comments or the clip is authenticated either way.`,
    articleType: "leak",
    factStatus: "rumor",
    categorySlug: "news",
    platformSlugs: ["pc", "playstation", "xbox"],
    relatedGameSlugs: ["ashen-covenant"],
    tagSlugs: ["soulslike"],
    authorSlug: "dario-vance",
    reviewerSlug: "sam-kowalczyk",
    heroImage: heroImg("ashen-leak", "Shadowed fortress silhouette with warning chevrons — leak coverage illustration (demo placeholder)"),
    publishedAt: "2026-07-01T07:45:00.000Z",
    updatedAtEditorial: "2026-07-01T11:20:00.000Z",
    isBreaking: false,
    isFeatured: false,
    isSponsored: false,
    sources: [
      { publisher: "Social clip (demo)", sourceUrl: "https://example.com/social/ashen-clip", sourceType: "social-post", originalPublicationDate: "2026-07-01T02:10:00.000Z", accessedAt: "2026-07-01T06:00:00.000Z", authorityLevel: 1, officialSource: false, notes: "Unverified origin. Archived copy retained by editorial." },
      { publisher: "Meridian Interactive FY2026 earnings (demo)", sourceUrl: "https://example.com/meridian/earnings", sourceType: "financial-filing", originalPublicationDate: "2026-05-15T00:00:00.000Z", accessedAt: "2026-07-01T06:30:00.000Z", authorityLevel: 4, officialSource: true },
    ],
    keyPoints: [
      "An unverified 90-second clip claims to show Ashen Covenant's adaptive fortress system.",
      "The studio has not commented; the clip's origin cannot be authenticated.",
      "The only confirmed facts remain the 2027 target and announced platforms.",
    ],
    confirmedFacts: [
      "Ashen Covenant is targeted for 2027 per publisher earnings materials.",
    ],
    unconfirmedPoints: [
      "Authenticity of the leaked footage.",
      "The adaptive arena mechanic as depicted.",
      "Any release timing beyond the 2027 target.",
    ],
    correctionLog: [
      { date: "2026-07-01T11:20:00.000Z", note: "Added detail about the posting account's history after reader questions." },
    ],
    seoTitle: "Ashen Covenant leak: alleged footage shows adaptive fortresses",
    seoDescription: "Unverified footage claiming to show Ashen Covenant's covenant system leaked overnight. What the clip shows and what remains unconfirmed. (Fictional demo.)",
    aiAssisted: false,
    humanReviewed: true,
    newsletterPlacement: "none",
  },
  {
    title: "Meridian Interactive acquires VR studio Deepcurrent ahead of Silent Meridian launch",
    slug: "meridian-acquires-deepcurrent",
    subtitle: "The fictional publisher's fourth acquisition in two years signals a bet that narrative VR is about to stop being niche.",
    excerpt: "Meridian Interactive is acquiring Deepcurrent Studios for an undisclosed sum, keeping the Silent Meridian team intact and independent 'in all creative matters.' (Fictional demo story.)",
    body: `**Demo notice: this is a fictional story about invented companies, created to demonstrate the Gaming Pulse platform.**

Meridian Interactive announced this morning it has agreed to acquire **Deepcurrent Studios**, the Australian VR developer behind the upcoming narrative thriller *Silent Meridian*. Terms were not disclosed.

## The deal

Deepcurrent's roughly 60-person team stays in Melbourne, and studio director Ione Faletau (fictional) retains what the announcement calls independence "in all creative matters." *Silent Meridian*'s November 2026 window is unchanged.

This is Meridian's **fourth acquisition in two years**, following a pattern: mid-sized teams with one distinctive shipping or near-shipping title, bought before their breakout rather than after.

## Why VR, why now

Publisher CEO Anders Vale (fictional) framed the deal bluntly in the announcement: "Headset installed base finally justifies premium narrative budgets."

That's a real shift in posture. Publishers have historically treated VR as a port target, not a first-budget platform. A publisher buying a VR-first studio *before* its flagship ships is a leading indicator — the kind of structural story our Insights desk tracks across the (fictional) industry.

## What to watch

- Whether *Silent Meridian* stays VR-first or gains a flatscreen mode under publisher pressure. The studio has previously called the microphone-driven design "inseparable from the headset."
- Retention: Meridian's three previous acquisitions have kept their leadership through at least one shipped title.
- The November date. Acquisitions closing months before launch historically cut both ways.

We've asked both companies about flatscreen plans and will update with any response.`,
    articleType: "news",
    factStatus: "confirmed",
    categorySlug: "industry",
    platformSlugs: ["vr", "pc"],
    relatedGameSlugs: ["silent-meridian"],
    tagSlugs: ["acquisitions"],
    authorSlug: "maya-okafor",
    reviewerSlug: "sam-kowalczyk",
    heroImage: heroImg("meridian-deepcurrent", "Two corporate marks joining over a sonar ring — acquisition illustration (demo placeholder)"),
    publishedAt: "2026-06-30T08:00:00.000Z",
    updatedAtEditorial: "2026-06-30T08:00:00.000Z",
    isBreaking: false,
    isFeatured: false,
    isSponsored: false,
    sources: [
      { publisher: "Meridian Interactive (demo)", sourceUrl: "https://example.com/meridian/deepcurrent-acquisition", sourceType: "press-release", originalPublicationDate: "2026-06-30T07:00:00.000Z", accessedAt: "2026-06-30T07:10:00.000Z", authorityLevel: 5, officialSource: true, verifiedBy: "sam-kowalczyk" },
      { publisher: "Deepcurrent Studios (demo)", sourceUrl: "https://example.com/deepcurrent/joining-meridian", sourceType: "official-blog", originalPublicationDate: "2026-06-30T07:05:00.000Z", accessedAt: "2026-06-30T07:15:00.000Z", authorityLevel: 5, officialSource: true },
    ],
    keyPoints: [
      "Meridian Interactive is acquiring Deepcurrent Studios; terms undisclosed.",
      "The Melbourne team and leadership remain in place.",
      "Silent Meridian's November 2026 window is unchanged.",
    ],
    confirmedFacts: [
      "The acquisition agreement, per both companies' announcements.",
      "Creative independence commitment as stated in the press release.",
    ],
    unconfirmedPoints: [
      "Deal value.",
      "Whether a flatscreen mode is under consideration.",
    ],
    correctionLog: [],
    seoTitle: "Meridian Interactive acquires Deepcurrent Studios",
    seoDescription: "The fictional publisher buys the VR studio behind Silent Meridian, its fourth acquisition in two years. What it means for narrative VR. (Fictional demo.)",
    aiAssisted: false,
    humanReviewed: true,
    newsletterPlacement: "footer",
  },
  {
    title: "Circuit Breakers 2 closed beta dated December 10 — full esports program to follow in 2027",
    slug: "circuit-breakers-2-beta-december",
    subtitle: "Voltcore commits to rollback netcode, a broadcast-director mode and remakes of every original map.",
    excerpt: "Circuit Breakers 2's closed beta begins December 10, 2026, with Voltcore promising 128-tick servers and a spectator-first broadcast toolkit for its esports return. (Fictional demo story.)",
    body: `**Demo notice: this is a fictional story about invented games and studios, created to demonstrate the Gaming Pulse platform.**

Voltcore Games has dated the *Circuit Breakers 2* closed beta for **December 10, 2026** — PC only, sign-ups open now — and sketched the competitive roadmap that will carry the arena-shooter sequel into a planned Q2 2027 launch.

## The competitive pitch

The original *Circuit Breakers* sustained a stubborn, mid-sized esports scene for eight years, more community-run than publisher-run. The sequel's pitch is infrastructure:

- **128-tick servers** with rollback netcode across all queues, casual included.
- A built-in **broadcast director**: automated camera AI, observer scripting and clean feeds designed for third-party tournament organizers, not just Voltcore's own events.
- **Every original map returns**, remade — with the classic layouts preserved in a "legacy geometry" mode for the first competitive season.

## Open questions

Voltcore hasn't announced whether the 2027 competitive program is open-circuit or franchised, a decision that shaped (and occasionally strangled) other fictional esports in this demo universe. Team sign-ups, prize structure and console plans are all listed as "2027 conversations."

The beta client goes out in waves starting December 10, with a public stress-test weekend "before the holidays" if the first wave holds up.`,
    articleType: "news",
    factStatus: "confirmed",
    categorySlug: "esports",
    platformSlugs: ["pc"],
    relatedGameSlugs: ["circuit-breakers-2"],
    tagSlugs: ["early-access", "release-dates"],
    authorSlug: "theo-marchetti",
    reviewerSlug: "sam-kowalczyk",
    heroImage: heroImg("circuit-breakers-beta", "Arena shooter arena with broadcast camera frames — Circuit Breakers 2 illustration (demo placeholder)"),
    publishedAt: "2026-06-28T15:00:00.000Z",
    updatedAtEditorial: "2026-06-28T15:00:00.000Z",
    isBreaking: false,
    isFeatured: false,
    isSponsored: false,
    sources: [
      { publisher: "Voltcore Games (demo)", sourceUrl: "https://example.com/voltcore/cb2-beta", sourceType: "official-blog", originalPublicationDate: "2026-06-28T14:00:00.000Z", accessedAt: "2026-06-28T14:10:00.000Z", authorityLevel: 5, officialSource: true, verifiedBy: "sam-kowalczyk" },
    ],
    keyPoints: [
      "Closed beta begins December 10, 2026 on PC.",
      "Rollback netcode and 128-tick servers across all queues.",
      "All original maps return, with a legacy-geometry competitive mode.",
    ],
    confirmedFacts: [
      "Beta date and PC platform confirmed by Voltcore's post.",
      "Q2 2027 full-launch target restated.",
    ],
    unconfirmedPoints: [
      "Whether the 2027 esports circuit is open or franchised.",
      "Console versions.",
    ],
    correctionLog: [],
    seoTitle: "Circuit Breakers 2 closed beta starts December 10, 2026",
    seoDescription: "Voltcore dates the Circuit Breakers 2 beta and details rollback netcode, broadcast tools and returning maps. (Fictional demo.)",
    aiAssisted: false,
    humanReviewed: true,
    newsletterPlacement: "none",
  },
  {
    title: "Starfall: Vanguard Season 3 'Riptide' brings underwater extraction on August 20",
    slug: "starfall-vanguard-season-3-riptide",
    subtitle: "Nova Forge's biggest seasonal drop yet sinks half the map — deliberately.",
    excerpt: "Season 3 of Starfall: Vanguard floods the Cerule lowlands, adds submersible extraction routes and reworks armor economy. Live August 20. (Fictional demo story.)",
    body: `**Demo notice: this is a fictional story about invented games and studios, created to demonstrate the Gaming Pulse platform.**

Nova Forge Studios has detailed **Season 3: Riptide** for its extraction shooter *Starfall: Vanguard*, arriving **August 20, 2026** as a free update.

## The map is drowning — on purpose

Riptide's centerpiece is a permanent world change: the ringworld's lowland districts flood over the season's first two weeks, in stages, live on every shard. Salvage that was cheap surface loot becomes contested underwater treasure, and two new **submersible extraction routes** replace the lowland's flight paths.

Nova Forge calls it "the first season that takes something away." Players who banked lowland outpost investments get a compensation package; the studio insists the flooding is permanent and will not roll back at season's end.

## Systems changes

The armor economy gets its long-requested rework: plate durability now degrades between raids unless maintained, pushing crafting materials toward mid-tier players and away from the hoarding meta. The battle pass drops its daily-mission slot entirely — progress now comes only from extraction value and event participation.

## Our take

Extraction shooters live and die on whether the map stays scary. Sinking a third of it is the boldest move this fictional genre entry has made since launch, and the compensation plan suggests Nova Forge learned from Season 1's outpost-wipe backlash (see our correction log from that coverage). We'll have hands-on impressions when the test server opens next week.`,
    articleType: "news",
    factStatus: "confirmed",
    categorySlug: "news",
    platformSlugs: ["pc", "playstation", "xbox"],
    relatedGameSlugs: ["starfall-vanguard"],
    tagSlugs: ["live-service", "extraction-shooters"],
    authorSlug: "dario-vance",
    heroImage: heroImg("starfall-riptide", "Flooded sci-fi cityscape with extraction submarine — Riptide season art (demo placeholder)"),
    videoSlugs: ["starfall-vanguard-season-2-trailer"],
    publishedAt: "2026-06-25T12:00:00.000Z",
    updatedAtEditorial: "2026-06-25T12:00:00.000Z",
    isBreaking: false,
    isFeatured: false,
    isSponsored: false,
    sources: [
      { publisher: "Nova Forge Studios (demo)", sourceUrl: "https://example.com/novaforge/riptide", sourceType: "official-blog", originalPublicationDate: "2026-06-25T10:00:00.000Z", accessedAt: "2026-06-25T10:30:00.000Z", authorityLevel: 5, officialSource: true },
    ],
    keyPoints: [
      "Season 3 'Riptide' launches August 20, 2026 as a free update.",
      "Lowland districts flood permanently across a two-week live event.",
      "Armor durability rework targets the hoarding meta.",
    ],
    confirmedFacts: [
      "August 20 date and permanence of the flood, per the studio's post.",
    ],
    unconfirmedPoints: [
      "Exact compensation values for lowland outpost owners.",
    ],
    correctionLog: [],
    seoTitle: "Starfall: Vanguard Season 3 Riptide launches August 20",
    seoDescription: "Riptide permanently floods Starfall: Vanguard's lowlands, adds submersible extraction and reworks armor durability. (Fictional demo.)",
    aiAssisted: false,
    humanReviewed: true,
    newsletterPlacement: "none",
  },
];

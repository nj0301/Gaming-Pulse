import type { SeedArticle } from "./types";

const heroImg = (slug: string, alt: string) => ({
  src: `/media/articles/${slug}.svg`,
  alt,
  width: 1600,
  height: 900,
  credit: "Demo placeholder art — Gaming Pulse",
});

/**
 * FICTIONAL DEMO ARTICLES — reviews, guides, opinion, analysis, interviews,
 * features and a sponsored example. Every fact, score and quote is invented.
 */
export const featureArticles: SeedArticle[] = [
  {
    title: "Neon Havoc review: pocket-sized chaos that respects your thumb and your time",
    slug: "neon-havoc-review",
    subtitle: "Pocket Thunder proves a character-action game can live on one thumb — with a demo score to match.",
    excerpt: "Neon Havoc compresses a full combo system into a single thumb without losing depth. Our review — 20 hours, retail build, no energy timers in sight. (Fictional demo review; score is illustrative.)",
    body: `**Demo notice: this is a fictional review of an invented game, with an illustrative score, created to demonstrate the Gaming Pulse platform.**

Five minutes. That's a full run of *Neon Havoc*, and it's the most honest design decision in mobile gaming this year — a roguelite that assumes you're on a bus, not chained to a gacha calendar.

## One thumb, full kit

The entire combat system lives under your right thumb: tap to strike, hold to charge, drag for directional specials, release timing for cancels. On paper that sounds like a compromise. In practice, by hour five I was executing cancel chains I'd struggle to do on a controller, because the input surface never asks you to move your hand.

Enemy design carries the depth. Each of the six districts introduces one enemy that specifically punishes the technique you leaned on in the previous one. It's a quietly brilliant anti-crutch curriculum.

## The roguelite frame

Runs feed a district-unlock meta that is refreshingly finite — there is an *end*, roughly eighteen hours in, after which the game hands you an endless ladder and gets out of your way. Boosts are earned, never sold. The only purchase in the game is the game.

## Where it stumbles

Boss variety thins in the back half; two of the final three bosses are remixes. And the soundtrack's four battle tracks, great as they are, will be worn through long before the credits.

## Verdict

*Neon Havoc* is the rare mobile action game that treats the platform as a design constraint to be solved rather than a monetization surface to be farmed. It's the best five minutes you can buy on a phone right now.`,
    articleType: "review",
    factStatus: "opinion",
    categorySlug: "reviews",
    platformSlugs: ["mobile"],
    relatedGameSlugs: ["neon-havoc"],
    tagSlugs: ["roguelite"],
    authorSlug: "lin-zhao",
    reviewerSlug: "maya-okafor",
    heroImage: heroImg("neon-havoc-review", "Neon brawler mid-combo on a phone screen — review illustration (demo placeholder)"),
    gallery: [
      { src: "/media/games/neon-havoc-shot-1.svg", alt: "Neon Havoc district combat (demo placeholder)", width: 1280, height: 720, caption: "District three's parry-bait enemies force technique switches.", credit: "Demo placeholder art" },
      { src: "/media/games/neon-havoc-shot-2.svg", alt: "Neon Havoc boss arena (demo placeholder)", width: 1280, height: 720, caption: "Boss arenas rotate around a fixed thumb-reach radius.", credit: "Demo placeholder art" },
    ],
    publishedAt: "2026-06-27T13:00:00.000Z",
    updatedAtEditorial: "2026-06-27T13:00:00.000Z",
    isBreaking: false,
    isFeatured: true,
    isSponsored: false,
    sources: [
      { publisher: "Gaming Pulse hands-on (demo)", sourceUrl: "https://example.com/gaming-pulse/review-policy", sourceType: "news-report", originalPublicationDate: "2026-06-27T00:00:00.000Z", accessedAt: "2026-06-27T00:00:00.000Z", authorityLevel: 5, officialSource: false, notes: "20 hours on retail build, reviewer-purchased copy per policy." },
    ],
    keyPoints: [
      "Full combo depth under a single thumb — no controller envy.",
      "Finite meta-progression with a real ending, then an optional endless ladder.",
      "Premium price, zero microtransactions.",
      "Boss variety thins late; score reflects it.",
    ],
    confirmedFacts: ["Review conducted on retail build over 20 hours; copy purchased by Gaming Pulse (demo policy)."],
    unconfirmedPoints: [],
    correctionLog: [],
    review: {
      score: 8.5,
      scoreMax: 10,
      verdict: "A one-thumb action masterclass that treats mobile as a canvas, not a cash register.",
      pros: ["Deep, genuinely novel one-thumb combat", "Runs sized for real life", "No monetization beyond the purchase price"],
      cons: ["Late-game boss remixes", "Thin battle soundtrack"],
      reviewedOnPlatform: "Mobile (demo hardware)",
      copyProvidedBy: "Purchased by Gaming Pulse (demo)",
    },
    seoTitle: "Neon Havoc review — one-thumb action done right (8.5/10)",
    seoDescription: "Our Neon Havoc review: a premium mobile roguelite brawler with real combat depth and no energy timers. Fictional demo review with illustrative score.",
    aiAssisted: false,
    humanReviewed: true,
    newsletterPlacement: "footer",
  },
  {
    title: "Starfall: Vanguard review — six months in, the ringworld finally earns its orbit",
    slug: "starfall-vanguard-review",
    subtitle: "A rocky launch, two seasons of correction, and now one of the most interesting persistent maps in the genre.",
    excerpt: "We re-reviewed Starfall: Vanguard after Season 2 reshaped its economy. The verdict: a 7.8 that was a 6 at launch. (Fictional demo review; score is illustrative.)",
    body: `**Demo notice: this is a fictional review of an invented game, with an illustrative score, created to demonstrate the Gaming Pulse platform.**

Reviewing a live-service game at launch is like reviewing a city from its groundbreaking ceremony. Six months and two seasons after *Starfall: Vanguard* arrived, we returned for the full re-review our launch coverage promised.

## What launch got wrong

March's launch build had a hoarding problem: extraction value funneled into private stockpiles, the map never changed, and week-four raids felt identical to week-one raids. Our launch-week coverage scored the foundation, not the promise — and the foundation was a 6.

## What six months fixed

Season 1's outpost investment system gave salvage somewhere to *go*. Season 2's "Undertow" gave the map a reason to *change* — underwater biomes that open and close on orbital-collapse timers, so every shard's map diverges from every other's.

The result is the thing extraction shooters chase and rarely catch: **war stories that are actually yours**, because your shard's map is genuinely different from your friend's.

## What still drags

Solo queue remains an afterthought; matchmade squads with voice off are a coin-flip. And console performance in the new underwater zones dips hard enough that we'd call PC the definitive platform until the promised patch lands.

## Verdict

*Starfall: Vanguard* is the rare live-service comeback that came back by adding *consequence* rather than content. If Riptide's flood delivers on its promise, this score has room to climb again.`,
    articleType: "review",
    factStatus: "opinion",
    categorySlug: "reviews",
    platformSlugs: ["pc", "playstation", "xbox"],
    relatedGameSlugs: ["starfall-vanguard"],
    tagSlugs: ["extraction-shooters", "live-service"],
    authorSlug: "lin-zhao",
    reviewerSlug: "maya-okafor",
    heroImage: heroImg("starfall-review", "Extraction squad silhouetted against a shattering ringworld — review illustration (demo placeholder)"),
    publishedAt: "2026-06-20T10:00:00.000Z",
    updatedAtEditorial: "2026-06-22T09:15:00.000Z",
    isBreaking: false,
    isFeatured: false,
    isSponsored: false,
    sources: [
      { publisher: "Gaming Pulse hands-on (demo)", sourceUrl: "https://example.com/gaming-pulse/review-policy", sourceType: "news-report", originalPublicationDate: "2026-06-20T00:00:00.000Z", accessedAt: "2026-06-20T00:00:00.000Z", authorityLevel: 5, officialSource: false, notes: "60 hours across launch and re-review periods; publisher-provided access disclosed." },
    ],
    keyPoints: [
      "Re-review after Season 2, upgrading our launch assessment.",
      "Shard-divergent maps finally deliver unique war stories.",
      "Solo queue and console underwater performance remain weak.",
    ],
    confirmedFacts: ["Re-review based on 60 cumulative hours; access provided by the fictional publisher and disclosed per policy."],
    unconfirmedPoints: [],
    correctionLog: [
      { date: "2026-06-22T09:15:00.000Z", note: "Corrected the Season 1 outpost compensation figure; an earlier version overstated it." },
    ],
    review: {
      score: 7.8,
      scoreMax: 10,
      verdict: "A live-service comeback built on consequence, not content volume.",
      pros: ["Persistent, shard-divergent map", "Outpost economy gives extraction purpose", "Excellent squad audio design"],
      cons: ["Solo queue neglected", "Console performance dips underwater"],
      reviewedOnPlatform: "PC (demo hardware)",
      copyProvidedBy: "Publisher-provided access (demo, disclosed)",
    },
    seoTitle: "Starfall: Vanguard re-review — 7.8/10 six months after launch",
    seoDescription: "Our Starfall: Vanguard re-review after Season 2: shard-divergent maps and a real economy lift it from a 6 to a 7.8. Fictional demo review.",
    aiAssisted: false,
    humanReviewed: true,
    newsletterPlacement: "none",
  },
  {
    title: "Ironroot Tactics beginner's guide: five opening principles that win campaigns",
    slug: "ironroot-tactics-beginners-guide",
    subtitle: "Stop producing units. Start farming the battlefield. A guide from 80 hours of early access.",
    excerpt: "Ironroot Tactics replaces unit production with battlefield cultivation, and the habits that win other tactics games will lose you this one. Five principles from 80 hours in. (Fictional demo guide.)",
    body: `**Demo notice: this is a fictional guide for an invented game, created to demonstrate the Gaming Pulse platform.**

*Ironroot Tactics* looks like a familiar turn-based grid game and punishes you for believing it. Its armies aren't built in a barracks — they're **grown from the tiles you fight on**. These five principles, learned across 80 early-access hours, will carry you through the first two campaign acts.

## 1. Terrain is your production queue

Every seeded tile grows something determined by terrain, weather and turn count. Marsh grows slow, tanky bogwood; scree grows fast, brittle thornlings. The opening question isn't "what do I build?" — it's "what does this map *want* to grow?"

## 2. Never seed your whole hand on turn one

New players carpet-seed the back line and get a same-age army that peaks — and rots — together. Stagger your seeding across the first four turns so your growth curve overlaps the enemy's assault waves.

## 3. Weather forecasts are win conditions

The three-turn forecast in the top corner is the most important UI element in the game. Rain doubles marsh growth. Wind spreads seed-scatter one extra tile. Plan two fights ahead, not one.

## 4. Let some units die on purpose

Fallen units compost their tile, upgrading whatever grows there next. Feeding a doomed thornling to a bogwood tile is often the correct trade — the guide-writer's version of a gambit accepted.

## 5. The enemy cultivates too

Act 2 opponents seed *your* territory. Burning their saplings early costs an action but denies a compounding asset. Treat enemy seeds like ticking siege engines.

Master these five and the campaign's fabled Act 3 difficulty spike becomes a hill, not a wall. Our full economy deep-dive follows when 1.0 gets a date.`,
    articleType: "guide",
    factStatus: "confirmed",
    categorySlug: "guides",
    platformSlugs: ["pc", "handheld"],
    relatedGameSlugs: ["ironroot-tactics"],
    tagSlugs: ["turn-based-strategy", "early-access"],
    authorSlug: "theo-marchetti",
    heroImage: heroImg("ironroot-guide", "Tactics grid with glowing seeded tiles — guide illustration (demo placeholder)"),
    publishedAt: "2026-06-24T11:00:00.000Z",
    updatedAtEditorial: "2026-06-24T11:00:00.000Z",
    isBreaking: false,
    isFeatured: false,
    isSponsored: false,
    sources: [
      { publisher: "Gaming Pulse hands-on (demo)", sourceUrl: "https://example.com/gaming-pulse/guides-policy", sourceType: "news-report", originalPublicationDate: "2026-06-24T00:00:00.000Z", accessedAt: "2026-06-24T00:00:00.000Z", authorityLevel: 5, officialSource: false, notes: "80 hours on early-access build 0.9.4." },
    ],
    keyPoints: [
      "Read the map before seeding — terrain determines your army.",
      "Stagger growth curves across turns one through four.",
      "Use the weather forecast as a planning horizon.",
      "Composting doomed units is often correct.",
    ],
    confirmedFacts: ["Guide verified against early-access build 0.9.4; mechanics may change before 1.0."],
    unconfirmedPoints: [],
    correctionLog: [],
    seoTitle: "Ironroot Tactics beginner's guide: 5 opening principles",
    seoDescription: "Win Ironroot Tactics campaigns by farming the battlefield: five opening principles from 80 hours of early access. Fictional demo guide.",
    aiAssisted: false,
    humanReviewed: true,
    newsletterPlacement: "inline",
  },
  {
    title: "Opinion: handheld PCs are quietly becoming the default way to play",
    slug: "opinion-handheld-pcs-default",
    subtitle: "The couch beat the desk. Now the pocket is beating the couch.",
    excerpt: "Verified handheld presets are showing up in launch-day patch notes before ultrawide fixes do. That ordering tells you where gaming's center of gravity has moved. (Fictional demo opinion.)",
    body: `**Demo notice: this is a fictional opinion column referencing invented games and demo statistics, created to demonstrate the Gaming Pulse platform. It also demonstrates how opinion is visually separated from reporting.**

*Petal & Blade*'s release-date trailer this week carried a detail that would have been unthinkable three years ago: a **battery preset** in the launch-day feature list, sitting above the ultrawide support line.

That ordering is not an accident. It's a tell.

## The quiet flip

In this demo universe's numbers, verified-handheld launches went from a courtesy to a checkbox to a *requirement* inside twenty-four months. Studio Lantern building a 40 fps battery preset isn't fan service — it's an acknowledgment that a plurality of its wishlist lives on a device with a fan and a headphone jack.

The desk never lost on power. It lost on **posture**. Games compete with everything else that happens on a couch, a train, a lunch break, and the handheld PC is the first form factor that brings the whole PC library to where the time actually is.

## What publishers should take from it

Stop treating handheld verification as a port target and start treating it as a design review. Text size, input latency tolerance, session length between save points — these are now first-audience questions. The fictional studios in our coverage that get this (Quiet Anvil's monthly handheld-tuning notes for *Ironroot Tactics*) are building loyalty the spec-sheet chasers can't buy.

## Where I might be wrong

Battery chemistry could stall. A console maker could undercut the category. And opinion columns that declare a "default" have a short shelf life by design — that's why this piece is labeled the way it is. But watch the patch notes. The pocket is winning.`,
    articleType: "opinion",
    factStatus: "opinion",
    categorySlug: "insights",
    platformSlugs: ["handheld", "pc"],
    relatedGameSlugs: ["petal-and-blade", "ironroot-tactics"],
    tagSlugs: ["handheld-pcs"],
    authorSlug: "priya-raman",
    heroImage: heroImg("handheld-opinion", "Handheld PC glowing in a commuter's hands — opinion illustration (demo placeholder)"),
    publishedAt: "2026-07-04T08:00:00.000Z",
    updatedAtEditorial: "2026-07-04T08:00:00.000Z",
    isBreaking: false,
    isFeatured: false,
    isSponsored: false,
    sources: [
      { publisher: "Studio Lantern release-date trailer (demo)", sourceUrl: "https://example.com/studio-lantern/release-date", sourceType: "press-release", originalPublicationDate: "2026-07-03T08:00:00.000Z", accessedAt: "2026-07-03T09:00:00.000Z", authorityLevel: 5, officialSource: true },
    ],
    keyPoints: [
      "Opinion: handheld presets now outrank ultrawide fixes in launch notes.",
      "The form factor won on posture, not power.",
      "Handheld verification should be a design review, not a port pass.",
    ],
    confirmedFacts: [],
    unconfirmedPoints: ["This is an opinion column; its claims are argument, not reporting."],
    correctionLog: [],
    seoTitle: "Opinion: handheld PCs are becoming the default way to play",
    seoDescription: "Battery presets above ultrawide fixes in launch notes — the small tell that gaming's center of gravity moved to handhelds. Fictional demo opinion column.",
    aiAssisted: false,
    humanReviewed: true,
    newsletterPlacement: "footer",
  },
  {
    title: "The extraction shooter's second wind: why 2026's persistence experiments are working",
    slug: "extraction-shooters-second-wind-analysis",
    subtitle: "Three fictional case studies in giving players something to lose.",
    excerpt: "After the genre's 2024 crash in this demo universe, a new wave of extraction shooters is growing by adding consequence instead of content. An analysis of what changed. (Fictional demo analysis.)",
    body: `**Demo notice: this is a fictional analysis referencing invented games, studios and market data, created to demonstrate the Gaming Pulse platform.**

Two years ago in this demo universe, the extraction genre was a cautionary tale — a dozen launches chasing the same loop, all bleeding players by month three. In 2026, the survivors are growing again. The difference isn't content cadence. It's **consequence architecture**.

## The three experiments

**Persistent maps** (*Starfall: Vanguard*): shard-level world state that diverges per community. Retention in our demo dataset inflects exactly where Season 1's outpost system landed — when extraction value gained a destination, sessions gained a reason.

**Permanent loss events** (Riptide's flood, announced last week): the first major title in the genre to *remove* map space rather than add it. Pre-registration for the season spiked in the days after the announcement — scarcity reads as stakes.

**Finite seasons with endings** (several smaller fictional titles): seasons that conclude with a resolved narrative state rather than a reset. Counter-intuitively, giving players a clean exit point correlates with *higher* return rates the following season.

## The common thread

All three experiments trade content volume for **irreversibility**. The 2024 crash generation shipped more maps, more guns, more events — all reversible, all disposable. The 2026 generation ships fewer things that *stay changed*.

There's a design lesson here that extends past the genre: players don't bond with content, they bond with consequences they witnessed. The studios in our (fictional) coverage that internalized this are building worlds with memory — and audiences with reasons to stay.

Our Insights desk will revisit this thesis when Riptide's retention data lands in the autumn.`,
    articleType: "analysis",
    factStatus: "opinion",
    categorySlug: "insights",
    platformSlugs: ["pc", "playstation", "xbox"],
    relatedGameSlugs: ["starfall-vanguard"],
    tagSlugs: ["extraction-shooters", "live-service"],
    authorSlug: "maya-okafor",
    heroImage: heroImg("extraction-analysis", "Rising line chart woven through extraction gear — analysis illustration (demo placeholder)"),
    publishedAt: "2026-07-01T14:00:00.000Z",
    updatedAtEditorial: "2026-07-01T14:00:00.000Z",
    isBreaking: false,
    isFeatured: true,
    isSponsored: false,
    sources: [
      { publisher: "Nova Forge seasonal reports (demo)", sourceUrl: "https://example.com/novaforge/riptide", sourceType: "official-blog", originalPublicationDate: "2026-06-25T10:00:00.000Z", accessedAt: "2026-06-30T10:00:00.000Z", authorityLevel: 5, officialSource: true },
      { publisher: "Gaming Pulse demo dataset", sourceUrl: "https://example.com/gaming-pulse/methodology", sourceType: "news-report", originalPublicationDate: "2026-07-01T00:00:00.000Z", accessedAt: "2026-07-01T00:00:00.000Z", authorityLevel: 3, officialSource: false, notes: "Illustrative retention figures, invented for the demo." },
    ],
    keyPoints: [
      "The genre's 2026 recovery is built on irreversibility, not content volume.",
      "Persistent maps, permanent loss and finite seasons are the three working patterns.",
      "Players bond with consequences they witnessed, not content they consumed.",
    ],
    confirmedFacts: ["Riptide's permanent flood is officially announced."],
    unconfirmedPoints: ["Retention figures cited are illustrative demo data, not real measurements."],
    correctionLog: [],
    seoTitle: "Analysis: why extraction shooters recovered in 2026",
    seoDescription: "Persistence, permanent loss and finite seasons — the consequence architecture behind the extraction genre's fictional second wind. Demo analysis.",
    aiAssisted: false,
    humanReviewed: true,
    newsletterPlacement: "inline",
  },
  {
    title: "Inside Studio Lantern: hand-drawing a metroidvania at 120 frames per second",
    slug: "studio-lantern-interview",
    subtitle: "Animation director Hana Seo on why Petal & Blade animates every petal by hand — and what that costs.",
    excerpt: "We spoke with Studio Lantern's animation director about the pipeline behind Petal & Blade's frame-by-frame art, the 120 fps target, and the shots they cut. (Fictional demo interview.)",
    body: `**Demo notice: this is a fictional interview with an invented studio and person, created to demonstrate the Gaming Pulse platform.**

Studio Lantern's Seoul office (in our demo universe) has a wall the team calls the graveyard: hundreds of printed animation frames from sequences that didn't survive. Animation director **Hana Seo** gave us an hour to talk about the ones that did.

**Gaming Pulse: The 120 fps target for a hand-drawn game raised eyebrows. Hand animation is traditionally *low* frame rate.**

**Hana Seo:** People conflate drawing count with frame rate. We animate key poses on hand-drawn twos and threes — that's the art style — but the *camera*, the parallax, the particle petals, the hit-stop timing, those run at 120. The drawing is a performance; the presentation is an instrument. Both need to be precise.

**The bloom system ties combat mastery to visual growth. Which came first?**

The art. We had a test animation of a branch blooming, maybe four seconds, and our combat lead kept replaying it saying "this should be a resource." Petals as spendable mastery came out of an animation review, not a design document. That's very us — the pipeline argues back.

**What did the pipeline kill?**

A whole traversal ability. Wall-sliding looked wrong at our drawing budget — the cloth follow-through needed twelve more frames per pose than we could afford across every surface angle. We replaced it with the branch-hook, which needs one anchored pose and lets the camera do the motion. Constraint made a better ability.

**August 14 is close. What's the team's honest state?**

Tired and sure. Content-locked since May. What's left is the boring heroism — performance passes, save-integrity testing, the handheld battery preset. The graveyard wall stopped growing weeks ago. That's how you know.

*This fictional interview was edited for length and clarity per our editorial policy.*`,
    articleType: "interview",
    factStatus: "confirmed",
    categorySlug: "industry",
    platformSlugs: ["pc", "playstation", "xbox", "nintendo", "handheld"],
    relatedGameSlugs: ["petal-and-blade"],
    tagSlugs: ["metroidvania"],
    authorSlug: "lin-zhao",
    reviewerSlug: "sam-kowalczyk",
    heroImage: heroImg("lantern-interview", "Animator's desk with glowing frame stack — interview illustration (demo placeholder)"),
    publishedAt: "2026-06-29T10:00:00.000Z",
    updatedAtEditorial: "2026-06-29T10:00:00.000Z",
    isBreaking: false,
    isFeatured: false,
    isSponsored: false,
    sources: [
      { publisher: "Studio Lantern interview (demo)", sourceUrl: "https://example.com/gaming-pulse/lantern-interview", sourceType: "interview", originalPublicationDate: "2026-06-26T00:00:00.000Z", accessedAt: "2026-06-26T00:00:00.000Z", authorityLevel: 5, officialSource: true, verifiedBy: "sam-kowalczyk", notes: "Recorded interview; quotes approved for accuracy, not content." },
    ],
    keyPoints: [
      "Hand-drawn poses on twos and threes; camera and effects at 120 fps.",
      "The petal-mastery system emerged from an animation review.",
      "Wall-sliding was cut for drawing-budget reasons and replaced by the branch-hook.",
    ],
    confirmedFacts: ["Content lock since May 2026, per the studio."],
    unconfirmedPoints: [],
    correctionLog: [],
    seoTitle: "Studio Lantern interview: hand-drawn animation at 120 fps",
    seoDescription: "Petal & Blade's animation director on drawing budgets, the petal bloom system and cut abilities. Fictional demo interview.",
    aiAssisted: false,
    humanReviewed: true,
    newsletterPlacement: "none",
  },
  {
    title: "The 14 games that will define late 2026 — a release radar feature",
    slug: "late-2026-release-radar",
    subtitle: "From Petal & Blade's August bloom to Circuit Breakers 2's winter beta: your (fictional) calendar, curated.",
    excerpt: "Late 2026 is stacked in our demo universe. We sorted the noise into the fourteen dates and windows that actually matter, by platform and confidence level. (Fictional demo feature.)",
    body: `**Demo notice: this is a fictional feature about invented games and dates, created to demonstrate the Gaming Pulse platform.**

Every autumn preview promises the biggest season ever. Instead of promising, we sorted: every date below is tagged with its **confidence level** — confirmed, windowed or reported — matching the labels used across Gaming Pulse coverage.

## August — the bloom

**Petal & Blade** (Aug 14, confirmed) anchors the month. Studio Lantern's simultaneous five-platform launch is the summer's safest bet and our most-anticipated review. **Starfall: Vanguard — Riptide** (Aug 20, confirmed) floods a third of its map permanently; if you lapsed, this is the re-entry point.

## September — the hearth

**Emberwilds** (Sep 17, confirmed) is the cozy counterweight — a combat-optional open world that our preview build suggests is deeper than its soft palette implies. A **Chrono Drift** demo weekend is *reported* for September and should be treated accordingly.

## October — the storm

**Skybound Legends: Tempest** (Oct 6, confirmed) is the quarter's biggest live-service swing. Japan's physical **Emberwilds** edition follows in an October window.

## November — the deep

**Silent Meridian** (November, windowed) remains the wildcard: a mic-driven VR thriller from a studio that was just acquired mid-polish. Watch this one's certification news closely.

## December and the horizon

**Circuit Breakers 2**'s closed beta (Dec 10, confirmed) closes the year, with its 1.0, **Ashen Covenant** and *Chrono Drift*'s fate all living in 2027's opening quarters.

Fourteen entries, five confidence downgrades since our spring radar — the full sortable calendar lives on our [upcoming games](/upcoming-games) page, updated as dates move.`,
    articleType: "feature",
    factStatus: "confirmed",
    categorySlug: "news",
    platformSlugs: ["pc", "playstation", "xbox", "nintendo", "handheld", "vr"],
    relatedGameSlugs: ["petal-and-blade", "emberwilds", "skybound-legends", "silent-meridian", "circuit-breakers-2", "chrono-drift"],
    tagSlugs: ["release-dates"],
    authorSlug: "dario-vance",
    heroImage: heroImg("release-radar", "Timeline of game key art tiles receding into autumn light — feature illustration (demo placeholder)"),
    publishedAt: "2026-06-26T09:00:00.000Z",
    updatedAtEditorial: "2026-07-03T10:00:00.000Z",
    isBreaking: false,
    isFeatured: false,
    isSponsored: false,
    sources: [
      { publisher: "Aggregated official announcements (demo)", sourceUrl: "https://example.com/gaming-pulse/release-tracking", sourceType: "news-report", originalPublicationDate: "2026-06-26T00:00:00.000Z", accessedAt: "2026-06-26T00:00:00.000Z", authorityLevel: 4, officialSource: false, notes: "Compiled from the sources cited on each linked story." },
    ],
    keyPoints: [
      "Every date tagged confirmed, windowed or reported.",
      "Petal & Blade and Tempest anchor the season.",
      "Five confidence downgrades since the spring radar.",
    ],
    confirmedFacts: ["All 'confirmed' entries trace to official announcements covered separately."],
    unconfirmedPoints: ["The September Chrono Drift demo weekend is reported, not announced."],
    correctionLog: [
      { date: "2026-07-03T10:00:00.000Z", note: "Updated with Petal & Blade's confirmed August 14 date, replacing the previous summer window." },
    ],
    seoTitle: "Late 2026 release radar: 14 games that matter",
    seoDescription: "The confirmed, windowed and reported release dates defining late 2026, curated by confidence level. Fictional demo feature.",
    aiAssisted: false,
    humanReviewed: true,
    newsletterPlacement: "inline",
  },
  {
    title: "Building a quiet 1440p battlestation for under $1,200 — in partnership with VoltPC",
    slug: "sponsored-voltpc-1440p-build",
    subtitle: "A parts list that prioritizes acoustics without sandbagging frame rates.",
    excerpt: "SPONSORED (demo): Working with fictional retailer VoltPC, we spec a 1440p build that stays under 30 dBA at load — and under budget. Sponsored-content example.",
    body: `**Demo notice: this is a fictional SPONSORED article featuring an invented retailer, created to demonstrate how Gaming Pulse discloses and visually separates paid content. No real products are recommended.**

*This article was produced in partnership with VoltPC (a fictional retailer). VoltPC had approval over the parts list; editorial conclusions about performance remain ours. See our affiliate disclosure.*

Most budget builds chase frame rates and accept leaf-blower acoustics. This build flips the priority: **under 30 dBA at gaming load**, 1440p/high as the target, $1,200 (demo pricing) as the ceiling.

## The parts list (fictional demo hardware)

| Component | Pick | Why |
| --- | --- | --- |
| GPU | Vertex RX-7 Silent Edition | Triple-slot cooler, 0 rpm below 55°C |
| CPU | Corewave 6-core | Stock cooler discarded — see below |
| Cooler | Glacier Loop 240 | The budget's biggest acoustic win |
| Case | Hushbox Mini | Foam-lined, top-ducted |
| PSU | Statik 650 Gold | Fanless below 300 W |

## Where the money went

The unusual call is spending cooler-and-case money at this budget. Our (demo) testing put the acoustic difference at 11 dBA versus the same silicon in a mesh-everything build — the difference between "present" and "gone" from across a desk.

## What we'd change at $1,400

More VRAM headroom, nothing else. The acoustic platform holds through a GPU upgrade, which is the point: buy the quiet once.

*Sponsored content is produced under the Gaming Pulse sponsored-content policy: paid placements are labeled on every surface where they appear, sponsors never see editorial coverage before publication, and sponsorship does not influence review scores.*`,
    articleType: "sponsored",
    factStatus: "confirmed",
    categorySlug: "hardware",
    platformSlugs: ["pc"],
    relatedGameSlugs: [],
    tagSlugs: [],
    authorSlug: "priya-raman",
    heroImage: heroImg("voltpc-sponsored", "Minimalist PC build with acoustic wave motif — sponsored content illustration (demo placeholder)"),
    publishedAt: "2026-06-23T12:00:00.000Z",
    updatedAtEditorial: "2026-06-23T12:00:00.000Z",
    isBreaking: false,
    isFeatured: false,
    isSponsored: true,
    sponsorName: "VoltPC (fictional demo retailer)",
    sources: [
      { publisher: "VoltPC spec sheets (demo)", sourceUrl: "https://example.com/voltpc/specs", sourceType: "store-listing", originalPublicationDate: "2026-06-20T00:00:00.000Z", accessedAt: "2026-06-21T00:00:00.000Z", authorityLevel: 3, officialSource: true },
    ],
    keyPoints: [
      "Sponsored example: acoustics-first 1440p build under a demo $1,200 budget.",
      "Sponsor disclosure appears at top, in metadata and in the footer policy note.",
    ],
    confirmedFacts: ["Sponsorship terms disclosed per policy: sponsor approved the parts list, not the conclusions."],
    unconfirmedPoints: [],
    correctionLog: [],
    seoTitle: "Sponsored: a quiet 1440p PC build under $1,200 (demo)",
    seoDescription: "A sponsored-content example showing Gaming Pulse's disclosure standards, featuring a fictional retailer and demo hardware.",
    aiAssisted: false,
    humanReviewed: true,
    newsletterPlacement: "none",
  },
  {
    title: "Emberwilds hands-on preview: the cozy game that respects systems players",
    slug: "emberwilds-hands-on-preview",
    subtitle: "Three hours with the preview build reveal surprising depth beneath the soft palette.",
    excerpt: "Emberwilds' preview build plays like a warm blanket hiding a spreadsheet — in the best way. Our hands-on impressions ahead of the September 17 launch. (Fictional demo preview.)",
    body: `**Demo notice: this is a fictional preview of an invented game, created to demonstrate the Gaming Pulse platform.**

Ten minutes into the *Emberwilds* preview build, I'd befriended a firefly, restored a hearth and accepted that this would be a pleasant, familiar cozy game. At hour three, I was drawing supply-chain diagrams on paper. Both of those things are true, and the second is the story.

## The hearth economy

Every restored hearth wakes a village, and every village *specializes*: charcoal, resin, glass, dye. Villages trade along paths you physically clear, and the routes you choose shape prices across the valley. It's a full logistics sandbox wearing a knitted jumper.

Willow & Wren's claim that the game can be finished without combat holds up in the slice — the closest thing to conflict is negotiating with a moth swarm that unionized a berry grove. (Genuinely.)

## What worried us

Inventory friction is real in the preview build: hauling resin across the valley by hand got old fast, and the firefly courier system that should fix it unlocks deeper than the preview allows. The studio says courier progression is being rebalanced for launch. That's the right thing to say; we'll verify in the review.

## Early verdict

Previews don't get scores under our review policy — but *Emberwilds* moved from "pleasant" to "genuinely fascinating" over three hours, which is the trajectory you want. September 17 suddenly feels close.`,
    articleType: "feature",
    factStatus: "confirmed",
    categorySlug: "reviews",
    platformSlugs: ["nintendo", "pc"],
    relatedGameSlugs: ["emberwilds"],
    tagSlugs: ["cozy-games", "open-world"],
    authorSlug: "lin-zhao",
    heroImage: heroImg("emberwilds-preview", "Lantern-lit valley village at dusk — preview illustration (demo placeholder)"),
    publishedAt: "2026-07-02T10:30:00.000Z",
    updatedAtEditorial: "2026-07-02T10:30:00.000Z",
    isBreaking: false,
    isFeatured: false,
    isSponsored: false,
    sources: [
      { publisher: "Willow & Wren preview build (demo)", sourceUrl: "https://example.com/willowwren/preview-program", sourceType: "press-release", originalPublicationDate: "2026-07-01T00:00:00.000Z", accessedAt: "2026-07-01T00:00:00.000Z", authorityLevel: 5, officialSource: true, notes: "Publisher-provided preview access, disclosed per policy." },
    ],
    keyPoints: [
      "Village specialization creates a real logistics economy.",
      "Combat-free completion claim holds up in the preview slice.",
      "Inventory friction is the launch-build question mark.",
    ],
    confirmedFacts: ["Preview based on a three-hour publisher-provided build, disclosed per policy."],
    unconfirmedPoints: ["Courier rebalancing is a studio statement, not yet verifiable."],
    correctionLog: [],
    seoTitle: "Emberwilds hands-on preview: cozy outside, systems-deep inside",
    seoDescription: "Three hours with Emberwilds reveal a logistics sandbox in a knitted jumper. Hands-on impressions before the September 17 launch. Fictional demo preview.",
    aiAssisted: false,
    humanReviewed: true,
    newsletterPlacement: "footer",
  },
];

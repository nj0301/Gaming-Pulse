import type { SeedAuthor, SeedCategory, SeedCompany, SeedPlatform, SeedTag } from "./types";

export const platforms: SeedPlatform[] = [
  { name: "PC", slug: "pc", shortName: "PC", accent: "cyan", description: "PC gaming — hardware, storefronts, mods and the games that push the platform forward." },
  { name: "PlayStation", slug: "playstation", shortName: "PS5", accent: "violet", description: "PlayStation news, exclusives, firmware and first-party studio coverage." },
  { name: "Xbox", slug: "xbox", shortName: "XSX", accent: "green", description: "Xbox Series consoles, Game Pass and ecosystem coverage." },
  { name: "Nintendo", slug: "nintendo", shortName: "NSW", accent: "magenta", description: "Nintendo hardware, first-party releases and eShop highlights." },
  { name: "Mobile", slug: "mobile", shortName: "MOB", accent: "warning", description: "iOS and Android gaming — premium ports, live-service hits and indies." },
  { name: "Handheld", slug: "handheld", shortName: "HH", accent: "cyan", description: "Handheld PCs and portable gaming devices." },
  { name: "VR & AR", slug: "vr", shortName: "VR", accent: "violet", description: "Virtual and augmented reality games, headsets and experiences." },
  { name: "Cloud Gaming", slug: "cloud-gaming", shortName: "CLD", accent: "green", description: "Cloud streaming services, latency tech and playable-anywhere releases." },
];

export const categories: SeedCategory[] = [
  { name: "News", slug: "news", description: "Breaking stories and confirmed reporting from across the industry." },
  { name: "Reviews", slug: "reviews", description: "Scored verdicts from our editorial team, following the Gaming Pulse review policy." },
  { name: "Guides", slug: "guides", description: "Gameplay guides, walkthroughs and tips written from hands-on play." },
  { name: "Esports", slug: "esports", description: "Competitive gaming — tournaments, rosters and the business of esports." },
  { name: "Hardware", slug: "hardware", description: "Consoles, handhelds, GPUs, peripherals and buying advice." },
  { name: "Industry", slug: "industry", description: "Studios, publishers, acquisitions, funding and the people behind games." },
  { name: "Insights", slug: "insights", description: "Original analysis and opinion on where gaming is heading." },
  { name: "Deals", slug: "deals", description: "Free games, discounts and genuinely good offers — checked by humans." },
  { name: "Videos", slug: "videos", description: "Trailers, gameplay premieres and interviews." },
];

export const tags: SeedTag[] = [
  { name: "Release Dates", slug: "release-dates" },
  { name: "Expansions", slug: "expansions" },
  { name: "Extraction Shooters", slug: "extraction-shooters" },
  { name: "Metroidvania", slug: "metroidvania" },
  { name: "Roguelite", slug: "roguelite" },
  { name: "Soulslike", slug: "soulslike" },
  { name: "Open World", slug: "open-world" },
  { name: "Turn-Based Strategy", slug: "turn-based-strategy" },
  { name: "Racing", slug: "racing" },
  { name: "Acquisitions", slug: "acquisitions" },
  { name: "Handheld PCs", slug: "handheld-pcs" },
  { name: "Game Pass", slug: "game-pass" },
  { name: "Early Access", slug: "early-access" },
  { name: "Live Service", slug: "live-service" },
  { name: "Cozy Games", slug: "cozy-games" },
];

/** Fictional demo companies — any resemblance to real studios is coincidental. */
export const companies: SeedCompany[] = [
  { name: "Nova Forge Studios", slug: "nova-forge-studios", role: "developer", country: "Canada", founded: 2014, description: "Fictional demo studio behind the extraction shooter Starfall: Vanguard. Known for systemic sci-fi sandboxes." },
  { name: "Meridian Interactive", slug: "meridian-interactive", role: "publisher", country: "United States", founded: 2006, description: "Fictional demo publisher with a portfolio spanning shooters, VR and live-service titles." },
  { name: "Willow & Wren Games", slug: "willow-and-wren-games", role: "both", country: "United Kingdom", founded: 2018, description: "Fictional demo studio crafting the cozy open-world game Emberwilds." },
  { name: "Redline Arcadia", slug: "redline-arcadia", role: "developer", country: "Japan", founded: 2011, description: "Fictional demo studio mixing arcade racing with time-loop mechanics in Chrono Drift." },
  { name: "Blackspire Forge", slug: "blackspire-forge", role: "developer", country: "Poland", founded: 2015, description: "Fictional demo studio developing the dark-fantasy action RPG Ashen Covenant." },
  { name: "Pocket Thunder", slug: "pocket-thunder", role: "both", country: "Finland", founded: 2019, description: "Fictional demo mobile studio behind the roguelite brawler Neon Havoc." },
  { name: "Deepcurrent Studios", slug: "deepcurrent-studios", role: "developer", country: "Australia", founded: 2016, description: "Fictional demo VR studio building the narrative thriller Silent Meridian." },
  { name: "Quiet Anvil", slug: "quiet-anvil", role: "both", country: "Germany", founded: 2013, description: "Fictional demo strategy specialist behind Ironroot Tactics." },
  { name: "Horizonworks", slug: "horizonworks", role: "both", country: "United States", founded: 2009, description: "Fictional demo studio operating the live-service action MMO Skybound Legends." },
  { name: "Studio Lantern", slug: "studio-lantern", role: "developer", country: "South Korea", founded: 2017, description: "Fictional demo studio hand-animating the metroidvania Petal & Blade." },
  { name: "Voltcore Games", slug: "voltcore-games", role: "both", country: "Sweden", founded: 2012, description: "Fictional demo esports developer behind Circuit Breakers." },
];

/** Fictional demo editorial team. */
export const authors: SeedAuthor[] = [
  {
    name: "Maya Okafor", slug: "maya-okafor", role: "Managing Editor",
    bio: "Maya leads the Gaming Pulse newsroom (a fictional demo team). Twelve years covering the business of games, previously on the analyst side.",
    avatar: { src: "/media/authors/maya-okafor.svg", alt: "Illustrated avatar of Maya Okafor", width: 256, height: 256 },
    expertise: ["Industry", "Live service", "Acquisitions"],
  },
  {
    name: "Dario Vance", slug: "dario-vance", role: "Senior News Writer",
    bio: "Dario chases release dates, platform stories and everything breaking. Fictional demo author.",
    avatar: { src: "/media/authors/dario-vance.svg", alt: "Illustrated avatar of Dario Vance", width: 256, height: 256 },
    expertise: ["News", "PlayStation", "Xbox"],
  },
  {
    name: "Lin Zhao", slug: "lin-zhao", role: "Reviews Editor",
    bio: "Lin runs the reviews desk and keeps the scoring honest. Fictional demo author.",
    avatar: { src: "/media/authors/lin-zhao.svg", alt: "Illustrated avatar of Lin Zhao", width: 256, height: 256 },
    expertise: ["Reviews", "RPGs", "Indies"],
  },
  {
    name: "Priya Raman", slug: "priya-raman", role: "Hardware & Tech Writer",
    bio: "Priya benchmarks handhelds and GPUs so you don't have to. Fictional demo author.",
    avatar: { src: "/media/authors/priya-raman.svg", alt: "Illustrated avatar of Priya Raman", width: 256, height: 256 },
    expertise: ["Hardware", "Handheld PCs", "VR"],
  },
  {
    name: "Theo Marchetti", slug: "theo-marchetti", role: "Guides & Esports Writer",
    bio: "Theo writes guides from real playthroughs and covers the competitive scene. Fictional demo author.",
    avatar: { src: "/media/authors/theo-marchetti.svg", alt: "Illustrated avatar of Theo Marchetti", width: 256, height: 256 },
    expertise: ["Guides", "Esports", "Strategy"],
  },
  {
    name: "Sam Kowalczyk", slug: "sam-kowalczyk", role: "Fact Checker",
    bio: "Sam verifies sourcing and factual status before stories ship. Fictional demo team member.",
    avatar: { src: "/media/authors/sam-kowalczyk.svg", alt: "Illustrated avatar of Sam Kowalczyk", width: 256, height: 256 },
    expertise: ["Fact checking", "Sourcing"],
  },
];

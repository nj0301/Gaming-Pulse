/** Copy for the static editorial/legal pages. Markdown bodies rendered via ArticleBody. */

export interface StaticPage {
  slug: string;
  title: string;
  description: string;
  body: string;
}

export const staticPages: Record<string, StaticPage> = {
  about: {
    slug: "about",
    title: "About Gaming Pulse",
    description: "What Gaming Pulse is, who makes it, and the standards it runs on.",
    body: `Gaming Pulse is a premium gaming-media platform: breaking news, release tracking, reviews, guides and original industry analysis under one roof.

**This is a demonstration build.** Every game, studio, person, date, score and story on this site is fictional, created to show the platform's editorial and technical capabilities.

## What we stand for

- **Signal over noise.** Fewer, better stories with clear sourcing.
- **Labels that mean something.** Rumors look like rumors. Opinion looks like opinion. Sponsored content is disclosed on every surface where it appears.
- **Corrections in the open.** Every article carries its own update log; site-wide corrections are collected on the [corrections](/corrections) page.

## How the site works

News is reported by the editorial team, fact-checked against the sources listed on each story, and published only when the required sourcing, authorship and disclosure fields are complete — our CMS literally refuses to publish without them.`,
  },
  team: {
    slug: "team",
    title: "Our Team",
    description: "The fictional demo editorial team behind Gaming Pulse.",
    body: `The Gaming Pulse editorial team (fictional, for demonstration) spans news, reviews, guides, hardware and fact-checking. Author pages list each writer's beat and published work.

Editorial roles are enforced in our CMS: writers draft, editors review, fact-checkers verify sourcing, and only authorized editors can publish.`,
  },
  "editorial-policy": {
    slug: "editorial-policy",
    title: "Editorial Policy",
    description: "How Gaming Pulse reports, labels, sources and corrects its coverage.",
    body: `## Sourcing

Every published story lists its sources with an authority level (1–5) and an official-source marker. Single-source stories are labeled as reports; anonymous sources are corroborated and known to the editor.

## Labels

- **Breaking / News / Official Announcement** — confirmed reporting.
- **Report** — original reporting the subjects haven't confirmed.
- **Rumor / Leak** — unverified material, visually distinct, with an explicit list of what is and isn't confirmed.
- **Opinion / Analysis** — argument and interpretation, never disguised as news.
- **Sponsored** — paid content, labeled on every card, page and feed where it appears.

## AI assistance

Articles state whether AI assisted drafting. Nothing publishes without human review, and the human-reviewed status is recorded on each article.

## Corrections

Errors are corrected in place with a dated entry in the article's correction log. Material corrections are also listed on the [corrections](/corrections) page.`,
  },
  "review-policy": {
    slug: "review-policy",
    title: "Review Policy",
    description: "How Gaming Pulse scores games and handles review access.",
    body: `## The score

Reviews use a 0–10 scale with one decimal. The score belongs to the reviewer, not the sponsor, publisher or traffic forecast.

## Standards

- Reviews are based on substantial hands-on time with a named build and platform, stated in every review.
- Copy provenance is disclosed: purchased, publisher-provided code, or event access.
- Live-service games get re-reviews when the game materially changes; the original score stays visible in the correction log.
- Previews never carry scores.

## Sponsorship firewall

Sponsored content never includes review scores, and sponsors never see reviews before publication.`,
  },
  corrections: {
    slug: "corrections",
    title: "Corrections",
    description: "Material corrections to Gaming Pulse coverage.",
    body: `Material corrections to published stories are listed here and in each article's own update log.

## Recent corrections (fictional demo entries)

- **July 4, 2026 — Tempest expansion coverage:** clarified that the free trial region opens to all players, not only expansion owners.
- **June 22, 2026 — Starfall: Vanguard re-review:** corrected the Season 1 outpost compensation figure; an earlier version overstated it.
- **July 1, 2026 — Ashen Covenant leak coverage:** added detail about the posting account's history after reader questions.

To request a correction, use the [contact page](/contact) — corrections requests are reviewed by the managing editor within two business days.`,
  },
  contact: {
    slug: "contact",
    title: "Contact",
    description: "How to reach the Gaming Pulse editorial team.",
    body: `**Demo build:** the addresses below are placeholders.

- **News tips:** see [submit a tip](/submit-tip) for secure options.
- **Corrections:** corrections@example.com
- **General editorial:** editorial@example.com
- **Advertising & partnerships:** see [advertise](/advertise).

We read everything; we can't reply to everything. Pitches for sponsored placement sent to editorial addresses are forwarded to the commercial team — editorial does not negotiate paid coverage.`,
  },
  advertise: {
    slug: "advertise",
    title: "Advertise",
    description: "Advertising and sponsored-content options on Gaming Pulse.",
    body: `Gaming Pulse offers display placements and clearly-labeled sponsored content.

## The rules (non-negotiable)

- Sponsored content is labeled on every surface: cards, article pages, feeds and search results.
- Sponsors may brief and approve their own sponsored article's scope — never editorial coverage, and never review scores.
- Editorial staff do not see advertiser lists when planning coverage.

**Demo build:** contact placeholder — partnerships@example.com.`,
  },
  "submit-tip": {
    slug: "submit-tip",
    title: "Submit a Tip",
    description: "Send Gaming Pulse a news tip, securely if needed.",
    body: `Got something we should look into? We protect sources.

## Options

- **Email:** tips@example.com (demo placeholder)
- **Sensitive material:** ask for our secure drop via the email above from a personal device and account, not a work one.

## What helps

Documents beat descriptions. Context beats screenshots. Telling us what we'd need to verify independently helps most of all.

We verify before we publish: leaked material is authenticated, its provenance assessed, and the companies involved get a chance to comment. See the [editorial policy](/editorial-policy) for how unverified material is labeled.`,
  },
  privacy: {
    slug: "privacy",
    title: "Privacy Policy",
    description: "How Gaming Pulse handles personal data.",
    body: `**Demo build:** this is a template policy, not legal advice; have counsel review before production use.

## What we collect

- **Newsletter:** your email address, stored solely to send the newsletter you asked for. One-click unsubscribe.
- **Analytics:** aggregated, PII-free interaction events (article views, search-term lengths, clicks). No emails, names or free-text inputs are sent to analytics.
- **Server logs:** standard technical logs retained briefly for security and debugging.

## What we don't do

We don't sell personal data, run cross-site tracking of our own, or require accounts to read.

## Your rights

Contact privacy@example.com (demo placeholder) for access or deletion requests.`,
  },
  terms: {
    slug: "terms",
    title: "Terms of Use",
    description: "Terms governing the use of Gaming Pulse.",
    body: `**Demo build:** template terms, not legal advice.

By using Gaming Pulse you agree to use the site lawfully, not to scrape it at abusive rates, and not to republish our original work without permission beyond fair use.

Content is provided "as is." Editorial content is not professional advice. Deals and prices are checked at publication but change without notice — verify before purchase.

These terms are governed by the laws of the operator's jurisdiction (to be set at production launch).`,
  },
  cookies: {
    slug: "cookies",
    title: "Cookie Policy",
    description: "The cookies and local storage Gaming Pulse uses.",
    body: `**Demo build:** reflects the current demo implementation.

## What we store

- **Preferences (localStorage):** your "reduce effects" setting and recent searches. Never sent to a server.
- **Strictly necessary cookies:** none in the demo build; a session cookie is used only in the CMS admin.
- **Analytics cookies:** none by default. If an analytics provider is enabled at production, this page and a consent flow will be updated first.`,
  },
  "affiliate-disclosure": {
    slug: "affiliate-disclosure",
    title: "Affiliate Disclosure",
    description: "How affiliate links work on Gaming Pulse.",
    body: `Some outbound links on deals pages and store-link buttons may be affiliate links: if you buy through them, Gaming Pulse may earn a commission at no extra cost to you.

## What that changes

- Nothing about coverage: deals are selected by editors for reader value, then affiliate links are attached where available — never the reverse.
- Affiliate revenue never influences review scores or news judgment (see the [review policy](/review-policy)).
- Affiliate links carry \`rel="sponsored"\` markup.

**Demo build:** all retailers and links are fictional placeholders.`,
  },
};

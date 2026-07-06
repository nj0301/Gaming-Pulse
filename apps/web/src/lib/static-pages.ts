/** Copy for the static informational/legal pages. Markdown bodies rendered via ArticleBody. */

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
    description: "What Gaming Pulse is and where its data comes from.",
    body: `Gaming Pulse is a real-time gaming news aggregator and games database. Everything on this site is live, real data — nothing is fabricated.

## Where the data comes from

- **News:** headlines, excerpts and images are pulled directly from public RSS feeds published by Eurogamer, PC Gamer, GameSpot, Rock Paper Shotgun, VG247, Destructoid and Nintendo Life. Every story links back to the original article at the source — we don't republish full articles.
- **Trending:** computed from the live feed itself — a topic is "trending" only when multiple different outlets are covering it at the same time. No manual scores, no editorial curation.
- **Games:** covers, screenshots, genres, platforms, ratings and store links come from [RAWG](https://rawg.io), a public games database.

## Refresh rate

Content refreshes automatically about once an hour. Nothing needs a manual update or a redeploy to stay current.

## What this site doesn't do

We don't publish original reporting, reviews, or opinion pieces, and we don't attribute headlines to fictional staff. Gaming Pulse is an index, not a newsroom.`,
  },
  contact: {
    slug: "contact",
    title: "Contact",
    description: "How to reach Gaming Pulse.",
    body: `**Placeholder addresses** — replace before production use.

- **General:** hello@example.com
- **Advertising & partnerships:** see [advertise](/advertise).

If you're an outlet whose feed appears on this site and have a question about attribution or want to be removed, use the address above.`,
  },
  advertise: {
    slug: "advertise",
    title: "Advertise",
    description: "Advertising options on Gaming Pulse.",
    body: `Gaming Pulse is an aggregator of real gaming news and a real games database — display advertising placements are available around this content.

**Placeholder:** contact partnerships@example.com for rates and inventory.`,
  },
  "submit-tip": {
    slug: "submit-tip",
    title: "Submit a Tip",
    description: "Suggest a source or report an issue.",
    body: `Gaming Pulse doesn't do original reporting, so we don't take news tips in the traditional sense. If you think we should be pulling from an outlet we're missing, or you've spotted incorrect data from RAWG or one of our news sources, let us know.

**Placeholder:** tips@example.com`,
  },
  privacy: {
    slug: "privacy",
    title: "Privacy Policy",
    description: "How Gaming Pulse handles personal data.",
    body: `**Template policy** — have counsel review before production use.

## What we collect

- **Newsletter:** your email address, stored solely to send the newsletter you asked for. One-click unsubscribe.
- **Analytics:** aggregated, PII-free interaction events (page views, search-term lengths, clicks). No emails, names or free-text inputs are sent to analytics.
- **Server logs:** standard technical logs retained briefly for security and debugging.

## What we don't do

We don't sell personal data, run cross-site tracking of our own, or require accounts to read.

## Your rights

Contact privacy@example.com (placeholder) for access or deletion requests.`,
  },
  terms: {
    slug: "terms",
    title: "Terms of Use",
    description: "Terms governing the use of Gaming Pulse.",
    body: `**Template terms** — not legal advice.

By using Gaming Pulse you agree to use the site lawfully and not to scrape it at abusive rates. Headlines, excerpts and images displayed here are sourced from third-party outlets and RAWG under an aggregator/index model; rights to the underlying articles and artwork remain with their original publishers.

Content is provided "as is." These terms are governed by the laws of the operator's jurisdiction (to be set at production launch).`,
  },
  cookies: {
    slug: "cookies",
    title: "Cookie Policy",
    description: "The cookies and local storage Gaming Pulse uses.",
    body: `## What we store

- **Preferences (localStorage):** your "reduce effects" setting and recent searches. Never sent to a server.
- **Strictly necessary cookies:** none by default.
- **Analytics cookies:** none by default. If an analytics provider is enabled at production, this page and a consent flow will be updated first.`,
  },
};

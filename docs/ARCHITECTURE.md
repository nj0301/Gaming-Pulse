# Architecture

## Overview

```
┌────────────────────┐         REST (+ webhook revalidate)        ┌────────────────────┐
│  apps/web          │ ─────────────────────────────────────────▶ │  apps/cms          │
│  Next.js 16        │ ◀───────────────────────────────────────── │  Strapi 5          │
│  App Router / RSC  │                                            │  SQLite dev /      │
│                    │        fixture fallback (no CMS or         │  PostgreSQL prod   │
│  lib/cms adapter ──┼──▶     CMS outage → bundled demo data)     └─────────┬──────────┘
└────────────────────┘                                                      │
        ▲                       shared, version-locked                      │ server-side
        │              ┌───────────────────────────────────┐               ▼
        └───────────── │ packages/core  ·  packages/seed-data │   integrations/ (IGDB,
                       └───────────────────────────────────┘    YouTube, Twitch, RSS)
```

## Key decisions (and why)

1. **Adapter-isolated CMS access.** All content flows through `apps/web/src/lib/cms` (`CmsAdapter` interface). Two implementations: `strapiAdapter` (REST mapping) and `fixtureAdapter` (bundled demo content). When `CMS_URL` is unset the site runs fully standalone; when a live CMS call fails, the call degrades to fixtures with a logged warning. This gives API-failure resilience, offline development and demo deployments from one mechanism.
2. **Seed data as the domain model.** `packages/seed-data` types are the web app's domain types; the Strapi adapter maps API responses *into* them. One source of truth for shapes, and the CMS seeder + web fallback can never drift apart.
3. **Pure logic in `packages/core`.** Trending score, reading time, release-date precision and the publish gate are dependency-free TS, unit-tested once, used by both apps. (Strapi compiles only its own `src`, so the CMS carries thin mirrors of two functions with pointers to the canonical files — see LIMITATIONS.md.)
4. **SQLite dev / PostgreSQL prod.** Zero-setup local development; `docker-compose.yml` provides prod-like Postgres. Strapi's query layer makes this a config-only switch. Search uses DB-agnostic `containsi` queries in release 1, isolated behind `/api/search` so it can move to Postgres FTS or Meilisearch without contract changes.
5. **Release-date precision as data.** Every release date stores `precision` (`exact|month|quarter|year|tba`); formatting and sorting respect it (`Q3 2026` never renders as a fake day; TBA sorts last; a quarter stays "upcoming" until it fully ends).
6. **Publish gating in the document service.** A Strapi documents-middleware blocks publishing articles missing sources, author, hero media, type, SEO fields or sponsor disclosure — enforcement lives server-side, not in UI convention. The same middleware computes reading time and writes editorial audit-log lines.
7. **Trend scoring is explainable.** Weighted composite (recency 30 / engagement 20 / search 15 / sources 15 / reach 10 / significance 5 / manual 5) with a mandatory human-written `whyTrending`. Editors can pin, adjust, hide and expire; a 30-minute cron recalculates.
8. **Animation is layered, not load-bearing.** Content renders server-side; Motion/CSS add enhancement. Two gates apply everywhere: OS `prefers-reduced-motion` and the site-level "Reduce effects" toggle (mirrored to `<html data-effects>` for pure-CSS animations). Tilt and hover-zoom are pointer-gated off for touch.
9. **Media is local and license-safe.** All demo artwork is generated SVG (scripts/generate-placeholders.mjs), clearly labeled "DEMO ART". External images are allowlisted (CMS host + optional CDN) in both the Next image config and the CSP.

## Web app structure

```
src/app            routes (App Router; RSC by default)
  news/[slug]      article page (+ dynamic OG image)
  games/[slug]     game profile
  upcoming-games   calendar/timeline/list with filters (client filtering over server data)
  platform|category|tag|author/[slug]   listing pages (shared ArticleListing)
  *-sitemap.xml, rss.xml, atom.xml, robots.ts, sitemap.ts   discovery layer
  api/search|newsletter|revalidate      server routes
src/components     ui primitives · cards · home sections · article panels · layout · motion
src/lib            cms adapters · seo builders · analytics · config · static page copy
```

## CMS structure

```
src/api/*          16 content types (schema.json + generated controllers/routes/services)
src/components     shared.source, shared.review-data, shared.gallery-item, shared.seo,
                   shared.correction-entry, shared.store-link, shared.nav-item, home.section
src/index.ts       publish-gate middleware, reading time, audit log, public-permission bootstrap
src/editorial      role bootstrap (Managing Editor → Contributor)
src/api/trend/services/scoring.ts   trend recalculation (cron: config/cron-tasks.ts)
src/integrations   igdb / youtube / twitch / rss adapters over a shared retry+cache base
src/middlewares    rate-limit (in-memory; Redis-ready interface)
scripts/seed.ts    demo-content seeder (uploads placeholder media, publishes via the gate)
```

### Content model mapping (spec → implementation)

The 20 requested models map to 16 collection/single types + 8 components. **Source, Review, Gallery and Correction are components**, not collections — they are compositional data owned by exactly one article, which removes orphan management and keeps the publish gate simple. `Newsletter` is implemented as `newsletter-subscriber` (the subscriber list); campaign entities can be added later.

## Caching & invalidation

- Web pages: ISR (`revalidate = 300`) + `next.revalidate` on CMS fetches.
- Instant publish: Strapi webhook → `POST /api/revalidate` (shared secret) → `revalidatePath` for the affected routes.
- Integrations: in-memory TTL cache with retry/backoff/Retry-After handling; swap `MemoryCache` for Redis in multi-instance deployments.

## Security

- Web: CSP, X-Frame-Options DENY, nosniff, referrer & permissions policies (next.config.ts); image-optimizer sandboxed for SVG; external images allowlisted; newsletter endpoint validated + per-IP throttled; revalidate webhook secret-gated; analytics events PII-free by type design.
- CMS: upload MIME allow/deny lists (scaffold defaults kept), CSP with media-host allowlist, CORS restricted to configured origins, API rate limiting middleware, RBAC roles, editorial audit-log lines on publish/unpublish/delete, refresh-token session management.

## Monorepo note

npm workspaces with React 19 pinned at the root (`legacy-peer-deps` via `.npmrc`); Strapi's React 18 nests inside `apps/cms/node_modules`. `lightningcss-darwin-arm64` is a root optionalDependency to work around npm's optional-deps hoisting bug on macOS arm64.

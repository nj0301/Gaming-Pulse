# Gaming Pulse

A production-grade gaming news, discovery and industry-insight platform: breaking news, trending topics, a release calendar, game profiles, reviews, guides, esports, hardware, deals and original analysis — built as a modern gaming command center with a premium editorial dark theme.

> **Demo content notice:** every game, studio, person, date, score, price and story shipped with this repository is **fictional**, created to demonstrate the platform. Placeholder artwork is generated locally (no copyrighted game assets).

## Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 16 (App Router, Server Components), React 19, TypeScript strict, Tailwind CSS 4, Motion |
| CMS | Strapi 5 (Draft & Publish, RBAC editorial roles, REST) |
| Database | SQLite for local development, PostgreSQL for production (`docker-compose.yml` provided) |
| Shared | `@gaming-pulse/core` (tested domain utilities), `@gaming-pulse/seed-data` (fictional demo content) |
| Tests | Vitest (unit + component), Playwright (e2e), publish-gate validation |

## Quick start (no CMS needed)

```bash
npm install            # installs all workspaces (Node 20–24)
node scripts/generate-placeholders.mjs   # regenerate demo artwork (already committed paths)
npm run dev:web        # → http://localhost:3000
```

The website runs standalone in **demo mode**, serving the bundled fictional content through the same adapter interface used for Strapi. This is also the automatic fallback if the CMS is ever unreachable.

## Full stack (web + CMS)

```bash
# 1. CMS
cp apps/cms/.env.example apps/cms/.env    # fill in generated secrets (openssl rand -base64 32)
npm run dev:cms                           # → http://localhost:1337/admin (create the first admin user)

# 2. Seed the fictional demo content (fresh database only)
npm run seed:cms

# 3. Point the website at the CMS
cp apps/web/.env.example apps/web/.env.local
# set CMS_URL=http://localhost:1337
npm run dev:web
```

Production database: `docker compose up -d postgres`, then set `DATABASE_CLIENT=postgres` and `DATABASE_URL` in `apps/cms/.env`.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev:web` / `npm run dev:cms` | Run the site / the CMS in development |
| `npm run build:web` / `npm run build:cms` | Production builds |
| `npm run seed:cms` | Load fictional demo content into Strapi (idempotent; skips if articles exist) |
| `npm test` | Unit + component tests (core package and web app) |
| `npm run test:e2e` | Playwright reader-journey tests (`npx playwright install chromium` first) |
| `npm run lint` | ESLint |

## Repository layout

```
apps/web        Next.js site (routes, components, CMS adapter, SEO, tests)
apps/cms        Strapi 5 (content types, roles, publish validation, trend scoring, integrations, seeder)
packages/core   Shared tested utilities: trending score, reading time, release-date precision, publish gate
packages/seed-data  Canonical fictional demo content used by both apps
docs/           Architecture, editorial guide, integrations, SEO checklist, performance, limitations, roadmap
scripts/        Placeholder-artwork generator
```

## Editorial usage (short version)

- **Writers** draft articles; the CMS **refuses to publish** without sources, author, hero media, article type and SEO fields — sponsored articles additionally require a sponsor name.
- **Homepage** section order, visibility and curation live in *Homepage Configuration*; navigation in *Navigation Configuration* — no code changes needed.
- **Trends** carry a mandatory plain-language "why it's trending" explanation, and editors can pin, boost/lower, hide or expire them; scores recalculate every 30 minutes via cron.
- Rumors, leaks and opinion are visually distinct from confirmed reporting across cards, article pages and structured data.

Full guide: [docs/CMS-EDITORIAL-GUIDE.md](docs/CMS-EDITORIAL-GUIDE.md)

## Documentation

- [Architecture](docs/ARCHITECTURE.md) — decisions, data flow, folder structure
- [CMS editorial guide](docs/CMS-EDITORIAL-GUIDE.md) — roles, workflow, publish gates
- [Data integrations](docs/DATA-INTEGRATIONS.md) — IGDB / YouTube / Twitch / RSS adapters, caching, rate limits
- [SEO checklist](docs/SEO-CHECKLIST.md)
- [Performance notes](docs/PERFORMANCE.md)
- [Known limitations](docs/LIMITATIONS.md) · [Roadmap](docs/ROADMAP.md)

## Deployment

- **Web:** any Node host or Vercel-style platform. Set `NEXT_PUBLIC_SITE_URL`, `CMS_URL`, `CMS_API_TOKEN`, `REVALIDATE_SECRET`. Build with `npm run build:web`.
- **CMS:** Node host with PostgreSQL. Set the secrets from `apps/cms/.env.example`; configure a webhook to `POST $SITE/api/revalidate` with header `x-revalidate-secret` for instant cache invalidation on publish.
- No secrets are committed anywhere in this repository; all configuration is environment-driven.

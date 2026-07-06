# Known Limitations

Honest list of what this build does not (yet) do.

## Editorial / CMS
- **Field-level permissions** (e.g. Fact Checker editing only `factStatus`) are workflow convention, not hard enforcement — Strapi Community Edition lacks field-level write rules; EE Review Workflows would close this.
- **Draft preview links** from the CMS to the site are scaffolded via `PREVIEW_SECRET` but the preview route itself is future work (site currently shows published content only).
- **Newsletter** stores subscribers (with per-IP throttling); double-opt-in email delivery needs an ESP integration.
- The two small CMS mirrors of core logic (`utils/trending.ts`, `utils/publish-validation.ts`) must be kept in sync with `packages/core` by hand (noted in both files); a build step could eliminate this.

## Search
- Release-1 search is case-insensitive `contains` (identical on SQLite/Postgres) with no typo tolerance or ranking beyond recency. The `/api/search` contract is stable, so upgrading to Postgres FTS, Meilisearch or Typesense is contained to the CMS controller.

## Media & video
- Demo videos are posters only — no player, since no licensed footage ships with the repo. The Video model supports YouTube ids and uploads for production.
- Focal-point cropping is not implemented; Strapi's default crops apply. (Aspect ratios are reserved everywhere, so no CLS.)
- Blur placeholders use skeletons rather than per-image blurhash.

## Platform
- Rate limiting and integration caches are in-memory — fine for one instance; use Redis (interface provided) when scaling out.
- Trend engagement/search signals are seeded illustrative values; wiring real analytics/Twitch signals into `trend.signals` is roadmap work.
- E2E tests are written but require `npx playwright install chromium` locally; they are not run in this repo's initial verification.
- GSAP ScrollTrigger was deliberately not included: Motion + CSS covered every required sequence, so shipping a second animation library would only cost bundle size. Add it lazily if a bespoke scroll sequence demands it.
- Analytics events go to `window.dataLayer` (GTM-compatible stub); no vendor is wired.
- Accessibility has been built to WCAG 2.2 AA patterns (semantics, focus, keyboard paths, reduced motion, contrast tokens) but has not had a third-party audit.

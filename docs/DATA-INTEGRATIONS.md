# Data Integration Guide

External data enters Gaming Pulse only through server-side adapters in `apps/cms/src/integrations/`. Browser components never call third-party APIs.

## Ground rules (enforced in code)

1. **Nothing external publishes automatically.** Synced entities are created as drafts; RSS items surface as story *leads*, never as articles. Automatic article copying is deliberately not built.
2. **Editors always win.** Entities carry `dataSource`, `externalDatabaseId` and `lastSynchronizedAt`; setting `editorOverride: true` on a game excludes it from all future sync writes.
3. **Every adapter is disabled until its env keys exist** — the site and CMS run fully without any provider.
4. **Validate commercial usage rights before enabling a provider.** IGDB, YouTube and Twitch each have their own commercial terms and quotas; confirm your deployment's tier and attribution requirements first.

## Shared plumbing (`base.ts`)

- `fetchJson(provider, url, options)`: timeout (10s default), retries with exponential backoff + jitter, `Retry-After` handling for 429/5xx, non-retryable 4xx fail fast.
- TTL response cache. Default `MemoryCache`; implement the two-method `CacheStore` interface over Redis (`REDIS_URL`) for multi-instance deployments.
- `IntegrationError` carries provider + status for observability.

## Providers

| Adapter | Env | Purpose | Cache TTL |
| --- | --- | --- | --- |
| `igdb.ts` | `IGDB_CLIENT_ID`, `IGDB_CLIENT_SECRET` | Game metadata search + draft-sync with dedupe on `externalDatabaseId` | search 1h, token 50m |
| `youtube.ts` | `YOUTUBE_API_KEY` | Hydrate editor-added Video entries (duration, publish date, thumbnail) | 6h (quota-aware) |
| `twitch.ts` | `TWITCH_CLIENT_ID`, `TWITCH_CLIENT_SECRET` | Live viewership as a trend engagement signal | streams 5m, game ids 24h |
| `rss.ts` | `RSS_FEEDS` (comma-separated allowlist) | Publisher press feeds → editorial leads | per-poll; failures isolated per feed |

## Deduplication

Games sync by `externalDatabaseId` (`igdb-<id>`): existing entities update in place (unless overridden), new ones are created as drafts. Slugs are unique at the DB level as a second guard.

## Failure behavior

- Adapter failure → logged, empty/null result; nothing user-facing breaks.
- CMS unreachable from the website → per-call fallback to bundled demo content (see `apps/web/src/lib/cms/strapi.ts`).
- One broken RSS feed never blocks the others.

## Adding a provider

1. Create `src/integrations/<name>.ts` exporting `isEnabled()` + typed fetchers built on `fetchJson`.
2. Document env vars in `apps/cms/.env.example` and this file, including the licensing note.
3. Write drafts only; respect `editorOverride`; record `lastSynchronizedAt`.
4. Wire a cron task in `config/cron-tasks.ts` if it should poll.

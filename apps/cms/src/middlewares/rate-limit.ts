/**
 * Minimal in-memory rate limiter for public API routes.
 *
 * Suitable for a single-instance deployment; swap the store for Redis
 * (see docs/DATA-INTEGRATIONS.md) when scaling horizontally.
 */
import type { Core } from "@strapi/strapi";
import type { Context, Next } from "koa";

interface Bucket {
  count: number;
  resetAt: number;
}

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 120; // per IP per minute across /api
const SEARCH_MAX = 30; // stricter budget for search

const buckets = new Map<string, Bucket>();

function take(key: string, max: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  bucket.count += 1;
  return bucket.count <= max;
}

// Periodic cleanup so the map cannot grow unbounded.
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key);
  }
}, WINDOW_MS).unref();

export default (_config: unknown, _ctx: { strapi: Core.Strapi }) => {
  return async (ctx: Context, next: Next) => {
    if (ctx.path.startsWith("/api/")) {
      const ip = ctx.request.ip;
      const isSearch = ctx.path.startsWith("/api/search");
      const allowed = isSearch ? take(`s:${ip}`, SEARCH_MAX) : take(`a:${ip}`, MAX_REQUESTS);
      if (!allowed) {
        ctx.status = 429;
        ctx.body = { error: { status: 429, name: "TooManyRequests", message: "Rate limit exceeded." } };
        return;
      }
    }
    await next();
  };
};

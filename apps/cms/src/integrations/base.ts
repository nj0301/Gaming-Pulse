/**
 * Shared integration plumbing: fetch with timeout, retry with exponential
 * backoff + jitter, and a TTL response cache.
 *
 * The cache is in-memory by default; when REDIS_URL is set, deployments
 * should swap `MemoryCache` for a Redis-backed implementation with the same
 * interface (see docs/DATA-INTEGRATIONS.md).
 *
 * Editorial rule enforced by every adapter: synchronized external data is
 * written as *draft* entities or metadata fields only — it is never published
 * automatically as editorial reporting.
 */

export interface CacheStore {
  get<T>(key: string): Promise<T | undefined>;
  set<T>(key: string, value: T, ttlSeconds: number): Promise<void>;
}

export class MemoryCache implements CacheStore {
  private store = new Map<string, { value: unknown; expiresAt: number }>();

  async get<T>(key: string): Promise<T | undefined> {
    const hit = this.store.get(key);
    if (!hit) return undefined;
    if (hit.expiresAt < Date.now()) {
      this.store.delete(key);
      return undefined;
    }
    return hit.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    this.store.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
  }
}

export const sharedCache: CacheStore = new MemoryCache();

export interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  timeoutMs?: number;
  retries?: number;
  cacheKey?: string;
  cacheTtlSeconds?: number;
}

export class IntegrationError extends Error {
  constructor(
    message: string,
    public readonly provider: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "IntegrationError";
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchJson<T>(
  provider: string,
  url: string,
  options: FetchOptions = {},
): Promise<T> {
  const {
    method = "GET",
    headers = {},
    body,
    timeoutMs = 10_000,
    retries = 3,
    cacheKey,
    cacheTtlSeconds = 300,
  } = options;

  if (cacheKey) {
    const cached = await sharedCache.get<T>(cacheKey);
    if (cached !== undefined) return cached;
  }

  let lastError: Error | undefined;
  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0) {
      // Exponential backoff with jitter: 0.5s, 1s, 2s (+/- 25%).
      const base = 500 * 2 ** (attempt - 1);
      await sleep(base + Math.random() * base * 0.5);
    }
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      const response = await fetch(url, { method, headers, body, signal: controller.signal });
      clearTimeout(timer);

      if (response.status === 429 || response.status >= 500) {
        // Retryable: respect Retry-After when present.
        const retryAfter = Number(response.headers.get("retry-after"));
        if (retryAfter > 0 && retryAfter < 60) await sleep(retryAfter * 1000);
        lastError = new IntegrationError(`${provider} responded ${response.status}`, provider, response.status);
        continue;
      }
      if (!response.ok) {
        throw new IntegrationError(`${provider} responded ${response.status}`, provider, response.status);
      }

      const data = (await response.json()) as T;
      if (cacheKey) await sharedCache.set(cacheKey, data, cacheTtlSeconds);
      return data;
    } catch (error) {
      if (error instanceof IntegrationError && error.status && error.status < 500 && error.status !== 429) {
        throw error; // non-retryable client error
      }
      lastError = error as Error;
    }
  }
  throw lastError ?? new IntegrationError(`${provider} request failed`, provider);
}

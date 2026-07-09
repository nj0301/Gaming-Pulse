/** Site-wide configuration derived from environment variables. */

/**
 * The canonical production origin for SEO.
 *
 * IMPORTANT: This is intentionally stable. If `NEXT_PUBLIC_SITE_URL` is missing
 * in Vercel production, we still must not emit localhost URLs in sitemaps,
 * robots, canonicals, JSON-LD, or Open Graph.
 */
export const PRODUCTION_SITE_URL = "https://gaming-pulse.jimmai.in";

function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit;

  const vercelUrl = process.env.VERCEL_URL?.trim();
  const isProd = process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";

  // Production must always use the canonical production origin.
  if (isProd) return PRODUCTION_SITE_URL;

  // Preview deployments should use their Vercel URL when available.
  if (vercelUrl) return `https://${vercelUrl}`;

  // Local development default.
  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl().replace(/\/$/, "");

/** Strapi base URL; when unset the site serves bundled fictional demo content. */
export const CMS_URL = process.env.CMS_URL?.replace(/\/$/, "") ?? null;

/** Optional read token for Strapi (draft preview uses a separate token). */
export const CMS_TOKEN = process.env.CMS_API_TOKEN ?? null;

/** Secret validating /api/preview requests from the CMS. */
export const PREVIEW_SECRET = process.env.PREVIEW_SECRET ?? null;

/** Secret validating on-demand revalidation webhooks from the CMS. */
export const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET ?? null;

export const SITE_NAME = "Gaming Pulse";

/** Default ISR revalidation window (seconds) for editorial content. */
export const REVALIDATE_SECONDS = 300;

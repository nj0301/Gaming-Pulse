/** Site-wide configuration derived from environment variables. */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

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

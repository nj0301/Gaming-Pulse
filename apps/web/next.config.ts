import type { NextConfig } from "next";
import path from "node:path";

const cmsHost = process.env.CMS_URL ? new URL(process.env.CMS_URL).hostname : null;
const mediaCdnHost = process.env.MEDIA_CDN_HOST || null;

const isDev = process.env.NODE_ENV === "development";

/**
 * Content-Security-Policy.
 * 'unsafe-inline' for styles is required by streamed inline styles;
 * script-src allows self + inline bootstrap only (Next generates hashed
 * inline scripts; strict nonces can be layered in middleware later).
 * 'unsafe-eval' is added in development only — React dev mode uses eval()
 * for debugging features; production builds never do.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  // The news aggregator hotlinks thumbnails directly from many outlets'
  // own CDNs (Eurogamer, PC Gamer, GameSpot, etc.) with attribution and a
  // link back to the source — the standard news-aggregator model. That
  // requires a broad https: allowance here rather than a fixed per-host list.
  `img-src 'self' data: blob: https:${cmsHost ? ` https://${cmsHost}` : ""}${mediaCdnHost ? ` https://${mediaCdnHost}` : ""}`,
  `media-src 'self'${cmsHost ? ` https://${cmsHost}` : ""}${mediaCdnHost ? ` https://${mediaCdnHost}` : ""}`,
  `connect-src 'self'${process.env.CMS_URL ? ` ${process.env.CMS_URL}` : ""}`,
  "font-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  // Monorepo: without this, Turbopack infers the wrong workspace root and
  // fails to resolve native binaries (lightningcss) hoisted to the root.
  turbopack: {
    root: path.join(__dirname, "../.."),
  },
  transpilePackages: ["@gaming-pulse/core", "@gaming-pulse/seed-data"],
  images: {
    formats: ["image/avif", "image/webp"],
    // External image allowlist: the CMS, configured media CDN, and RAWG's
    // real game-cover CDN (media.rawg.io) — required for /games real photos.
    remotePatterns: [
      ...(cmsHost ? [{ protocol: "https" as const, hostname: cmsHost }, { protocol: "http" as const, hostname: cmsHost }] : []),
      ...(mediaCdnHost ? [{ protocol: "https" as const, hostname: mediaCdnHost }] : []),
      { protocol: "https" as const, hostname: "media.rawg.io" },
    ],
    // Demo placeholder art is SVG; allow it through the optimizer safely.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const cmsHost = process.env.CMS_URL ? new URL(process.env.CMS_URL).hostname : null;
const mediaCdnHost = process.env.MEDIA_CDN_HOST || null;

/**
 * Content-Security-Policy.
 * 'unsafe-inline' for styles is required by streamed inline styles;
 * script-src allows self + inline bootstrap only (Next generates hashed
 * inline scripts; strict nonces can be layered in middleware later).
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob:${cmsHost ? ` https://${cmsHost}` : ""}${mediaCdnHost ? ` https://${mediaCdnHost}` : ""}`,
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
  transpilePackages: ["@gaming-pulse/core", "@gaming-pulse/seed-data"],
  images: {
    formats: ["image/avif", "image/webp"],
    // External image allowlist: only the CMS and configured media CDN.
    remotePatterns: [
      ...(cmsHost ? [{ protocol: "https" as const, hostname: cmsHost }, { protocol: "http" as const, hostname: cmsHost }] : []),
      ...(mediaCdnHost ? [{ protocol: "https" as const, hostname: mediaCdnHost }] : []),
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

/**
 * Analytics event layer — provider-agnostic and PII-free by construction.
 *
 * Events are pushed to `window.dataLayer` when present (GTM-compatible) and
 * logged in development. Payload values are limited to content identifiers
 * and coarse metrics; never pass emails, names or free-text user input other
 * than truncated search queries.
 */

export type AnalyticsEvent =
  | { name: "release_filter"; filter: string; value: string }
  | { name: "newsletter_signup"; placement: string }
  | { name: "search_query"; queryLength: number }
  | { name: "search_result_click"; resultType: string; slug: string }
  | { name: "outbound_store_click"; gameSlug: string; store: string };

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function track(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;
  const payload = { event: event.name, ...event, timestamp: Date.now() };
  window.dataLayer?.push(payload);
  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", payload);
  }
}

/**
 * Strapi adapter: maps site-configuration REST responses (nav, settings,
 * homepage layout) into the web domain model. Degrades to the fixture
 * adapter on any failure. Strapi is no longer used for content — real
 * content comes from the news wire and RAWG.
 */
import { CMS_URL, REVALIDATE_SECONDS } from "../config";
import { fixtureAdapter } from "./fixtures";
import type { CmsAdapter } from "./types";

type Entity = Record<string, unknown>;

async function cmsFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`/api${path}`, CMS_URL!);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  const response = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
  if (!response.ok) throw new Error(`CMS responded ${response.status} for ${path}`);
  return response.json() as Promise<T>;
}

/** Wrap a Strapi call with fixture fallback. */
async function withFallback<T>(label: string, strapiCall: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
  try {
    return await strapiCall();
  } catch (error) {
    console.warn(`[cms] ${label} failed (${(error as Error).message}); serving fixture config.`);
    return fallback();
  }
}

export const strapiAdapter: CmsAdapter = {
  source: "strapi",

  getSiteSettings: () =>
    withFallback(
      "site-settings",
      async () => {
        const data = await cmsFetch<{ data: Entity }>("/site-setting");
        const s = data.data;
        const fixture = await fixtureAdapter.getSiteSettings();
        return {
          ...fixture,
          siteName: String(s.siteName ?? fixture.siteName),
          tagline: String(s.tagline ?? fixture.tagline),
          demoNotice: String(s.demoNotice ?? fixture.demoNotice),
          newsletterHeading: String(s.newsletterHeading ?? fixture.newsletterHeading),
          newsletterSubheading: String(s.newsletterSubheading ?? fixture.newsletterSubheading),
        };
      },
      fixtureAdapter.getSiteSettings,
    ),

  getNavigation: () =>
    withFallback(
      "navigation",
      async () => {
        const data = await cmsFetch<{ data: Entity }>(
          "/navigation-config?populate[primary][populate]=children&populate[footer][populate]=children",
        );
        const mapItems = (items: unknown): import("@gaming-pulse/seed-data").SeedNavItem[] =>
          Array.isArray(items)
            ? items.map((i: Entity) => ({
                label: String(i.label),
                href: String(i.href),
                children: Array.isArray(i.children) && i.children.length
                  ? (i.children as Entity[]).map((c) => ({ label: String(c.label), href: String(c.href) }))
                  : undefined,
              }))
            : [];
        return { primary: mapItems(data.data.primary), footer: mapItems(data.data.footer) };
      },
      fixtureAdapter.getNavigation,
    ),

  getHomepageSections: () =>
    withFallback(
      "homepage-config",
      async () => {
        const data = await cmsFetch<{ data: Entity }>("/homepage-config?populate=sections");
        const sections = (data.data.sections ?? []) as Entity[];
        return sections
          .map((s) => ({
            kind: s.kind as never,
            title: String(s.title),
            enabled: Boolean(s.enabled),
            order: Number(s.order),
            curatedSlugs: (s.curatedSlugs as string[]) ?? [],
            maxItems: Number(s.maxItems ?? 6),
          }))
          .sort((a, b) => a.order - b.order);
      },
      fixtureAdapter.getHomepageSections,
    ),
};

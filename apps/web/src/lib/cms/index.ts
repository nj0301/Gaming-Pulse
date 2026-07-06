/**
 * CMS entry point. Chooses the active adapter:
 *  - CMS_URL set  -> Strapi adapter (with per-call fixture fallback)
 *  - CMS_URL unset -> bundled fictional demo content
 */
import { cache } from "react";
import { CMS_URL } from "../config";
import { fixtureAdapter } from "./fixtures";
import { strapiAdapter } from "./strapi";
import type { CmsAdapter } from "./types";

export const cms: CmsAdapter = CMS_URL ? strapiAdapter : fixtureAdapter;

/** Request-deduplicated accessors for layout-level data. */
export const getSiteSettings = cache(() => cms.getSiteSettings());
export const getNavigation = cache(() => cms.getNavigation());

export type * from "./types";

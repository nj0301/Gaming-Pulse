/**
 * IGDB adapter (disabled until credentials are configured).
 *
 * Env: IGDB_CLIENT_ID, IGDB_CLIENT_SECRET
 *
 * Commercial-use note: IGDB's API terms restrict commercial usage tiers —
 * validate licensing for your deployment before enabling this provider
 * (docs/DATA-INTEGRATIONS.md). Synced games are created as DRAFTS with
 * dataSource="igdb"; editors review, localize and publish. Entities with
 * editorOverride=true are never overwritten by sync.
 */
import type { Core } from "@strapi/strapi";
import { fetchJson } from "./base";

const TOKEN_URL = "https://id.twitch.tv/oauth2/token";
const API_URL = "https://api.igdb.com/v4";

interface IgdbGame {
  id: number;
  name: string;
  slug: string;
  summary?: string;
  first_release_date?: number;
}

export function isEnabled(): boolean {
  return Boolean(process.env.IGDB_CLIENT_ID && process.env.IGDB_CLIENT_SECRET);
}

async function getAccessToken(): Promise<string> {
  const data = await fetchJson<{ access_token: string }>("igdb-auth", TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.IGDB_CLIENT_ID!,
      client_secret: process.env.IGDB_CLIENT_SECRET!,
      grant_type: "client_credentials",
    }).toString(),
    cacheKey: "igdb:token",
    cacheTtlSeconds: 3000,
  });
  return data.access_token;
}

export async function searchGames(query: string): Promise<IgdbGame[]> {
  if (!isEnabled()) return [];
  const token = await getAccessToken();
  return fetchJson<IgdbGame[]>("igdb", `${API_URL}/games`, {
    method: "POST",
    headers: {
      "Client-ID": process.env.IGDB_CLIENT_ID!,
      Authorization: `Bearer ${token}`,
    },
    body: `search "${query.replace(/"/g, "")}"; fields name,slug,summary,first_release_date; limit 20;`,
    cacheKey: `igdb:search:${query.toLowerCase()}`,
    cacheTtlSeconds: 3600,
  });
}

/**
 * Sync a game by external id into a draft entity. Deduplicates on
 * externalDatabaseId and never touches editor-overridden entries.
 */
export async function syncGame(strapi: Core.Strapi, igdbGame: IgdbGame): Promise<void> {
  const externalDatabaseId = `igdb-${igdbGame.id}`;
  const existing = await strapi.documents("api::game.game").findFirst({
    filters: { externalDatabaseId },
  });

  if (existing?.editorOverride) {
    strapi.log.info(`[igdb] skipping ${igdbGame.slug}: editor override set`);
    return;
  }

  // Cast: generated content types lag behind schema edits until `strapi ts:generate-types` runs.
  const data = {
    name: igdbGame.name,
    slug: igdbGame.slug,
    summary: igdbGame.summary ?? "",
    externalDatabaseId,
    dataSource: "igdb" as const,
    lastSynchronizedAt: new Date().toISOString(),
  } as Record<string, unknown>;

  if (existing) {
    await strapi.documents("api::game.game").update({ documentId: existing.documentId, data });
  } else {
    // Draft only — editorial publishes after review.
    await strapi.documents("api::game.game").create({ data });
  }
}

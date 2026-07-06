/**
 * Twitch API adapter (disabled until TWITCH_CLIENT_ID/SECRET configured).
 *
 * Provides live-viewership signals consumed by the trend scoring service as
 * part of "platform reach"/"engagement" inputs. Read-only; caches 5 minutes.
 */
import { fetchJson } from "./base";

const TOKEN_URL = "https://id.twitch.tv/oauth2/token";
const API_URL = "https://api.twitch.tv/helix";

export function isEnabled(): boolean {
  return Boolean(process.env.TWITCH_CLIENT_ID && process.env.TWITCH_CLIENT_SECRET);
}

async function getAccessToken(): Promise<string> {
  const data = await fetchJson<{ access_token: string }>("twitch-auth", TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.TWITCH_CLIENT_ID!,
      client_secret: process.env.TWITCH_CLIENT_SECRET!,
      grant_type: "client_credentials",
    }).toString(),
    cacheKey: "twitch:token",
    cacheTtlSeconds: 3000,
  });
  return data.access_token;
}

/** Current total viewers for a game name on Twitch, or null when disabled/unknown. */
export async function getGameViewership(gameName: string): Promise<number | null> {
  if (!isEnabled()) return null;
  const token = await getAccessToken();
  const headers = {
    "Client-ID": process.env.TWITCH_CLIENT_ID!,
    Authorization: `Bearer ${token}`,
  };

  const gameData = await fetchJson<{ data: Array<{ id: string }> }>(
    "twitch",
    `${API_URL}/games?name=${encodeURIComponent(gameName)}`,
    { headers, cacheKey: `twitch:game:${gameName.toLowerCase()}`, cacheTtlSeconds: 86_400 },
  );
  const gameId = gameData.data[0]?.id;
  if (!gameId) return null;

  const streams = await fetchJson<{ data: Array<{ viewer_count: number }> }>(
    "twitch",
    `${API_URL}/streams?game_id=${gameId}&first=100`,
    { headers, cacheKey: `twitch:streams:${gameId}`, cacheTtlSeconds: 300 },
  );
  return streams.data.reduce((sum, s) => sum + s.viewer_count, 0);
}

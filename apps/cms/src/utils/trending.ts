/**
 * Trend scoring — mirrors @gaming-pulse/core/src/trending.ts, which is the
 * canonical, unit-tested implementation. Duplicated here because Strapi's
 * build compiles only ./src; keep both files in sync when changing weights.
 */

export interface TrendSignals {
  hoursSinceLastSignal: number;
  engagementVelocity: number;
  peakEngagementVelocity: number;
  searchInterest: number;
  sourceCount: number;
  averageSourceAuthority: number;
  platformCount: number;
  editorialSignificance: number;
  manualAdjustment: number;
}

export const TREND_WEIGHTS = {
  recency: 0.3,
  engagement: 0.2,
  search: 0.15,
  sources: 0.15,
  reach: 0.1,
  significance: 0.05,
  manual: 0.05,
} as const;

const RECENCY_HALF_LIFE_HOURS = 12;
const MAX_COUNTED_SOURCES = 8;
const MAX_COUNTED_PLATFORMS = 8;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export function calculateTrendScore(signals: TrendSignals): number {
  const recency = 100 * Math.pow(0.5, Math.max(0, signals.hoursSinceLastSignal) / RECENCY_HALF_LIFE_HOURS);
  const engagement =
    signals.peakEngagementVelocity > 0
      ? clamp((Math.max(0, signals.engagementVelocity) / signals.peakEngagementVelocity) * 100, 0, 100)
      : 0;
  const breadth = clamp(signals.sourceCount / MAX_COUNTED_SOURCES, 0, 1);
  const authority = clamp((signals.averageSourceAuthority - 1) / 4, 0, 1);
  const sources = (breadth * 0.5 + authority * 0.5) * 100;
  const reach = clamp(signals.platformCount / MAX_COUNTED_PLATFORMS, 0, 1) * 100;

  const raw =
    recency * TREND_WEIGHTS.recency +
    engagement * TREND_WEIGHTS.engagement +
    clamp(signals.searchInterest, 0, 100) * TREND_WEIGHTS.search +
    sources * TREND_WEIGHTS.sources +
    reach * TREND_WEIGHTS.reach +
    clamp(signals.editorialSignificance, 0, 100) * TREND_WEIGHTS.significance +
    clamp(signals.manualAdjustment, -100, 100) * TREND_WEIGHTS.manual;

  return Math.round(clamp(raw, 0, 100) * 10) / 10;
}

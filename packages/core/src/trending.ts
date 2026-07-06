/**
 * Trending score calculation for the Gaming Pulse trend system.
 *
 * Weighted composite (all component inputs normalized to 0–100):
 *   recency 30% · engagement velocity 20% · search interest 15% ·
 *   source count/authority 15% · platform reach 10% ·
 *   editorial significance 5% · manual editorial adjustment 5%
 */

export interface TrendSignals {
  /** Hours since the trend's newest supporting content was published. */
  hoursSinceLastSignal: number;
  /** Engagement events (views, shares, clicks) per hour, site-relative. */
  engagementVelocity: number;
  /** Peak engagement velocity observed across the site in the same window (for normalization). */
  peakEngagementVelocity: number;
  /** Search interest, 0–100 (e.g. internal search share or external index). */
  searchInterest: number;
  /** Distinct sources reporting the story. */
  sourceCount: number;
  /** Average authority of those sources, 1 (unverified) – 5 (official). */
  averageSourceAuthority: number;
  /** Number of platforms the subject touches (PC, PS, Xbox, ...). */
  platformCount: number;
  /** Editor-assigned significance, 0–100. */
  editorialSignificance: number;
  /** Manual editorial adjustment, -100 to +100. Scaled into the 5% band. */
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

/** Recency half-life in hours: score halves roughly every 12 hours. */
const RECENCY_HALF_LIFE_HOURS = 12;
const MAX_COUNTED_SOURCES = 8;
const MAX_COUNTED_PLATFORMS = 8;

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

/** Exponential-decay recency score, 0–100. */
export function recencyScore(hoursSinceLastSignal: number): number {
  const hours = Math.max(0, hoursSinceLastSignal);
  return 100 * Math.pow(0.5, hours / RECENCY_HALF_LIFE_HOURS);
}

/** Engagement velocity relative to the current site peak, 0–100. */
export function engagementScore(velocity: number, peakVelocity: number): number {
  if (peakVelocity <= 0) return 0;
  return clamp((Math.max(0, velocity) / peakVelocity) * 100, 0, 100);
}

/** Source score blends breadth (count) and authority, 0–100. */
export function sourceScore(sourceCount: number, averageAuthority: number): number {
  const breadth = clamp(sourceCount / MAX_COUNTED_SOURCES, 0, 1);
  const authority = clamp((averageAuthority - 1) / 4, 0, 1);
  return (breadth * 0.5 + authority * 0.5) * 100;
}

/** Platform reach, 0–100. */
export function reachScore(platformCount: number): number {
  return clamp(platformCount / MAX_COUNTED_PLATFORMS, 0, 1) * 100;
}

export interface TrendScoreBreakdown {
  total: number;
  components: {
    recency: number;
    engagement: number;
    search: number;
    sources: number;
    reach: number;
    significance: number;
    manual: number;
  };
}

/**
 * Composite trending score, 0–100 (manual adjustment can push a component
 * negative but the total is clamped to 0–100).
 */
export function calculateTrendScore(signals: TrendSignals): TrendScoreBreakdown {
  const components = {
    recency: recencyScore(signals.hoursSinceLastSignal) * TREND_WEIGHTS.recency,
    engagement:
      engagementScore(signals.engagementVelocity, signals.peakEngagementVelocity) *
      TREND_WEIGHTS.engagement,
    search: clamp(signals.searchInterest, 0, 100) * TREND_WEIGHTS.search,
    sources:
      sourceScore(signals.sourceCount, signals.averageSourceAuthority) * TREND_WEIGHTS.sources,
    reach: reachScore(signals.platformCount) * TREND_WEIGHTS.reach,
    significance:
      clamp(signals.editorialSignificance, 0, 100) * TREND_WEIGHTS.significance,
    manual: clamp(signals.manualAdjustment, -100, 100) * TREND_WEIGHTS.manual,
  };

  const raw = Object.values(components).reduce((sum, v) => sum + v, 0);
  return { total: Math.round(clamp(raw, 0, 100) * 10) / 10, components };
}

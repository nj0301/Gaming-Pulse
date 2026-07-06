import { describe, expect, it } from "vitest";
import {
  calculateTrendScore,
  engagementScore,
  reachScore,
  recencyScore,
  sourceScore,
  TREND_WEIGHTS,
  type TrendSignals,
} from "../src/trending";

const baseSignals: TrendSignals = {
  hoursSinceLastSignal: 0,
  engagementVelocity: 0,
  peakEngagementVelocity: 100,
  searchInterest: 0,
  sourceCount: 0,
  averageSourceAuthority: 1,
  platformCount: 0,
  editorialSignificance: 0,
  manualAdjustment: 0,
};

describe("trend weights", () => {
  it("sum to 1", () => {
    const sum = Object.values(TREND_WEIGHTS).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1);
  });
});

describe("recencyScore", () => {
  it("is 100 for a fresh signal", () => {
    expect(recencyScore(0)).toBe(100);
  });
  it("halves every 12 hours", () => {
    expect(recencyScore(12)).toBeCloseTo(50);
    expect(recencyScore(24)).toBeCloseTo(25);
  });
  it("treats negative hours as fresh", () => {
    expect(recencyScore(-5)).toBe(100);
  });
});

describe("engagementScore", () => {
  it("normalizes against the site peak", () => {
    expect(engagementScore(50, 100)).toBe(50);
  });
  it("caps at 100", () => {
    expect(engagementScore(500, 100)).toBe(100);
  });
  it("returns 0 when there is no peak", () => {
    expect(engagementScore(50, 0)).toBe(0);
  });
});

describe("sourceScore", () => {
  it("rewards official multi-source stories", () => {
    expect(sourceScore(8, 5)).toBe(100);
  });
  it("scores a single unverified source low", () => {
    expect(sourceScore(1, 1)).toBeLessThan(10);
  });
});

describe("reachScore", () => {
  it("scales with platform count and caps", () => {
    expect(reachScore(4)).toBe(50);
    expect(reachScore(20)).toBe(100);
  });
});

describe("calculateTrendScore", () => {
  it("gives a maximal story ~100", () => {
    const { total } = calculateTrendScore({
      hoursSinceLastSignal: 0,
      engagementVelocity: 100,
      peakEngagementVelocity: 100,
      searchInterest: 100,
      sourceCount: 8,
      averageSourceAuthority: 5,
      platformCount: 8,
      editorialSignificance: 100,
      manualAdjustment: 100,
    });
    expect(total).toBe(100);
  });

  it("gives a dead story ~0", () => {
    const { total } = calculateTrendScore({
      ...baseSignals,
      hoursSinceLastSignal: 24 * 30,
    });
    expect(total).toBeLessThan(1);
  });

  it("weights recency at 30% of the total", () => {
    const { components } = calculateTrendScore({ ...baseSignals, hoursSinceLastSignal: 0 });
    expect(components.recency).toBeCloseTo(30);
  });

  it("allows manual adjustment to lower a score", () => {
    const up = calculateTrendScore({ ...baseSignals, manualAdjustment: 100 });
    const down = calculateTrendScore({ ...baseSignals, manualAdjustment: -100 });
    expect(up.total).toBeGreaterThan(down.total);
    expect(down.total).toBeGreaterThanOrEqual(0);
  });

  it("never exceeds bounds", () => {
    const { total } = calculateTrendScore({
      ...baseSignals,
      searchInterest: 10_000,
      editorialSignificance: 10_000,
    });
    expect(total).toBeLessThanOrEqual(100);
  });
});

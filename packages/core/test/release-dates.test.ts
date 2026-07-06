import { describe, expect, it } from "vitest";
import {
  formatReleaseDate,
  isUpcoming,
  releaseSortKey,
  type ReleaseDateLike,
} from "../src/release-dates";

const d = (date: string | null, precision: ReleaseDateLike["precision"]): ReleaseDateLike => ({
  date,
  precision,
});

describe("formatReleaseDate", () => {
  it("formats exact dates", () => {
    expect(formatReleaseDate(d("2026-09-17", "exact"))).toBe("September 17, 2026");
  });
  it("formats month precision without inventing a day", () => {
    expect(formatReleaseDate(d("2026-09-01", "month"))).toBe("September 2026");
  });
  it("formats quarter precision", () => {
    expect(formatReleaseDate(d("2026-08-01", "quarter"))).toBe("Q3 2026");
  });
  it("formats year precision", () => {
    expect(formatReleaseDate(d("2027-01-01", "year"))).toBe("2027");
  });
  it("formats TBA regardless of stored date", () => {
    expect(formatReleaseDate(d("2026-01-01", "tba"))).toBe("TBA");
    expect(formatReleaseDate(d(null, "tba"))).toBe("TBA");
  });
  it("falls back to TBA on malformed dates", () => {
    expect(formatReleaseDate(d("soon", "exact"))).toBe("TBA");
  });
});

describe("releaseSortKey", () => {
  it("orders exact < month-window < TBA", () => {
    const exact = releaseSortKey(d("2026-03-10", "exact"));
    const month = releaseSortKey(d("2026-04-01", "month"));
    const tba = releaseSortKey(d(null, "tba"));
    expect(exact).toBeLessThan(month);
    expect(month).toBeLessThan(tba);
  });
  it("uses the start of a quarter window", () => {
    expect(releaseSortKey(d("2026-08-15", "quarter"))).toBe(Date.UTC(2026, 6, 1));
  });
});

describe("isUpcoming", () => {
  const now = new Date("2026-07-05T12:00:00Z");
  it("treats a passed exact date as released", () => {
    expect(isUpcoming(d("2026-07-01", "exact"), now)).toBe(false);
  });
  it("treats a future exact date as upcoming", () => {
    expect(isUpcoming(d("2026-07-06", "exact"), now)).toBe(true);
  });
  it("keeps the current quarter upcoming until it ends", () => {
    expect(isUpcoming(d("2026-07-01", "quarter"), now)).toBe(true);
  });
  it("keeps the current year upcoming until it ends", () => {
    expect(isUpcoming(d("2026-01-01", "year"), now)).toBe(true);
  });
  it("always treats TBA as upcoming", () => {
    expect(isUpcoming(d(null, "tba"), now)).toBe(true);
  });
});

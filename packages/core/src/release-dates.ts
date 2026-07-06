/**
 * Release-date precision handling.
 *
 * A release date entry stores an ISO date plus a precision level. Display and
 * sorting must respect the precision — "Q3 2026" must never render as a fake
 * exact day.
 */

export type ReleasePrecision = "exact" | "month" | "quarter" | "year" | "tba";

export type ReleaseKind =
  | "full"
  | "early-access"
  | "dlc"
  | "expansion"
  | "remake"
  | "remaster"
  | "port";

export interface ReleaseDateLike {
  /** ISO date (YYYY-MM-DD). Ignored when precision is "tba". */
  date: string | null;
  precision: ReleasePrecision;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

function parts(iso: string): { year: number; month: number; day: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return null;
  return { year: Number(m[1]), month: Number(m[2]), day: Number(m[3]) };
}

/** Format a release date according to its precision, e.g. "Q3 2026", "March 2026", "TBA". */
export function formatReleaseDate(entry: ReleaseDateLike, locale = "en-US"): string {
  if (entry.precision === "tba" || !entry.date) return "TBA";
  const p = parts(entry.date);
  if (!p) return "TBA";

  switch (entry.precision) {
    case "year":
      return String(p.year);
    case "quarter":
      return `Q${Math.ceil(p.month / 3)} ${p.year}`;
    case "month":
      return `${MONTHS[p.month - 1]} ${p.year}`;
    case "exact":
      return new Date(Date.UTC(p.year, p.month - 1, p.day)).toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      });
  }
}

/**
 * Sort key: earliest possible moment of the window. TBA sorts last.
 * Returns a comparable number (ms epoch; Infinity for TBA).
 */
export function releaseSortKey(entry: ReleaseDateLike): number {
  if (entry.precision === "tba" || !entry.date) return Number.POSITIVE_INFINITY;
  const p = parts(entry.date);
  if (!p) return Number.POSITIVE_INFINITY;
  switch (entry.precision) {
    case "year":
      return Date.UTC(p.year, 0, 1);
    case "quarter": {
      const quarterStartMonth = (Math.ceil(p.month / 3) - 1) * 3;
      return Date.UTC(p.year, quarterStartMonth, 1);
    }
    case "month":
      return Date.UTC(p.year, p.month - 1, 1);
    case "exact":
      return Date.UTC(p.year, p.month - 1, p.day);
  }
}

/** True when the (possibly imprecise) window has not fully passed at `now`. */
export function isUpcoming(entry: ReleaseDateLike, now: Date = new Date()): boolean {
  if (entry.precision === "tba" || !entry.date) return true;
  const p = parts(entry.date);
  if (!p) return true;
  let end: number;
  switch (entry.precision) {
    case "year":
      end = Date.UTC(p.year + 1, 0, 1);
      break;
    case "quarter":
      end = Date.UTC(p.year, Math.ceil(p.month / 3) * 3, 1);
      break;
    case "month":
      end = Date.UTC(p.year, p.month, 1);
      break;
    case "exact":
      end = Date.UTC(p.year, p.month - 1, p.day + 1);
      break;
  }
  return now.getTime() < end;
}

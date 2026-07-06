/** Text helpers shared by web and CMS. */

export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(input: string, maxLength: number): string {
  if (input.length <= maxLength) return input;
  const cut = input.slice(0, maxLength - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > maxLength * 0.6 ? lastSpace : cut.length).trimEnd()}…`;
}

/** Relative time label for editorial timestamps, e.g. "3 hours ago". */
export function timeAgo(iso: string, now: Date = new Date()): string {
  const then = new Date(iso).getTime();
  const diffSeconds = Math.max(0, Math.floor((now.getTime() - then) / 1000));
  const units: Array<[label: string, seconds: number]> = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [label, seconds] of units) {
    const value = Math.floor(diffSeconds / seconds);
    if (value >= 1) return `${value} ${label}${value > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

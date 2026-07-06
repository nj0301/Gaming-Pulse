"use client";

/**
 * Release calendar with timeline / month-grouped calendar / list views and
 * the full filter set (platform, genre, region, developer/publisher, release
 * kind, confidence). Server provides pre-joined entries; filtering is
 * instant and client-side. Filters collapse into a drawer on mobile.
 */
import Link from "next/link";
import { useMemo, useState } from "react";
import { formatReleaseDate, releaseSortKey, type ReleaseKind, type ReleasePrecision } from "@gaming-pulse/core";
import { track } from "@/lib/analytics";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/section";

export interface CalendarEntry {
  id: string;
  gameSlug: string;
  gameName: string;
  platformSlugs: string[];
  region: string;
  date: string | null;
  precision: ReleasePrecision;
  kind: ReleaseKind;
  confirmed: boolean;
  note?: string;
  genres: string[];
  developerSlug: string;
  publisherSlug: string;
}

interface Props {
  entries: CalendarEntry[];
  platforms: Array<{ name: string; slug: string; shortName: string }>;
  genres: string[];
  companies: Array<{ name: string; slug: string }>;
}

type View = "timeline" | "calendar" | "list";

const KINDS: Array<{ value: ReleaseKind | "all"; label: string }> = [
  { value: "all", label: "All types" },
  { value: "full", label: "Full release" },
  { value: "early-access", label: "Early access" },
  { value: "dlc", label: "DLC" },
  { value: "expansion", label: "Expansion" },
  { value: "remake", label: "Remake" },
  { value: "remaster", label: "Remaster" },
];

const CONFIDENCE = [
  { value: "all", label: "Any confidence" },
  { value: "confirmed", label: "Confirmed date" },
  { value: "window", label: "Release window" },
  { value: "tba", label: "TBA" },
] as const;

export function ReleaseCalendar({ entries, platforms, genres, companies }: Props) {
  const [view, setView] = useState<View>("timeline");
  const [platform, setPlatform] = useState("all");
  const [genre, setGenre] = useState("all");
  const [region, setRegion] = useState("all");
  const [company, setCompany] = useState("all");
  const [kind, setKind] = useState<string>("all");
  const [confidence, setConfidence] = useState<string>("all");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(
    () =>
      entries
        .filter((entry) => platform === "all" || entry.platformSlugs.includes(platform))
        .filter((entry) => genre === "all" || entry.genres.includes(genre))
        .filter((entry) => region === "all" || entry.region === region)
        .filter(
          (entry) =>
            company === "all" || entry.developerSlug === company || entry.publisherSlug === company,
        )
        .filter((entry) => kind === "all" || entry.kind === kind)
        .filter((entry) => {
          if (confidence === "all") return true;
          if (confidence === "confirmed") return entry.confirmed && entry.precision === "exact";
          if (confidence === "window") return entry.precision !== "exact" && entry.precision !== "tba";
          return entry.precision === "tba";
        })
        .sort((a, b) => releaseSortKey(a) - releaseSortKey(b)),
    [entries, platform, genre, region, company, kind, confidence],
  );

  const monthGroups = useMemo(() => {
    const groups = new Map<string, CalendarEntry[]>();
    for (const entry of filtered) {
      const key =
        entry.precision === "tba" || !entry.date
          ? "To be announced"
          : entry.precision === "year"
            ? entry.date.slice(0, 4)
            : new Date(entry.date).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
      groups.set(key, [...(groups.get(key) ?? []), entry]);
    }
    return [...groups.entries()];
  }, [filtered]);

  const onFilter = (name: string) => (event: React.ChangeEvent<HTMLSelectElement>) => {
    track({ name: "release_filter", filter: name, value: event.target.value });
    switch (name) {
      case "platform":
        setPlatform(event.target.value);
        break;
      case "genre":
        setGenre(event.target.value);
        break;
      case "region":
        setRegion(event.target.value);
        break;
      case "company":
        setCompany(event.target.value);
        break;
      case "kind":
        setKind(event.target.value);
        break;
      case "confidence":
        setConfidence(event.target.value);
        break;
    }
  };

  const select =
    "rounded border border-edge bg-surface px-3 py-2 text-sm text-fg-secondary focus:border-cyan";

  const filters = (
    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <label className="flex flex-col gap-1 text-xs text-fg-muted">
        Platform
        <select value={platform} onChange={onFilter("platform")} className={select}>
          <option value="all">All platforms</option>
          {platforms.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-xs text-fg-muted">
        Genre
        <select value={genre} onChange={onFilter("genre")} className={select}>
          <option value="all">All genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-xs text-fg-muted">
        Region
        <select value={region} onChange={onFilter("region")} className={select}>
          <option value="all">All regions</option>
          <option value="worldwide">Worldwide</option>
          <option value="na">North America</option>
          <option value="eu">Europe</option>
          <option value="jp">Japan</option>
        </select>
      </label>
      <label className="flex flex-col gap-1 text-xs text-fg-muted">
        Studio
        <select value={company} onChange={onFilter("company")} className={select}>
          <option value="all">All studios</option>
          {companies.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-xs text-fg-muted">
        Type
        <select value={kind} onChange={onFilter("kind")} className={select}>
          {KINDS.map((k) => (
            <option key={k.value} value={k.value}>
              {k.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-xs text-fg-muted">
        Confidence
        <select value={confidence} onChange={onFilter("confidence")} className={select}>
          {CONFIDENCE.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );

  return (
    <div>
      {/* View switcher + mobile filter toggle */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="View" className="flex rounded-lg border border-edge bg-surface p-1">
          {(["timeline", "calendar", "list"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              aria-pressed={view === v}
              className={`rounded px-3 py-1.5 font-label text-sm font-semibold uppercase tracking-wider transition-colors ${
                view === v ? "bg-cyan text-bg" : "text-fg-secondary hover:text-fg"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setFiltersOpen(!filtersOpen)}
          aria-expanded={filtersOpen}
          className="rounded border border-edge bg-surface px-3 py-2 font-label text-sm font-semibold uppercase tracking-wider text-fg-secondary sm:hidden"
        >
          Filters {filtersOpen ? "▴" : "▾"}
        </button>
      </div>

      {/* Filters: always visible on ≥sm, drawer on mobile */}
      <div className={`${filtersOpen ? "block" : "hidden"} mb-6 sm:block`}>{filters}</div>

      <p className="mb-4 text-sm text-fg-muted" aria-live="polite">
        {filtered.length} release{filtered.length === 1 ? "" : "s"}
      </p>

      {filtered.length === 0 && (
        <EmptyState title="No releases match those filters" hint="Try removing a filter or two." />
      )}

      {view === "timeline" && filtered.length > 0 && (
        <ol className="relative border-l-2 border-edge pl-6">
          {filtered.map((entry) => (
            <li key={entry.id} className="relative pb-6 last:pb-0">
              <span
                aria-hidden
                className={`absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 ${
                  entry.confirmed ? "border-cyan bg-cyan/40" : "border-warning bg-warning/30"
                }`}
              />
              <EntryRow entry={entry} />
            </li>
          ))}
        </ol>
      )}

      {view === "calendar" && filtered.length > 0 && (
        <div className="space-y-8">
          {monthGroups.map(([month, group]) => (
            <section key={month} aria-label={month}>
              <h2 className="mb-3 border-b border-edge pb-2 font-display text-lg font-bold text-cyan">{month}</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.map((entry) => (
                  <div key={entry.id} className="rounded-lg border border-edge bg-surface p-4">
                    <EntryRow entry={entry} stacked />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {view === "list" && filtered.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-edge text-left font-label text-xs uppercase tracking-wider text-fg-muted">
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Game</th>
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">Platforms</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => (
                <tr key={entry.id} className="border-b border-edge/60">
                  <td className="py-2.5 pr-4 font-semibold text-cyan">{formatReleaseDate(entry)}</td>
                  <td className="py-2.5 pr-4">
                    <Link href={`/games/${entry.gameSlug}`} className="font-semibold text-fg hover:text-cyan">
                      {entry.gameName}
                    </Link>
                  </td>
                  <td className="py-2.5 pr-4 text-fg-secondary">{entry.kind.replace(/-/g, " ")}</td>
                  <td className="py-2.5 pr-4 text-fg-muted">{entry.platformSlugs.join(", ")}</td>
                  <td className="py-2.5">
                    <Badge tone={entry.confirmed ? "green" : "warning"}>
                      {entry.confirmed ? "Confirmed" : "Window"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function EntryRow({ entry, stacked = false }: { entry: CalendarEntry; stacked?: boolean }) {
  return (
    <div className={stacked ? "" : "flex flex-wrap items-center gap-x-4 gap-y-1"}>
      <span className={`font-label text-sm font-bold uppercase tracking-wide text-cyan ${stacked ? "block" : "w-36 shrink-0"}`}>
        {formatReleaseDate(entry)}
      </span>
      <Link href={`/games/${entry.gameSlug}`} className="font-display font-semibold text-fg hover:text-cyan">
        {entry.gameName}
      </Link>
      <span className="flex flex-wrap items-center gap-1.5">
        {entry.kind !== "full" && <Badge tone="violet">{entry.kind.replace(/-/g, " ")}</Badge>}
        {!entry.confirmed && <Badge tone="warning">window</Badge>}
        {entry.region !== "worldwide" && <Badge tone="neutral">{entry.region.toUpperCase()}</Badge>}
      </span>
      <span className="text-xs text-fg-muted">{entry.platformSlugs.join(" · ")}</span>
      {entry.note && <p className={`text-sm text-fg-muted ${stacked ? "mt-1" : "w-full"}`}>{entry.note}</p>}
    </div>
  );
}

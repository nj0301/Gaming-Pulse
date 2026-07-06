"use client";

/**
 * Full-screen search overlay: debounced input, keyboard navigation across
 * results, trending + recent searches, loading/empty/error states.
 * Queries go to /api/search (server route → CMS adapter).
 */
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { track } from "@/lib/analytics";
import { useEffects } from "@/components/motion/effects-provider";

interface FlatResult {
  type: string;
  label: string;
  href: string;
  hint?: string;
}

interface ApiResults {
  articles: Array<{ title: string; slug: string; articleType: string }>;
  games: Array<{ name: string; slug: string }>;
  companies: Array<{ name: string; slug: string }>;
  authors: Array<{ name: string; slug: string }>;
  platforms: Array<{ name: string; slug: string }>;
  categories: Array<{ name: string; slug: string }>;
  tags: Array<{ name: string; slug: string }>;
}

const TRENDING_SUGGESTIONS = [
  "Tempest expansion",
  "Petal & Blade",
  "Chrono Drift delay",
  "handheld",
  "extraction",
];

const RECENT_KEY = "gp-recent-searches";

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FlatResult[]>([]);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { reduced } = useEffects();

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      try {
        setRecent(JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]"));
      } catch {
        setRecent([]);
      }
    } else {
      setQuery("");
      setResults([]);
      setState("idle");
      setActiveIndex(-1);
    }
  }, [open]);

  // Debounced fetch.
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setState("idle");
      return;
    }
    setState("loading");
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Search failed (${response.status})`);
        const data = (await response.json()) as ApiResults;
        const flat: FlatResult[] = [
          ...data.articles.map((a) => ({ type: "Article", label: a.title, href: `/news/${a.slug}`, hint: a.articleType })),
          ...data.games.map((g) => ({ type: "Game", label: g.name, href: `/games/${g.slug}` })),
          ...data.platforms.map((p) => ({ type: "Platform", label: p.name, href: `/platform/${p.slug}` })),
          ...data.categories.map((c) => ({ type: "Category", label: c.name, href: `/category/${c.slug}` })),
          ...data.tags.map((t) => ({ type: "Tag", label: t.name, href: `/tag/${t.slug}` })),
          ...data.authors.map((a) => ({ type: "Author", label: a.name, href: `/author/${a.slug}` })),
          ...data.companies.map((c) => ({ type: "Company", label: c.name, href: `/search?q=${encodeURIComponent(c.name)}` })),
        ];
        setResults(flat);
        setState("done");
        setActiveIndex(flat.length ? 0 : -1);
        track({ name: "search_query", queryLength: query.length });
      } catch (error) {
        if ((error as Error).name !== "AbortError") setState("error");
      }
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const rememberQuery = (q: string) => {
    const next = [q, ...recent.filter((r) => r !== q)].slice(0, 5);
    setRecent(next);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  };

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter" && activeIndex >= 0 && results[activeIndex]) {
      const result = results[activeIndex];
      rememberQuery(query);
      track({ name: "search_result_click", resultType: result.type, slug: result.href });
      window.location.href = result.href;
    }
  }

  const suggestions = useMemo(() => (recent.length ? recent : TRENDING_SUGGESTIONS), [recent]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] bg-bg/95 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div className="mx-auto flex h-full max-w-3xl flex-col px-4 pt-20 sm:px-6">
            <div className="flex items-center gap-3">
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search articles, games, platforms…"
                aria-label="Search query"
                role="combobox"
                aria-expanded={results.length > 0}
                aria-controls="search-results"
                aria-activedescendant={activeIndex >= 0 ? `search-result-${activeIndex}` : undefined}
                className="w-full rounded-lg border border-edge bg-surface px-5 py-4 font-display text-xl text-fg placeholder:text-fg-muted focus:border-cyan"
              />
              <button
                type="button"
                onClick={onClose}
                className="rounded border border-edge px-4 py-4 text-fg-muted transition-colors hover:text-fg"
                aria-label="Close search"
              >
                Esc
              </button>
            </div>

            <div className="mt-6 flex-1 overflow-y-auto pb-16" id="search-results" role="listbox" aria-label="Search results">
              {state === "idle" && (
                <div>
                  <p className="mb-3 font-label text-xs font-semibold uppercase tracking-widest text-fg-muted">
                    {recent.length ? "Recent searches" : "Trending searches"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setQuery(s)}
                        className="rounded-full border border-edge bg-surface px-4 py-1.5 text-sm text-fg-secondary transition-colors hover:border-cyan/50 hover:text-cyan"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {state === "loading" && (
                <div className="space-y-3" aria-live="polite" aria-label="Loading results">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="gp-skeleton h-14 rounded-lg" />
                  ))}
                </div>
              )}

              {state === "error" && (
                <p role="alert" className="rounded-lg border border-warning/40 bg-warning/10 p-4 text-warning">
                  Search is unavailable right now. Please try again in a moment.
                </p>
              )}

              {state === "done" && results.length === 0 && (
                <p className="rounded-lg border border-edge bg-surface p-6 text-center text-fg-muted">
                  No results for “{query}”. Try a game, platform or topic.
                </p>
              )}

              {state === "done" &&
                results.map((result, index) => (
                  <Link
                    key={`${result.href}-${index}`}
                    id={`search-result-${index}`}
                    role="option"
                    aria-selected={index === activeIndex}
                    href={result.href}
                    onClick={() => {
                      rememberQuery(query);
                      track({ name: "search_result_click", resultType: result.type, slug: result.href });
                      onClose();
                    }}
                    className={`mb-2 flex items-center justify-between rounded-lg border px-4 py-3 transition-colors ${
                      index === activeIndex
                        ? "border-cyan/60 bg-surface-elevated"
                        : "border-edge bg-surface hover:border-cyan/40"
                    }`}
                  >
                    <span className="text-fg">{result.label}</span>
                    <span className="ml-4 shrink-0 font-label text-xs font-semibold uppercase tracking-wider text-fg-muted">
                      {result.hint ?? result.type}
                    </span>
                  </Link>
                ))}

              {query.trim().length >= 2 && (
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  onClick={onClose}
                  className="mt-4 block text-center font-label text-sm font-semibold uppercase tracking-wider text-cyan"
                >
                  Full search for “{query}” →
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

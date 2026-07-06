import type { Metadata } from "next";
import Link from "next/link";
import { cms } from "@/lib/cms";
import { Container, EmptyState } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Gaming Pulse articles, games, companies and authors.",
  alternates: { canonical: "/search" },
  robots: { index: false }, // query pages should not be indexed
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const query = q.slice(0, 100);
  const results = query.length >= 2 ? await cms.search(query) : null;

  const groups = results
    ? ([
        ["Articles", results.articles.map((a) => ({ label: a.title, href: `/news/${a.slug}`, hint: a.articleType }))],
        ["Games", results.games.map((g) => ({ label: g.name, href: `/games/${g.slug}`, hint: "game" }))],
        ["Platforms", results.platforms.map((p) => ({ label: p.name, href: `/platform/${p.slug}`, hint: "platform" }))],
        ["Categories", results.categories.map((c) => ({ label: c.name, href: `/category/${c.slug}`, hint: "category" }))],
        ["Tags", results.tags.map((t) => ({ label: t.name, href: `/tag/${t.slug}`, hint: "tag" }))],
        ["Authors", results.authors.map((a) => ({ label: a.name, href: `/author/${a.slug}`, hint: "author" }))],
      ] as const)
    : [];

  const total = groups.reduce((sum, [, items]) => sum + items.length, 0);

  return (
    <Container className="py-10">
      <h1 className="font-display text-3xl font-bold text-fg">Search</h1>

      {/* No-JS friendly search form */}
      <form action="/search" method="get" className="mt-6 flex max-w-xl gap-2" role="search">
        <label htmlFor="site-search" className="sr-only">
          Search query
        </label>
        <input
          id="site-search"
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search articles, games, platforms…"
          className="w-full rounded border border-edge bg-surface px-4 py-2.5 text-fg placeholder:text-fg-muted focus:border-cyan"
        />
        <button
          type="submit"
          className="rounded bg-cyan px-5 py-2.5 font-label text-sm font-bold uppercase tracking-wider text-bg"
        >
          Search
        </button>
      </form>

      <div className="mt-10">
        {query.length < 2 ? (
          <p className="text-fg-muted">Enter at least two characters to search.</p>
        ) : total === 0 ? (
          <EmptyState
            title={`No results for “${query}”`}
            hint="Try a different spelling, a game name, or a platform."
          />
        ) : (
          <div className="space-y-10">
            <p className="text-sm text-fg-muted" aria-live="polite">
              {total} result{total === 1 ? "" : "s"} for “{query}”
            </p>
            {groups
              .filter(([, items]) => items.length > 0)
              .map(([group, items]) => (
                <section key={group} aria-label={group}>
                  <h2 className="mb-3 font-display text-lg font-bold text-fg">{group}</h2>
                  <ul className="space-y-2">
                    {items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="flex items-center justify-between rounded-lg border border-edge bg-surface px-4 py-3 transition-colors hover:border-cyan/50"
                        >
                          <span className="text-fg">{item.label}</span>
                          <Badge tone="neutral">{item.hint}</Badge>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
          </div>
        )}
      </div>
    </Container>
  );
}

import type { Article, Source } from "@/lib/cms/types";
import { Badge } from "@/components/ui/badge";

/** "What you need to know" summary box. */
export function KeyPoints({ points }: { points: string[] }) {
  if (points.length === 0) return null;
  return (
    <aside aria-label="What you need to know" className="rounded-lg border border-cyan/30 bg-surface p-5">
      <h2 className="font-label text-sm font-bold uppercase tracking-widest text-cyan">What you need to know</h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-fg-secondary">
        {points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </aside>
  );
}

/** Confirmed vs unconfirmed panel — the fact-status backbone of every story. */
export function FactPanel({ article }: { article: Article }) {
  if (article.confirmedFacts.length === 0 && article.unconfirmedPoints.length === 0) return null;
  return (
    <section aria-label="Fact status" className="grid gap-4 sm:grid-cols-2">
      {article.confirmedFacts.length > 0 && (
        <div className="rounded-lg border border-signal/30 bg-signal/5 p-5">
          <h2 className="font-label text-sm font-bold uppercase tracking-widest text-signal">Confirmed</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-fg-secondary">
            {article.confirmedFacts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        </div>
      )}
      {article.unconfirmedPoints.length > 0 && (
        <div className="rounded-lg border border-warning/30 bg-warning/5 p-5">
          <h2 className="font-label text-sm font-bold uppercase tracking-widest text-warning">
            Unconfirmed / unknown
          </h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-fg-secondary">
            {article.unconfirmedPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

/** Source list with authority and official markers. */
export function SourceList({ sources }: { sources: Source[] }) {
  if (sources.length === 0) return null;
  return (
    <section aria-label="Sources" className="rounded-lg border border-edge bg-surface p-5">
      <h2 className="font-label text-sm font-bold uppercase tracking-widest text-fg-muted">Sources</h2>
      <ul className="mt-3 space-y-3">
        {sources.map((source) => (
          <li key={source.sourceUrl} className="text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={source.sourceUrl}
                rel="nofollow noopener"
                target="_blank"
                className="font-semibold text-fg underline decoration-edge underline-offset-4 hover:text-cyan"
              >
                {source.publisher}
              </a>
              <Badge tone={source.officialSource ? "green" : "neutral"}>
                {source.officialSource ? "Official" : source.sourceType.replace(/-/g, " ")}
              </Badge>
              <span className="text-xs text-fg-muted" title="Source authority, 1–5">
                Authority {source.authorityLevel}/5
              </span>
            </div>
            {source.notes && <p className="mt-1 text-xs text-fg-muted">{source.notes}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Update & correction log. */
export function CorrectionLog({ corrections }: { corrections: Article["correctionLog"] }) {
  if (corrections.length === 0) return null;
  return (
    <section aria-label="Updates and corrections" className="rounded-lg border border-edge bg-surface p-5">
      <h2 className="font-label text-sm font-bold uppercase tracking-widest text-fg-muted">
        Updates &amp; corrections
      </h2>
      <ol className="mt-3 space-y-2">
        {corrections.map((entry) => (
          <li key={entry.date} className="text-sm text-fg-secondary">
            <time dateTime={entry.date} className="mr-2 font-mono text-xs text-fg-muted">
              {new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </time>
            {entry.note}
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Review verdict box for review-type articles. */
export function ReviewVerdict({ review }: { review: NonNullable<Article["review"]> }) {
  return (
    <section aria-label="Review verdict" className="rounded-xl border border-signal/40 bg-surface p-6">
      <div className="flex items-center gap-5">
        <p className="font-display text-5xl font-bold text-signal">
          {review.score.toFixed(1)}
          <span className="text-xl text-fg-muted">/{review.scoreMax}</span>
        </p>
        <p className="font-display text-lg font-semibold text-fg">{review.verdict}</p>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <h3 className="font-label text-xs font-bold uppercase tracking-widest text-signal">Pros</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-fg-secondary">
            {review.pros.map((pro) => (
              <li key={pro}>{pro}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-label text-xs font-bold uppercase tracking-widest text-warning">Cons</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-fg-secondary">
            {review.cons.map((con) => (
              <li key={con}>{con}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-4 text-xs text-fg-muted">
        Reviewed on {review.reviewedOnPlatform} · {review.copyProvidedBy}
      </p>
    </section>
  );
}

/** Speculation banner for rumor/leak/opinion content. */
export function SpeculativeBanner({ articleType }: { articleType: string }) {
  const copy: Record<string, string> = {
    rumor:
      "This story reports a rumor. The claims below are not confirmed; treat timelines and details as provisional.",
    leak: "This story covers leaked material that has not been verified or acknowledged by the companies involved.",
    opinion: "This is an opinion column. It represents the author's argument, not Gaming Pulse news reporting.",
    report:
      "This is original reporting based on sources; the companies involved have not confirmed the details below.",
    analysis: "This is analysis — interpretation built on the sourced facts linked within.",
  };
  const text = copy[articleType];
  if (!text) return null;
  return (
    <p role="note" className="rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-warning">
      {text}
    </p>
  );
}

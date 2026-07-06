import clsx from "clsx";
import Link from "next/link";
import type { ReactNode } from "react";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

export function SectionHeading({
  title,
  href,
  accent = "cyan",
  children,
}: {
  title: string;
  href?: string;
  accent?: "cyan" | "violet" | "magenta" | "green" | "warning";
  children?: ReactNode;
}) {
  const accentClass = {
    cyan: "bg-cyan",
    violet: "bg-violet",
    magenta: "bg-magenta",
    green: "bg-signal",
    warning: "bg-warning",
  }[accent];

  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <h2 className="flex items-center gap-3 font-display text-xl font-bold text-fg sm:text-2xl">
        <span aria-hidden className={clsx("h-6 w-1 rounded", accentClass)} />
        {title}
      </h2>
      {href ? (
        <Link
          href={href}
          className="shrink-0 font-label text-sm font-semibold uppercase tracking-wider text-fg-muted transition-colors hover:text-cyan"
        >
          View all →
        </Link>
      ) : (
        children
      )}
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-lg border border-edge bg-surface p-10 text-center">
      <p className="font-display text-lg font-semibold text-fg">{title}</p>
      {hint && <p className="mt-2 text-sm text-fg-muted">{hint}</p>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={clsx("gp-skeleton rounded-lg", className)} />;
}

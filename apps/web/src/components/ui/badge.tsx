import clsx from "clsx";
import type { ReactNode } from "react";

export type BadgeTone =
  | "neutral"
  | "cyan"
  | "violet"
  | "magenta"
  | "green"
  | "warning"
  | "danger";

const tones: Record<BadgeTone, string> = {
  neutral: "border-edge bg-surface text-fg-secondary",
  cyan: "border-cyan/40 bg-cyan/10 text-cyan",
  violet: "border-violet/40 bg-violet/10 text-violet",
  magenta: "border-magenta/40 bg-magenta/10 text-magenta",
  green: "border-signal/40 bg-signal/10 text-signal",
  warning: "border-warning/40 bg-warning/10 text-warning",
  danger: "border-red-500/40 bg-red-500/10 text-red-400",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 border px-2 py-0.5 font-label text-xs font-semibold uppercase tracking-wider",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Maps editorial labels to visual tones — rumor/leak/opinion stand apart. */
export function articleTypeTone(articleType: string): BadgeTone {
  switch (articleType) {
    case "breaking":
      return "danger";
    case "rumor":
    case "leak":
      return "warning";
    case "opinion":
    case "analysis":
      return "violet";
    case "review":
      return "green";
    case "sponsored":
      return "magenta";
    default:
      return "cyan";
  }
}

export function factStatusTone(factStatus: string): BadgeTone {
  switch (factStatus) {
    case "confirmed":
      return "green";
    case "rumor":
    case "unconfirmed":
      return "warning";
    case "opinion":
      return "violet";
    default:
      return "neutral";
  }
}

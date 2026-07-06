import type { ReactNode } from "react";

/**
 * Static wrapper — content renders immediately, no entrance animation.
 * Kept as a component (rather than removing every call site) so callers
 * don't need to change; decorative motion was removed sitewide per design
 * direction (futuristic-but-static theme).
 */
export function Reveal({
  children,
  className,
  as: Component = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article";
}) {
  return <Component className={className}>{children}</Component>;
}

"use client";

/** Reading-progress bar + scroll-depth analytics (25/50/75/100). */
import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";

export function ReadingProgress({ slug }: { slug: string }) {
  const [progress, setProgress] = useState(0);
  const reported = useRef(new Set<number>());

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const percent = total > 0 ? Math.min(100, (window.scrollY / total) * 100) : 0;
        setProgress(percent);
        for (const milestone of [25, 50, 75, 100] as const) {
          if (percent >= milestone && !reported.current.has(milestone)) {
            reported.current.add(milestone);
            track({ name: "scroll_depth", slug, percent: milestone });
          }
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [slug]);

  return (
    <div aria-hidden className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent">
      <div
        className="h-full origin-left bg-gradient-to-r from-cyan via-violet to-magenta"
        style={{ transform: `scaleX(${progress / 100})` }}
      />
    </div>
  );
}

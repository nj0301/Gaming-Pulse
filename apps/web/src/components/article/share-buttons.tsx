"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";
import { SITE_NAME } from "@/lib/config";

export function ShareButtons({ slug, title }: { slug: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : `/news/${slug}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      track({ name: "share", slug, channel: "copy-link" });
    } catch {
      // Clipboard unavailable (permissions/http) — no-op.
    }
  }

  async function nativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: `${title} | ${SITE_NAME}`, url });
        track({ name: "share", slug, channel: "native" });
      } catch {
        // User cancelled.
      }
    } else {
      copyLink();
    }
  }

  return (
    <div className="flex items-center gap-2" aria-label="Share this article">
      <button
        type="button"
        onClick={nativeShare}
        className="rounded border border-edge bg-surface px-3 py-1.5 font-label text-xs font-semibold uppercase tracking-wider text-fg-secondary transition-colors hover:border-cyan/50 hover:text-cyan"
      >
        Share
      </button>
      <button
        type="button"
        onClick={copyLink}
        aria-live="polite"
        className="rounded border border-edge bg-surface px-3 py-1.5 font-label text-xs font-semibold uppercase tracking-wider text-fg-secondary transition-colors hover:border-cyan/50 hover:text-cyan"
      >
        {copied ? "Copied ✓" : "Copy link"}
      </button>
    </div>
  );
}

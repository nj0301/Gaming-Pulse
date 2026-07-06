"use client";

/** Newsletter signup with inline validation, success and error states. */
import { useState } from "react";
import { track } from "@/lib/analytics";

export function NewsletterForm({ placement }: { placement: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setState("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setState("loading");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: placement }),
      });
      if (!response.ok) throw new Error(`Signup failed (${response.status})`);
      setState("done");
      setMessage("You're in. Watch for the next Briefing.");
      // PII rule: only the placement is tracked, never the email.
      track({ name: "newsletter_signup", placement });
    } catch {
      setState("error");
      setMessage("Signup is unavailable right now — please try again later.");
    }
  }

  if (state === "done") {
    return (
      <p role="status" className="mt-3 rounded border border-signal/40 bg-signal/10 px-4 py-3 text-sm text-signal">
        {message}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-3">
      <div className="flex gap-2">
        <label htmlFor={`newsletter-email-${placement}`} className="sr-only">
          Email address
        </label>
        <input
          id={`newsletter-email-${placement}`}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          aria-describedby={state === "error" ? `newsletter-error-${placement}` : undefined}
          className="w-full rounded border border-edge bg-surface px-4 py-2.5 text-sm text-fg placeholder:text-fg-muted focus:border-cyan"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="shrink-0 rounded bg-cyan px-4 py-2.5 font-label text-sm font-bold uppercase tracking-wider text-bg transition-opacity disabled:opacity-60"
        >
          {state === "loading" ? "…" : "Subscribe"}
        </button>
      </div>
      {state === "error" && (
        <p id={`newsletter-error-${placement}`} role="alert" className="mt-2 text-sm text-warning">
          {message}
        </p>
      )}
    </form>
  );
}

import { NextRequest, NextResponse } from "next/server";
import { CMS_TOKEN, CMS_URL } from "@/lib/config";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Simple per-IP throttle to keep the endpoint abuse-resistant. */
const recent = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= MAX_PER_WINDOW) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
  recent.set(ip, [...hits, now]);

  let body: { email?: string; source?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const source = String(body.source ?? "web").slice(0, 40);
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  // Demo mode without a CMS: accept and discard (documented behavior).
  if (!CMS_URL) {
    return NextResponse.json({ ok: true, demo: true });
  }

  try {
    const response = await fetch(`${CMS_URL}/api/newsletter-subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(CMS_TOKEN ? { Authorization: `Bearer ${CMS_TOKEN}` } : {}),
      },
      body: JSON.stringify({ data: { email, source, subscribedAt: new Date().toISOString() } }),
    });
    if (response.status === 400) {
      // Unique-email violation → treat as already subscribed.
      return NextResponse.json({ ok: true, already: true });
    }
    if (!response.ok) throw new Error(`CMS responded ${response.status}`);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Subscription service unavailable" }, { status: 503 });
  }
}

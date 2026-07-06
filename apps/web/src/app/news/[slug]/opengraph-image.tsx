import { ImageResponse } from "next/og";
import { cms } from "@/lib/cms";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Gaming Pulse article";

/** Dynamic social card for every article. */
export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await cms.getArticleBySlug(slug);
  const title = article?.title ?? "Gaming Pulse";
  const type = article?.articleType?.replace(/-/g, " ") ?? "news";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "linear-gradient(135deg, #080A12 0%, #101321 60%, #1D2236 100%)",
          color: "#F8FAFC",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              padding: "6px 18px",
              borderRadius: 6,
              background: "#22D3EE",
              color: "#080A12",
              fontSize: 26,
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            {type}
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#A8B0C5" }}>gamingpulse (demo)</div>
        </div>
        <div style={{ display: "flex", fontSize: 58, fontWeight: 700, lineHeight: 1.15, maxWidth: 1000 }}>
          {title.length > 110 ? `${title.slice(0, 108)}…` : title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", width: 48, height: 6, background: "#22D3EE", borderRadius: 3 }} />
          <div style={{ display: "flex", width: 24, height: 6, background: "#8B5CF6", borderRadius: 3 }} />
          <div style={{ display: "flex", width: 12, height: 6, background: "#EC4899", borderRadius: 3 }} />
          <div style={{ display: "flex", fontSize: 24, color: "#737C96", marginLeft: 12 }}>
            Gaming Pulse — the signal in gaming&apos;s noise
          </div>
        </div>
      </div>
    ),
    size,
  );
}

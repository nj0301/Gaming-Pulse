import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { articles, deals, games } from "@gaming-pulse/seed-data";
import { ArticleCard } from "@/components/cards/article-card";
import { GameCard } from "@/components/cards/game-card";
import { DealCard } from "@/components/cards/deal-card";
import { Badge, articleTypeTone, factStatusTone } from "@/components/ui/badge";
import {
  FactPanel,
  ReviewVerdict,
  SourceList,
  SpeculativeBanner,
} from "@/components/article/editorial-panels";
import { EffectsProvider } from "@/components/motion/effects-provider";

const rumor = articles.find((a) => a.articleType === "leak")!;
const review = articles.find((a) => a.articleType === "review" && a.review)!;
const sponsored = articles.find((a) => a.isSponsored)!;

describe("ArticleCard", () => {
  it("renders title, excerpt and link", () => {
    render(<ArticleCard article={rumor} />);
    expect(screen.getByRole("heading", { name: rumor.title })).toBeInTheDocument();
    expect(screen.getAllByRole("link")[0]).toHaveAttribute("href", `/news/${rumor.slug}`);
  });

  it("labels sponsored content on the card", () => {
    render(<ArticleCard article={sponsored} />);
    expect(screen.getAllByText(/sponsored/i).length).toBeGreaterThan(0);
  });

  it("shows the review score badge for reviews", () => {
    render(<ArticleCard article={review} />);
    expect(screen.getByText(`${review.review!.score.toFixed(1)}/10`)).toBeInTheDocument();
  });
});

describe("editorial tone mapping", () => {
  it("visually separates speculative from confirmed content", () => {
    expect(articleTypeTone("rumor")).toBe("warning");
    expect(articleTypeTone("leak")).toBe("warning");
    expect(articleTypeTone("opinion")).toBe("violet");
    expect(articleTypeTone("news")).not.toBe("warning");
    expect(factStatusTone("confirmed")).toBe("green");
    expect(factStatusTone("rumor")).toBe("warning");
  });
});

describe("SpeculativeBanner", () => {
  it("shows a warning note for leaks and nothing for plain news", () => {
    const { rerender } = render(<SpeculativeBanner articleType="leak" />);
    expect(screen.getByRole("note")).toHaveTextContent(/not been verified/i);
    rerender(<SpeculativeBanner articleType="news" />);
    expect(screen.queryByRole("note")).not.toBeInTheDocument();
  });
});

describe("FactPanel", () => {
  it("renders confirmed and unconfirmed columns", () => {
    render(<FactPanel article={rumor} />);
    expect(screen.getByText(/^confirmed$/i)).toBeInTheDocument();
    expect(screen.getByText(/unconfirmed \/ unknown/i)).toBeInTheDocument();
  });
});

describe("SourceList", () => {
  it("marks official sources and shows authority", () => {
    render(<SourceList sources={rumor.sources} />);
    expect(screen.getByText("Official")).toBeInTheDocument();
    expect(screen.getAllByText(/authority \d\/5/i).length).toBe(rumor.sources.length);
  });
});

describe("ReviewVerdict", () => {
  it("shows score, verdict, pros, cons and copy provenance", () => {
    render(<ReviewVerdict review={review.review!} />);
    expect(screen.getByText(review.review!.score.toFixed(1))).toBeInTheDocument();
    expect(screen.getByText(review.review!.verdict)).toBeInTheDocument();
    expect(
      screen.getByText((text) => text.includes(review.review!.copyProvidedBy)),
    ).toBeInTheDocument();
  });
});

describe("GameCard", () => {
  it("renders name, status and link", () => {
    const game = games[0];
    render(<GameCard game={game} />);
    expect(screen.getByRole("heading", { name: game.name })).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", `/games/${game.slug}`);
  });
});

describe("DealCard", () => {
  it("marks free deals and uses sponsored rel on outbound links", () => {
    const free = deals.find((d) => d.isFree)!;
    render(
      <EffectsProvider>
        <DealCard deal={free} />
      </EffectsProvider>,
    );
    expect(screen.getByText("Free")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /get deal/i })).toHaveAttribute(
      "rel",
      expect.stringContaining("sponsored"),
    );
  });
});

describe("Badge", () => {
  it("renders its children", () => {
    render(<Badge tone="cyan">PC</Badge>);
    expect(screen.getByText("PC")).toBeInTheDocument();
  });
});

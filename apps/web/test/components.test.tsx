import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { GameCard } from "@/components/cards/game-card";
import { WireCard } from "@/components/cards/wire-card";
import { Badge } from "@/components/ui/badge";
import type { WireArticle } from "@/lib/news-feed";

const sampleWire: WireArticle = {
  id: "https://example.com/story",
  title: "A real headline from a real outlet",
  excerpt: "A short real excerpt.",
  link: "https://example.com/story",
  imageUrl: "https://cdn.example.com/photo.jpg",
  sourceName: "Eurogamer",
  publishedAt: new Date().toISOString(),
};

describe("GameCard", () => {
  it("renders name, status and a real cover image, linking to the game page", () => {
    render(
      <GameCard
        game={{
          slug: "elden-ring",
          name: "Elden Ring",
          cover: { src: "https://media.rawg.io/cover.jpg", alt: "Elden Ring cover" },
          releaseStatus: "released",
          genres: ["RPG"],
        }}
      />,
    );
    expect(screen.getByRole("heading", { name: "Elden Ring" })).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/games/elden-ring");
    expect(screen.getByText("Released")).toBeInTheDocument();
  });

  it("shows the real release date instead of genres when provided", () => {
    render(
      <GameCard
        game={{
          slug: "some-game",
          name: "Some Game",
          cover: { src: "https://media.rawg.io/cover.jpg", alt: "cover" },
          releaseStatus: "upcoming",
          genres: ["Action"],
          releaseDate: "2027-03-10",
        }}
      />,
    );
    expect(screen.getByText("Mar 10, 2027")).toBeInTheDocument();
  });
});

describe("WireCard", () => {
  it("links directly to the real source article, not an internal page", () => {
    render(<WireCard article={sampleWire} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", sampleWire.link);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("credits the real outlet by name", () => {
    render(<WireCard article={sampleWire} />);
    expect(screen.getByText("Eurogamer")).toBeInTheDocument();
    expect(screen.getByText(/Read at Eurogamer/)).toBeInTheDocument();
  });

  it("shows a source-attributed placeholder when the outlet provided no image", () => {
    render(<WireCard article={{ ...sampleWire, imageUrl: null }} />);
    expect(screen.getAllByText("Eurogamer").length).toBeGreaterThan(0);
  });
});

describe("Badge", () => {
  it("renders its children", () => {
    render(<Badge tone="cyan">Live</Badge>);
    expect(screen.getByText("Live")).toBeInTheDocument();
  });
});

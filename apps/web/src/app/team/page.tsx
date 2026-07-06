import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cms } from "@/lib/cms";
import { Container } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Our Team",
  description: "The Gaming Pulse editorial team (fictional demo).",
  alternates: { canonical: "/team" },
};

export default async function TeamPage() {
  const authors = await cms.getAuthors();
  return (
    <Container className="py-12">
      <h1 className="font-display text-3xl font-bold text-fg">Our team</h1>
      <p className="mt-2 max-w-2xl text-fg-secondary">
        The editorial team behind Gaming Pulse. (Demo build: all team members are fictional.)
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {authors.map((author) => (
          <Link
            key={author.slug}
            href={`/author/${author.slug}`}
            className="group rounded-xl border border-edge bg-surface p-5 transition-colors hover:border-cyan/50"
          >
            <div className="flex items-center gap-4">
              <Image
                src={author.avatar.src}
                alt={author.avatar.alt}
                width={56}
                height={56}
                className="rounded-full border border-edge"
              />
              <div>
                <h2 className="font-display font-bold text-fg group-hover:text-cyan">{author.name}</h2>
                <p className="text-sm text-fg-muted">{author.role}</p>
              </div>
            </div>
            <p className="mt-3 line-clamp-2 text-sm text-fg-secondary">{author.bio}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {author.expertise.map((topic) => (
                <Badge key={topic} tone="neutral">
                  {topic}
                </Badge>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}

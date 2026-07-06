import Link from "next/link";
import { Container } from "@/components/ui/section";

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="font-display text-7xl font-bold text-cyan">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-fg">Respawn point not found</h1>
      <p className="mx-auto mt-3 max-w-md text-fg-secondary">
        The page you&rsquo;re after has been moved, unpublished, or never existed. Try the latest news or search.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="rounded bg-cyan px-5 py-2.5 font-label text-sm font-bold uppercase tracking-wider text-bg">
          Home
        </Link>
        <Link
          href="/latest"
          className="rounded border border-edge bg-surface px-5 py-2.5 font-label text-sm font-bold uppercase tracking-wider text-fg-secondary"
        >
          Latest news
        </Link>
      </div>
    </Container>
  );
}

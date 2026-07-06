import { Container, Skeleton } from "@/components/ui/section";

export default function Loading() {
  return (
    <Container className="py-10" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-10 w-72" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i}>
            <Skeleton className="aspect-video" />
            <Skeleton className="mt-3 h-4 w-24" />
            <Skeleton className="mt-2 h-5 w-full" />
            <Skeleton className="mt-2 h-4 w-3/4" />
          </div>
        ))}
      </div>
    </Container>
  );
}

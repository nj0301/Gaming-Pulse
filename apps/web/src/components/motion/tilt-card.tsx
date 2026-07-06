"use client";

/**
 * Desktop-only pointer tilt. Disabled on touch devices, when effects are
 * reduced, and degrades to a plain wrapper without JS.
 */
import { useRef, useState, type ReactNode } from "react";
import { useEffects } from "./effects-provider";

export function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const { reduced } = useEffects();
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<string | undefined>(undefined);

  const enabled =
    !reduced &&
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    setTransform(`perspective(900px) rotateX(${(-py * 4).toFixed(2)}deg) rotateY(${(px * 5).toFixed(2)}deg)`);
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{ transform, transition: transform ? "transform 0.1s linear" : "transform 0.4s ease" }}
      onPointerMove={onPointerMove}
      onPointerLeave={() => setTransform(undefined)}
    >
      {children}
    </div>
  );
}

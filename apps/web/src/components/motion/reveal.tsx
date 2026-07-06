"use client";

/**
 * Scroll-into-view reveal with optional stagger. Uses transform/opacity only
 * and renders children fully visible when effects are reduced or JS fails
 * (content is server-rendered; this only adds the entrance transition).
 */
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { useEffects } from "./effects-provider";

interface RevealProps {
  children: ReactNode;
  /** Delay in seconds — pass index * 0.06 for staggered card grids. */
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article";
}

export function Reveal({ children, delay = 0, className, as = "div" }: RevealProps) {
  const { reduced } = useEffects();
  const osReduced = useReducedMotion();
  const skip = reduced || osReduced;

  // The union of motion.div/li/section/article confuses TS; they share the div props we use.
  const Component = motion[as] as typeof motion.div;
  return (
    <Component
      className={className}
      initial={skip ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.2, 0.6, 0.2, 1] }}
    >
      {children}
    </Component>
  );
}

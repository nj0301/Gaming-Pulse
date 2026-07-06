"use client";

/**
 * Site-level effects control.
 *
 * Combines the OS `prefers-reduced-motion` setting with a user-toggleable
 * "Reduce effects" preference (persisted in localStorage). The resolved state
 * is exposed via context for JS-driven animation AND mirrored to
 * `<html data-effects>` so pure-CSS animation obeys it too.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { track } from "@/lib/analytics";

interface EffectsContextValue {
  /** True when decorative animation should be skipped. */
  reduced: boolean;
  /** True when the user explicitly toggled reduce-effects on. */
  userReduced: boolean;
  toggle: () => void;
}

const EffectsContext = createContext<EffectsContextValue>({
  reduced: false,
  userReduced: false,
  toggle: () => {},
});

const STORAGE_KEY = "gp-reduce-effects";

export function EffectsProvider({ children }: { children: ReactNode }) {
  const [systemReduced, setSystemReduced] = useState(false);
  const [userReduced, setUserReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setSystemReduced(media.matches);
    const onChange = (e: MediaQueryListEvent) => setSystemReduced(e.matches);
    media.addEventListener("change", onChange);
    setUserReduced(localStorage.getItem(STORAGE_KEY) === "1");
    return () => media.removeEventListener("change", onChange);
  }, []);

  const reduced = systemReduced || userReduced;

  useEffect(() => {
    document.documentElement.dataset.effects = reduced ? "reduced" : "full";
  }, [reduced]);

  const toggle = useCallback(() => {
    setUserReduced((current) => {
      const next = !current;
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      track({ name: "effects_toggle", reduced: next });
      return next;
    });
  }, []);

  return (
    <EffectsContext.Provider value={{ reduced, userReduced, toggle }}>
      {children}
    </EffectsContext.Provider>
  );
}

export function useEffects(): EffectsContextValue {
  return useContext(EffectsContext);
}

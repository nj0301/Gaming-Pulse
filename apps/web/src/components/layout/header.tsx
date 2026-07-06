"use client";

/**
 * Site header: desktop navigation, mobile drawer, full-screen search
 * overlay, newsletter CTA, and a sticky bar that compacts after scrolling.
 * Fully keyboard-accessible.
 */
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { NavItem } from "@/lib/cms/types";
import { SearchOverlay } from "./search-overlay";

export function Header({ primaryNav }: { primaryNav: NavItem[] }) {
  const pathname = usePathname();
  const [compact, setCompact] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const navId = useId();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setCompact(window.scrollY > 80);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close overlays on navigation.
  useEffect(() => {
    setDrawerOpen(false);
    setSearchOpen(false);
    setOpenSubmenu(null);
  }, [pathname]);

  // Keyboard: Escape closes; "/" opens search.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDrawerOpen(false);
        setSearchOpen(false);
        setOpenSubmenu(null);
      }
      if (event.key === "/" && !searchOpen && !(event.target instanceof HTMLInputElement)) {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  // Focus trap entry for the drawer.
  useEffect(() => {
    if (drawerOpen) drawerRef.current?.querySelector<HTMLElement>("a, button")?.focus();
  }, [drawerOpen]);

  const isActive = useCallback(
    (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href)),
    [pathname],
  );

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-cyan focus:px-4 focus:py-2 focus:font-semibold focus:text-bg"
      >
        Skip to content
      </a>

      <header
        className={clsx(
          "sticky top-0 z-50 border-b border-edge bg-bg/85 backdrop-blur transition-[padding]",
          compact ? "py-0" : "py-1",
        )}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className={clsx(
              "flex shrink-0 items-center gap-2 font-display font-bold text-fg transition-all",
              compact ? "py-2 text-lg" : "py-3 text-xl",
            )}
          >
            <PulseMark />
            <span>
              Gaming<span className="text-cyan">Pulse</span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav aria-label="Primary" className="hidden flex-1 lg:block">
            <ul className="flex items-center gap-1" id={navId}>
              {primaryNav.map((item) =>
                item.children?.length ? (
                  <li key={item.label} className="relative">
                    <button
                      type="button"
                      className={clsx(
                        "group relative rounded px-3 py-2 font-label text-sm font-semibold uppercase tracking-wider transition-colors",
                        openSubmenu === item.label ? "text-cyan" : "text-fg-secondary hover:text-fg",
                      )}
                      aria-expanded={openSubmenu === item.label}
                      aria-haspopup="true"
                      onClick={() => setOpenSubmenu(openSubmenu === item.label ? null : item.label)}
                    >
                      {item.label} <span aria-hidden>▾</span>
                    </button>
                    {openSubmenu === item.label && (
                      <div
                        className="absolute left-0 top-full z-50 mt-1 grid w-[520px] grid-cols-2 gap-1 rounded-lg border border-edge bg-surface-elevated p-3 shadow-2xl"
                        role="menu"
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            role="menuitem"
                            className={clsx(
                              "rounded px-3 py-2 text-sm transition-colors hover:bg-surface hover:text-cyan",
                              isActive(child.href) ? "text-cyan" : "text-fg-secondary",
                            )}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </li>
                ) : (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={clsx(
                        "relative block rounded px-3 py-2 font-label text-sm font-semibold uppercase tracking-wider transition-colors",
                        isActive(item.href) ? "text-cyan" : "text-fg-secondary hover:text-fg",
                      )}
                      aria-current={isActive(item.href) ? "page" : undefined}
                    >
                      {item.label}
                      {/* Animated underline */}
                      <span
                        aria-hidden
                        className={clsx(
                          "absolute inset-x-3 -bottom-px h-0.5 origin-left rounded bg-cyan transition-transform duration-200",
                          isActive(item.href) ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {/* Search */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 rounded border border-edge bg-surface px-3 py-1.5 text-sm text-fg-muted transition-colors hover:border-cyan/50 hover:text-fg"
              aria-label="Open search"
            >
              <SearchIcon />
              <span className="hidden md:inline">Search</span>
              <kbd className="hidden rounded bg-bg px-1.5 font-mono text-xs md:inline">/</kbd>
            </button>

            {/* Newsletter CTA */}
            <Link
              href="/#newsletter"
              className="hidden rounded bg-cyan px-3 py-1.5 font-label text-sm font-bold uppercase tracking-wider text-bg transition-transform hover:scale-105 md:block"
            >
              Briefing
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              className="rounded border border-edge p-2 text-fg lg:hidden"
              aria-expanded={drawerOpen}
              aria-controls="mobile-drawer"
              aria-label={drawerOpen ? "Close menu" : "Open menu"}
              onClick={() => setDrawerOpen(!drawerOpen)}
            >
              <MenuIcon open={drawerOpen} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div
            ref={drawerRef}
            id="mobile-drawer"
            className="absolute right-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto border-l border-edge bg-bg-secondary p-6"
          >
            <nav aria-label="Mobile primary">
              <ul className="space-y-1">
                {primaryNav.map((item) => (
                  <li key={item.label}>
                    {item.children?.length ? (
                      <details className="group">
                        <summary className="cursor-pointer rounded px-3 py-2.5 font-label font-semibold uppercase tracking-wider text-fg-secondary transition-colors hover:text-fg [&::-webkit-details-marker]:hidden">
                          {item.label} <span aria-hidden className="float-right group-open:rotate-180">▾</span>
                        </summary>
                        <ul className="ml-3 space-y-1 border-l border-edge pl-3">
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                className="block rounded px-3 py-2 text-sm text-fg-secondary hover:text-cyan"
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </details>
                    ) : (
                      <Link
                        href={item.href}
                        className={clsx(
                          "block rounded px-3 py-2.5 font-label font-semibold uppercase tracking-wider transition-colors",
                          isActive(item.href) ? "text-cyan" : "text-fg-secondary hover:text-fg",
                        )}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-6 space-y-3 border-t border-edge pt-6">
              <Link
                href="/#newsletter"
                className="block rounded bg-cyan px-4 py-2.5 text-center font-label font-bold uppercase tracking-wider text-bg"
              >
                Get the Briefing
              </Link>
            </div>
          </div>
        </div>
      )}

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function PulseMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden className="text-cyan">
      <rect x="1" y="1" width="26" height="26" rx="6" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M5 14h4l2-5 4 10 2-5h6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
      {open ? (
        <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      ) : (
        <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      )}
    </svg>
  );
}

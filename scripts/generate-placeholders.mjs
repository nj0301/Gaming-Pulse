#!/usr/bin/env node
/**
 * Generates license-safe placeholder SVG artwork for all demo media referenced
 * by @gaming-pulse/seed-data, into apps/web/public/media.
 *
 * Every image is clearly labelled "DEMO ART" — no copyrighted assets are used.
 * Re-run after adding seed entries:  node scripts/generate-placeholders.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outRoot = join(root, "apps/web/public");

const PALETTES = [
  ["#22D3EE", "#8B5CF6"],
  ["#8B5CF6", "#EC4899"],
  ["#EC4899", "#F59E0B"],
  ["#A3E635", "#22D3EE"],
  ["#F59E0B", "#8B5CF6"],
  ["#22D3EE", "#A3E635"],
];

const hash = (s) => [...s].reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0);

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function svg(label, sublabel, w, h) {
  const [c1, c2] = PALETTES[Math.abs(hash(label)) % PALETTES.length];
  const fontSize = Math.max(18, Math.round(w / 24));
  const id = `g${Math.abs(hash(label + w))}`;
  const lines = Array.from({ length: 5 }, (_, i) => {
    const y = ((Math.abs(hash(label + i)) % 100) / 100) * h;
    return `<line x1="0" y1="${y.toFixed(0)}" x2="${w}" y2="${(y * 0.7 + h * 0.15).toFixed(0)}" stroke="${i % 2 ? c1 : c2}" stroke-opacity="0.18" stroke-width="${1 + (i % 3)}"/>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)} demo placeholder">
<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}" stop-opacity="0.55"/><stop offset="1" stop-color="${c2}" stop-opacity="0.35"/></linearGradient></defs>
<rect width="${w}" height="${h}" fill="#101321"/>
<rect width="${w}" height="${h}" fill="url(#${id})"/>
${lines}
<rect x="0" y="0" width="${w}" height="${h}" fill="none" stroke="#2A3047" stroke-width="2"/>
<text x="50%" y="48%" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="${fontSize}" fill="#F8FAFC">${esc(label)}</text>
<text x="50%" y="58%" text-anchor="middle" font-family="Arial, sans-serif" font-size="${Math.round(fontSize * 0.55)}" fill="#A8B0C5">${esc(sublabel)}</text>
</svg>`;
}

function write(relPath, label, sublabel, w, h) {
  const file = join(outRoot, relPath);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, svg(label, sublabel, w, h));
}

// Keep in sync with packages/seed-data. Loaded lazily to avoid a TS toolchain here.
const games = [
  ["starfall-vanguard", "Starfall: Vanguard"],
  ["emberwilds", "Emberwilds"],
  ["chrono-drift", "Chrono Drift"],
  ["ashen-covenant", "Ashen Covenant"],
  ["neon-havoc", "Neon Havoc"],
  ["silent-meridian", "Silent Meridian"],
  ["ironroot-tactics", "Ironroot Tactics"],
  ["skybound-legends", "Skybound Legends"],
  ["petal-and-blade", "Petal & Blade"],
  ["circuit-breakers-2", "Circuit Breakers 2"],
];
const gameShots = { "starfall-vanguard": 4, emberwilds: 4, "chrono-drift": 3, "ashen-covenant": 2, "neon-havoc": 3, "silent-meridian": 3, "ironroot-tactics": 4, "skybound-legends": 4, "petal-and-blade": 4, "circuit-breakers-2": 2 };

for (const [slug, name] of games) {
  write(`media/games/${slug}-cover.svg`, name, "DEMO ART — cover", 600, 800);
  write(`media/games/${slug}-hero.svg`, name, "DEMO ART — key art", 1920, 820);
  for (let i = 1; i <= gameShots[slug]; i++) {
    write(`media/games/${slug}-shot-${i}.svg`, name, `DEMO ART — screenshot ${i}`, 1280, 720);
  }
}

const articleHeroes = [
  ["skybound-tempest", "Tempest Expansion"],
  ["petal-blade-date", "Petal & Blade"],
  ["chrono-drift-report", "Chrono Drift Report"],
  ["ashen-leak", "Leak Coverage"],
  ["meridian-deepcurrent", "Acquisition"],
  ["circuit-breakers-beta", "Circuit Breakers 2"],
  ["starfall-riptide", "Season 3: Riptide"],
  ["neon-havoc-review", "Neon Havoc Review"],
  ["starfall-review", "Starfall Re-review"],
  ["ironroot-guide", "Ironroot Guide"],
  ["handheld-opinion", "Opinion"],
  ["extraction-analysis", "Analysis"],
  ["lantern-interview", "Interview"],
  ["release-radar", "Release Radar"],
  ["voltpc-sponsored", "Sponsored"],
  ["emberwilds-preview", "Emberwilds Preview"],
];
for (const [slug, label] of articleHeroes) {
  write(`media/articles/${slug}.svg`, label, "DEMO ART — editorial", 1600, 900);
}

const videoPosters = [
  ["tempest-announce", "Tempest Trailer"],
  ["petal-blade-date", "Release Date Trailer"],
  ["emberwilds-window", "Emberwilds Trailer"],
  ["chrono-drift-reveal", "Gameplay Reveal"],
  ["silent-meridian-story", "Story Trailer"],
];
for (const [slug, label] of videoPosters) {
  write(`media/videos/${slug}.svg`, label, "DEMO ART — video poster", 1280, 720);
}

const authorNames = [
  ["maya-okafor", "MO"],
  ["dario-vance", "DV"],
  ["lin-zhao", "LZ"],
  ["priya-raman", "PR"],
  ["theo-marchetti", "TM"],
  ["sam-kowalczyk", "SK"],
];
for (const [slug, initials] of authorNames) {
  write(`media/authors/${slug}.svg`, initials, "DEMO", 256, 256);
}

write("media/og-default.svg", "Gaming Pulse", "DEMO ART — social card", 1200, 630);

console.log("Placeholder media generated in apps/web/public/media");

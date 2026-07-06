/**
 * Work around npm workspace optional-deps hoisting: Tailwind v4 needs
 * platform-specific lightningcss and @tailwindcss/oxide binaries at install time.
 */
import { execSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

function linuxLibc() {
  try {
    const { familySync, MUSL } = require("detect-libc");
    return familySync() === MUSL ? "musl" : "gnu";
  } catch {
    return "gnu";
  }
}

function platformPackages() {
  if (process.platform === "darwin") {
    return [`lightningcss-darwin-${process.arch}`, `@tailwindcss/oxide-darwin-${process.arch}`];
  }
  if (process.platform === "linux") {
    const libc = linuxLibc();
    return [`lightningcss-linux-${process.arch}-${libc}`, `@tailwindcss/oxide-linux-${process.arch}-${libc}`];
  }
  if (process.platform === "win32") {
    return [`lightningcss-win32-${process.arch}-msvc`, `@tailwindcss/oxide-win32-${process.arch}-msvc`];
  }
  return [];
}

function ensure(pkg) {
  try {
    require.resolve(pkg);
    return;
  } catch {
    // fall through to install
  }

  console.log(`[postinstall] Installing missing native CSS package: ${pkg}`);
  execSync(`npm install ${pkg} --no-save --legacy-peer-deps`, { stdio: "inherit" });
}

for (const pkg of platformPackages()) {
  ensure(pkg);
}

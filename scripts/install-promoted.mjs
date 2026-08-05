#!/usr/bin/env node

/**
 * Install only the promoted skill set listed in .claude-plugin/plugin.json.
 * Does not modify the public `skills` CLI; it passes an explicit --skill list.
 *
 * Usage:
 *   node scripts/install-promoted.mjs
 *   node scripts/install-promoted.mjs toxicgozen/dev-skills
 *   node scripts/install-promoted.mjs . -- --agent cursor -y
 */

import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const plugin = JSON.parse(await readFile(join(repo, ".claude-plugin", "plugin.json"), "utf8"));

const skillNames = (plugin.skills ?? []).map((skillPath) => {
  const parts = String(skillPath).replace(/\\/g, "/").split("/").filter(Boolean);
  return parts[parts.length - 1];
});

if (skillNames.length === 0) {
  console.error("No skills listed in .claude-plugin/plugin.json");
  process.exit(1);
}

const argv = process.argv.slice(2);
const separator = argv.indexOf("--");
const before = separator === -1 ? argv : argv.slice(0, separator);
const passthrough = separator === -1 ? [] : argv.slice(separator + 1);
const source = before[0] ?? "toxicgozen/dev-skills";
const extra = before.slice(1);

const args = ["skills@latest", "add", source, "--skill", ...skillNames, ...extra, ...passthrough];

console.log(`Installing ${skillNames.length} promoted skills from ${source}`);
console.log(`npx ${args.join(" ")}`);

const result = spawnSync("npx", args, { stdio: "inherit", shell: true });
process.exit(result.status ?? 1);

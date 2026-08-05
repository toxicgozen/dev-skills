#!/usr/bin/env node

import { access } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pluginPath = join(repo, ".claude-plugin", "plugin.json");
const plugin = JSON.parse(await (await import("node:fs/promises")).readFile(pluginPath, "utf8"));
const errors = [];

if (!Array.isArray(plugin.skills) || plugin.skills.length === 0) {
  errors.push(".claude-plugin/plugin.json must list at least one skill path");
}

for (const skillPath of plugin.skills ?? []) {
  const absolute = resolve(repo, skillPath);
  const skillMd = join(absolute, "SKILL.md");
  try {
    await access(skillMd);
  } catch {
    errors.push(`missing ${skillPath}/SKILL.md`);
  }
}

if (errors.length) {
  console.error("Promoted layout check failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`PASS promoted layout (${plugin.skills.length} skills in plugin.json)`);

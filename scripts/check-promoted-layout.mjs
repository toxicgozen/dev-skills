#!/usr/bin/env node

import { access, readFile, readdir } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parsePromotedPath } from "./promoted-skills.mjs";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pluginPath = join(repo, ".claude-plugin", "plugin.json");
const plugin = JSON.parse(await readFile(pluginPath, "utf8"));
const topReadme = await readFile(join(repo, "README.md"), "utf8");
const errors = [];
const promotedPaths = plugin.skills ?? [];
const promotedNames = new Set();

if (!Array.isArray(promotedPaths) || promotedPaths.length === 0) {
  errors.push(".claude-plugin/plugin.json must list at least one skill path");
}

for (const skillPath of promotedPaths) {
  const parsed = parsePromotedPath(skillPath);
  if (!parsed) {
    errors.push(`promoted path must use an engineering/productivity bucket: ${skillPath}`);
    continue;
  }

  const { bucket, name } = parsed;
  if (promotedNames.has(name)) errors.push(`duplicate promoted skill name: ${name}`);
  promotedNames.add(name);

  const absolute = resolve(repo, skillPath);
  try {
    await access(join(absolute, "SKILL.md"));
  } catch {
    errors.push(`missing ${skillPath}/SKILL.md`);
  }

  try {
    await access(join(absolute, "agents", "openai.yaml"));
  } catch {
    errors.push(`missing ${skillPath}/agents/openai.yaml`);
  }

  try {
    await access(join(repo, "docs", bucket, `${name}.md`));
  } catch {
    errors.push(`missing docs/${bucket}/${name}.md`);
  }

  if (!topReadme.includes(`](./skills/${bucket}/${name}/SKILL.md)`)) {
    errors.push(`README.md must link ${name}`);
  }

  const bucketReadme = await readFile(join(repo, "skills", bucket, "README.md"), "utf8");
  if (!bucketReadme.includes(`](./${name}/SKILL.md)`)) {
    errors.push(`skills/${bucket}/README.md must link ${name}`);
  }
}

for (const bucket of ["engineering", "productivity"]) {
  const entries = await readdir(join(repo, "skills", bucket), { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const skillMd = join(repo, "skills", bucket, entry.name, "SKILL.md");
    try {
      await access(skillMd);
      if (!promotedNames.has(entry.name)) {
        errors.push(`promoted bucket skill missing from plugin.json: ${relative(repo, dirname(skillMd))}`);
      }
    } catch {
      // Not a skill directory.
    }
  }
}

if (errors.length) {
  console.error("Promoted layout check failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`PASS promoted layout (${promotedPaths.length} skills in plugin.json)`);

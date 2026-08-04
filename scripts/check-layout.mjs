#!/usr/bin/env node

import { readdir, readFile } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const skillsRoot = join(repo, "skills");
const errors = [];

const entries = await readdir(skillsRoot, { withFileTypes: true });
const skillNames = entries
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

for (const entry of entries) {
  if (!entry.isDirectory()) {
    errors.push(`skills/${entry.name} is not a skill directory`);
  }
}

async function findSkillFiles(directory) {
  const found = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) found.push(...(await findSkillFiles(path)));
    if (entry.isFile() && entry.name === "SKILL.md") found.push(path);
  }
  return found;
}

const skillFiles = await findSkillFiles(skillsRoot);
const discoveredNames = [];

for (const skillFile of skillFiles) {
  const directory = relative(skillsRoot, dirname(skillFile));
  const parts = directory.split(sep);
  if (parts.length !== 1) {
    errors.push(`${relative(repo, skillFile)} is nested; skills must live at skills/<name>/SKILL.md`);
    continue;
  }
  discoveredNames.push(parts[0]);
}

for (const skillName of skillNames) {
  if (!discoveredNames.includes(skillName)) {
    errors.push(`skills/${skillName}/SKILL.md is missing`);
  }
}

const plugin = JSON.parse(
  await readFile(join(repo, ".claude-plugin", "plugin.json"), "utf8"),
);
const pluginSkills = [...plugin.skills].sort();
const expectedPluginSkills = skillNames.map((name) => `./skills/${name}`);

if (JSON.stringify(pluginSkills) !== JSON.stringify(expectedPluginSkills)) {
  errors.push(".claude-plugin/plugin.json must list every skill directory exactly once");
}

const packageMetadata = JSON.parse(await readFile(join(repo, "package.json"), "utf8"));
if (plugin.version !== packageMetadata.version) {
  errors.push("plugin.json and package.json versions must match");
}

const readme = await readFile(join(repo, "README.md"), "utf8");
for (const skillName of skillNames) {
  if (!readme.includes(`./skills/${skillName}/SKILL.md`)) {
    errors.push(`README.md does not link skills/${skillName}/SKILL.md`);
  }
}

if (skillNames.length === 0) errors.push("the install set is empty");
if (discoveredNames.length !== new Set(discoveredNames).size) {
  errors.push("duplicate skill names were discovered");
}

if (errors.length > 0) {
  console.error("Layout check failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`PASS flat install set: ${skillNames.length} skills`);

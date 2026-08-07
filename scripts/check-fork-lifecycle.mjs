#!/usr/bin/env node

import { access, readFile, readdir } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parsePromotedPath } from "./promoted-skills.mjs";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = async (path) => readFile(join(repo, path), "utf8");
const exists = async (path) => {
  try {
    await access(join(repo, path));
    return true;
  } catch {
    return false;
  }
};

const errors = [];
const requiredSkills = [
  "setup-dev-skills-structure",
  "pull-update-dev-skills",
];

const plugin = JSON.parse(await read(".claude-plugin/plugin.json"));
const promotedInOrder = (plugin.skills ?? [])
  .map(parsePromotedPath)
  .filter(Boolean)
  .map(({ name }) => name);
const promoted = new Set(promotedInOrder);

for (const skill of requiredSkills) {
  if (!promoted.has(skill)) errors.push(`${skill} must be promoted in plugin.json`);
  if (!(await exists(`skills/engineering/${skill}/SKILL.md`))) {
    errors.push(`missing skills/engineering/${skill}/SKILL.md`);
  }
  if (!(await exists(`skills/engineering/${skill}/agents/openai.yaml`))) {
    errors.push(`missing skills/engineering/${skill}/agents/openai.yaml`);
  }
  if (!(await exists(`docs/engineering/${skill}.md`))) {
    errors.push(`missing docs/engineering/${skill}.md`);
  }
}

const updateSkill = await read("skills/engineering/pull-update-dev-skills/SKILL.md");
for (const outcome of ["retain-local", "adopt-upstream", "remove-local", "needs-decision"]) {
  if (!updateSkill.includes(`**${outcome}**`)) {
    errors.push(`pull-update-dev-skills must define the ${outcome} outcome`);
  }
}
if (updateSkill.includes("apply-upstream")) {
  errors.push("pull-update-dev-skills must not retain the superseded apply-upstream outcome");
}

const structureSkill = await read("skills/engineering/setup-dev-skills-structure/SKILL.md");
if (/npx skills|npm run setup|global skills/i.test(structureSkill)) {
  errors.push("setup-dev-skills-structure must configure projects, not user-scope installation");
}

for (const retired of [
  "skills/engineering/setup-matt-pocock-skills",
  "skills/engineering/configure-dev-skills-repo",
  "skills/engineering/setup-dev-skills",
  "skills/engineering/update-dev-skills",
]) {
  if (await exists(retired)) errors.push(`retired lifecycle skill must be absent: ${retired}`);
}

const bootstrap = await read("global-scope-skills-bootstrap.md");
if (!bootstrap.includes("npx skills@latest add toxicgozen/dev-skills")) {
  errors.push("global bootstrap must document direct npx installation from this fork");
}
if (!bootstrap.includes("npx skills@latest update")) {
  errors.push("global bootstrap must document direct npx maintenance");
}
if (/npm run setup|install-promoted\.mjs/.test(bootstrap)) {
  errors.push("global bootstrap must not depend on a clone-based wrapper");
}

const packageJson = JSON.parse(await read("package.json"));
const packageLock = JSON.parse(await read("package-lock.json"));
if (plugin.version !== packageJson.version) {
  errors.push("plugin.json and package.json versions must match");
}
if (packageLock.name !== packageJson.name || packageLock.version !== packageJson.version) {
  errors.push("package-lock.json identity must match package.json");
}
if (packageJson.scripts?.setup || packageJson.scripts?.["install:promoted"]) {
  errors.push("package.json must not expose repo-to-user installation wrappers");
}
for (const retiredScript of ["scripts/install-promoted.mjs", "scripts/promoted-install-plan.mjs"]) {
  if (await exists(retiredScript)) errors.push(`retired install wrapper must be absent: ${retiredScript}`);
}

const expectedDirectCommand = `npx skills@latest add toxicgozen/dev-skills --skill ${promotedInOrder.join(" ")} -g --agent cursor codex`;
for (const path of [".agents/install-block.md", "README.md", "global-scope-skills-bootstrap.md"]) {
  const contents = await read(path);
  if (!contents.includes(expectedDirectCommand)) {
    errors.push(`${path} direct install command must match plugin.json order`);
  }
}

const readme = await read("README.md");
if (readme.includes("npm run setup")) {
  errors.push("README.md must not expose a clone-based setup command");
}

const fork = await read("FORK.md");
if (!fork.includes("Issue → Intent → Commit")) {
  errors.push("FORK.md must define the Issue → Intent → Commit protocol");
}
if (!fork.includes("fork-intents.json")) {
  errors.push("FORK.md must point to fork-intents.json");
}

let registry;
try {
  registry = JSON.parse(await read("fork-intents.json"));
} catch (error) {
  errors.push(`fork-intents.json must be valid JSON: ${error.message}`);
}

if (registry) {
  const allowedStatuses = new Set(["active", "superseded-by-upstream", "needs-decision"]);
  const ids = new Set();
  for (const [index, record] of (registry.intents ?? []).entries()) {
    const label = record.id || `record ${index + 1}`;
    for (const field of ["id", "intent", "upstreamCoverage", "areas", "evidence", "status", "lastReviewedUpstream"]) {
      if (record[field] == null || record[field] === "" || (Array.isArray(record[field]) && record[field].length === 0)) {
        errors.push(`${label} is missing ${field}`);
      }
    }
    if (ids.has(record.id)) errors.push(`duplicate fork intent id: ${record.id}`);
    ids.add(record.id);
    if (!allowedStatuses.has(record.status)) errors.push(`${label} has invalid status ${record.status}`);
    if (record.status === "active" && !/^https:\/\/github\.com\/toxicgozen\/dev-skills\/issues\/\d+$/.test(record.issue ?? "")) {
      errors.push(`${label} must link an issue while active`);
    }
    if (record.status === "needs-decision" && !record.issue && !record.sourceCommit) {
      errors.push(`${label} needs an issue or sourceCommit for its next decision`);
    }
    if (!/^[0-9a-f]{7,40}$/.test(record.lastReviewedUpstream ?? "")) {
      errors.push(`${label} has an invalid lastReviewedUpstream`);
    }
  }
  if (!Array.isArray(registry.intents) || registry.intents.length === 0) {
    errors.push("fork-intents.json must contain at least one intent");
  }
}

const retiredReferences = [
  {
    name: "setup-matt-pocock-skills",
    pattern: /setup-matt-pocock-skills/,
    allowed: new Set([
      ".agents/adr/0004-keep-global-installation-outside-the-skill-set.md",
      "CHANGELOG.md",
      "docs/engineering/setup-dev-skills-structure.md",
      "scripts/check-fork-lifecycle.mjs",
    ]),
  },
  {
    name: "configure-dev-skills-repo",
    pattern: /configure-dev-skills-repo/,
    allowed: new Set(["scripts/check-fork-lifecycle.mjs"]),
  },
  {
    name: "setup-dev-skills",
    pattern: /(^|[^-])setup-dev-skills(?!-structure)/,
    allowed: new Set(["scripts/check-fork-lifecycle.mjs"]),
  },
  {
    name: "update-dev-skills",
    pattern: /(^|[^-])update-dev-skills/,
    allowed: new Set(["scripts/check-fork-lifecycle.mjs"]),
  },
];

async function collectTextFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if ([".git", "node_modules"].includes(entry.name)) continue;
    const absolute = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectTextFiles(absolute)));
    else if (/\.(md|json|ya?ml|mjs)$/.test(entry.name)) files.push(absolute);
  }
  return files;
}

for (const absolute of await collectTextFiles(repo)) {
  const path = relative(repo, absolute).replace(/\\/g, "/");
  const contents = await readFile(absolute, "utf8");
  for (const retired of retiredReferences) {
    if (!retired.allowed.has(path) && retired.pattern.test(contents)) {
      errors.push(`stale ${retired.name} reference: ${path}`);
    }
  }
}

if (errors.length) {
  console.error("Fork lifecycle check failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`PASS fork lifecycle (${registry.intents.length} intent records)`);

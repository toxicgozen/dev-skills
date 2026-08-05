#!/usr/bin/env node

import { spawnSync } from "node:child_process";

const stagedNames = spawnSync("git", ["diff", "--cached", "--name-only", "--diff-filter=ACMR"], {
  encoding: "utf8"
});
const stagedDiff = spawnSync(
  "git",
  ["diff", "--cached", "--no-ext-diff", "--unified=0", "--", ".", ":(exclude)scripts/check-fork-privacy.mjs"],
  { encoding: "utf8" }
);

if (stagedNames.status !== 0 || stagedDiff.status !== 0) {
  console.error("Unable to inspect the staged changes.");
  process.exit(2);
}

const blockedPaths = /(^|\/)(?:\.env(?:\..*)?|\.local|\.private)(?:\/|$)/i;
const blockedContent = [
  ["GitHub token", /\b(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,})\b/],
  ["OpenAI-style secret", /\bsk-[A-Za-z0-9_-]{20,}\b/],
  ["AWS access key", /\bAKIA[0-9A-Z]{16}\b/],
  ["private key", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ["Windows user path", /\b[A-Za-z]:[\\/]Users[\\/][^\\/\s]+/i],
  ["macOS user path", /\/(?:Users)\/[^/\s]+/],
  ["Linux user path", /\/home\/[^/\s]+/]
];

const violations = [];
for (const file of stagedNames.stdout.split(/\r?\n/).filter(Boolean)) {
  if (blockedPaths.test(file)) violations.push(`blocked path: ${file}`);
}

const addedLines = stagedDiff.stdout
  .split(/\r?\n/)
  .filter((line) => line.startsWith("+") && !line.startsWith("+++"))
  .map((line) => line.slice(1));

for (const [label, pattern] of blockedContent) {
  if (addedLines.some((line) => pattern.test(line))) violations.push(`possible ${label}`);
}

if (violations.length) {
  console.error("Fork privacy check failed:");
  for (const violation of violations) console.error(`- ${violation}`);
  console.error("Review the staged diff and remove or replace private content before committing.");
  process.exit(1);
}

console.log("PASS fork privacy scan");
console.log("Review the staged diff manually before committing; this scanner cannot identify every private detail.");

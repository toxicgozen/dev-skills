# Global-scope skills bootstrap

Instructions for an agent configuring **global** Cursor / Codex skills from this fork.
Humans: open this file in chat and say “follow it”.

## Hard boundaries

1. Only manage skills whose install source is `toxicgozen/dev-skills` (see `skills-lock.json` `source` fields, or the skill set this script installs).
2. Do **not** add, update, remove, or rename skills from any other source (other GitHub repos, Cursor built-ins under `skills-cursor`, personal skills, etc.).
3. Do **not** use `npx skills add … -s '*'` / `--skill '*'`. That installs non-promoted buckets (`in-progress/`, `misc/`, `deprecated/`).
4. Do **not** edit skill bodies under `~/.agents/skills`, `~/.cursor/skills`, or `~/.codex/skills` by hand unless the installer failed and you are recovering — prefer the installer.

## Authority

- Promoted set: `.claude-plugin/plugin.json` → `skills` array
- Installer: `scripts/install-promoted.mjs` (reads that array; does not change the public `skills` CLI)

## Steps

Run from this repository root (a clone of `toxicgozen/dev-skills`).

### 1. Install / refresh the promoted set (global)

```bash
node scripts/install-promoted.mjs . -- -g --agent cursor codex -y
```

If the checkout is not the source you want on the lockfile, use the GitHub source instead:

```bash
node scripts/install-promoted.mjs toxicgozen/dev-skills -- -g --agent cursor codex -y
```

Pass extra `npx skills` flags after `--` if needed (other agents, no `-y`, etc.).

### 2. Remove obsolete skills from this source only

After a layout change (for example drafts that used to ship, or renames like `writing-great-skills` → `writing-for-agents`):

1. Read the global/project `skills-lock.json` the CLI maintains for this install scope.
2. Collect skill names where `source` is `toxicgozen/dev-skills` (or the local path equivalent for this repo).
3. Subtract the current promoted names from `plugin.json`.
4. For each leftover name, remove **only those**, e.g.:

```bash
npx skills remove -g -a cursor -a codex -y --skill <name1> <name2> ...
```

If a leftover skill is not in the lock under this source, leave it alone.

### 3. Verify

```bash
npx skills list -g
node scripts/check-promoted-layout.mjs
```

Confirm promoted skills are present for the requested agents, and that skills from other sources still exist unchanged.

## Out of scope

- Project-local installs (omit `-g`) unless the human explicitly asks
- Claude Code plugin marketplace install (`claude plugins install …`) — different path; see `README.md` / upstream docs
- Syncing or rewriting this repository’s skill content (that is normal repo work, not this bootstrap)

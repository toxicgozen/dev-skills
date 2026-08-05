# Public fork boundary

This is a public personal fork of [mattpocock/skills](https://github.com/mattpocock/skills).
It tracks the upstream repository tree and applies only small, generic adaptations.
It is not a storage location for private context.

## Privacy

- Never add captures, private specifications, conversations, local logs,
  credentials, tokens, personal data, or machine-specific paths.
- Do not copy content from a private consumer repository merely to make a skill
  example concrete. Use synthetic, minimal examples.
- Keep `.local/`, `.private/`, and environment files untracked.
- Before every commit, review the staged file list and diff, then run
  `node scripts/check-fork-privacy.mjs`.
- A passing scanner is only a safety net; the staged diff remains the authority.

## Upstream relationship

- `origin` is `toxicgozen/dev-skills`; `upstream` is `mattpocock/skills`
  and is fetch-only.
- Prefer staying aligned with upstream. Sync from `upstream/main`, then
  re-apply only the fork overlays that are still needed.
- Micro-adaptations belong in issues on this fork. Drop a fork patch when
  upstream lands an equivalent fix.
- Do not open or prepare an upstream contribution unless the user explicitly
  asks for one in that task.

## Promoted install set

Upstream keeps category and lifecycle buckets under `skills/`. The Claude Code
plugin ships only the paths listed in `.claude-plugin/plugin.json`.

`npx skills add` discovers nested skill directories and may also list
non-promoted buckets (`in-progress/`, `misc/`, `deprecated/`). Do not treat that
raw discovery list as the fork's recommended install set.

Recommended installs for this fork:

- Claude Code: install from this repository's plugin / marketplace using the
  `skills` array in `.claude-plugin/plugin.json`.
- Other agents: run `scripts/install-promoted.mjs` (or pass the same skill names
  to `npx skills add … --skill …`). The script reads `plugin.json` so both
  paths share one authority list.

Do not modify the public `skills` CLI to filter buckets.

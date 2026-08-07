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
- Prefer staying aligned with upstream. Run `/pull-update-dev-skills` to compare
  against `upstream/main` by the intents in [`fork-intents.json`](./fork-intents.json),
  then re-apply only the fork overlays that are still needed.
- Micro-adaptations belong in issues on this fork. Drop a fork patch when
  upstream lands an equivalent fix.
- Do not open or prepare an upstream contribution unless the user explicitly
  asks for one in that task.

## Issue → Intent → Commit

- One issue owns one independently decidable intent.
- One completed intent lands as one implementation commit whose message
  references that issue (`Refs #N` or `Closes #N`).
- The issue is the source of truth for why; the commit is the implementation
  snapshot for how.
- Every active fork overlay has an issue-linked record in
  [`fork-intents.json`](./fork-intents.json). Update the record whenever the
  overlay changes or is compared with upstream.
- A sync to one upstream commit is one intent and one merge commit. It may
  decide several existing overlay records, but it must account for every one.
- Release commits and upstream-authored commits brought in by that merge are
  mechanical exceptions; they do not create new fork intents.

Legacy overlays marked `needs-decision` predate this protocol. The next sync
must compare each one with upstream, then either link a dedicated issue and
retain it or mark it `superseded-by-upstream` and remove it.

## Promoted install set

Upstream keeps category and lifecycle buckets under `skills/`. The Claude Code
plugin ships only the paths listed in `.claude-plugin/plugin.json`.

`npx skills add` discovers nested skill directories and may also list
non-promoted buckets (`in-progress/`, `misc/`, `deprecated/`). Do not treat that
raw discovery list as the fork's recommended install set.

Recommended installs for this fork:

- Claude Code: install from this repository's plugin / marketplace using the
  `skills` array in `.claude-plugin/plugin.json`.
- Other agents: run the explicit `npx skills add … --skill …` command in
  [`global-scope-skills-bootstrap.md`](./global-scope-skills-bootstrap.md).
  Its names mirror `plugin.json`, and `npx skills update -g` refreshes installed
  copies without a repository clone.

`/setup-dev-skills-structure` configures one consumer project's tracker,
labels, and domain-doc layout. `/pull-update-dev-skills` aligns this fork's
source with upstream. Neither command owns machine-global installation.

Do not modify the public `skills` CLI to filter buckets.

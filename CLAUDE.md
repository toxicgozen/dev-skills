Before modifying this public fork, read [`FORK.md`](./FORK.md) and apply its
privacy and upstream-contribution rules.

This repository is a curated, installable adaptation of selected skills from
Matt Pocock's collection. It is not a tracking mirror of the upstream tree.

## Skill set

- Skills live flat at `skills/<skill-name>/SKILL.md`.
- Every direct child of `skills/` ships through
  `npx skills add toxicgozen/dev-skills`.
- Do not introduce category, promotion, lifecycle, personal, draft, or
  deprecated buckets beneath `skills/`.
- If a skill is not part of the maintained set, remove it from this repository
  instead of hiding it from installers.
- Treat upstream changes as candidates to review and adapt. Do not merge an
  upstream bucket or repository layout into this install surface.

When adding, renaming, or removing a skill, update the top-level `README.md`,
`.claude-plugin/plugin.json`, and any routes in `ask-matt` affected by the
change. Run `npm test` and verify the CLI discovery result with
`npx skills add . --list`.

Every `SKILL.md` is either user-invoked (`disable-model-invocation: true` plus
`policy.allow_implicit_invocation: false` in `agents/openai.yaml`) or
model-invoked. See [`.agents/invocation.md`](./.agents/invocation.md).

The repository is also a single-plugin Claude Code marketplace.
`.claude-plugin/marketplace.json` lists the `dev-skills` plugin, and the plugin
manifest lists every directory under `skills/`. Keep its version in sync with
`package.json` and run `claude plugin validate . --strict` after changing a
manifest.

[`ask-matt`](./skills/ask-matt/SKILL.md) maps the user-reachable skills and how
they relate. Update it whenever a skill is added, renamed, removed, or changes
its role in a flow.

For local development links into `~/.claude/skills` and `~/.agents/skills`, run
`scripts/link-skills.sh`. This is a maintainer convenience, not an installer.

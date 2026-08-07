# The canonical install block

One install story, one wording. `README.md`, `.changeset/*`, and every page under `docs/` must say **this** and nothing else. Change it here first, then propagate.

`mattpocock-skills` is listed in **Claude Code's official marketplace** — configured name `claude-plugins-official`, source repo `anthropics/claude-plugins-official` — which every Claude Code install has out of the box. There is no marketplace to add first. Official Anthropic marketplaces have auto-update enabled by default ([discover-plugins](https://code.claude.com/docs/en/discover-plugins)), so "updates arrive automatically" is a true claim, not a hope.

## Claude Code — the plugin

<canonical-block name="claude-code">

```bash
claude plugins install mattpocock-skills
```

Or, from inside a session:

```
/plugin install mattpocock-skills
```

It's in Claude Code's official marketplace, so there's nothing to add first, and updates arrive automatically.

</canonical-block>

## Codex, and other agents — this fork

The plugin is Claude Code only. Install this fork's promoted set directly from
any directory:

<canonical-block name="skills-sh-whole-set">

```bash
npx skills@latest add toxicgozen/dev-skills --skill ask-matt diagnosing-bugs grill-with-docs triage improve-codebase-architecture setup-dev-skills-structure pull-update-dev-skills tdd to-spec to-tickets wayfinder implement prototype research domain-modeling codebase-design code-review resolving-merge-conflicts wizard grill-me grilling handoff teach to-questionnaire wait-what writing-for-agents -g --agent cursor codex
```

The command installs exactly the names in `.claude-plugin/plugin.json`; raw
repository discovery may also expose non-promoted buckets. The CLI keeps its
overwrite confirmation visible; cancel if a same-named skill belongs to a
different source. Differently named skills are never part of reconciliation.
Use `npx skills@latest update -g` for later global refreshes; no clone is
required. The operational runbook is
[`global-scope-skills-bootstrap.md`](../global-scope-skills-bootstrap.md).

</canonical-block>

…and the single-skill form wherever one skill is named on its own. Note that **`docs/` pages are not a consumer of this block**: ai-hero renders the install widget above the body, so a page that writes the commands out duplicates it. See [writing-docs.md](./writing-docs.md).

<canonical-block name="skills-sh-one-skill">

```bash
npx skills@latest add toxicgozen/dev-skills --skill=<name>
```

```bash
npx skills@latest update <name>
```

</canonical-block>

`skills@latest` is the pinned spelling in all three. The pages under `docs/` used to carry their own copy of these commands; those blocks are now deleted rather than corrected, because the site renders the install commands itself.

## The two routes are exclusive

The plugin is a managed, read-only bundle you subscribe to. skills.sh writes files you own and edit. Installing both leaves the user with every skill twice — always say "pick one".

## Not the install story

`.claude-plugin/marketplace.json` makes the repo its own single-plugin marketplace (`/plugin marketplace add mattpocock/skills`, then `/plugin install mattpocock-skills@mattpocock`). The official listing supersedes it. It is kept as a fallback for installing the repo directly — an unreleased commit, or a fork — and is **not** documented to users.

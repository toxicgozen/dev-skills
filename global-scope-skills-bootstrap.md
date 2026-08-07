# Maintain the global skill set

The global install does not depend on a clone of this repository. The
[`skills` CLI](https://www.skills.sh/docs/cli) owns both installation and later
updates; the repository only declares which skills are promoted.

## Install the promoted set

Run the command below from any directory. It installs the exact set in
`.claude-plugin/plugin.json` for Cursor and Codex at global scope:

```bash
npx skills@latest add toxicgozen/dev-skills --skill ask-matt diagnosing-bugs grill-with-docs triage improve-codebase-architecture setup-dev-skills-structure pull-update-dev-skills tdd to-spec to-tickets wayfinder implement prototype research domain-modeling codebase-design code-review resolving-merge-conflicts wizard grill-me grilling handoff teach to-questionnaire wait-what writing-for-agents -g --agent cursor codex
```

The overwrite confirmation stays visible. If it reports a same-named skill
owned by another source, cancel and decide which source should own that name.

## Update installed skills

Use the CLI's global update operation; no repository checkout or pull is
required:

```bash
npx skills@latest update -g
```

The CLI reads its lock file to find installed sources. Use
`npx skills@latest list -g` first when you want to inspect the global set, or
pass specific skill names to `update` when you do not want to refresh every
global skill.

This is different from `/pull-update-dev-skills`: that command updates the fork
source against `mattpocock/skills`, while the CLI updates the copies installed
on one machine.

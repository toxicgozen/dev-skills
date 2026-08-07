## What it does

`setup-dev-skills-structure` prepares one project for the engineering skills by
recording its issue tracker, triage labels, and domain-document layout. It writes
inspectable Markdown under `docs/agents/` and a small pointer block in the
project's existing agent instruction file.

It configures project structure after the skills are available; it never
installs, updates, or removes global skills.

## When to reach for it

You invoke this by typing `/setup-dev-skills-structure` — the
[agent](https://www.aihero.dev/ai-coding-dictionary/agent) won't reach for it
on its own. Run it once in each project before a tracker-dependent flow starts
guessing where issues live or which label strings to apply.

For maintaining the fork source against upstream, use
[pull-update-dev-skills](https://aihero.dev/skills-pull-update-dev-skills).

## Prerequisites

Run it inside the project it should configure. The project needs an existing
`CLAUDE.md` or `AGENTS.md`; if neither exists, the skill asks which one to
create instead of choosing a harness contract for you.

## The three decisions

| Decision | Default | When it asks |
| --- | --- | --- |
| Issue tracker | the tracker matching the Git remote | every run |
| Triage labels | the five canonical state names | only when triage is installed |
| Domain docs | one root `CONTEXT.md` plus `docs/adr/` | only when monorepo signals make multiple contexts plausible |

The tracker and label files are mappings, not provisioning scripts. They tell
downstream skills how to use infrastructure that already exists.

## Common questions

**Is this the old `setup-matt-pocock-skills` job?**

Yes. The name now describes the structure it creates without tying the skill
to one upstream repository.

**Do I have to use GitHub?**

No. GitHub, GitLab, and local Markdown ship as templates. Other trackers work
when you supply the operational contract the downstream skills should follow.

**Does it create tracker labels?**

No. It records the mapping between canonical triage roles and existing label
strings. Provision missing labels in the tracker itself.

## It's working if

- Tracker-dependent skills stop asking where issues live.
- Triage applies the project's real label strings rather than inventing them.
- The project's agent instruction file points to committed, editable
  `docs/agents/` contracts.
- Re-running the skill presents existing choices instead of duplicating them.

## Where it fits

`setup-dev-skills-structure` is run-once project configuration, aligned with
the original upstream setup skill. It prepares tracker-dependent skills such
as [triage](https://aihero.dev/skills-triage) and
[to-tickets](https://aihero.dev/skills-to-tickets); it does not maintain the
fork or a user's global skill directory. The full skill map lives in
[ask-matt](https://aihero.dev/skills-ask-matt).

# dev-skills

A curated, installable adaptation of the development-workflow skills from
[Matt Pocock's skills collection](https://github.com/mattpocock/skills).

This repository is the set, not a mirror of the upstream repository. Skills we
use and maintain live directly under `skills/`; skills we do not want to ship
are absent. Installers do not need to understand any internal classification
or release tier.

## Install

Install from GitHub with the standard Agent Skills installer:

```bash
npx skills add toxicgozen/dev-skills
```

The installer will offer only the skills in this curated set. To inspect the
set without installing it:

```bash
npx skills add toxicgozen/dev-skills --list
```

To install selected skills non-interactively:

```bash
npx skills add toxicgozen/dev-skills --skill tdd code-review
```

When developing from a local checkout, replace the repository name with `.`:

```bash
npx skills add . --list
npx skills add .
```

## Included skills

- **[ask-matt](./skills/ask-matt/SKILL.md)** — Choose the right skill or flow for the work at hand.
- **[code-review](./skills/code-review/SKILL.md)** — Review a change against repository standards and its originating spec.
- **[codebase-design](./skills/codebase-design/SKILL.md)** — Design deep modules with small interfaces and well-placed seams.
- **[diagnosing-bugs](./skills/diagnosing-bugs/SKILL.md)** — Diagnose hard bugs and performance regressions systematically.
- **[domain-modeling](./skills/domain-modeling/SKILL.md)** — Build and sharpen a project's ubiquitous language and domain model.
- **[grill-me](./skills/grill-me/SKILL.md)** — Stress-test a plan or design through a relentless interview.
- **[grill-with-docs](./skills/grill-with-docs/SKILL.md)** — Grill a plan while recording its domain language and decisions.
- **[grilling](./skills/grilling/SKILL.md)** — Reusable grilling discipline for other skills and direct use.
- **[handoff](./skills/handoff/SKILL.md)** — Compact a conversation so another agent can continue it.
- **[implement](./skills/implement/SKILL.md)** — Implement work from a spec or set of tickets.
- **[improve-codebase-architecture](./skills/improve-codebase-architecture/SKILL.md)** — Find and work through codebase-deepening opportunities.
- **[prototype](./skills/prototype/SKILL.md)** — Build a throwaway prototype to answer a design question.
- **[research](./skills/research/SKILL.md)** — Research primary sources and capture cited findings in the repository.
- **[resolving-merge-conflicts](./skills/resolving-merge-conflicts/SKILL.md)** — Resolve an in-progress merge or rebase by intent.
- **[setup-matt-pocock-skills](./skills/setup-matt-pocock-skills/SKILL.md)** — Configure a repository for the workflow skills that require local policy.
- **[tdd](./skills/tdd/SKILL.md)** — Develop one vertical slice at a time with red-green-refactor.
- **[teach](./skills/teach/SKILL.md)** — Teach a skill or concept in a stateful workspace.
- **[to-spec](./skills/to-spec/SKILL.md)** — Synthesize the current conversation into a spec.
- **[to-tickets](./skills/to-tickets/SKILL.md)** — Break a plan or spec into dependency-aware tracer-bullet tickets.
- **[triage](./skills/triage/SKILL.md)** — Categorize, verify, and prepare issues and external pull requests.
- **[wayfinder](./skills/wayfinder/SKILL.md)** — Resolve a large effort as a map of decision tickets.
- **[writing-great-skills](./skills/writing-great-skills/SKILL.md)** — Write and edit predictable agent skills.

## Maintenance model

The upstream repository is prior art and an update source, not this
repository's public interface. Upstream changes are reviewed and selectively
adapted into the retained skills. Upstream directory categories, drafts,
personal skills, and deprecated skills are not synchronized here.

Every direct child of `skills/` is installable and shipped. Adding or removing
a skill is therefore an explicit change to the set. Run `npm test` after
changing the layout or manifests.

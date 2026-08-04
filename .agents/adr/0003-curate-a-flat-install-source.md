---
status: accepted
---

# Curate one flat, directly installable skill set

`dev-skills` is a maintained adaptation of selected skills from Matt Pocock's
collection, not a mirror of the upstream repository's organization. Consumers
install it through one interface:

```text
npx skills add toxicgozen/dev-skills
```

All retained skills live at `skills/<skill-name>/SKILL.md`. Every direct child
of `skills/` ships, and skills outside the maintained set are removed rather
than hidden behind promotion metadata. Category, lifecycle, personal, draft,
and deprecated buckets are not part of this repository's consumer interface.

This puts the selection decision in the source tree itself. The skills CLI,
Claude Code plugin manifest, local development linker, README, and tests all
project the same set instead of maintaining competing definitions. Upstream
updates are reviewed and adapted skill by skill; upstream repository machinery
is not merged by default.

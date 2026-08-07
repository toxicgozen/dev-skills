---
status: accepted
issue: https://github.com/toxicgozen/dev-skills/issues/2
---

# Keep global installation outside the skill set

The upstream `setup-matt-pocock-skills` skill configures the consuming project.
It does not bootstrap a user-scope installation. Preserve that boundary here
under the source-neutral name `/setup-dev-skills-structure`.

Keep two user-invoked interfaces:

- `/setup-dev-skills-structure` owns project-local issue tracker, triage label,
  and domain-doc structure;
- `/pull-update-dev-skills` aligns the fork source with upstream by the intents in
  `fork-intents.json`.

Global installation and refresh are direct `npx skills` operations documented
in `global-scope-skills-bootstrap.md`. They need no clone and no installed
bootstrap skill. The plugin manifest remains the promoted-set authority for
the explicit install command.

This split gives each command one state boundary: project structure or fork
source. Machine-local installation stays in the package manager that owns it.
The cost is a breaking command rename for the setup skill, handled by the
changelog and docs.

---
status: accepted
---

# Track upstream with a promoted install overlay

This fork tracks [mattpocock/skills](https://github.com/mattpocock/skills)
closely: same bucket layout under `skills/`, same promoted set in
`.claude-plugin/plugin.json`, and only small behaviour patches when a local
need is not yet solved upstream.

The vercel-labs `skills` CLI discovers nested `SKILL.md` files under `skills/`
and does **not** understand upstream's engineering/productivity promotion
convention. A flat tree was previously used to make discovery equal the ship
set; that approach is superseded because it fought upstream merges.

Instead:

1. Keep the upstream tree and plugin manifest as the source of truth for what
   is promoted.
2. Document one direct `npx skills` command whose explicit names mirror
   `plugin.json`; do not add a clone-dependent installation wrapper.
3. Re-apply only documented fork skill patches after each upstream sync; drop
   them when upstream covers the same behaviour.

Privacy scanning and the public-fork boundary in `FORK.md` remain required.
Personal or workspace-owned tools (for example Obsidian or TickTick skills)
do not live in this repository.

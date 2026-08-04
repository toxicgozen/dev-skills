# Public fork boundary

This is a public, curated adaptation of selected development-workflow skills
derived from Matt Pocock's collection. It is an installation source in its own
right, not a storage location for private context and not a mirror of the
upstream repository tree.

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

- `origin` is `toxicgozen/dev-skills`; `upstream` is
  `mattpocock/skills` and is fetch-only.
- Review upstream changes skill by skill. Adapt only changes wanted by this
  maintained set.
- Do not import upstream category folders, drafts, personal material,
  deprecated skills, documentation-site content, release automation, or other
  repository machinery merely because it exists upstream.
- Do not open or prepare an upstream contribution unless the user explicitly
  asks for one in that task.

## Installation interface

The supported installation interface is:

```text
npx skills add toxicgozen/dev-skills
```

Every direct directory under `skills/` is part of that interface. There is no
separate promotion list for the installer: retain a skill here when it belongs
in the set, and delete it when it does not.

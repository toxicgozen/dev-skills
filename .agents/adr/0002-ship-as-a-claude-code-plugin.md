---
status: superseded
superseded-by: 0003-curate-a-flat-install-source.md
---

# Ship as a Claude Code plugin while retaining upstream buckets

The repository previously retained the upstream category and lifecycle
folders, then used a Claude Code plugin manifest as a second promotion list.
That made the plugin installable, but `npx skills add` still discovered drafts,
deprecated skills, personal skills, and rarely used skills alongside the
intended set. Codex plugin support was also deferred because its manifest could
not select two promoted folders without selecting the non-promoted folders.

This decision is superseded. The repository no longer preserves those folders
or asks a manifest to compensate for them. See
[ADR 0003](./0003-curate-a-flat-install-source.md).

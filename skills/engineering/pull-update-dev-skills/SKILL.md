---
name: pull-update-dev-skills
description: Compare this fork with upstream and align it by recorded intent. Run when maintaining toxicgozen/dev-skills against mattpocock/skills.
disable-model-invocation: true
---

# Pull and Update Dev Skills

Align this fork with `upstream/main` by intent. File similarity is evidence;
the problem each change solves is the unit of decision.

## Hard boundaries

- Read `FORK.md`, `fork-intents.json`, `CLAUDE.md`, and relevant fork ADRs
  before comparing changes.
- Keep the public-fork privacy boundary in force throughout the run.
- Treat `upstream` as fetch-only. Never push to it or prepare an upstream
  contribution unless the user separately asks.
- Plan first. Do not merge, restore paths, edit intent records, or commit until
  the user approves the intent-level plan.
- Preserve unrelated working-tree changes. If they overlap the sync, stop and
  ask how the user wants to isolate them.

## 1. Establish the sync issue

Every mutating sync is one intent and one commit. Resolve the issue named by the
user. If none was named, draft a single issue whose intent is “align this fork
to upstream commit `<sha>` and resolve every registered overlay”, then get
authorization before creating it.

A dry run may proceed without an issue because it changes no repository state.

## 2. Snapshot both sides

Confirm the checkout, remotes, current branch, status, merge base, and current
upstream commit. Fetch `upstream/main`, then record:

- the before and target upstream SHAs;
- upstream commits not yet reachable from the fork;
- fork-only commits and changed areas since the merge base;
- every intent record whose areas intersect those changes.

Use commit messages, issues, ADRs, skill docs, and behavior as primary evidence.
Names and line overlap alone do not establish shared intent.

## 3. Produce the intent plan

For every upstream change and every registered fork intent, emit one row:

| Intent | Local evidence | Upstream evidence | Outcome | Reason |
| --- | --- | --- | --- | --- |

Choose exactly one outcome:

- **retain-local** — upstream does not cover the local intent;
- **adopt-upstream** — accept an upstream change whose intent is distinct from
  the registered local overlays;
- **remove-local** — upstream now covers the same intent; remove the redundant
  local implementation and mark the record `superseded-by-upstream`;
- **needs-decision** — the intents touch or partially overlap, but the evidence
  does not justify choosing one implementation.

Put every ambiguous row in a separate decision list. Explain the behavioral
difference and ask the user to choose; never convert ambiguity into an automatic
merge resolution.

The plan is complete only when every upstream change and every registered
overlay is accounted for once.

## 4. Apply the approved plan

Work on a dedicated branch with a clean tree. Merge `upstream/main` without
committing so the complete result remains reviewable as one sync change.

- Resolve **adopt-upstream** rows to upstream behavior.
- Reapply only approved **retain-local** overlays.
- Resolve **remove-local** rows to upstream behavior and update their intent
  records with the upstream evidence.
- Pause on any new ambiguity or scope not present in the approved plan.

Update `lastReviewedUpstream` for every record actually reviewed. Add a new
active record for a new overlay only when it links the single issue that owns
that intent.

## 5. Verify and commit

Run the repository's full checks, including:

```bash
npm test
npm run check:privacy
```

When a plugin manifest changed, also run:

```bash
claude plugin validate . --strict
```

Review the staged file list and diff. Commit the approved sync once, with the
target upstream SHA in the subject or body and `Closes #<issue>` in the message.
Do not push unless the user asks.

Finish with the final upstream SHA and four lists: retained locally, adopted
from upstream, removed locally, and user decisions made.

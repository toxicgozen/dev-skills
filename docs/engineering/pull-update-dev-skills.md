## What it does

`pull-update-dev-skills` compares this public fork with upstream and produces
an intent-level alignment plan before it changes the tree. It decides whether
to retain a local overlay, adopt a distinct upstream change, remove a local
patch that upstream supersedes, or ask the maintainer about an ambiguous
overlap.

The unit of comparison is the problem a change solves, not the files or phrases
the two implementations happen to share.

## When to reach for it

You invoke this by typing `/pull-update-dev-skills` — the
[agent](https://www.aihero.dev/ai-coding-dictionary/agent) won't reach for it
on its own. Run it when checking for new `mattpocock/skills` changes or when an
active fork overlay may have become redundant.

For configuring a consumer project's tracker and domain-doc layout, use
[setup-dev-skills-structure](https://aihero.dev/skills-setup-dev-skills-structure).

## Prerequisites

It runs in the `toxicgozen/dev-skills` checkout with a fetch-only `upstream`
remote. A mutating sync needs one issue that names the target upstream commit;
a dry run does not.

## The intent plan

| Outcome | Meaning |
| --- | --- |
| retain-local | Upstream still does not cover the local intent |
| adopt-upstream | The upstream change is distinct from registered local intent and can be accepted |
| remove-local | Upstream now solves the same problem, so the redundant local implementation is removed |
| needs-decision | The relationship is plausible but the evidence cannot choose safely |

Every upstream change and every registered overlay appears exactly once. The
plan stops for human judgment when an outcome is `needs-decision`.

## Common questions

**Does similar wording mean the intent is the same?**

No. Similar names and overlapping files are discovery clues. Issues, commits,
behavior, ADRs, and user-visible failure modes are the evidence used to decide
whether two changes solve the same problem.

**Why keep superseded intent records?**

They explain why a local patch disappeared and which upstream evidence replaced
it. Without that history, the same patch is likely to be reintroduced during a
later conflict.

**Will it push or contribute upstream?**

No. The default endpoint is one reviewed local sync commit. Pushing and upstream
contributions require separate user instructions.

## It's working if

- The maintainer sees the complete intent plan before any merge or restore.
- An upstream solution to the same problem removes the redundant local patch.
- Ambiguous overlaps stop with a concrete behavioral comparison.
- The final commit and active intent records link back to their owning issues.

## Where it fits

`pull-update-dev-skills` is periodic fork-source maintenance. Global copies are
installed and refreshed directly with the skills CLI; project structure belongs
to [setup-dev-skills-structure](https://aihero.dev/skills-setup-dev-skills-structure).
The wider set is mapped by
[ask-matt](https://aihero.dev/skills-ask-matt).

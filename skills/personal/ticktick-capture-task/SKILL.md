---
name: ticktick-capture-task
description: Capture supplied content as exactly one TickTick task and verify the created task by reading it back. Use only when the user explicitly asks to add, create, capture, or save a task in TickTick. Do not use for general TickTick questions, non-TickTick capture, task updates, or as an implicit step in another application's workflow.
---

# Capture one task in TickTick

Use the connected TickTick application to create one private task. Treat task
capture as the public capability; project lookup, connector calls, and
verification are internal mechanics of this skill.

## 1. Freeze the requested task

Before any write, identify and keep fixed for this run:

- the supplied title;
- optional content or description;
- every explicit due date or time, priority, tag, and supported recurrence;
- the explicitly named project, if any.

Preserve explicit values rather than rewriting, enriching, or inventing them.
If no title can be identified without guessing, ask the user for one. Do not
look in Obsidian or another application for context, enrichment, defaults, or
related records.

This skill creates exactly one task. For a batch request, stop and ask the user
to choose one task; do not choose on their behalf or write until they do. Do not
update, complete, delete, move, or otherwise modify an existing task.

## 2. Resolve the destination

Read the available TickTick projects before creating the task.

- When the user named a project, require one exact existing match. If the
  project is missing or more than one project remains plausible, stop and ask
  the user. Never create a project implicitly.
- When the user did not name a project, use TickTick's Inbox.

When the user supplied tags, read the available TickTick tags and require an
exact existing match for each one. If tags cannot be listed or any supplied tag
is missing or ambiguous, stop before writing. Never pass an unverified tag to a
create operation that might create it implicitly.

Use the resolved project's identifier for both creation and verification. Do
not persist project choices or connector availability as configuration.

## 3. Create one task

A clear request to add or capture the task authorizes creation of that one
private TickTick task. Do not ask for another confirmation unless the title or
explicit destination is ambiguous, the requested field is unsupported, or the
operation has a newly discovered risk.

Create one task with the frozen title and every explicit supported field. Do
not create missing tags, projects, columns, groups, comments, habits, or other
resources. If TickTick cannot represent an explicit field faithfully, stop
before writing and explain the limitation.

Do not treat a successful connector response, an entity tag, or a returned task
identifier as proof that the task now has the requested state.

## 4. Read back and verify

After creation, fetch the exact task using both the resolved project identifier
and returned task identifier. Verify:

- the task belongs to the resolved project;
- the title matches the frozen title;
- optional content and every explicit due date or time, priority, tag, and
  recurrence match the request.

If a value is normalized by TickTick, report the stored value and treat it as
verified only when it preserves the user's stated meaning. A mismatch is not
authorization to update the task. Stop further side effects and report the
created task plus the deviation.

## 5. Handle an unknown create result

If creation times out, disconnects, or otherwise leaves success unknown, do not
retry the create call. First inspect the resolved TickTick project for a task
matching the frozen title and all explicit fields.

- One exact match: fetch it by project identifier and task identifier, then run
  the normal verification.
- No exact match, several plausible matches, or an unavailable read path: stop
  and report the unknown result and duplicate risk.

Never infer idempotency from an entity tag or from repeating the same input.
Ordinary capture does not create a durable ledger, recovery database, or
cross-application workflow record.

## 6. Report impact

Report:

- the frozen input used;
- the resolved project;
- the task link when returned, otherwise its stable identifier;
- the fields confirmed by read-back;
- any normalization, deviation, or unknown state;
- whether no write occurred and why.

Report only effects and evidence that actually exist. A connector success
message by itself is not verification.

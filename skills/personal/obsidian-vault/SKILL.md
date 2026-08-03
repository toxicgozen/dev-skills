---
name: obsidian-vault
description: Store supplied content as a sourced note in an Obsidian vault while obeying that vault's own rules. Use when the user asks to save, capture, archive, translate, or turn content into an Obsidian note. Do not use for ordinary read-only questions about vault content or as an implicit dependency of another application task.
---

# Store content in Obsidian

Treat the target vault as the owner of note types, paths, names, templates,
frontmatter, tags, links, and aggregation. Keep this skill independent of any
specific vault or machine.

## 1. Resolve the target vault

Run the resolver from this skill directory:

```text
node scripts/resolve-vault.mjs [--vault "Explicit Name"]
```

Use an explicitly requested vault when present. Otherwise use the active vault
when it is registered, or the only registered vault. If several vaults remain
plausible, ask the user. Never silently replace an invalid explicit choice.

If the resolver cannot run Obsidian:

1. Run the read-only `obsidian help` probe.
2. Check whether the Obsidian application is running.
3. Start it only when it is absent and retry the original read-only probe.
4. If it is running but sandboxed access still fails, retry the same read-only
   probe outside the sandbox to identify IPC isolation.
5. Request narrowly scoped access for the required Obsidian subcommand. Do not
   disable the sandbox or replay a write merely to diagnose the connection.

Pass `vault=<resolved-name>` to subsequent Obsidian commands. Do not persist a
vault name or path during ordinary use. A future device-local choice requires
an explicit initialization or repair request; discovery results are not user
configuration.

## 2. Load the vault contract

Read the root `AGENTS.md` when present, then follow its routes for the smallest
set of rules required by this operation. Do not infer a shared folder layout,
note taxonomy, naming convention, template, frontmatter schema, tag system,
index note, or safety policy.

Use the Obsidian CLI for indexed content. Inspect hidden agent files through the
filesystem only when the request explicitly concerns them and the vault
contract permits it.

## 3. Freeze the source and plan the note

Before any side effect:

1. Read the exact content the user selected and keep that input fixed for this
   run. Do not silently re-read or retranslate a changing source mid-run.
2. Record the source identity, the part used, and the read date. Include a
   version or content identifier when readily available.
3. Determine the note type, title, path, structure, links, and metadata from the
   vault contract. Do not invent missing schema values.
4. Mark derived content with its source and authority. When the source remains
   canonical, say that the note is non-authoritative and may become stale.
5. Search the whole vault by proposed title, aliases, and durable source
   references before creating anything.

Handle matches as follows:

- No match: prepare a create operation.
- One same-source match: stop and report it unless the user explicitly asked to
  update or synchronize that note.
- Several plausible matches: ask the user to choose.

Do not create a recurring sync relationship or freshness monitor from a save
request. Do not add an index note or tags unless the vault contract requires
them.

## 4. Preview risk and obtain authorization

Before writing, state:

- the resolved vault and exact target path;
- whether the operation creates or changes an existing note;
- the content scope, source, and authority statement;
- every additional side effect, including source-file deletion;
- the verified recovery mechanism, or that none is available;
- the execution order, read-back checks, and stop conditions.

Follow the vault's stricter confirmation rules. Always wait for explicit
authorization when recovery is not verified, the target or scope is not exact,
the operation is broad, or the user required a preview. Authorization for a
previous plan does not cover a changed path or larger scope.

## 5. Write one effect at a time

Use Obsidian-aware create, move, rename, and delete operations when the vault
contract requires them. Never replace a required link-aware operation with a
filesystem move, rename, or delete because the CLI is unavailable.

Do not put an arbitrary note body into one `content=` or `code=` argument.
Obsidian on Windows can crash its main process when one CLI argument crosses an
IPC chunk boundary while the CLI still exits successfully. Create the small
template or shell first, then stream long body content through the bundled
writer from this skill directory:

```text
node scripts/append-content.mjs --vault "Resolved Name" --path "Folder/Note.md"
```

Send the body on stdin. The writer splits UTF-8 without breaking code points,
keeps each `content=` payload below 2 KiB, invokes `obsidian append ... inline`
serially, and stops at the first failed chunk. Never run Obsidian CLI writes in
parallel. Treat a main-process error dialog as a failed write even when the CLI
returned exit code 0.

After each create or edit, read the exact target back and verify:

- the expected path exists and is non-empty;
- required metadata, structure, source, and authority statements are present;
- content written through shell or IPC preserved its characters;
- the result matches the authorized plan.

If read-back fails or final state is unknown, stop producing side effects.
Report the last verified state, unknown range, and duplicate-write risk. Only
perform a later source-file deletion after the note has passed every required
check.

## 6. Report impact

Report the input used, resolved vault, created or changed note, any other actual
side effects, read-back evidence, deviations, unknowns, and currently valid
next actions. A tool success response is not read-back evidence.

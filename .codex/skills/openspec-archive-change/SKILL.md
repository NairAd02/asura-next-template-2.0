---
name: openspec-archive-change
description: Archive a completed change in the experimental workflow. Use when the user wants to finalize and archive a change after implementation is complete.
allowed-tools: Bash(openspec:*)
license: MIT
compatibility: Requires openspec CLI.
metadata:
  author: openspec
  version: "1.0"
  generatedBy: "1.6.0"
---

<!-- LOCAL_HARNESS_INTEGRATION_V1 -->

Archive a completed change in the experimental workflow.

**Store selection:** If the user names a store (a store is a standalone OpenSpec repo registered on this machine) or the work lives in one, run `openspec store list --json` to discover registered store ids, then pass `--store <id>` on the commands that read or write specs and changes (`new change`, `status`, `instructions`, `list`, `show`, `validate`, `archive`, `doctor`, `context`). Other commands do not take the flag. Hints printed by commands already carry the flag; keep it on follow-ups. Without a store, commands act on the nearest local `openspec/` root.

**Input**: Optionally specify a change name. If omitted, check if it can be inferred from conversation context. If vague or ambiguous you MUST prompt for available changes.

**Steps**

1. **If no change name provided, prompt for selection**

   Run `openspec list --json` to get available changes. Use the **AskUserQuestion tool** to let the user select.

   Show only active changes (not already archived).
   Include the schema used for each change if available.

   **IMPORTANT**: Do NOT guess or auto-select a change. Always let the user choose.

2. **Check artifact completion status**

   Run `openspec status --change "<name>" --json` to check artifact completion.

   Parse the JSON to understand:
   - `schemaName`: The workflow being used
   - `planningHome`, `changeRoot`, `artifactPaths`, and `actionContext`: path and scope context
   - `artifacts`: List of artifacts with their status (`done` or other)

   **If any artifacts are not `done`:** stop and report the incomplete artifacts. Confirmation cannot override readiness.

3. **Check task completion status**

   Read the tasks file (typically `tasks.md`) to check for incomplete tasks.

   Count tasks marked with `- [ ]` (incomplete) vs `- [x]` (complete).

   **If incomplete tasks are found or the tasks file is missing:** stop and report the exact problem.

4. **Run fail-closed readiness**

   Read the assurance profile, linked requirement, planning artifacts,
   `tasks.md`, schema-v3 `apply-progress.md`, and `verify-report.md`. Confirm
   that the planning digest/approval checkpoint is current and the report
   contains one structured five-gate `pnpm verify` result. Then run:

   ```bash
   node scripts/validate-harness.mjs --archive-ready <change-id>
   ```

   Stop on any failure. Readiness requires compatible accepted/delta
   identities, complete tasks/ownership/execution records, PASS, and a fresh
   SHA-256 snapshot. OpenSpec status is the native preflight.

5. **Perform the native archive**

   Preserve `--store <id>` when applicable and invoke only:

   ```bash
   openspec archive <change-id> --yes --json
   ```

   The native command owns spec synchronization and archive placement. Never manipulate the archive filesystem directly.

6. **Display summary**

   Show archive completion summary including:
   - Change name
   - Schema that was used
   - Archive location
   - Native spec synchronization result
   - Requirement/index reconciliation and post-archive spec validation

**Output On Success**

```
## Archive Complete

**Change:** <change-name>
**Schema:** <schema-name>
**Archived to:** the archive path derived from `planningHome.changesDir`/YYYY-MM-DD-<name>/
**Specs:** ✓ Synced to main specs (or "No delta specs" or "Sync skipped")

All artifacts complete. All tasks complete.
```

**Guardrails**
- Always prompt for change selection if not provided
- Use artifact graph (openspec status --json) for completion checking
- Block archive on every readiness invariant; confirmation is not an override
- Require PASS even when a failure pre-dates the change
- Show clear summary of what happened
- Use only native `openspec archive` for spec sync and archive placement
- Update the linked requirement/index after native archive, then validate accepted specs

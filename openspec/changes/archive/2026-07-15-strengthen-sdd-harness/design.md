## Context

REQ-001 established the hybrid layers, and the baseline change proved the quality gates. The current harness has skills and roles but lacks an unavoidable Codex entry point, a durable handoff format, implementation-progress records, and archival evidence. The design must improve operability without importing the heavier strategies intentionally excluded from gentle-ai-main.

## Goals / Non-Goals

**Goals:**

- Make the existing hybrid workflow discoverable from the repository root.
- Classify work consistently and continue active changes from native OpenSpec state.
- Preserve OpenSpec as the only executable change and state authority.
- Pass only necessary exact skill paths to bounded roles.
- Make implementation, verification, and archive decisions auditable from change artifacts.
- Support both multi-agent and single-agent runtimes.
- Keep one final verification tier.

**Non-Goals:**

- Build an installer, memory system, persona system, model router, receipt format, review tier system, or PR slicing system.
- Add automated test frameworks or a second verification suite.
- Rewrite product modules or add dependencies.
- Require requirement briefs for purely internal non-contractual work.

## Decisions

### Root bootstrap is concise and mandatory

A root AGENTS.md will require reading the SDD skill and the skill registry before work. It contains the entry classification table and points to detailed documents rather than duplicating them.

- **Rationale:** Codex automatically discovers a root instruction file; a short bootstrap makes the harness active without turning it into a long alternate manual.
- **Alternative considered:** Rely on a human prompt to name the workflow. Rejected because the protocol can otherwise be skipped.

### OpenSpec state is queried, never mirrored

Before apply, verification, and archive, the operator reads openspec status --change <id> --json. Before apply, it also reads openspec instructions apply --change <id> --json. The installed OpenSpec schema has no verify or archive instruction artifact, so the harness records status as the authoritative preflight for those phases rather than inventing commands or state.

- **Rationale:** Native OpenSpec output remains the authority and avoids state drift.
- **Alternative considered:** Maintain a custom phase-status file. Rejected because it would compete with OpenSpec.

### Exact skills and bounded roles are explicit

The registry remains the resolver. A role receives only the exact SKILL.md paths needed for its task, file roots, and a common handoff. Executors cannot redelegate. When subagents are unavailable, the orchestrator performs the same role inline under the same responsibility and file boundaries.

- **Rationale:** This preserves progressive disclosure and predictable responsibility.
- **Alternative considered:** Give every role every skill. Rejected because it creates irrelevant context and weakens ownership.

### Handoff and readiness use repository artifacts

A new contract defines mandatory input and output fields. Before implementation approval, the operator rereads proposal, specs, design, tasks, and relevant requirement brief and checks existence, coherent scope, valid paths, and no blocking question.

- **Rationale:** A structured handoff preserves context across agents and sessions without creating an external memory system.
- **Alternative considered:** Free-form summaries only. Rejected because omissions are not discoverable.

### Progress and evidence are change-local append-only records

Every implemented change creates apply-progress.md. It is cumulative and records status, completed tasks, files, decisions, issues, remaining work, and skills. tasks.md remains the source of completion truth. Verification writes verify-report.md with conformance, exact gates, exit codes, warnings, and PASS or FAIL. A later change invalidates the report and requires all gates again.

- **Rationale:** The artifacts are inspectable, survive sessions, and remain adjacent to the change without replacing OpenSpec tasks.
- **Alternative considered:** A global journal or receipts. Rejected because it increases infrastructure and was explicitly out of scope.

### Archive is a documented readiness gate

The verifier checks all task boxes, progress presence/reconciliation, PASS evidence, and requirement status/link coherence before archive. Requirementless technical work records no requirement as applicable; behavior work updates its linked brief and index.

- **Rationale:** Archive should promote accepted behavior only after objective evidence is complete.
- **Alternative considered:** Archive after build alone. Rejected because it loses task and product-intent traceability.

## Interfaces

### Handoff Input

- role
- task
- change ID or no-change classification
- structured OpenSpec status/context
- allowed editable roots
- exact skill paths

### Handoff Output

- status: success, partial, or blocked
- summary
- artifacts
- files changed
- completed tasks
- risks
- next phase
- skill resolution: paths-injected, inline-fallback, or none

### apply-progress.md Fields

- status
- completed tasks
- files changed
- decisions and deviations
- problems
- remaining tasks
- skills loaded

### verify-report.md Fields

- conformance against proposal, specs, design, and tasks
- command, exit code, and summary for OpenSpec, typecheck, lint, and build
- relevant warnings
- PASS or FAIL verdict
- report invalidation rule

## Skills and Responsibility Boundaries

- spec-driven-development: universal lifecycle and native state checks.
- implementation-progress: progress and report artifact rules.
- verification-harness: four gates, archive readiness, and evidence format.
- module-architecture: applies to design changes only.
- requirements-curation: applies to broad product intent only.

The harness change itself does not require data-layer, UI, forms, filters, SSR, or i18n implementation skills.

## Migration Plan

1. Add root bootstrap, contract, and progress skill.
2. Update registry, SDD skill, verifier skill, and role definitions.
3. Update OpenSpec configuration, operator docs, and README references.
4. Update the workflow delta spec and this change tasks.
5. Execute the pilot with apply-progress and verify-report.
6. Update REQ-002 to implemented and archive this change.

Rollback is a source revert. No data, dependency, or runtime migration exists.

## Verification Approach

- Validate OpenSpec artifacts and run the four baseline gates through pnpm verify.
- Inspect the root bootstrap, registry, contracts, skills, and roles for exact paths and consistent terms.
- Demonstrate active-change recovery through status, tasks, and apply-progress.
- Demonstrate the archive gate by inspecting pending-task and FAIL-report conditions rather than attempting an invalid archive command that could mutate state.
- Record the technical-task classification simulation in apply-progress and verify-report.

## Risks / Trade-offs

- [Current OpenSpec CLI lacks verify/archive instructions] -> Use status as the native authority for those phases and document the limitation.
- [Documentation can drift] -> Put durable behavior in workflow spec, root bootstrap, shared contract, and verifier skill, then validate in the pilot.
- [Progress can diverge from tasks] -> Require reconciliation before continuation and archive.
- [Inline fallback may blur roles] -> Preserve the same allowed roots, responsibilities, and no-redelegation rule.

## Open Questions

None.

# Verification Report

Change: `stabilize-subagent-orchestration`  
Date: 2026-07-23  
Verifier: `agent-verifier`  
Requirement brief: not applicable; this is requirementless internal harness
governance work.

## Conformance

- Proposal: PASS. The implementation covers the root/executor split,
  proportional execution modes, semantic milestones, 10/20/15-minute default
  observation budgets, one bounded recovery, single-writer ownership, bounded
  architecture, runtime adapters, native Codex agents, validation, and
  operator/developer guidance.
- Workflow delta: PASS. Root and executor entry paths are distinct;
  `delegationPlan` schema v2 separates role ownership, skill resolution,
  execution mode, planned mode, budgets, milestones, exclusive artifacts, and
  fallback evidence.
- Design: PASS. Portable semantics remain under `.agent`; Codex registration
  remains a thin `.codex` adapter; architecture is advisory by default and
  bounded by exact inputs, template, stopping condition, and
  `maxResearchRounds`.
- Tasks and progress: PASS. The approval checkpoint is present, all task IDs
  reconcile, owner-tagged tasks are covered by schema-v2 role entries and
  complete handoffs, task 6.1 is complete, and progress is
  `ready-for-archive`.
- One-writer ownership: PASS. The orchestrator and verifier entries do not
  claim the same exclusive artifact; the verifier exclusively owns this
  report.
- Runtime adapters: PASS. Five native Codex agent TOMLs point to the matching
  portable role profiles, inherit the parent model, apply the planned reasoning
  defaults, and use `workspace-write`; the generic adapter documents absent
  capabilities without inventing Codex tools.
- Mechanical validation: PASS. The validator enforces schema v2, planned
  inline/subagent/runtime-fallback semantics, budget and milestone fields,
  fallback evidence, handoff coverage, exclusive-artifact collisions,
  bootstrap separation, and native adapter structure.
- Documentation and terminology: PASS. Mutable guidance consistently separates
  `skillResolution` (`paths-injected` or `none`) from `inline`, `subagent`, and
  `runtime-fallback`; historical migration references are descriptive rather
  than active guidance.

## Final Gates

The required aggregate command was run exactly:

| Command | Exit code | Duration | Summary |
|---|---:|---:|---|
| `pnpm verify` | 0 | 323024 ms | PASS: OpenSpec 6/6, harness fixtures 26/26, Vitest 4 files and 19 tests, non-incremental typecheck, full lint, and production build. |

A supplemental no-repair pass captured exact timings for each gate:

| Command | Exit code | Duration | Summary |
|---|---:|---:|---|
| `pnpm validate:specs` | 0 | 7032 ms | OpenSpec validated 1 active change and 5 accepted specs; harness validation passed 26/26 fixtures and repository invariants. |
| `pnpm test:unit:run` | 0 | 3493 ms | Vitest passed 4 test files and 19 tests. |
| `pnpm typecheck` | 0 | 12386 ms | Application and reference TypeScript checks passed with `--noEmit --incremental false`. |
| `pnpm lint` | 0 | 16531 ms | Repository ESLint and the non-ignored reference widget lint passed. |
| `pnpm build` | 0 | 28628 ms | Next.js 16.2.4 production build compiled, typechecked, generated 29 static pages, and finalized successfully. |
| `node scripts/validate-harness.mjs --snapshot stabilize-subagent-orchestration` | 0 | 138 ms | Regenerated the final SHA-256 evidence snapshot below after persisting the first strict result. |
| `openspec status --change stabilize-subagent-orchestration --json` | 0 | 1955 ms | Native status reported all planning artifacts complete. |
| `node scripts/validate-harness.mjs --archive-ready stabilize-subagent-orchestration` | 0 | 512 ms | First strict reconciliation passed before the final snapshot refresh. |

## Warnings

- Next.js emitted the existing `metadataBase` warning twice and used
  `http://localhost:3000` to resolve social metadata. The warning does not
  violate this internal harness change.
- `git diff --check` exited 0; Git printed line-ending notices that LF will be
  converted to CRLF when it next writes the changed text files.
- A Codex IDE thread opened before the new custom-agent TOML files existed may
  require a new chat or extension reload before the names are discovered. The
  portable handoff remains usable by a native generic subagent.
- Structured validation proves evidence shape and internal coherence; it does
  not establish actual provider activity, elapsed runtime behavior, or the
  truth of a human chat event.

## Archive Readiness

The change has no linked requirement brief. Native OpenSpec status is complete,
all tasks and progress are reconciled, and the first strict archive-readiness
reconciliation passed. The snapshot below is refreshed after persisting that
result and is followed by a final no-write strict check.

## Verdict

PASS

## Invalidation Rule

Any subsequent modification to an implementation file or covered change
artifact invalidates this PASS and requires `pnpm verify`, a fresh SHA-256
snapshot, and strict archive-readiness validation again.

## Evidence Snapshot

```json
{
  "schemaVersion": 1,
  "algorithm": "sha256",
  "paths": [
    ".agent/agents/agent-architect.md",
    ".agent/agents/agent-data.md",
    ".agent/agents/agent-requirements-curator.md",
    ".agent/agents/agent-ui.md",
    ".agent/agents/agent-verifier.md",
    ".agent/agents/orchestrator.md",
    ".agent/contracts/phase-handoff.md",
    ".agent/README.md",
    ".agent/runtime-adapters/codex.md",
    ".agent/runtime-adapters/generic.md",
    ".agent/runtime-adapters/portable-contract.md",
    ".agent/skill-registry.md",
    ".agent/skills/implementation-progress/SKILL.md",
    ".agent/skills/spec-driven-development/SKILL.md",
    ".codex/agents/agent-architect.toml",
    ".codex/agents/agent-data.toml",
    ".codex/agents/agent-requirements-curator.toml",
    ".codex/agents/agent-ui.toml",
    ".codex/agents/agent-verifier.toml",
    ".codex/config.toml",
    "AGENTS.md",
    "harness-docs/developer-harness-guide.md",
    "harness-docs/harness-audit-report.md",
    "harness-docs/human-operator-guide.md",
    "harness-docs/README.md",
    "openspec/changes/stabilize-subagent-orchestration/.openspec.yaml",
    "openspec/changes/stabilize-subagent-orchestration/apply-progress.md",
    "openspec/changes/stabilize-subagent-orchestration/design.md",
    "openspec/changes/stabilize-subagent-orchestration/proposal.md",
    "openspec/changes/stabilize-subagent-orchestration/specs/workflow/spec.md",
    "openspec/changes/stabilize-subagent-orchestration/tasks.md",
    "README.md",
    "scripts/harness-validation.mjs",
    "scripts/harness-validation.test.mjs"
  ],
  "digest": "6cd8c429b3eeee53ebcba2ed0a6b23ecc92cff1473ab5e268b7a304cdcf501d5"
}
```

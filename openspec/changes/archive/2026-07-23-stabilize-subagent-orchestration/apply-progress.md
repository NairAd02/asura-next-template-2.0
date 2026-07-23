# Apply Progress

## Current Snapshot

```json
{
  "schemaVersion": 2,
  "status": "ready-for-archive",
  "completedTaskIds": [
    "1.1",
    "2.1",
    "2.2",
    "2.3",
    "2.4",
    "3.1",
    "3.2",
    "4.1",
    "4.2",
    "4.3",
    "5.1",
    "5.2",
    "6.1"
  ],
  "remainingTaskIds": [],
  "filesChanged": [
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
  "approvalCheckpoint": {
    "schemaVersion": 1,
    "status": "approved",
    "approvedBy": "human-operator",
    "approvedAt": "2026-07-23",
    "approvalSource": "chat",
    "packetSummary": "The operator reviewed and explicitly approved the Implementation Approval Packet, including the schema v2 migration, runtime-adapter discovery risk, proportional budgets, and evidence boundaries.",
    "artifactsReviewed": [
      "openspec/changes/stabilize-subagent-orchestration/proposal.md",
      "openspec/changes/stabilize-subagent-orchestration/design.md",
      "openspec/changes/stabilize-subagent-orchestration/specs/workflow/spec.md",
      "openspec/changes/stabilize-subagent-orchestration/tasks.md"
    ]
  },
  "delegationPlan": {
    "schemaVersion": 2,
    "requiredRoles": [
      "orchestrator",
      "agent-verifier"
    ],
    "roles": [
      {
        "role": "orchestrator",
        "taskIds": [
          "1.1",
          "2.1",
          "2.2",
          "2.3",
          "2.4",
          "3.1",
          "3.2",
          "4.1",
          "4.2",
          "4.3",
          "5.1",
          "5.2"
        ],
        "allowedRoots": [
          "AGENTS.md",
          "README.md",
          ".agent/**",
          ".codex/config.toml",
          ".codex/agents/**",
          "harness-docs/**",
          "scripts/harness-validation.mjs",
          "scripts/harness-validation.test.mjs",
          "openspec/changes/stabilize-subagent-orchestration/tasks.md",
          "openspec/changes/stabilize-subagent-orchestration/apply-progress.md"
        ],
        "skills": [
          ".agent/skills/spec-driven-development/SKILL.md",
          ".agent/skills/implementation-progress/SKILL.md"
        ],
        "skillResolution": "paths-injected",
        "executionMode": "inline",
        "plannedMode": "inline",
        "budgetClass": "implementation",
        "budgetMinutes": 20,
        "expectedMilestones": [
          "started",
          "context-loaded",
          "artifact-written",
          "completed"
        ],
        "exclusiveArtifacts": [
          "AGENTS.md",
          "README.md",
          ".agent/README.md",
          ".agent/skill-registry.md",
          ".agent/agents/orchestrator.md",
          ".agent/agents/agent-architect.md",
          ".agent/agents/agent-data.md",
          ".agent/agents/agent-requirements-curator.md",
          ".agent/agents/agent-ui.md",
          ".agent/agents/agent-verifier.md",
          ".agent/contracts/phase-handoff.md",
          ".agent/skills/spec-driven-development/SKILL.md",
          ".agent/skills/implementation-progress/SKILL.md",
          ".agent/runtime-adapters/portable-contract.md",
          ".agent/runtime-adapters/codex.md",
          ".agent/runtime-adapters/generic.md",
          ".codex/config.toml",
          ".codex/agents/agent-architect.toml",
          ".codex/agents/agent-data.toml",
          ".codex/agents/agent-requirements-curator.toml",
          ".codex/agents/agent-ui.toml",
          ".codex/agents/agent-verifier.toml",
          "harness-docs/README.md",
          "harness-docs/developer-harness-guide.md",
          "harness-docs/human-operator-guide.md",
          "harness-docs/harness-audit-report.md",
          "scripts/harness-validation.mjs",
          "scripts/harness-validation.test.mjs"
        ],
        "fallbackReason": "",
        "recoveryEvidence": ""
      },
      {
        "role": "agent-verifier",
        "taskIds": [
          "6.1"
        ],
        "allowedRoots": [
          "openspec/changes/stabilize-subagent-orchestration/verify-report.md",
          "openspec/changes/stabilize-subagent-orchestration/tasks.md",
          "openspec/changes/stabilize-subagent-orchestration/apply-progress.md"
        ],
        "skills": [
          ".agent/skills/verification-harness/SKILL.md",
          ".agent/skills/implementation-progress/SKILL.md"
        ],
        "skillResolution": "paths-injected",
        "executionMode": "subagent",
        "plannedMode": "subagent",
        "budgetClass": "verification",
        "budgetMinutes": 15,
        "expectedMilestones": [
          "started",
          "context-loaded",
          "artifact-written",
          "completed"
        ],
        "exclusiveArtifacts": [
          "openspec/changes/stabilize-subagent-orchestration/verify-report.md"
        ],
        "fallbackReason": "",
        "recoveryEvidence": ""
      }
    ]
  },
  "skillsLoaded": [
    ".agent/skills/spec-driven-development/SKILL.md",
    ".agent/skills/implementation-progress/SKILL.md",
    ".agent/skills/verification-harness/SKILL.md"
  ]
}
```

## Decisions and Deviations

- The approved proportional plan keeps governance, adapter, validator, and guide edits inline under the orchestrator because they form one schema migration and share the same critical-path context.
- Final verification remains assigned to an independent `agent-verifier` subagent. Polling intervals will not be interpreted as completion deadlines, and the verifier receives the default 15-minute observation budget.
- No requirement brief applies because this change modifies internal harness governance and runtime adapters without changing product behavior.

## Problems

- 2026-07-23: the first native archive attempt failed safely with
  `archive_spec_update_failed` because four legacy scenario headings were not
  preserved exactly inside `MODIFIED` blocks. OpenSpec reported that no files
  changed. The delta is being reconciled, and the prior PASS is intentionally
  invalidated pending a fresh task 6.1 verification and snapshot.
  Resolution on 2026-07-23: the accepted headings are now preserved as
  compatibility scenarios with schema-v2 semantics; strict OpenSpec and
  scenario-coverage checks passed, task 6.1 was rerun independently, and the
  fresh PASS evidence below supersedes the invalidated report.

## Handoff History

### 2026-07-23 - orchestrator - apply readiness

- Role: orchestrator.
- Status: success.
- Summary: Recovered native OpenSpec apply state, reread every approved planning artifact, recorded the human approval checkpoint, and created the proportional delegation plan using schema v2.
- Artifacts: `openspec/changes/stabilize-subagent-orchestration/apply-progress.md`; `openspec/changes/stabilize-subagent-orchestration/tasks.md`; `scripts/harness-validation.mjs`.
- Files changed: `openspec/changes/stabilize-subagent-orchestration/apply-progress.md`; `openspec/changes/stabilize-subagent-orchestration/tasks.md`; `scripts/harness-validation.mjs`.
- Completed tasks: 1.1.
- Verification: `openspec status --change stabilize-subagent-orchestration --json` exited 0; `openspec instructions apply --change stabilize-subagent-orchestration --json` exited 0; proposal, delta spec, design, and tasks were reread with no blocking question.
- Risks: Full validator fixtures and repository validation remain pending under tasks 4.2 and 4.3.
- Next phase: orchestrator updates portable governance, runtime adapters, validator fixtures, and operator guidance.
- Allowed editable roots: `AGENTS.md`; `README.md`; `.agent/**`; `.codex/config.toml`; `.codex/agents/**`; `harness-docs/**`; validator files; active change tasks and progress.
- Skills: `.agent/skills/spec-driven-development/SKILL.md`; `.agent/skills/implementation-progress/SKILL.md`.
- Skill resolution: paths-injected.
- Execution mode: inline.
- Planned mode: inline.
- Lifecycle milestones: started, context-loaded, artifact-written, completed.
- Budget class: implementation.
- Budget outcome: completed within the planned 20-minute orchestration budget for this readiness slice.
- Exclusive artifacts: apply-progress plan, tasks reconciliation, and schema-v2 validator entry.
- Fallback reason: not applicable.
- Recovery evidence: not applicable.

### 2026-07-23 - agent-verifier - archive compatibility re-verification

- Role: agent-verifier.
- Status: success.
- Summary: Independently re-verified the full harness after the archive-compatibility delta remediation. The accepted scenario headings required by the modified workflow requirements are preserved, the compatibility bodies reject obsolete `inline-fallback` semantics while retaining planned `inline` and evidenced `runtime-fallback`, and all final gates passed without implementation or planning repair.
- Artifacts: `openspec/changes/stabilize-subagent-orchestration/verify-report.md`; `openspec/changes/stabilize-subagent-orchestration/tasks.md`; `openspec/changes/stabilize-subagent-orchestration/apply-progress.md`.
- Files changed: `openspec/changes/stabilize-subagent-orchestration/verify-report.md`; `openspec/changes/stabilize-subagent-orchestration/tasks.md`; `openspec/changes/stabilize-subagent-orchestration/apply-progress.md`.
- Completed tasks: 6.1.
- Verification: `openspec status --change stabilize-subagent-orchestration --json` exited 0 and reported complete planning artifacts; accepted/delta scenario-coverage comparison exited 0 with every accepted heading preserved for modified requirements; `openspec validate stabilize-subagent-orchestration --strict` exited 0; `git diff --check` exited 0 with line-ending notices only; `pnpm verify` exited 0 in 104954 ms (OpenSpec 6/6, harness 26/26, Vitest 4 files and 19 tests, typecheck, lint, and production build all passed); supplemental exact gate timings were `pnpm validate:specs` exit 0 in 4768 ms, `pnpm test:unit:run` exit 0 in 4806 ms, `pnpm typecheck` exit 0 in 18324 ms, `pnpm lint` exit 0 in 28951 ms, and `pnpm build` exit 0 in 34548 ms; final native `openspec status --change stabilize-subagent-orchestration --json` exited 0 in 1610 ms; the first reconciled `node scripts/validate-harness.mjs --archive-ready stabilize-subagent-orchestration` exited 0 in 512 ms.
- Risks: The remediated compatibility headings have not yet been exercised by a second native archive attempt because archive remains the root orchestrator's next phase. A Codex IDE thread opened before the custom-agent TOMLs existed may still need a new chat or extension reload for named-agent discovery. Structured validation proves internal evidence coherence, not actual provider activity.
- Next phase: root orchestrator may retry native archive after confirming the final no-write strict readiness result; no requirement brief update applies.
- Allowed editable roots: `openspec/changes/stabilize-subagent-orchestration/verify-report.md`; `openspec/changes/stabilize-subagent-orchestration/tasks.md`; `openspec/changes/stabilize-subagent-orchestration/apply-progress.md`.
- Skills: `.agent/skills/verification-harness/SKILL.md`; `.agent/skills/implementation-progress/SKILL.md`.
- Skill resolution: paths-injected.
- Execution mode: subagent.
- Planned mode: subagent.
- Lifecycle milestones: started, context-loaded, artifact-written, completed.
- Budget class: verification.
- Budget outcome: completed successfully within the assigned 15-minute minimum observation window; no recovery was required.
- Exclusive artifacts: `openspec/changes/stabilize-subagent-orchestration/verify-report.md`.
- Fallback reason: not applicable.
- Recovery evidence: not applicable.

### 2026-07-23 - orchestrator - archive compatibility remediation

- Role: orchestrator.
- Status: success.
- Summary: Diagnosed the fail-closed native archive error, compared accepted and delta scenario headings, preserved the four required compatibility names with schema-v2 semantics, and invalidated final verification for a fresh independent pass.
- Artifacts: `openspec/changes/stabilize-subagent-orchestration/specs/workflow/spec.md`; `openspec/changes/stabilize-subagent-orchestration/tasks.md`; `openspec/changes/stabilize-subagent-orchestration/apply-progress.md`.
- Files changed: the three artifacts above.
- Completed tasks: none; task 6.1 was reopened because a covered delta artifact changed.
- Verification: first `openspec archive stabilize-subagent-orchestration --yes --json` exited 1 with `archive_spec_update_failed` and explicitly reported no files changed; accepted/delta heading comparison identified exactly four missing scenario names.
- Risks: The stale PASS report remains non-authoritative until the independent verifier reruns `pnpm verify`, regenerates the snapshot, and passes strict archive readiness.
- Next phase: `agent-verifier` reruns task 6.1 without repairing implementation.
- Allowed editable roots: active change delta spec, tasks, and progress.
- Skills: `.agent/skills/spec-driven-development/SKILL.md`; `.agent/skills/implementation-progress/SKILL.md`.
- Skill resolution: paths-injected.
- Execution mode: inline.
- Planned mode: inline.
- Lifecycle milestones: started, context-loaded, artifact-written, completed.
- Budget class: planning.
- Budget outcome: completed within the 10-minute planning observation class; no recovery was required.
- Exclusive artifacts: active workflow delta spec compatibility remediation.
- Fallback reason: not applicable.
- Recovery evidence: not applicable.

### 2026-07-23 - agent-verifier - final conformance and gates

- Role: agent-verifier.
- Status: success.
- Summary: Independently reviewed the implemented harness against the proposal, workflow delta, design, tasks, approval checkpoint, schema-v2 delegation plan, bootstrap split, one-writer ownership, runtime adapters, validator fixtures, documentation, and terminology. All conformance checks and final gates passed; no implementation repair was performed.
- Artifacts: `openspec/changes/stabilize-subagent-orchestration/verify-report.md`; `openspec/changes/stabilize-subagent-orchestration/tasks.md`; `openspec/changes/stabilize-subagent-orchestration/apply-progress.md`.
- Files changed: `openspec/changes/stabilize-subagent-orchestration/verify-report.md`; `openspec/changes/stabilize-subagent-orchestration/tasks.md`; `openspec/changes/stabilize-subagent-orchestration/apply-progress.md`.
- Completed tasks: 6.1.
- Verification: `openspec status --change stabilize-subagent-orchestration --json` exited 0 and reported complete planning artifacts; `git diff --check` exited 0 with line-ending notices only; `pnpm verify` exited 0 in 323024 ms (OpenSpec 6/6, harness 26/26, Vitest 4 files and 19 tests, typecheck, lint, and production build all passed); supplemental exact gate timings were `pnpm validate:specs` exit 0 in 7032 ms, `pnpm test:unit:run` exit 0 in 3493 ms, `pnpm typecheck` exit 0 in 12386 ms, `pnpm lint` exit 0 in 16531 ms, and `pnpm build` exit 0 in 28628 ms; final native `openspec status --change stabilize-subagent-orchestration --json` exited 0 in 1955 ms; the first `node scripts/validate-harness.mjs --archive-ready stabilize-subagent-orchestration` reconciliation exited 0 in 512 ms.
- Risks: A Codex IDE thread opened before the custom-agent TOML files existed may need a new chat or extension reload to discover the names. The validator proves structured evidence and internal coherence, not actual provider activity or elapsed runtime behavior.
- Next phase: root orchestrator may archive natively after confirming the final no-write strict readiness check; no requirement brief update applies.
- Allowed editable roots: `openspec/changes/stabilize-subagent-orchestration/verify-report.md`; `openspec/changes/stabilize-subagent-orchestration/tasks.md`; `openspec/changes/stabilize-subagent-orchestration/apply-progress.md`.
- Skills: `.agent/skills/verification-harness/SKILL.md`; `.agent/skills/implementation-progress/SKILL.md`.
- Skill resolution: paths-injected.
- Execution mode: subagent.
- Planned mode: subagent.
- Lifecycle milestones: started, context-loaded, artifact-written, completed.
- Budget class: verification.
- Budget outcome: completed successfully within the assigned 15-minute minimum observation window; no recovery was required.
- Exclusive artifacts: `openspec/changes/stabilize-subagent-orchestration/verify-report.md`.
- Fallback reason: not applicable.
- Recovery evidence: not applicable.

### 2026-07-23 - orchestrator - governance and adapter implementation

- Role: orchestrator.
- Status: success.
- Summary: Implemented the root/executor bootstrap split, schema-v2 delegation and handoff semantics, bounded architecture workflow, portable runtime boundary, five native Codex adapters, structured validation/fixtures, and reconciled operator/developer guidance.
- Artifacts: `AGENTS.md`; `.agent/`; `.codex/config.toml`; `.codex/agents/`; `README.md`; `harness-docs/`; `scripts/harness-validation.mjs`; `scripts/harness-validation.test.mjs`; active change tasks/progress.
- Files changed: every repository-relative path listed in the Current Snapshot `filesChanged` array.
- Completed tasks: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 4.1, 4.2, 4.3, 5.1, 5.2.
- Verification: `node --check scripts/harness-validation.mjs` and the test file passed; `node --test scripts/harness-validation.test.mjs` passed 26/26; runtime-adapter validation passed; `codex --strict-config --version` parsed project configuration with Codex CLI 0.144.4; `openspec validate stabilize-subagent-orchestration --strict` passed; `pnpm validate:harness` passed; mutable guidance contains no `inline-fallback`; `git diff --check` passed with line-ending notices only.
- Risks: A Codex IDE thread opened before the new custom-agent TOML files may require a new chat or extension reload to discover their names. This does not invalidate the portable handoff. Final independent verification remains pending.
- Next phase: `agent-verifier` performs task 6.1 without repairing implementation.
- Allowed editable roots: `AGENTS.md`; `README.md`; `.agent/**`; `.codex/config.toml`; `.codex/agents/**`; `harness-docs/**`; validator files; active change tasks and progress.
- Skills: `.agent/skills/spec-driven-development/SKILL.md`; `.agent/skills/implementation-progress/SKILL.md`.
- Skill resolution: paths-injected.
- Execution mode: inline.
- Planned mode: inline.
- Lifecycle milestones: started, context-loaded, artifact-written, completed.
- Budget class: implementation.
- Budget outcome: completed under the planned implementation class; observation-budget recovery did not apply to this inline critical-path migration.
- Exclusive artifacts: root/executor governance, specialized role profiles, handoff/progress contracts, runtime adapter documentation, Codex agent configuration, validator/test files, and harness guides listed in the delegation plan.
- Fallback reason: not applicable.
- Recovery evidence: not applicable.

import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  LOCAL_INTEGRATION_MARKER,
  createEvidenceSnapshot,
  createPlanningDigest,
  listActiveChanges,
  validateChangeLifecycle,
  validateDeltaCompatibility,
  validateLocalSkillIntegration,
  validateRuntimeAdapters,
  validateVerificationScripts,
} from "./harness-validation.mjs";
import { FINAL_GATES } from "./run-verification.mjs";

async function write(root, relativePath, content) {
  const absolute = path.join(root, ...relativePath.split("/"));
  await mkdir(path.dirname(absolute), { recursive: true });
  await writeFile(absolute, content, "utf8");
}

function ownershipRole(overrides = {}) {
  return {
    role: "orchestrator",
    taskIds: ["1.1"],
    allowedRoots: ["src/**"],
    skills: [".agent/skills/spec-driven-development/SKILL.md"],
    skillResolution: "paths-injected",
    plannedMode: "inline",
    exclusiveArtifacts: ["src/example.js"],
    ...overrides,
  };
}

function inlineRecord(overrides = {}) {
  return {
    role: "orchestrator",
    taskIds: ["1.1"],
    status: "success",
    summary: "Implemented the bounded fixture change.",
    executionMode: "inline",
    allowedRoots: ["src/**"],
    skills: [".agent/skills/spec-driven-development/SKILL.md"],
    skillResolution: "paths-injected",
    filesChanged: ["src/example.js"],
    verification: [{ command: "node --check src/example.js", exitCode: 0, summary: "Syntax passed." }],
    risks: [],
    exclusiveArtifacts: ["src/example.js"],
    ...overrides,
  };
}

function verificationRun(overrides = {}) {
  return {
    schemaVersion: 1,
    kind: "HARNESS_VERIFY_RESULT_V1",
    status: "PASS",
    durationMs: 25,
    gates: FINAL_GATES.map((gate) => ({
      id: gate.id,
      command: `pnpm ${gate.args[0]}`,
      status: "passed",
      exitCode: 0,
      durationMs: 5,
      summary: `${gate.id} passed.`,
    })),
    ...overrides,
  };
}

function progressMarkdown(snapshot) {
  return `# Apply Progress

## Current Snapshot

\`\`\`json
${JSON.stringify(snapshot, null, 2)}
\`\`\`

## Decisions and Deviations

None.

## Problems

None.
`;
}

async function createProgress(root, change, overrides = {}) {
  const planning = await createPlanningDigest(root, change);
  const snapshot = {
    schemaVersion: 3,
    status: "ready-for-archive",
    assuranceProfile: "standard-change",
    completedTaskIds: ["1.1"],
    remainingTaskIds: [],
    filesChanged: ["src/example.js"],
    skillsLoaded: [".agent/skills/spec-driven-development/SKILL.md"],
    approvalCheckpoint: {
      schemaVersion: 2,
      status: "approved",
      assuranceProfile: "standard-change",
      approvedBy: "human-operator",
      approvedAt: "2026-07-23",
      approvalSource: "chat",
      packetSummary: "The operator approved the exact planning artifact set.",
      artifactsReviewed: planning.paths,
      planningDigest: planning.digest,
    },
    ownershipPlan: {
      schemaVersion: 3,
      assuranceProfile: "standard-change",
      requiredRoles: ["orchestrator"],
      roles: [ownershipRole()],
    },
    executionRecords: [inlineRecord()],
    documentationReconciliation: {
      mode: "not-applicable",
      result: "not-applicable",
      rationale: "The fixture has no linked requirement brief.",
    },
    ...overrides,
  };
  await write(root, `openspec/changes/${change}/apply-progress.md`, progressMarkdown(snapshot));
  return snapshot;
}

async function createFixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), "harness-validation-"));
  const change = "demo-change";
  await write(root, `openspec/changes/${change}/proposal.md`, "# Proposal\n\nA bounded internal change.\n");
  await write(root, `openspec/changes/${change}/design.md`, "# Design\n\nKeep the fixture deterministic.\n");
  await write(
    root,
    `openspec/changes/${change}/specs/demo/spec.md`,
    "## ADDED Requirements\n\n### Requirement: Demo\n\n#### Scenario: Example\n\n- **WHEN** it runs\n- **THEN** it passes\n",
  );
  await write(root, `openspec/changes/${change}/tasks.md`, "- [x] 1.1 [orchestrator] Implement example.\n");
  await write(root, "src/example.js", "export const example = true;\n");
  const progress = await createProgress(root, change);
  const snapshot = await createEvidenceSnapshot(root, change, progress);
  await write(
    root,
    `openspec/changes/${change}/verify-report.md`,
    `# Verification Report

## Verdict

PASS

## Verification Run

\`\`\`json
${JSON.stringify(verificationRun(), null, 2)}
\`\`\`

## Evidence Snapshot

\`\`\`json
${JSON.stringify(snapshot, null, 2)}
\`\`\`
`,
  );
  return { root, change };
}

async function withFixture(callback) {
  const fixture = await createFixture();
  try {
    await callback(fixture);
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
}

test("accepts a coherent schema-v3 lifecycle and fresh archive evidence", async () => {
  await withFixture(async ({ root, change }) => {
    assert.deepEqual(await validateChangeLifecycle(root, change), []);
    assert.deepEqual(await validateChangeLifecycle(root, change, { archiveReady: true }), []);
  });
});

test("rejects pending tasks only at archive readiness", async () => {
  await withFixture(async ({ root, change }) => {
    await write(
      root,
      `openspec/changes/${change}/tasks.md`,
      "- [x] 1.1 [orchestrator] Implement example.\n- [ ] 1.2 [orchestrator] Verify example.\n",
    );
    await createProgress(root, change, {
      status: "ready-for-verification",
      remainingTaskIds: ["1.2"],
      ownershipPlan: {
        schemaVersion: 3,
        assuranceProfile: "standard-change",
        requiredRoles: ["orchestrator"],
        roles: [ownershipRole({ taskIds: ["1.1", "1.2"] })],
      },
    });
    assert.deepEqual(await validateChangeLifecycle(root, change), []);
    const errors = await validateChangeLifecycle(root, change, { archiveReady: true });
    assert.ok(errors.some((error) => error.includes("pending task IDs")), errors.join("\n"));
  });
});

test("rejects missing progress once implementation starts", async () => {
  await withFixture(async ({ root, change }) => {
    await rm(path.join(root, "openspec", "changes", change, "apply-progress.md"));
    const errors = await validateChangeLifecycle(root, change);
    assert.ok(errors.some((error) => error.includes("apply-progress.md is missing")), errors.join("\n"));
  });
});

test("planning digest is stable across task checkbox changes", async () => {
  await withFixture(async ({ root, change }) => {
    const before = await createPlanningDigest(root, change);
    await write(root, `openspec/changes/${change}/tasks.md`, "- [ ] 1.1 [orchestrator] Implement example.\n");
    const after = await createPlanningDigest(root, change);
    assert.equal(after.digest, before.digest);
    assert.deepEqual(after.paths, before.paths);
  });
});

test("planning digest rejects unsafe change IDs", async () => {
  await withFixture(async ({ root }) => {
    await assert.rejects(() => createPlanningDigest(root, "../outside"), /Unsafe change ID/);
  });
});

test("rejects a stale approval digest after planning content changes", async () => {
  await withFixture(async ({ root, change }) => {
    await write(root, `openspec/changes/${change}/design.md`, "# Design\n\nChanged after approval.\n");
    const errors = await validateChangeLifecycle(root, change);
    assert.ok(errors.some((error) => error.includes("planning digest is stale")), errors.join("\n"));
  });
});

test("rejects an approval path set that does not match current planning inputs", async () => {
  await withFixture(async ({ root, change }) => {
    const planning = await createPlanningDigest(root, change);
    await createProgress(root, change, {
      approvalCheckpoint: {
        schemaVersion: 2,
        status: "approved",
        assuranceProfile: "standard-change",
        approvedBy: "human-operator",
        approvedAt: "2026-07-23",
        approvalSource: "chat",
        packetSummary: "Incomplete path set.",
        artifactsReviewed: planning.paths.slice(1),
        planningDigest: planning.digest,
      },
    });
    const errors = await validateChangeLifecycle(root, change);
    assert.ok(errors.some((error) => error.includes("does not match the current planning path set")), errors.join("\n"));
  });
});

test("rejects owner-tagged work without an ownership plan", async () => {
  await withFixture(async ({ root, change }) => {
    await createProgress(root, change, { ownershipPlan: undefined });
    const errors = await validateChangeLifecycle(root, change);
    assert.ok(errors.some((error) => error.includes("ownershipPlan evidence")), errors.join("\n"));
  });
});

test("accepts compact inline records without subagent lifecycle fields", async () => {
  await withFixture(async ({ root, change }) => {
    const errors = await validateChangeLifecycle(root, change);
    assert.deepEqual(errors, []);
  });
});

test("rejects no-change inside an active implementation lifecycle", async () => {
  await withFixture(async ({ root, change }) => {
    await createProgress(root, change, { assuranceProfile: "no-change" });
    const errors = await validateChangeLifecycle(root, change);
    assert.ok(errors.some((error) => error.includes("must not use an active implementation lifecycle")), errors.join("\n"));
  });
});

test("requires verifier ownership for high-risk change evidence", async () => {
  await withFixture(async ({ root, change }) => {
    await createProgress(root, change, { assuranceProfile: "high-risk" });
    const errors = await validateChangeLifecycle(root, change);
    assert.ok(errors.some((error) => error.includes("high-risk ownershipPlan requires agent-verifier")), errors.join("\n"));
  });
});

test("rejects subagent-only budget fields on inline records", async () => {
  await withFixture(async ({ root, change }) => {
    await createProgress(root, change, {
      executionRecords: [inlineRecord({ budget: { class: "implementation", minutes: 20, outcome: "done" } })],
    });
    const errors = await validateChangeLifecycle(root, change);
    assert.ok(errors.some((error) => error.includes("inline mode must omit subagent-only field budget")), errors.join("\n"));
  });
});

test("rejects obsolete inline-fallback skill resolution and unsafe roots", async () => {
  await withFixture(async ({ root, change }) => {
    await createProgress(root, change, {
      ownershipPlan: {
        schemaVersion: 3,
        assuranceProfile: "standard-change",
        requiredRoles: ["orchestrator"],
        roles: [ownershipRole({ skillResolution: "inline-fallback", allowedRoots: ["../src"] })],
      },
      executionRecords: [inlineRecord({ skillResolution: "inline-fallback", allowedRoots: ["../src"] })],
    });
    const errors = await validateChangeLifecycle(root, change);
    assert.ok(errors.some((error) => error.includes("unsupported skillResolution inline-fallback")), errors.join("\n"));
    assert.ok(errors.some((error) => error.includes("unsafe owned path ../src")), errors.join("\n"));
  });
});

test("requires lifecycle milestones and budget for subagent records", async () => {
  await withFixture(async ({ root, change }) => {
    await createProgress(root, change, {
      ownershipPlan: {
        schemaVersion: 3,
        assuranceProfile: "standard-change",
        requiredRoles: ["orchestrator"],
        roles: [ownershipRole({ plannedMode: "subagent" })],
      },
      executionRecords: [inlineRecord({ executionMode: "subagent" })],
    });
    const errors = await validateChangeLifecycle(root, change);
    assert.ok(errors.some((error) => error.includes("field milestones")), errors.join("\n"));
    assert.ok(errors.some((error) => error.includes("requires a budget object")), errors.join("\n"));
  });
});

test("accepts coherent subagent and runtime-fallback records", async () => {
  await withFixture(async ({ root, change }) => {
    const role = ownershipRole({ plannedMode: "subagent" });
    const base = inlineRecord({
      executionMode: "subagent",
      milestones: ["started", "context-loaded", "artifact-written", "completed"],
      budget: { class: "implementation", minutes: 20, outcome: "completed within budget" },
    });
    await createProgress(root, change, {
      ownershipPlan: {
        schemaVersion: 3,
        assuranceProfile: "standard-change",
        requiredRoles: ["orchestrator"],
        roles: [role],
      },
      executionRecords: [base],
    });
    assert.deepEqual(await validateChangeLifecycle(root, change), []);

    await createProgress(root, change, {
      ownershipPlan: {
        schemaVersion: 3,
        assuranceProfile: "standard-change",
        requiredRoles: ["orchestrator"],
        roles: [role],
      },
      executionRecords: [
        {
          ...base,
          executionMode: "runtime-fallback",
          plannedMode: "subagent",
          fallbackReason: "The bounded executor stopped with a terminal tool failure.",
          recoveryEvidence: "One retry failed; the prior writer was stopped before inline recovery.",
        },
      ],
    });
    assert.deepEqual(await validateChangeLifecycle(root, change), []);
  });
});

test("rejects runtime fallback without concrete recovery evidence", async () => {
  await withFixture(async ({ root, change }) => {
    await createProgress(root, change, {
      ownershipPlan: {
        schemaVersion: 3,
        assuranceProfile: "standard-change",
        requiredRoles: ["orchestrator"],
        roles: [ownershipRole({ plannedMode: "subagent" })],
      },
      executionRecords: [
        inlineRecord({
          executionMode: "runtime-fallback",
          plannedMode: "subagent",
          milestones: ["started", "blocked"],
          budget: { class: "implementation", minutes: 20, outcome: "exhausted" },
        }),
      ],
    });
    const errors = await validateChangeLifecycle(root, change);
    assert.ok(errors.some((error) => error.includes("requires fallbackReason")), errors.join("\n"));
    assert.ok(errors.some((error) => error.includes("requires recoveryEvidence")), errors.join("\n"));
  });
});

test("rejects duplicate exclusive artifact writers", async () => {
  await withFixture(async ({ root, change }) => {
    await createProgress(root, change, {
      ownershipPlan: {
        schemaVersion: 3,
        assuranceProfile: "standard-change",
        requiredRoles: ["orchestrator"],
        roles: [
          ownershipRole(),
          ownershipRole({ role: "agent-ui", taskIds: ["9.9"], exclusiveArtifacts: ["src/example.js"] }),
        ],
      },
    });
    const errors = await validateChangeLifecycle(root, change);
    assert.ok(errors.some((error) => error.includes("assigned to both orchestrator and agent-ui")), errors.join("\n"));
  });
});

test("rejects completed owner-tagged tasks without a successful execution record", async () => {
  await withFixture(async ({ root, change }) => {
    await createProgress(root, change, { executionRecords: [] });
    const errors = await validateChangeLifecycle(root, change);
    assert.ok(errors.some((error) => error.includes("lacks executionRecords coverage")), errors.join("\n"));
  });
});

test("rejects FAIL, malformed gate evidence, and stale snapshots at archive readiness", async () => {
  await withFixture(async ({ root, change }) => {
    const reportPath = path.join(root, "openspec", "changes", change, "verify-report.md");
    const report = await readFile(reportPath, "utf8");
    await writeFile(
      reportPath,
      report
        .replace("\nPASS\n", "\nFAIL\n")
        .replace('"command": "pnpm build"', '"command": "pnpm lint"'),
      "utf8",
    );
    await write(root, "src/example.js", "export const example = false;\n");
    const errors = await validateChangeLifecycle(root, change, { archiveReady: true });
    assert.ok(errors.some((error) => error.includes("verdict must be PASS")), errors.join("\n"));
    assert.ok(errors.some((error) => error.includes("each final gate exactly once")), errors.join("\n"));
    assert.ok(errors.some((error) => error.includes("Evidence Snapshot is stale")), errors.join("\n"));
  });
});

test("accepts compatible MODIFIED requirements and rejects identity drift", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "harness-delta-"));
  const change = "delta-change";
  try {
    const accepted = `# Demo

### Requirement: Stable identity

#### Scenario: First behavior

- **WHEN** something happens
- **THEN** it works

#### Scenario: Second behavior

- **WHEN** something else happens
- **THEN** it also works
`;
    const compatible = `## MODIFIED Requirements

### Requirement: Stable identity

#### Scenario: First behavior

- **WHEN** something happens
- **THEN** it works faster

#### Scenario: Second behavior

- **WHEN** something else happens
- **THEN** it also works
`;
    await write(root, "openspec/specs/demo/spec.md", accepted);
    await write(root, `openspec/changes/${change}/specs/demo/spec.md`, compatible);
    assert.deepEqual(await validateDeltaCompatibility(root, change), []);
    await write(
      root,
      `openspec/changes/${change}/specs/demo/spec.md`,
      compatible.replace("#### Scenario: Second behavior", "#### Scenario: Renamed behavior"),
    );
    const errors = await validateDeltaCompatibility(root, change);
    assert.ok(errors.some((error) => error.includes('missing accepted scenario "Second behavior"')), errors.join("\n"));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("accepts mechanically supported unchanged-scope documentation reconciliation", async () => {
  await withFixture(async ({ root, change }) => {
    await write(root, "docs/requirements/demo/brief.md", "# REQ-DEMO\n");
    await write(
      root,
      `openspec/changes/${change}/proposal.md`,
      "# Proposal\n\nRequirement: docs/requirements/demo/brief.md\n",
    );
    const impact = {
      requirementBrief: "docs/requirements/demo/brief.md",
      maintainedPaths: ["docs/project-context.md"],
      plannedImpact: "none",
    };
    const planning = await createPlanningDigest(root, change);
    await createProgress(root, change, {
      documentationImpact: impact,
      documentationReconciliation: {
        mode: "unchanged-scope",
        result: "no-change",
        planningDigest: planning.digest,
        comparedPaths: impact.maintainedPaths,
      },
    });
    assert.deepEqual(await validateChangeLifecycle(root, change), []);

    await createProgress(root, change, {
      filesChanged: ["src/example.js", "docs/project-context.md"],
      documentationImpact: impact,
      documentationReconciliation: {
        mode: "unchanged-scope",
        result: "no-change",
        planningDigest: planning.digest,
        comparedPaths: impact.maintainedPaths,
      },
    });
    const errors = await validateChangeLifecycle(root, change);
    assert.ok(errors.some((error) => error.includes("conflicts with maintained file changes")), errors.join("\n"));
  });
});

test("requires successful curator evidence for material linked documentation impact", async () => {
  await withFixture(async ({ root, change }) => {
    await write(root, "docs/requirements/demo/brief.md", "# REQ-DEMO\n");
    await write(
      root,
      `openspec/changes/${change}/proposal.md`,
      "# Proposal\n\nRequirement: docs/requirements/demo/brief.md\n",
    );
    await createProgress(root, change, {
      documentationImpact: {
        requirementBrief: "docs/requirements/demo/brief.md",
        maintainedPaths: ["docs/project-context.md"],
        plannedImpact: "material",
      },
      documentationReconciliation: { mode: "curator", result: "updated" },
    });
    const errors = await validateChangeLifecycle(root, change);
    assert.ok(errors.some((error) => error.includes("lacks a successful executionRecords entry")), errors.join("\n"));
  });
});

test("keeps archived schema-v1/v2 evidence outside active schema-v3 migration", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "harness-archive-"));
  try {
    await write(
      root,
      "openspec/changes/archive/2026-01-01-legacy/apply-progress.md",
      '## Current Snapshot\n\n```json\n{"schemaVersion":2}\n```\n',
    );
    assert.deepEqual(await listActiveChanges(root), []);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

const runtimeAgentDefinitions = [
  ["agent-architect", "medium"],
  ["agent-data", "high"],
  ["agent-requirements-curator", "medium"],
  ["agent-ui", "high"],
  ["agent-verifier", "high"],
];

async function createRuntimeFixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), "harness-runtime-"));
  await write(
    root,
    "AGENTS.md",
    [
      "HARNESS_EXECUTOR_V1",
      "non-root executor handoff",
      ".agent/contracts/phase-handoff.md",
      "assurance profile",
      ".agent/skills/spec-driven-development/SKILL.md",
      ".agent/skill-registry.md",
      ".agent/agents/orchestrator.md",
    ].join("\n"),
  );
  await write(root, ".codex/config.toml", "[agents]\nenabled = true\nmax_concurrent_threads_per_session = 4\n");
  for (const [name, reasoning] of runtimeAgentDefinitions) {
    const rolePath = `.agent/agents/${name}.md`;
    await write(root, rolePath, `HARNESS_EXECUTOR_V1\nUse .agent/contracts/phase-handoff.md.\n`);
    await write(
      root,
      `.codex/agents/${name}.toml`,
      `name = "${name}"
description = "Bounded ${name}."
model_reasoning_effort = "${reasoning}"
sandbox_mode = "workspace-write"
developer_instructions = """
HARNESS_EXECUTOR_V1
Read .agent/contracts/phase-handoff.md and ${rolePath}.
"""
`,
    );
  }
  return root;
}

test("accepts coherent root, executor, and Codex adapter definitions", async () => {
  const root = await createRuntimeFixture();
  try {
    assert.deepEqual(await validateRuntimeAdapters(root), []);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("rejects root bootstrap order and missing adapter registration", async () => {
  const root = await createRuntimeFixture();
  try {
    await write(
      root,
      "AGENTS.md",
      "HARNESS_EXECUTOR_V1\nnon-root\nassurance profile\n.agent/agents/orchestrator.md\n.agent/skill-registry.md\n.agent/skills/spec-driven-development/SKILL.md\n.agent/contracts/phase-handoff.md\n",
    );
    await rm(path.join(root, ".codex", "agents", "agent-ui.toml"));
    const errors = await validateRuntimeAdapters(root);
    assert.ok(errors.some((error) => error.includes("root bootstrap must load")), errors.join("\n"));
    assert.ok(errors.some((error) => error.includes("agent-ui.toml") && error.includes("file is missing")), errors.join("\n"));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

function localSkillContent(extra = "") {
  return `<!-- ${LOCAL_INTEGRATION_MARKER} -->
assurance profile planning digest requirement classification openspec status Implementation Approval Packet
openspec instructions apply apply-progress.md executionRecords approvalCheckpoint phase-handoff.md
planning artifacts existingOutputPaths pnpm verify requirements curation no-change OpenSpec artifacts
delta active validate-harness.mjs verify-report.md PASS snapshot openspec archive <change-id> --yes --json
${extra}
`;
}

test("rejects unsafe manual archive movement in local overlays", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "harness-skills-"));
  try {
    for (const name of ["propose", "apply", "update", "explore", "sync"]) {
      await write(root, `.codex/skills/openspec-${name === "sync" ? "sync-specs" : `${name}-change`}/SKILL.md`, localSkillContent());
    }
    await write(root, ".codex/skills/openspec-archive-change/SKILL.md", localSkillContent('mv "<changeRoot>" "archive"\n'));
    const errors = await validateLocalSkillIntegration(root);
    assert.ok(errors.some((error) => error.includes("manual change-directory movement")), errors.join("\n"));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("accepts the single-run verification command contract", () => {
  const manifest = {
    scripts: {
      "test:unit": "vitest",
      "test:unit:run": "vitest run",
      "typecheck:fast": "pnpm typecheck:app:fast && pnpm typecheck:reference:fast",
      typecheck: "pnpm typecheck:app && pnpm typecheck:reference",
      "typecheck:app": "tsc --noEmit --incremental false",
      "typecheck:reference": "tsc --noEmit --incremental false",
      "lint:fast": "eslint . --cache",
      lint: "eslint .",
      build: "next build",
      "validate:specs": "node scripts/validate-harness.mjs",
      "verify:fast": "pnpm test:unit:run && pnpm typecheck:fast && pnpm lint:fast",
      verify: "node scripts/run-verification.mjs",
    },
    devDependencies: { vitest: "^4.1.10" },
  };
  const source = `
export const FINAL_GATES = [
  { id: "specs-harness", command: "pnpm", args: ["validate:specs"] },
  { id: "unit-component", command: "pnpm", args: ["test:unit:run"] },
  { id: "typecheck", command: "pnpm", args: ["typecheck"] },
  { id: "lint", command: "pnpm", args: ["lint"] },
  { id: "build", command: "pnpm", args: ["build"] },
];
// HARNESS_VERIFY_RESULT_V1 durationMs exitCode status
`;
  assert.deepEqual(validateVerificationScripts(manifest, source), []);
});

test("rejects missing and duplicated final gates plus browser binaries", () => {
  const errors = validateVerificationScripts(
    {
      scripts: {
        "test:unit": "vitest",
        "test:unit:run": "vitest run",
        "typecheck:fast": "tsc --noEmit",
        typecheck: "tsc --noEmit",
        "typecheck:app": "tsc --noEmit",
        "typecheck:reference": "tsc --noEmit",
        "lint:fast": "eslint . --cache",
        lint: "eslint . --cache",
        build: "next build",
        "validate:specs": "node scripts/validate-harness.mjs",
        "verify:fast": "pnpm test:unit:run && pnpm typecheck:fast && pnpm lint:fast",
        verify: "pnpm validate:specs && pnpm build",
      },
      devDependencies: { cypress: "latest" },
    },
    'const gates = [{ id: "lint", command: "pnpm", args: ["lint"] }, { id: "lint", command: "pnpm", args: ["lint"] }];',
  );
  assert.ok(errors.some((error) => error.includes("invoke only")), errors.join("\n"));
  assert.ok(errors.some((error) => error.includes("exactly once")), errors.join("\n"));
  assert.ok(errors.some((error) => error.includes("final lint must not use cache")), errors.join("\n"));
  assert.ok(errors.some((error) => error.includes("cypress is outside")), errors.join("\n"));
});

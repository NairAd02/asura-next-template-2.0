import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  LOCAL_INTEGRATION_MARKER,
  createEvidenceSnapshot,
  validateChangeLifecycle,
  validateLocalSkillIntegration,
  validateVerificationScripts,
} from "./harness-validation.mjs";

async function write(root, relativePath, content) {
  const absolute = path.join(root, ...relativePath.split("/"));
  await mkdir(path.dirname(absolute), { recursive: true });
  await writeFile(absolute, content, "utf8");
}

function progress(overrides = {}) {
  const { handoffHistory = "- verifier pending.", ...snapshotOverrides } = overrides;
  const value = {
    schemaVersion: 1,
    status: "ready-for-archive",
    completedTaskIds: ["1.1"],
    remainingTaskIds: [],
    filesChanged: ["src/example.js"],
    skillsLoaded: [".agent/skills/spec-driven-development/SKILL.md"],
    approvalCheckpoint: approvalCheckpoint(),
    ...snapshotOverrides,
  };
  return `# Apply Progress\n\n## Current Snapshot\n\n\`\`\`json\n${JSON.stringify(value, null, 2)}\n\`\`\`\n\n## Decisions and Deviations\n\nNone.\n\n## Problems\n\nNone.\n\n## Handoff History\n\n${handoffHistory}\n`;
}

function approvalCheckpoint(overrides = {}) {
  return {
    schemaVersion: 1,
    status: "approved",
    approvedBy: "human-operator",
    approvedAt: "2026-07-16",
    approvalSource: "chat",
    packetSummary: "Implementation Approval Packet reviewed and approved before edits.",
    artifactsReviewed: ["proposal.md", "design.md", "tasks.md", "specs/demo/spec.md"],
    ...overrides,
  };
}

function delegationPlan(overrides = {}) {
  return {
    schemaVersion: 1,
    requiredRoles: ["agent-data"],
    roles: [
      {
        role: "agent-data",
        taskIds: ["1.1"],
        allowedRoots: ["src/**"],
        skills: [".agent/skills/data-layer/SKILL.md"],
        resolution: "paths-injected",
        fallbackReason: "",
      },
    ],
    ...overrides,
  };
}

async function createFixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), "harness-validation-"));
  const change = "demo-change";
  await write(root, `openspec/changes/${change}/proposal.md`, "Requirement: docs/requirements/demo/brief.md\n");
  await write(root, `openspec/changes/${change}/design.md`, "# Design\n");
  await write(root, `openspec/changes/${change}/specs/demo/spec.md`, "## ADDED Requirements\n");
  await write(root, `openspec/changes/${change}/tasks.md`, "- [x] 1.1 Implement example.\n");
  await write(root, `openspec/changes/${change}/apply-progress.md`, progress());
  await write(root, "docs/requirements/demo/brief.md", "# REQ-DEMO\n");
  await write(root, "docs/requirements/index.md", "- REQ-DEMO\n");
  await write(root, "src/example.js", "export const example = true;\n");
  const parsedProgress = JSON.parse(progress().match(/```json\s*([\s\S]*?)```/)[1]);
  const snapshot = await createEvidenceSnapshot(root, change, parsedProgress);
  await write(root, `openspec/changes/${change}/verify-report.md`, `# Verification Report\n\n## Verdict\n\nPASS\n\n## Evidence Snapshot\n\n\`\`\`json\n${JSON.stringify(snapshot, null, 2)}\n\`\`\`\n`);
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

test("rejects pending tasks", async () => {
  await withFixture(async ({ root, change }) => {
    await write(root, `openspec/changes/${change}/tasks.md`, "- [x] 1.1 Implement example.\n- [ ] 1.2 Verify example.\n");
    await write(root, `openspec/changes/${change}/apply-progress.md`, progress({ status: "ready-for-verification", remainingTaskIds: ["1.2"] }));
    await rm(path.join(root, "openspec", "changes", change, "verify-report.md"));
    assert.deepEqual(await validateChangeLifecycle(root, change), []);
    const errors = await validateChangeLifecycle(root, change, { archiveReady: true });
    assert.ok(errors.some((error) => error.includes("pending task IDs")), errors.join("\n"));
  });
});

test("rejects missing progress after implementation starts", async () => {
  await withFixture(async ({ root, change }) => {
    await rm(path.join(root, "openspec", "changes", change, "apply-progress.md"));
    const errors = await validateChangeLifecycle(root, change);
    assert.ok(errors.some((error) => error.includes("apply-progress.md is missing")), errors.join("\n"));
  });
});

test("rejects missing approval checkpoint after implementation starts", async () => {
  await withFixture(async ({ root, change }) => {
    await write(root, `openspec/changes/${change}/apply-progress.md`, progress({ approvalCheckpoint: undefined }));
    const errors = await validateChangeLifecycle(root, change);
    assert.ok(errors.some((error) => error.includes("approvalCheckpoint")), errors.join("\n"));
  });
});

test("rejects malformed approval checkpoint", async () => {
  await withFixture(async ({ root, change }) => {
    await write(
      root,
      `openspec/changes/${change}/apply-progress.md`,
      progress({
        approvalCheckpoint: approvalCheckpoint({
          status: "pending",
          packetSummary: "",
          artifactsReviewed: ["../proposal.md"],
        }),
      }),
    );
    const errors = await validateChangeLifecycle(root, change);
    assert.ok(errors.some((error) => error.includes("status must be approved")), errors.join("\n"));
    assert.ok(errors.some((error) => error.includes("packetSummary")), errors.join("\n"));
    assert.ok(errors.some((error) => error.includes("unsafe path")), errors.join("\n"));
  });
});

test("rejects FAIL evidence", async () => {
  await withFixture(async ({ root, change }) => {
    const reportPath = path.join(root, "openspec", "changes", change, "verify-report.md");
    const report = await readFile(reportPath, "utf8");
    await writeFile(reportPath, report.replace("\nPASS\n", "\nFAIL\n"), "utf8");
    assert.deepEqual(await validateChangeLifecycle(root, change), []);
    const errors = await validateChangeLifecycle(root, change, { archiveReady: true });
    assert.ok(errors.some((error) => error.includes("verdict must be PASS")), errors.join("\n"));
  });
});

test("rejects stale SHA-256 evidence", async () => {
  await withFixture(async ({ root, change }) => {
    await write(root, "src/example.js", "export const example = false;\n");
    assert.deepEqual(await validateChangeLifecycle(root, change), []);
    const errors = await validateChangeLifecycle(root, change, { archiveReady: true });
    assert.ok(errors.some((error) => error.includes("Evidence Snapshot is stale")), errors.join("\n"));
  });
});

test("accepts owner-tagged task with matching delegation plan and handoff", async () => {
  await withFixture(async ({ root, change }) => {
    await write(root, `openspec/changes/${change}/tasks.md`, "- [x] 1.1 [agent-data] Implement example.\n");
    await write(
      root,
      `openspec/changes/${change}/apply-progress.md`,
      progress({
        delegationPlan: delegationPlan(),
        handoffHistory:
          "### 2026-07-16 - agent-data\n\n- Status: success.\n- Completed tasks: 1.1.\n- Skill resolution: paths-injected.\n",
      }),
    );
    assert.deepEqual(await validateChangeLifecycle(root, change), []);
  });
});

test("rejects owner-tagged task when delegationPlan is missing", async () => {
  await withFixture(async ({ root, change }) => {
    await write(root, `openspec/changes/${change}/tasks.md`, "- [x] 1.1 [agent-data] Implement example.\n");
    const errors = await validateChangeLifecycle(root, change);
    assert.ok(errors.some((error) => error.includes("delegationPlan")), errors.join("\n"));
  });
});

test("rejects duplicate owner tags on one task", async () => {
  await withFixture(async ({ root, change }) => {
    await write(root, `openspec/changes/${change}/tasks.md`, "- [x] 1.1 [agent-data] [agent-ui] Implement example.\n");
    await write(
      root,
      `openspec/changes/${change}/apply-progress.md`,
      progress({
        delegationPlan: delegationPlan(),
        handoffHistory:
          "### 2026-07-16 - agent-data\n\n- Status: success.\n- Completed tasks: 1.1.\n- Skill resolution: paths-injected.\n",
      }),
    );
    const errors = await validateChangeLifecycle(root, change);
    assert.ok(errors.some((error) => error.includes("exactly one owner tag")), errors.join("\n"));
  });
});

test("rejects owner-tagged task not covered by delegationPlan task IDs", async () => {
  await withFixture(async ({ root, change }) => {
    await write(root, `openspec/changes/${change}/tasks.md`, "- [x] 1.1 [agent-data] Implement example.\n");
    await write(
      root,
      `openspec/changes/${change}/apply-progress.md`,
      progress({
        delegationPlan: delegationPlan({
          roles: [
            {
              role: "agent-data",
              taskIds: ["9.9"],
              allowedRoots: ["src/**"],
              skills: [".agent/skills/data-layer/SKILL.md"],
              resolution: "paths-injected",
              fallbackReason: "",
            },
          ],
        }),
        handoffHistory:
          "### 2026-07-16 - agent-data\n\n- Status: success.\n- Completed tasks: 1.1.\n- Skill resolution: paths-injected.\n",
      }),
    );
    const errors = await validateChangeLifecycle(root, change);
    assert.ok(errors.some((error) => error.includes("not covered by delegationPlan")), errors.join("\n"));
  });
});

test("rejects inline-fallback without fallbackReason", async () => {
  await withFixture(async ({ root, change }) => {
    await write(root, `openspec/changes/${change}/tasks.md`, "- [x] 1.1 [agent-data] Implement example.\n");
    await write(
      root,
      `openspec/changes/${change}/apply-progress.md`,
      progress({
        delegationPlan: delegationPlan({
          roles: [
            {
              role: "agent-data",
              taskIds: ["1.1"],
              allowedRoots: ["src/**"],
              skills: [".agent/skills/data-layer/SKILL.md"],
              resolution: "inline-fallback",
              fallbackReason: "",
            },
          ],
        }),
        handoffHistory:
          "### 2026-07-16 - agent-data\n\n- Status: success.\n- Completed tasks: 1.1.\n- Skill resolution: inline-fallback.\n",
      }),
    );
    const errors = await validateChangeLifecycle(root, change);
    assert.ok(errors.some((error) => error.includes("without a fallbackReason")), errors.join("\n"));
  });
});

test("rejects completed owner-tagged role with no matching handoff history", async () => {
  await withFixture(async ({ root, change }) => {
    await write(root, `openspec/changes/${change}/tasks.md`, "- [x] 1.1 [agent-data] Implement example.\n");
    await write(
      root,
      `openspec/changes/${change}/apply-progress.md`,
      progress({
        delegationPlan: delegationPlan(),
        handoffHistory:
          "### 2026-07-16 - agent-ui\n\n- Status: success.\n- Completed tasks: none.\n- Skill resolution: paths-injected.\n",
      }),
    );
    const errors = await validateChangeLifecycle(root, change);
    assert.ok(errors.some((error) => error.includes("lack matching Handoff History")), errors.join("\n"));
  });
});

test("rejects unsafe archive skill integration", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "harness-skills-"));
  try {
    const common = `<!-- ${LOCAL_INTEGRATION_MARKER} -->\nopenspec status requirement classification delta active Implementation Approval Packet\n`;
    await write(root, ".codex/skills/openspec-propose/SKILL.md", common);
    await write(
      root,
      ".codex/skills/openspec-apply-change/SKILL.md",
      `${common}openspec instructions apply apply-progress.md phase-handoff.md approvalCheckpoint\n`,
    );
    await write(root, ".codex/skills/openspec-sync-specs/SKILL.md", common);
    await write(root, ".codex/skills/openspec-archive-change/SKILL.md", `${common}validate-harness.mjs verify-report.md PASS snapshot openspec archive <change-id> --yes --json\nmv \"<changeRoot>\" \"archive\"\n`);
    const errors = await validateLocalSkillIntegration(root);
    assert.ok(errors.some((error) => error.includes("manual change-directory movement")), errors.join("\n"));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("accepts the lightweight verification command contract", () => {
  assert.deepEqual(
    validateVerificationScripts({
      scripts: {
        "test:unit": "vitest",
        "test:unit:run": "vitest run",
        "typecheck:fast": "tsc --noEmit --incremental",
        "lint:fast": "eslint . --cache",
        "verify:fast": "pnpm test:unit:run && pnpm typecheck:fast && pnpm lint:fast",
        verify: "pnpm validate:specs && pnpm test:unit:run && pnpm typecheck && pnpm lint && pnpm build",
      },
      devDependencies: { vitest: "^4.1.10" },
    }),
    [],
  );
});

test("rejects a missing unit gate and browser framework dependency", () => {
  const errors = validateVerificationScripts({
    scripts: {
      "test:unit": "vitest",
      "test:unit:run": "vitest run",
      "typecheck:fast": "tsc --noEmit --incremental",
      "lint:fast": "eslint . --cache",
      "verify:fast": "pnpm test:unit:run && pnpm typecheck:fast && pnpm lint:fast",
      verify: "pnpm validate:specs && pnpm typecheck && pnpm lint && pnpm build",
    },
    devDependencies: { cypress: "latest" },
  });
  assert.ok(errors.some((error) => error.includes("verify must include test:unit:run")), errors.join("\n"));
  assert.ok(errors.some((error) => error.includes("cypress is outside")), errors.join("\n"));
});

test("accepts a coherent fresh fixture", async () => {
  await withFixture(async ({ root, change }) => {
    assert.deepEqual(await validateChangeLifecycle(root, change), []);
    assert.deepEqual(await validateChangeLifecycle(root, change, { archiveReady: true }), []);
  });
});

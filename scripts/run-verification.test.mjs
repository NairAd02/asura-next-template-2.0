import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { FINAL_GATES, buildSpawnInvocation, runVerification } from "./run-verification.mjs";

const quietStream = { write() {} };

function deterministicNow() {
  let value = 0;
  return () => {
    value += 10;
    return value;
  };
}

test("runs every final gate exactly once in order and emits structured PASS evidence", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "verification-runner-"));
  const calls = [];
  try {
    const result = await runVerification({
      cwd: root,
      now: deterministicNow(),
      clock: () => "2026-07-23T00:00:00.000Z",
      stdout: quietStream,
      stderr: quietStream,
      executeGate: async (gate) => {
        calls.push(gate.id);
        return { exitCode: 0, signal: null, summary: `${gate.id} passed` };
      },
    });
    assert.deepEqual(calls, FINAL_GATES.map((gate) => gate.id));
    assert.equal(new Set(calls).size, FINAL_GATES.length);
    assert.equal(result.status, "PASS");
    assert.ok(result.durationMs > 0);
    assert.ok(result.gates.every((gate) => gate.status === "passed" && gate.exitCode === 0));
    const persisted = JSON.parse(
      await readFile(path.join(root, ".cache", "harness", "verification-result.json"), "utf8"),
    );
    assert.deepEqual(persisted, result);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("fails fast and marks later final gates skipped", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "verification-runner-"));
  const calls = [];
  try {
    const result = await runVerification({
      cwd: root,
      now: deterministicNow(),
      stdout: quietStream,
      stderr: quietStream,
      executeGate: async (gate) => {
        calls.push(gate.id);
        return {
          exitCode: gate.id === "unit-component" ? 2 : 0,
          signal: null,
          summary: `${gate.id} result`,
        };
      },
    });
    assert.deepEqual(calls, ["specs-harness", "unit-component"]);
    assert.equal(result.status, "FAIL");
    assert.equal(result.gates[1].status, "failed");
    assert.ok(result.gates.slice(2).every((gate) => gate.status === "skipped" && gate.exitCode === null));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("uses cmd.exe for pnpm scripts on Windows without enabling shell mode", () => {
  assert.deepEqual(
    buildSpawnInvocation(FINAL_GATES[0], {
      platform: "win32",
      env: { ComSpec: "C:\\Windows\\System32\\cmd.exe" },
    }),
    {
      command: "C:\\Windows\\System32\\cmd.exe",
      args: ["/d", "/s", "/c", "pnpm validate:specs"],
    },
  );
  assert.deepEqual(buildSpawnInvocation(FINAL_GATES[0], { platform: "linux", env: {} }), {
    command: "pnpm",
    args: ["validate:specs"],
  });
});

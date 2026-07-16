#!/usr/bin/env node

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import {
  createEvidenceSnapshot,
  parseProgress,
  validateChangeLifecycle,
  validateRepository,
} from "./harness-validation.mjs";
import { readFile } from "node:fs/promises";
import path from "node:path";

const execFileAsync = promisify(execFile);
const root = process.cwd();
const snapshotIndex = process.argv.indexOf("--snapshot");
const archiveReadyIndex = process.argv.indexOf("--archive-ready");

async function openSpecVersion() {
  const executable = process.platform === "win32" ? "cmd.exe" : "openspec";
  const args = process.platform === "win32" ? ["/d", "/s", "/c", "openspec --version"] : ["--version"];
  const { stdout, stderr } = await execFileAsync(executable, args, { cwd: root });
  return `${stdout}${stderr}`.trim();
}

async function main() {
  if (snapshotIndex !== -1) {
    const changeId = process.argv[snapshotIndex + 1];
    if (!changeId || changeId.startsWith("--")) throw new Error("Usage: node scripts/validate-harness.mjs --snapshot <change-id>");
    const progressPath = path.join(root, "openspec", "changes", changeId, "apply-progress.md");
    const progress = parseProgress(await readFile(progressPath, "utf8"));
    const snapshot = await createEvidenceSnapshot(root, changeId, progress);
    process.stdout.write(`${JSON.stringify(snapshot, null, 2)}\n`);
    return;
  }

  if (archiveReadyIndex !== -1) {
    const changeId = process.argv[archiveReadyIndex + 1];
    if (!changeId || changeId.startsWith("--")) throw new Error("Usage: node scripts/validate-harness.mjs --archive-ready <change-id>");
    const version = await openSpecVersion();
    const repositoryErrors = await validateRepository(root, version);
    const lifecycleErrors = await validateChangeLifecycle(root, changeId, { archiveReady: true });
    const errors = [...new Set([...repositoryErrors, ...lifecycleErrors])];
    if (errors.length > 0) {
      process.stderr.write(`Archive readiness failed (${errors.length} invariant${errors.length === 1 ? "" : "s"}):\n`);
      for (const error of errors) process.stderr.write(`- ${error}\n`);
      process.exitCode = 1;
      return;
    }
    process.stdout.write(`Archive readiness passed for ${changeId}.\n`);
    return;
  }

  const version = await openSpecVersion();
  const errors = await validateRepository(root, version);
  if (errors.length > 0) {
    process.stderr.write(`Harness validation failed (${errors.length} invariant${errors.length === 1 ? "" : "s"}):\n`);
    for (const error of errors) process.stderr.write(`- ${error}\n`);
    process.exitCode = 1;
    return;
  }

  process.stdout.write("Harness validation passed: continuous repository invariants and active progress reconciliation are coherent.\n");
}

main().catch((error) => {
  process.stderr.write(`Harness validation could not run: ${error.message}\n`);
  process.exitCode = 1;
});

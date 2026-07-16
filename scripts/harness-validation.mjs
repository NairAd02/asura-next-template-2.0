import { createHash } from "node:crypto";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

export const EXPECTED_OPENSPEC_VERSION = "1.6.0";
export const LOCAL_INTEGRATION_MARKER = "LOCAL_HARNESS_INTEGRATION_V1";

const LOCAL_SKILLS = {
  propose: ".codex/skills/openspec-propose/SKILL.md",
  apply: ".codex/skills/openspec-apply-change/SKILL.md",
  sync: ".codex/skills/openspec-sync-specs/SKILL.md",
  archive: ".codex/skills/openspec-archive-change/SKILL.md",
};

const GUIDANCE_FILES = [
  "AGENTS.md",
  "README.md",
  "docs/developer-harness-guide.md",
  "docs/human-operator-guide.md",
  ".agent/skills/spec-driven-development/SKILL.md",
  ".agent/skills/behavior-testing/SKILL.md",
  ".agent/skills/implementation-progress/SKILL.md",
  ".agent/skills/verification-harness/SKILL.md",
  ".agent/agents/orchestrator.md",
  ".agent/agents/agent-verifier.md",
];

const OWNER_TAG_PATTERN = /\[(orchestrator|agent-[a-z0-9-]+)\]/g;
const VALID_SKILL_RESOLUTIONS = new Set(["paths-injected", "inline-fallback", "none"]);

function normalizeRelativePath(value) {
  return value.replaceAll("\\", "/").replace(/^\.\//, "");
}

function isSafeRelativePath(value) {
  const normalized = normalizeRelativePath(value);
  return (
    normalized.length > 0 &&
    !path.posix.isAbsolute(normalized) &&
    normalized !== ".." &&
    !normalized.startsWith("../") &&
    !normalized.includes("/../")
  );
}

async function pathExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

async function listFiles(directory, root = directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(absolute, root)));
    } else if (entry.isFile()) {
      files.push(normalizeRelativePath(path.relative(root, absolute)));
    }
  }

  return files.sort((left, right) => left.localeCompare(right));
}

function extractSection(markdown, heading) {
  const lines = markdown.split(/\r?\n/);
  const expected = `## ${heading}`.toLowerCase();
  const start = lines.findIndex((line) => line.trim().toLowerCase() === expected);
  if (start === -1) return null;
  const endOffset = lines.slice(start + 1).findIndex((line) => /^##\s+/.test(line.trim()));
  const end = endOffset === -1 ? lines.length : start + 1 + endOffset;
  return lines.slice(start + 1, end).join("\n").trim();
}

export function extractJsonSection(markdown, heading) {
  const section = extractSection(markdown, heading);
  if (section === null) return null;
  const block = section.match(/```json\s*([\s\S]*?)```/i);
  if (!block) throw new Error(`Section \"${heading}\" must contain a fenced json block.`);

  try {
    return JSON.parse(block[1]);
  } catch (error) {
    throw new Error(`Section \"${heading}\" contains invalid JSON: ${error.message}`);
  }
}

export function parseTasks(markdown) {
  const tasks = [];
  const pattern = /^\s*-\s+\[([ xX])\]\s+((?:\d+\.)+\d+)\s+(.+)$/gm;
  for (const match of markdown.matchAll(pattern)) {
    const description = match[3].trim();
    const ownerTags = [...description.matchAll(OWNER_TAG_PATTERN)].map((ownerMatch) => ownerMatch[1]);
    tasks.push({
      id: match[2],
      done: match[1].toLowerCase() === "x",
      description,
      ownerTags,
      ownerTag: ownerTags[0] ?? null,
    });
  }
  return tasks;
}

export function parseProgress(markdown) {
  const snapshot = extractJsonSection(markdown, "Current Snapshot");
  if (!snapshot || typeof snapshot !== "object" || Array.isArray(snapshot)) {
    throw new Error('apply-progress.md requires an object under "## Current Snapshot".');
  }

  const requiredArrays = ["completedTaskIds", "remainingTaskIds", "filesChanged", "skillsLoaded"];
  for (const field of requiredArrays) {
    if (!Array.isArray(snapshot[field]) || snapshot[field].some((item) => typeof item !== "string")) {
      throw new Error(`Current Snapshot field ${field} must be an array of strings.`);
    }
  }
  if (snapshot.schemaVersion !== 1) throw new Error("Current Snapshot schemaVersion must be 1.");
  if (!["in-progress", "blocked", "ready-for-verification", "ready-for-archive"].includes(snapshot.status)) {
    throw new Error("Current Snapshot has an unsupported status.");
  }

  return snapshot;
}

export function parseVerdict(markdown) {
  const section = extractSection(markdown, "Verdict");
  if (section === null) return null;
  return section.split(/\r?\n/, 1)[0].trim().replace(/^`|`$/g, "").toUpperCase();
}

export function validateOpenSpecVersion(output) {
  const actual = String(output).trim().match(/\d+\.\d+\.\d+/)?.[0] ?? String(output).trim();
  return actual === EXPECTED_OPENSPEC_VERSION
    ? []
    : [`OpenSpec version mismatch: expected ${EXPECTED_OPENSPEC_VERSION}, received ${actual || "no version"}.`];
}

export function validateVerificationScripts(manifest) {
  const errors = [];
  const scripts = manifest?.scripts ?? {};
  const requiredFragments = {
    "verify:fast": ["test:unit:run", "typecheck:fast", "lint:fast"],
    verify: ["validate:specs", "test:unit:run", "typecheck", "lint", "build"],
  };

  for (const [scriptName, fragments] of Object.entries(requiredFragments)) {
    const command = scripts[scriptName];
    if (typeof command !== "string") {
      errors.push(`package.json: missing required script ${scriptName}.`);
      continue;
    }
    for (const fragment of fragments) {
      if (!command.includes(fragment)) {
        errors.push(`package.json: script ${scriptName} must include ${fragment}.`);
      }
    }
  }

  for (const scriptName of ["test:unit", "test:unit:run", "typecheck:fast", "lint:fast"]) {
    if (typeof scripts[scriptName] !== "string") errors.push(`package.json: missing required script ${scriptName}.`);
  }

  const dependencies = { ...(manifest?.dependencies ?? {}), ...(manifest?.devDependencies ?? {}) };
  for (const browserFramework of ["@playwright/test", "playwright", "cypress"]) {
    if (browserFramework in dependencies) {
      errors.push(`package.json: ${browserFramework} is outside the lightweight browser-binary-free verification profile.`);
    }
  }

  return errors;
}

async function readRequired(root, relativePath, errors) {
  try {
    return await readFile(path.join(root, relativePath), "utf8");
  } catch (error) {
    errors.push(`${relativePath}: ${error.code === "ENOENT" ? "file is missing" : error.message}.`);
    return null;
  }
}

export async function validateLocalSkillIntegration(root) {
  const errors = [];
  const contents = {};

  for (const [name, relativePath] of Object.entries(LOCAL_SKILLS)) {
    const content = await readRequired(root, relativePath, errors);
    if (content === null) continue;
    contents[name] = content;
    if (!content.includes(LOCAL_INTEGRATION_MARKER)) {
      errors.push(`${relativePath}: missing ${LOCAL_INTEGRATION_MARKER}; review the local overlay after openspec update.`);
    }
  }

  const requirements = {
    propose: ["requirement", "classification", "openspec status", "Implementation Approval Packet"],
    apply: [
      "openspec status",
      "openspec instructions apply",
      "apply-progress.md",
      "phase-handoff.md",
      "Implementation Approval Packet",
      "approvalCheckpoint",
    ],
    sync: ["openspec status", "delta", "active"],
    archive: ["openspec status", "validate-harness.mjs", "verify-report.md", "PASS", "snapshot", "openspec archive"],
  };
  for (const [name, tokens] of Object.entries(requirements)) {
    const content = contents[name]?.toLowerCase();
    if (!content) continue;
    for (const token of tokens) {
      if (!content.includes(token.toLowerCase())) errors.push(`${LOCAL_SKILLS[name]}: missing required integration guidance \"${token}\".`);
    }
  }

  const archive = contents.archive ?? "";
  if (!/openspec\s+archive\s+[^\r\n]+--yes\s+--json/i.test(archive)) {
    errors.push(`${LOCAL_SKILLS.archive}: native archive command must include --yes --json.`);
  }
  const unsafeArchivePatterns = [
    { pattern: /\bmkdir(?:\s+-p)?\b/i, label: "manual archive directory creation" },
    { pattern: /(^|\s)mv\s+[\"'<]/im, label: "manual change-directory movement" },
    { pattern: /proceed\s+if\s+(?:the\s+)?user\s+confirms/i, label: "confirmation override" },
    { pattern: /don['’]?t\s+block\s+archive/i, label: "non-blocking archive warning" },
  ];
  for (const { pattern, label } of unsafeArchivePatterns) {
    if (pattern.test(archive)) errors.push(`${LOCAL_SKILLS.archive}: unsafe ${label} is prohibited.`);
  }

  return errors;
}

export async function validateGuidance(root) {
  const errors = [];
  for (const relativePath of GUIDANCE_FILES) {
    const content = await readRequired(root, relativePath, errors);
    if (content === null) continue;
    if (/openspec\s+instructions\s+(?:verify|archive)\b/i.test(content)) {
      errors.push(`${relativePath}: OpenSpec 1.6.0 has no instructions verify/archive command; use status.`);
    }
    if (/archive[^\n]{0,100}(?:despite|aunque)[^\n]{0,80}(?:fail|failure|fallo)/i.test(content)) {
      errors.push(`${relativePath}: archive guidance must not permit a failure exception.`);
    }
  }
  return errors;
}

export async function calculateSnapshotDigest(root, relativePaths) {
  const digest = createHash("sha256");
  digest.update("HARNESS_EVIDENCE_SNAPSHOT_V1\0");

  for (const rawPath of relativePaths) {
    const relativePath = normalizeRelativePath(rawPath);
    if (!isSafeRelativePath(relativePath)) throw new Error(`Unsafe snapshot path: ${rawPath}`);
    const content = await readFile(path.join(root, ...relativePath.split("/")));
    digest.update(`${Buffer.byteLength(relativePath, "utf8")}:`);
    digest.update(relativePath, "utf8");
    digest.update(`:${content.byteLength}:`);
    digest.update(content);
    digest.update("\0");
  }

  return digest.digest("hex");
}

async function collectRequirementPaths(root, changePaths) {
  const requirements = new Set();
  const pattern = /docs\/requirements\/[a-z0-9][a-z0-9-]*\/brief\.md/g;
  for (const relativePath of changePaths) {
    if (!relativePath.endsWith(".md")) continue;
    const content = await readFile(path.join(root, ...relativePath.split("/")), "utf8");
    for (const match of content.matchAll(pattern)) requirements.add(match[0]);
  }
  if (requirements.size > 0) requirements.add("docs/requirements/index.md");
  return requirements;
}

export async function collectEvidencePaths(root, changeId, progress) {
  const changeRelative = `openspec/changes/${changeId}`;
  const changeAbsolute = path.join(root, ...changeRelative.split("/"));
  const changeFiles = (await listFiles(changeAbsolute, root)).filter(
    (relativePath) => relativePath !== `${changeRelative}/verify-report.md`,
  );
  const paths = new Set(changeFiles);

  for (const rawPath of progress.filesChanged) {
    const relativePath = normalizeRelativePath(rawPath);
    if (!isSafeRelativePath(relativePath)) throw new Error(`Unsafe filesChanged path: ${rawPath}`);
    if (!(await pathExists(path.join(root, ...relativePath.split("/"))))) {
      throw new Error(`filesChanged path does not exist: ${relativePath}`);
    }
    paths.add(relativePath);
  }
  for (const relativePath of await collectRequirementPaths(root, changeFiles)) paths.add(relativePath);

  return [...paths].sort((left, right) => left.localeCompare(right));
}

export async function createEvidenceSnapshot(root, changeId, progress) {
  const paths = await collectEvidencePaths(root, changeId, progress);
  return {
    schemaVersion: 1,
    algorithm: "sha256",
    paths,
    digest: await calculateSnapshotDigest(root, paths),
  };
}

function compareTaskIds(actual, expected, label, errors) {
  const actualSorted = [...new Set(actual)].sort();
  const expectedSorted = [...new Set(expected)].sort();
  if (JSON.stringify(actualSorted) !== JSON.stringify(expectedSorted)) {
    errors.push(`${label} mismatch: expected [${expectedSorted.join(", ")}], received [${actualSorted.join(", ")}].`);
  }
}

function parseHandoffEntries(progressMarkdown) {
  const section = extractSection(progressMarkdown, "Handoff History");
  if (section === null) return [];
  return section
    .split(/(?=^###\s+)/m)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function validateDelegationPlan(changeId, tasks, progress, progressMarkdown, errors) {
  const ownerTaggedTasks = tasks.filter((task) => task.ownerTags.length > 0);
  if (ownerTaggedTasks.length === 0) return;

  for (const task of ownerTaggedTasks) {
    if (task.ownerTags.length !== 1) {
      errors.push(`${changeId}: task ${task.id} must have exactly one owner tag, found ${task.ownerTags.length}.`);
    }
  }

  const delegationPlan = progress.delegationPlan;
  if (!delegationPlan || typeof delegationPlan !== "object" || Array.isArray(delegationPlan)) {
    errors.push(`${changeId}: owner-tagged tasks require Current Snapshot delegationPlan evidence.`);
    return;
  }
  if (delegationPlan.schemaVersion !== 1) errors.push(`${changeId}: delegationPlan schemaVersion must be 1.`);
  if (
    !Array.isArray(delegationPlan.requiredRoles) ||
    delegationPlan.requiredRoles.some((role) => typeof role !== "string" || role.length === 0)
  ) {
    errors.push(`${changeId}: delegationPlan.requiredRoles must be an array of strings.`);
  }
  if (!Array.isArray(delegationPlan.roles)) {
    errors.push(`${changeId}: delegationPlan.roles must be an array.`);
    return;
  }

  const rolesByName = new Map();
  for (const entry of delegationPlan.roles) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      errors.push(`${changeId}: delegationPlan.roles entries must be objects.`);
      continue;
    }
    const { role, taskIds, allowedRoots, skills, resolution, fallbackReason } = entry;
    if (typeof role !== "string" || role.length === 0) {
      errors.push(`${changeId}: delegationPlan role entries require a role string.`);
      continue;
    }
    if (rolesByName.has(role)) errors.push(`${changeId}: delegationPlan role ${role} is duplicated.`);
    rolesByName.set(role, entry);
    for (const [field, value] of Object.entries({ taskIds, allowedRoots, skills })) {
      if (!Array.isArray(value) || value.some((item) => typeof item !== "string" || item.length === 0)) {
        errors.push(`${changeId}: delegationPlan role ${role} field ${field} must be an array of strings.`);
      }
    }
    if (!VALID_SKILL_RESOLUTIONS.has(resolution)) {
      errors.push(`${changeId}: delegationPlan role ${role} has unsupported resolution ${resolution ?? "missing"}.`);
    }
    if (resolution === "inline-fallback" && (typeof fallbackReason !== "string" || fallbackReason.trim().length === 0)) {
      errors.push(`${changeId}: delegationPlan role ${role} uses inline-fallback without a fallbackReason.`);
    }
  }

  const requiredRoles = new Set(Array.isArray(delegationPlan.requiredRoles) ? delegationPlan.requiredRoles : []);
  for (const task of ownerTaggedTasks) {
    if (task.ownerTags.length !== 1) continue;
    const role = task.ownerTag;
    if (!requiredRoles.has(role)) errors.push(`${changeId}: delegationPlan.requiredRoles is missing owner ${role}.`);
    const roleEntry = rolesByName.get(role);
    if (!roleEntry) {
      errors.push(`${changeId}: delegationPlan.roles is missing owner ${role}.`);
      continue;
    }
    if (!Array.isArray(roleEntry.taskIds) || !roleEntry.taskIds.includes(task.id)) {
      errors.push(`${changeId}: owner-tagged task ${task.id} is not covered by delegationPlan role ${role}.`);
    }
  }

  const handoffEntries = parseHandoffEntries(progressMarkdown);
  const completedOwners = new Set(ownerTaggedTasks.filter((task) => task.done && task.ownerTags.length === 1).map((task) => task.ownerTag));

  for (const match of progressMarkdown.matchAll(/Skill resolution:\s*([a-z-]+)/gi)) {
    const resolution = match[1].toLowerCase();
    if (!VALID_SKILL_RESOLUTIONS.has(resolution)) {
      errors.push(`${changeId}: Handoff History contains unsupported Skill resolution ${match[1]}.`);
    }
  }

  for (const owner of completedOwners) {
    const matchingEntries = handoffEntries.filter((entry) => entry.includes(owner));
    if (matchingEntries.length === 0) {
      errors.push(`${changeId}: completed owner-tagged tasks for ${owner} lack matching Handoff History.`);
      continue;
    }
    if (!matchingEntries.some((entry) => /Skill resolution:\s*(?:paths-injected|inline-fallback|none)\b/i.test(entry))) {
      errors.push(`${changeId}: Handoff History for ${owner} lacks Skill resolution evidence.`);
    }
  }
}

function validateApprovalCheckpoint(changeId, progress, errors) {
  const checkpoint = progress.approvalCheckpoint;
  if (!checkpoint || typeof checkpoint !== "object" || Array.isArray(checkpoint)) {
    errors.push(`${changeId}: started implementation requires Current Snapshot approvalCheckpoint evidence.`);
    return;
  }

  if (checkpoint.schemaVersion !== 1) errors.push(`${changeId}: approvalCheckpoint schemaVersion must be 1.`);
  if (checkpoint.status !== "approved") errors.push(`${changeId}: approvalCheckpoint status must be approved.`);

  for (const field of ["approvedBy", "approvalSource", "packetSummary"]) {
    if (typeof checkpoint[field] !== "string" || checkpoint[field].trim().length === 0) {
      errors.push(`${changeId}: approvalCheckpoint.${field} must be a non-empty string.`);
    }
  }

  if (typeof checkpoint.approvedAt !== "string" || checkpoint.approvedAt.trim().length === 0) {
    errors.push(`${changeId}: approvalCheckpoint.approvedAt must be a non-empty string.`);
  }

  if (
    !Array.isArray(checkpoint.artifactsReviewed) ||
    checkpoint.artifactsReviewed.length === 0 ||
    checkpoint.artifactsReviewed.some((item) => typeof item !== "string" || item.trim().length === 0)
  ) {
    errors.push(`${changeId}: approvalCheckpoint.artifactsReviewed must be a non-empty array of strings.`);
    return;
  }

  for (const item of checkpoint.artifactsReviewed) {
    if (!isSafeRelativePath(item)) {
      errors.push(`${changeId}: approvalCheckpoint.artifactsReviewed contains unsafe path ${item}.`);
    }
  }
}

export async function validateChangeLifecycle(root, changeId, { archiveReady = false } = {}) {
  const errors = [];
  const changeRelative = `openspec/changes/${changeId}`;
  const requiredArtifacts = ["proposal.md", "design.md", "tasks.md"];
  for (const artifact of requiredArtifacts) {
    if (!(await pathExists(path.join(root, changeRelative, artifact)))) errors.push(`${changeId}: missing required artifact ${artifact}.`);
  }
  const specsDirectory = path.join(root, changeRelative, "specs");
  if (!(await pathExists(specsDirectory)) || (await listFiles(specsDirectory)).filter((file) => file.endsWith(".md")).length === 0) {
    errors.push(`${changeId}: missing delta specification files.`);
  }

  const tasksPath = path.join(root, changeRelative, "tasks.md");
  if (!(await pathExists(tasksPath))) return errors;
  const tasks = parseTasks(await readFile(tasksPath, "utf8"));
  if (tasks.length === 0) errors.push(`${changeId}: tasks.md contains no parseable numbered checkbox tasks.`);

  const progressPath = path.join(root, changeRelative, "apply-progress.md");
  const reportPath = path.join(root, changeRelative, "verify-report.md");
  const progressExists = await pathExists(progressPath);
  const reportExists = await pathExists(reportPath);
  const started = tasks.some((task) => task.done) || progressExists || reportExists;
  if (!started) return errors;

  const pending = tasks.filter((task) => !task.done).map((task) => task.id);
  const completed = tasks.filter((task) => task.done).map((task) => task.id);
  if (archiveReady && pending.length > 0) errors.push(`${changeId}: pending task IDs block archive readiness: ${pending.join(", ")}.`);
  if (!progressExists) {
    errors.push(`${changeId}: implementation started but apply-progress.md is missing.`);
    return errors;
  }

  let progress;
  let progressMarkdown;
  try {
    progressMarkdown = await readFile(progressPath, "utf8");
    progress = parseProgress(progressMarkdown);
    compareTaskIds(progress.completedTaskIds, completed, `${changeId}: completedTaskIds`, errors);
    compareTaskIds(progress.remainingTaskIds, pending, `${changeId}: remainingTaskIds`, errors);
    validateApprovalCheckpoint(changeId, progress, errors);
    validateDelegationPlan(changeId, tasks, progress, progressMarkdown, errors);
    if (archiveReady && progress.status !== "ready-for-archive") {
      errors.push(`${changeId}: archive readiness requires progress status ready-for-archive.`);
    }
  } catch (error) {
    errors.push(`${changeId}: ${error.message}`);
    return errors;
  }

  // Continuous validation must remain runnable while evidence is being refreshed.
  // PASS, snapshot freshness, and terminal completeness are archive-only invariants.
  if (!archiveReady) return errors;

  if (!reportExists) {
    errors.push(`${changeId}: verify-report.md is required for archive readiness.`);
    return errors;
  }

  const report = await readFile(reportPath, "utf8");
  const verdict = parseVerdict(report);
  if (verdict !== "PASS") errors.push(`${changeId}: verify-report.md verdict must be PASS, received ${verdict ?? "missing"}.`);

  let recordedSnapshot;
  try {
    recordedSnapshot = extractJsonSection(report, "Evidence Snapshot");
    if (!recordedSnapshot) throw new Error('verify-report.md requires an "## Evidence Snapshot" JSON block.');
    if (recordedSnapshot.schemaVersion !== 1 || recordedSnapshot.algorithm !== "sha256") {
      throw new Error("Evidence Snapshot must use schemaVersion 1 and algorithm sha256.");
    }
    if (!Array.isArray(recordedSnapshot.paths) || recordedSnapshot.paths.some((item) => typeof item !== "string")) {
      throw new Error("Evidence Snapshot paths must be an array of strings.");
    }
    if (!/^[a-f0-9]{64}$/.test(recordedSnapshot.digest ?? "")) {
      throw new Error("Evidence Snapshot digest must be a lowercase SHA-256 hex string.");
    }

    const expected = await createEvidenceSnapshot(root, changeId, progress);
    if (JSON.stringify(recordedSnapshot.paths) !== JSON.stringify(expected.paths)) {
      errors.push(`${changeId}: Evidence Snapshot paths are incomplete or not sorted exactly.`);
    }
    if (recordedSnapshot.digest !== expected.digest) {
      errors.push(`${changeId}: Evidence Snapshot is stale; covered files changed after verification.`);
    }
  } catch (error) {
    errors.push(`${changeId}: ${error.message}`);
  }

  return errors;
}

export async function listActiveChanges(root) {
  const changesRoot = path.join(root, "openspec", "changes");
  if (!(await pathExists(changesRoot))) return [];
  const entries = await readdir(changesRoot, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory() && entry.name !== "archive")
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));
}

export async function validateRepository(root, openSpecVersionOutput) {
  const manifestErrors = [];
  const manifestContent = await readRequired(root, "package.json", manifestErrors);
  if (manifestContent !== null) {
    try {
      manifestErrors.push(...validateVerificationScripts(JSON.parse(manifestContent)));
    } catch (error) {
      manifestErrors.push(`package.json: invalid JSON: ${error.message}.`);
    }
  }
  const errors = [
    ...validateOpenSpecVersion(openSpecVersionOutput),
    ...manifestErrors,
    ...(await validateLocalSkillIntegration(root)),
    ...(await validateGuidance(root)),
  ];
  for (const changeId of await listActiveChanges(root)) {
    errors.push(...(await validateChangeLifecycle(root, changeId)));
  }
  return errors;
}

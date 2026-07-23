import { createHash } from "node:crypto";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

export const EXPECTED_OPENSPEC_VERSION = "1.6.0";
export const LOCAL_INTEGRATION_MARKER = "LOCAL_HARNESS_INTEGRATION_V1";

const LOCAL_SKILLS = {
  propose: ".codex/skills/openspec-propose/SKILL.md",
  apply: ".codex/skills/openspec-apply-change/SKILL.md",
  update: ".codex/skills/openspec-update-change/SKILL.md",
  explore: ".codex/skills/openspec-explore/SKILL.md",
  sync: ".codex/skills/openspec-sync-specs/SKILL.md",
  archive: ".codex/skills/openspec-archive-change/SKILL.md",
};

const GUIDANCE_FILES = [
  "AGENTS.md",
  "README.md",
  "harness-docs/developer-harness-guide.md",
  "harness-docs/human-operator-guide.md",
  ".agent/skills/spec-driven-development/SKILL.md",
  ".agent/skills/behavior-testing/SKILL.md",
  ".agent/skills/implementation-progress/SKILL.md",
  ".agent/skills/verification-harness/SKILL.md",
  ".agent/agents/orchestrator.md",
  ".agent/agents/agent-architect.md",
  ".agent/agents/agent-data.md",
  ".agent/agents/agent-requirements-curator.md",
  ".agent/agents/agent-ui.md",
  ".agent/agents/agent-verifier.md",
];

const OWNER_TAG_PATTERN = /\[(orchestrator|agent-[a-z0-9-]+)\]/g;
const VALID_ASSURANCE_PROFILES = new Set(["no-change", "standard-change", "high-risk"]);
const VALID_SKILL_RESOLUTIONS = new Set(["paths-injected", "none"]);
const VALID_EXECUTION_MODES = new Set(["inline", "subagent", "runtime-fallback"]);
const VALID_PLANNED_MODES = new Set(["inline", "subagent"]);
const VALID_BUDGET_CLASSES = new Set(["planning", "curation", "implementation", "verification"]);
const VALID_MILESTONES = new Set([
  "started",
  "context-loaded",
  "recommendation-ready",
  "artifact-written",
  "completed",
  "blocked",
]);
const EXECUTOR_MARKER = "HARNESS_EXECUTOR_V1";
const FINAL_GATE_COMMANDS = [
  "pnpm validate:specs",
  "pnpm test:unit:run",
  "pnpm typecheck",
  "pnpm lint",
  "pnpm build",
];
const FINAL_GATE_IDS = ["specs-harness", "unit-component", "typecheck", "lint", "build"];
const CODEX_AGENT_DEFINITIONS = [
  {
    path: ".codex/agents/agent-architect.toml",
    name: "agent-architect",
    rolePath: ".agent/agents/agent-architect.md",
    reasoning: "medium",
  },
  {
    path: ".codex/agents/agent-data.toml",
    name: "agent-data",
    rolePath: ".agent/agents/agent-data.md",
    reasoning: "high",
  },
  {
    path: ".codex/agents/agent-requirements-curator.toml",
    name: "agent-requirements-curator",
    rolePath: ".agent/agents/agent-requirements-curator.md",
    reasoning: "medium",
  },
  {
    path: ".codex/agents/agent-ui.toml",
    name: "agent-ui",
    rolePath: ".agent/agents/agent-ui.md",
    reasoning: "high",
  },
  {
    path: ".codex/agents/agent-verifier.toml",
    name: "agent-verifier",
    rolePath: ".agent/agents/agent-verifier.md",
    reasoning: "high",
  },
];
const CONTEXT_BUDGETS = [
  {
    label: "root bootstrap",
    maxWords: 1800,
    paths: [
      ".agent/skills/spec-driven-development/SKILL.md",
      ".agent/skill-registry.md",
      ".agent/agents/orchestrator.md",
    ],
  },
  {
    label: "full UI executor",
    maxWords: 4200,
    paths: [
      ".agent/contracts/phase-handoff.md",
      ".agent/agents/agent-ui.md",
      ".agent/skills/ssr-data-fetching/SKILL.md",
      ".agent/skills/client-views-modals/SKILL.md",
      ".agent/skills/forms-rhf-zod/SKILL.md",
      ".agent/skills/filters-url-state/SKILL.md",
      ".agent/skills/i18n-conventions/SKILL.md",
      ".agent/skills/behavior-testing/SKILL.md",
      ".agent/skills/implementation-progress/SKILL.md",
    ],
  },
  {
    label: "data executor",
    maxWords: 3000,
    paths: [
      ".agent/contracts/phase-handoff.md",
      ".agent/agents/agent-data.md",
      ".agent/skills/data-layer/SKILL.md",
      ".agent/skills/behavior-testing/SKILL.md",
      ".agent/skills/i18n-conventions/SKILL.md",
      ".agent/skills/implementation-progress/SKILL.md",
    ],
  },
];

function normalizeRelativePath(value) {
  return String(value).replaceAll("\\", "/").replace(/^\.\//, "");
}

function normalizeHeading(value) {
  return value.trim().replace(/\s+/g, " ");
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
  if (!block) throw new Error(`Section "${heading}" must contain a fenced json block.`);
  try {
    return JSON.parse(block[1]);
  } catch (error) {
    throw new Error(`Section "${heading}" contains invalid JSON: ${error.message}`);
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
  if (snapshot.schemaVersion !== 3) throw new Error("Current Snapshot schemaVersion must be 3.");
  if (!["in-progress", "blocked", "ready-for-verification", "ready-for-archive"].includes(snapshot.status)) {
    throw new Error("Current Snapshot has an unsupported status.");
  }
  if (!VALID_ASSURANCE_PROFILES.has(snapshot.assuranceProfile)) {
    throw new Error("Current Snapshot assuranceProfile is missing or unsupported.");
  }
  for (const field of ["completedTaskIds", "remainingTaskIds", "filesChanged", "skillsLoaded", "executionRecords"]) {
    if (!Array.isArray(snapshot[field])) throw new Error(`Current Snapshot field ${field} must be an array.`);
  }
  for (const field of ["completedTaskIds", "remainingTaskIds", "filesChanged", "skillsLoaded"]) {
    if (snapshot[field].some((item) => typeof item !== "string")) {
      throw new Error(`Current Snapshot field ${field} must contain strings.`);
    }
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

export function validateVerificationScripts(manifest, runnerSource = "") {
  const errors = [];
  const scripts = manifest?.scripts ?? {};
  const fast = scripts["verify:fast"];
  if (typeof fast !== "string") {
    errors.push("package.json: missing required script verify:fast.");
  } else {
    for (const fragment of ["test:unit:run", "typecheck:fast", "lint:fast"]) {
      if (!fast.includes(fragment)) errors.push(`package.json: script verify:fast must include ${fragment}.`);
    }
  }
  for (const scriptName of [
    "test:unit",
    "test:unit:run",
    "typecheck:fast",
    "typecheck",
    "lint:fast",
    "lint",
    "build",
    "validate:specs",
  ]) {
    if (typeof scripts[scriptName] !== "string") errors.push(`package.json: missing required script ${scriptName}.`);
  }
  if (scripts.verify !== "node scripts/run-verification.mjs") {
    errors.push("package.json: verify must invoke only node scripts/run-verification.mjs.");
  }
  if (!/--incremental\s+false/.test(scripts["typecheck:app"] ?? "")) {
    errors.push("package.json: final application typecheck must be non-incremental.");
  }
  if (!/--incremental\s+false/.test(scripts["typecheck:reference"] ?? "")) {
    errors.push("package.json: final reference typecheck must be non-incremental.");
  }
  if (/\s--cache(?:\s|$)/.test(scripts.lint ?? "")) {
    errors.push("package.json: final lint must not use cache.");
  }

  if (typeof runnerSource !== "string" || runnerSource.length === 0) {
    errors.push("scripts/run-verification.mjs: file is missing or empty.");
  } else {
    const gates = [...runnerSource.matchAll(/id:\s*"([^"]+)"[\s\S]*?command:\s*"pnpm"[\s\S]*?args:\s*\["([^"]+)"\]/g)].map(
      (match) => ({ id: match[1], script: match[2] }),
    );
    const expected = FINAL_GATE_IDS.map((id, index) => ({
      id,
      script: FINAL_GATE_COMMANDS[index].replace(/^pnpm\s+/, ""),
    }));
    if (JSON.stringify(gates) !== JSON.stringify(expected)) {
      errors.push("scripts/run-verification.mjs: final gates must appear exactly once in the required order.");
    }
    for (const token of ["HARNESS_VERIFY_RESULT_V1", "durationMs", "exitCode", "status"]) {
      if (!runnerSource.includes(token)) errors.push(`scripts/run-verification.mjs: missing structured result token ${token}.`);
    }
    if (/args:\s*\["verify"\]/.test(runnerSource)) {
      errors.push("scripts/run-verification.mjs: runner must not recurse through pnpm verify.");
    }
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
    return await readFile(path.join(root, ...relativePath.split("/")), "utf8");
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
    propose: ["assurance profile", "planning digest", "requirement", "classification", "openspec status", "Implementation Approval Packet"],
    apply: [
      "assurance profile",
      "planning digest",
      "openspec status",
      "openspec instructions apply",
      "apply-progress.md",
      "executionRecords",
      "Implementation Approval Packet",
      "approvalCheckpoint",
    ],
    update: ["planning artifacts", "openspec status", "existingOutputPaths", "planning digest", "approvalCheckpoint", "pnpm verify"],
    explore: ["assurance profile", "classification", "requirements curation", "no-change", "OpenSpec artifacts", "Implementation Approval Packet"],
    sync: ["openspec status", "delta", "active"],
    archive: ["openspec status", "validate-harness.mjs", "verify-report.md", "PASS", "snapshot", "openspec archive"],
  };
  for (const [name, tokens] of Object.entries(requirements)) {
    const content = contents[name]?.toLowerCase();
    if (!content) continue;
    for (const token of tokens) {
      if (!content.includes(token.toLowerCase())) {
        errors.push(`${LOCAL_SKILLS[name]}: missing required integration guidance "${token}".`);
      }
    }
  }
  const archive = contents.archive ?? "";
  if (!/openspec\s+archive\s+[^\r\n]+--yes\s+--json/i.test(archive)) {
    errors.push(`${LOCAL_SKILLS.archive}: native archive command must include --yes --json.`);
  }
  const unsafeArchivePatterns = [
    { pattern: /\bmkdir(?:\s+-p)?\b/i, label: "manual archive directory creation" },
    { pattern: /(^|\s)mv\s+["'<]/im, label: "manual change-directory movement" },
    { pattern: /proceed\s+if\s+(?:the\s+)?user\s+confirms/i, label: "confirmation override" },
    { pattern: /don['â€™]?t\s+block\s+archive/i, label: "non-blocking archive warning" },
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

function hasTomlString(content, field, value) {
  const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^\\s*${field}\\s*=\\s*["']${escapedValue}["']\\s*$`, "m").test(content);
}

export async function validateRuntimeAdapters(root) {
  const errors = [];
  const rootInstructions = await readRequired(root, "AGENTS.md", errors);
  if (rootInstructions !== null) {
    const rootTokens = [
      ".agent/skills/spec-driven-development/SKILL.md",
      ".agent/skill-registry.md",
      ".agent/agents/orchestrator.md",
    ];
    for (const token of [EXECUTOR_MARKER, ".agent/contracts/phase-handoff.md", "assurance profile", ...rootTokens]) {
      if (!rootInstructions.toLowerCase().includes(token.toLowerCase())) {
        errors.push(`AGENTS.md: root/executor bootstrap is missing ${token}.`);
      }
    }
    const rootTokenIndexes = rootTokens.map((token) => rootInstructions.indexOf(token));
    if (
      rootTokenIndexes.every((index) => index >= 0) &&
      !(rootTokenIndexes[0] < rootTokenIndexes[1] && rootTokenIndexes[1] < rootTokenIndexes[2])
    ) {
      errors.push("AGENTS.md: root bootstrap must load SDD, registry, and orchestrator in that order.");
    }
    if (!/non-root|executor handoff/i.test(rootInstructions)) {
      errors.push("AGENTS.md: root/executor bootstrap must identify non-root executor entry.");
    }
  }
  for (const definition of CODEX_AGENT_DEFINITIONS) {
    const roleContent = await readRequired(root, definition.rolePath, errors);
    if (roleContent !== null) {
      for (const token of [EXECUTOR_MARKER, ".agent/contracts/phase-handoff.md"]) {
        if (!roleContent.includes(token)) errors.push(`${definition.rolePath}: executor bootstrap is missing ${token}.`);
      }
      if (/read\s+\.agent\/skill-registry\.md/i.test(roleContent)) {
        errors.push(`${definition.rolePath}: executor must not require the root skill registry bootstrap.`);
      }
      if (/read\s+\.agent\/agents\/orchestrator\.md/i.test(roleContent)) {
        errors.push(`${definition.rolePath}: executor must not require the orchestrator bootstrap.`);
      }
    }
  }
  const config = await readRequired(root, ".codex/config.toml", errors);
  if (config !== null) {
    if (!/^\s*\[agents\]\s*$/m.test(config)) errors.push(".codex/config.toml: missing [agents] table.");
    if (!/^\s*enabled\s*=\s*true\s*$/m.test(config)) errors.push(".codex/config.toml: agents.enabled must be true.");
    if (!/^\s*max_concurrent_threads_per_session\s*=\s*4\s*$/m.test(config)) {
      errors.push(".codex/config.toml: max_concurrent_threads_per_session must be 4.");
    }
  }
  for (const definition of CODEX_AGENT_DEFINITIONS) {
    const content = await readRequired(root, definition.path, errors);
    if (content === null) continue;
    if (!hasTomlString(content, "name", definition.name)) errors.push(`${definition.path}: name must be ${definition.name}.`);
    for (const field of ["description", "developer_instructions"]) {
      if (!new RegExp(`^\\s*${field}\\s*=`, "m").test(content)) errors.push(`${definition.path}: missing required ${field}.`);
    }
    if (!content.includes(EXECUTOR_MARKER)) {
      errors.push(`${definition.path}: developer instructions must include ${EXECUTOR_MARKER}.`);
    }
    if (!content.includes(definition.rolePath)) errors.push(`${definition.path}: must reference portable role ${definition.rolePath}.`);
    if (!hasTomlString(content, "model_reasoning_effort", definition.reasoning)) {
      errors.push(`${definition.path}: model_reasoning_effort must be ${definition.reasoning}.`);
    }
    if (!hasTomlString(content, "sandbox_mode", "workspace-write")) {
      errors.push(`${definition.path}: sandbox_mode must be workspace-write.`);
    }
  }
  return errors;
}

function countWords(content) {
  return content.trim().length === 0 ? 0 : content.trim().split(/\s+/).length;
}

export async function validateContextBudgets(root) {
  const errors = [];
  const referencePaths = new Set();
  for (const budget of CONTEXT_BUDGETS) {
    let words = 0;
    for (const relativePath of budget.paths) {
      const content = await readRequired(root, relativePath, errors);
      if (content !== null) {
        words += countWords(content);
        for (const match of content.matchAll(/`(\.agent\/reference\/widget\/[^`]+)`/g)) {
          referencePaths.add(match[1]);
        }
      }
    }
    if (words > budget.maxWords) {
      errors.push(`${budget.label} context is ${words} words; maximum is ${budget.maxWords}.`);
    }
  }
  for (const relativePath of [...referencePaths].sort()) {
    if (!(await pathExists(path.join(root, ...relativePath.split("/"))))) {
      errors.push(`${relativePath}: lazy reference path does not exist.`);
    }
  }
  return errors;
}

function updateDigestWithPath(digest, relativePath, content) {
  digest.update(`${Buffer.byteLength(relativePath, "utf8")}:`);
  digest.update(relativePath, "utf8");
  digest.update(`:${content.byteLength}:`);
  digest.update(content);
  digest.update("\0");
}

export async function calculateSnapshotDigest(root, relativePaths) {
  const digest = createHash("sha256");
  digest.update("HARNESS_EVIDENCE_SNAPSHOT_V1\0");
  for (const rawPath of relativePaths) {
    const relativePath = normalizeRelativePath(rawPath);
    if (!isSafeRelativePath(relativePath)) throw new Error(`Unsafe snapshot path: ${rawPath}`);
    updateDigestWithPath(digest, relativePath, await readFile(path.join(root, ...relativePath.split("/"))));
  }
  return digest.digest("hex");
}

function canonicalizePlanningContent(relativePath, content) {
  let text = content.toString("utf8");
  if (relativePath.endsWith("/tasks.md")) {
    text = text.replace(/^(\s*-\s+)\[[ xX]\](\s+(?:\d+\.)+\d+\s+)/gm, "$1[ ]$2");
  }
  if (/^docs\/requirements\/[^/]+\/brief\.md$/.test(relativePath)) {
    text = text
      .replace(/^>\s+\*\*(?:Status|OpenSpec change):\*\*.*$/gim, "")
      .replace(/\n## Documentation Synchronization[\s\S]*?(?=\n## |\s*$)/i, "");
  }
  return Buffer.from(text, "utf8");
}

async function collectRequirementPaths(root, sourcePaths) {
  const requirements = new Set();
  const pattern = /docs\/requirements\/[a-z0-9][a-z0-9-]*\/brief\.md/g;
  for (const relativePath of sourcePaths) {
    if (!relativePath.endsWith(".md")) continue;
    const content = await readFile(path.join(root, ...relativePath.split("/")), "utf8");
    for (const match of content.matchAll(pattern)) requirements.add(match[0]);
  }
  return requirements;
}

export async function collectPlanningPaths(root, changeId) {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(changeId)) {
    throw new Error(`Unsafe change ID: ${changeId}`);
  }
  const changeRelative = `openspec/changes/${changeId}`;
  const required = [
    `${changeRelative}/proposal.md`,
    `${changeRelative}/design.md`,
    `${changeRelative}/tasks.md`,
  ];
  for (const relativePath of required) {
    if (!(await pathExists(path.join(root, ...relativePath.split("/"))))) {
      throw new Error(`${changeId}: planning digest is missing ${relativePath}.`);
    }
  }
  const specsRoot = path.join(root, ...`${changeRelative}/specs`.split("/"));
  if (!(await pathExists(specsRoot))) throw new Error(`${changeId}: planning digest is missing delta specs.`);
  const specPaths = (await listFiles(specsRoot, root)).filter((relativePath) => relativePath.endsWith(".md"));
  if (specPaths.length === 0) throw new Error(`${changeId}: planning digest is missing delta specs.`);
  const paths = new Set([...required, ...specPaths]);
  for (const requirementPath of await collectRequirementPaths(root, [...paths])) {
    if (!(await pathExists(path.join(root, ...requirementPath.split("/"))))) {
      throw new Error(`${changeId}: linked requirement does not exist: ${requirementPath}.`);
    }
    paths.add(requirementPath);
  }
  return [...paths].sort((left, right) => left.localeCompare(right));
}

export async function createPlanningDigest(root, changeId) {
  const paths = await collectPlanningPaths(root, changeId);
  const digest = createHash("sha256");
  digest.update("HARNESS_PLANNING_DIGEST_V1\0");
  for (const relativePath of paths) {
    const content = await readFile(path.join(root, ...relativePath.split("/")));
    updateDigestWithPath(digest, relativePath, canonicalizePlanningContent(relativePath, content));
  }
  return {
    schemaVersion: 1,
    algorithm: "sha256",
    paths,
    digest: digest.digest("hex"),
  };
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
  for (const relativePath of await collectRequirementPaths(root, changeFiles)) {
    paths.add(relativePath);
    paths.add("docs/requirements/index.md");
  }
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

function validateStringArray(changeId, role, field, value, errors, { allowEmpty = true } = {}) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string" || item.length === 0)) {
    errors.push(`${changeId}: ${role} field ${field} must be an array of strings.`);
    return false;
  }
  if (!allowEmpty && value.length === 0) {
    errors.push(`${changeId}: ${role} field ${field} must not be empty.`);
    return false;
  }
  return true;
}

function validateSkillResolution(changeId, label, entry, errors) {
  if (!VALID_SKILL_RESOLUTIONS.has(entry.skillResolution)) {
    errors.push(`${changeId}: ${label} has unsupported skillResolution ${entry.skillResolution ?? "missing"}.`);
  }
  if (entry.skillResolution === "paths-injected" && (!Array.isArray(entry.skills) || entry.skills.length === 0)) {
    errors.push(`${changeId}: ${label} uses paths-injected without exact skills.`);
  }
  if (entry.skillResolution === "none" && Array.isArray(entry.skills) && entry.skills.length > 0) {
    errors.push(`${changeId}: ${label} uses skillResolution none with non-empty skills.`);
  }
}

function validateExecutionRecord(changeId, record, rolePlan, errors) {
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    errors.push(`${changeId}: executionRecords entries must be objects.`);
    return;
  }
  const label = `execution record ${record.role ?? "missing-role"}`;
  for (const field of ["role", "status", "summary", "executionMode", "skillResolution"]) {
    if (typeof record[field] !== "string" || record[field].trim().length === 0) {
      errors.push(`${changeId}: ${label} requires ${field}.`);
    }
  }
  if (!["success", "partial", "blocked"].includes(record.status)) {
    errors.push(`${changeId}: ${label} has unsupported status ${record.status ?? "missing"}.`);
  }
  if (!VALID_EXECUTION_MODES.has(record.executionMode)) {
    errors.push(`${changeId}: ${label} has unsupported executionMode ${record.executionMode ?? "missing"}.`);
  }
  for (const [field, allowEmpty] of [
    ["taskIds", false],
    ["allowedRoots", false],
    ["skills", true],
    ["filesChanged", true],
    ["risks", true],
    ["exclusiveArtifacts", true],
  ]) {
    validateStringArray(changeId, label, field, record[field], errors, { allowEmpty });
  }
  if (
    !Array.isArray(record.verification) ||
    record.verification.some(
      (item) =>
        !item ||
        typeof item !== "object" ||
        typeof item.command !== "string" ||
        !Number.isInteger(item.exitCode) ||
        typeof item.summary !== "string",
    )
  ) {
    errors.push(`${changeId}: ${label} verification must contain command, integer exitCode, and summary records.`);
  }
  for (const rootPath of [...(record.allowedRoots ?? []), ...(record.exclusiveArtifacts ?? [])]) {
    if (!isSafeRelativePath(rootPath)) errors.push(`${changeId}: ${label} contains unsafe owned path ${rootPath}.`);
  }
  validateSkillResolution(changeId, label, record, errors);
  if (!rolePlan) {
    errors.push(`${changeId}: ${label} has no matching ownershipPlan role.`);
  } else if (rolePlan.plannedMode === "inline" && record.executionMode !== "inline") {
    errors.push(`${changeId}: ${label} planned inline but recorded ${record.executionMode}.`);
  } else if (rolePlan.plannedMode === "subagent" && !["subagent", "runtime-fallback"].includes(record.executionMode)) {
    errors.push(`${changeId}: ${label} planned subagent but recorded ${record.executionMode}.`);
  }

  if (record.executionMode === "inline") {
    for (const field of ["milestones", "budget", "fallbackReason", "recoveryEvidence", "plannedMode"]) {
      if (record[field] !== undefined && record[field] !== "" && !(Array.isArray(record[field]) && record[field].length === 0)) {
        errors.push(`${changeId}: ${label} inline mode must omit subagent-only field ${field}.`);
      }
    }
  } else {
    if (!validateStringArray(changeId, label, "milestones", record.milestones, errors, { allowEmpty: false })) {
      // Error already recorded.
    } else {
      for (const milestone of record.milestones) {
        if (!VALID_MILESTONES.has(milestone)) errors.push(`${changeId}: ${label} has unsupported milestone ${milestone}.`);
      }
      if (!record.milestones.includes("started") || !record.milestones.some((item) => ["completed", "blocked"].includes(item))) {
        errors.push(`${changeId}: ${label} milestones require started and a terminal outcome.`);
      }
    }
    if (!record.budget || typeof record.budget !== "object" || Array.isArray(record.budget)) {
      errors.push(`${changeId}: ${label} requires a budget object.`);
    } else {
      if (!VALID_BUDGET_CLASSES.has(record.budget.class)) errors.push(`${changeId}: ${label} has unsupported budget class.`);
      if (!Number.isInteger(record.budget.minutes) || record.budget.minutes <= 0) {
        errors.push(`${changeId}: ${label} budget minutes must be a positive integer.`);
      }
      if (typeof record.budget.outcome !== "string" || record.budget.outcome.trim().length === 0) {
        errors.push(`${changeId}: ${label} budget outcome is required.`);
      }
    }
  }
  if (record.executionMode === "runtime-fallback") {
    if (record.plannedMode !== "subagent") errors.push(`${changeId}: ${label} runtime-fallback requires plannedMode subagent.`);
    for (const field of ["fallbackReason", "recoveryEvidence"]) {
      if (typeof record[field] !== "string" || record[field].trim().length === 0) {
        errors.push(`${changeId}: ${label} runtime-fallback requires ${field}.`);
      }
    }
  } else if (record.executionMode === "subagent" && record.plannedMode !== undefined && record.plannedMode !== "subagent") {
    errors.push(`${changeId}: ${label} subagent plannedMode must be subagent when recorded.`);
  }
}

function validateOwnershipEvidence(changeId, tasks, progress, errors) {
  const ownerTaggedTasks = tasks.filter((task) => task.ownerTags.length > 0);
  for (const task of ownerTaggedTasks) {
    if (task.ownerTags.length !== 1) {
      errors.push(`${changeId}: task ${task.id} must have exactly one owner tag, found ${task.ownerTags.length}.`);
    }
  }
  if (ownerTaggedTasks.length === 0) return;
  const plan = progress.ownershipPlan;
  if (!plan || typeof plan !== "object" || Array.isArray(plan)) {
    errors.push(`${changeId}: owner-tagged tasks require Current Snapshot ownershipPlan evidence.`);
    return;
  }
  if (plan.schemaVersion !== 3) errors.push(`${changeId}: ownershipPlan schemaVersion must be 3.`);
  if (plan.assuranceProfile !== progress.assuranceProfile) {
    errors.push(`${changeId}: ownershipPlan assuranceProfile must match Current Snapshot.`);
  }
  validateStringArray(changeId, "ownershipPlan", "requiredRoles", plan.requiredRoles, errors, { allowEmpty: false });
  if (!Array.isArray(plan.roles)) {
    errors.push(`${changeId}: ownershipPlan.roles must be an array.`);
    return;
  }
  const rolesByName = new Map();
  const exclusiveArtifactOwners = new Map();
  for (const entry of plan.roles) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      errors.push(`${changeId}: ownershipPlan.roles entries must be objects.`);
      continue;
    }
    const label = `ownershipPlan role ${entry.role ?? "missing-role"}`;
    if (typeof entry.role !== "string" || entry.role.length === 0) {
      errors.push(`${changeId}: ownershipPlan role entries require a role string.`);
      continue;
    }
    if (rolesByName.has(entry.role)) errors.push(`${changeId}: ownershipPlan role ${entry.role} is duplicated.`);
    rolesByName.set(entry.role, entry);
    for (const [field, allowEmpty] of [
      ["taskIds", false],
      ["allowedRoots", false],
      ["skills", true],
      ["exclusiveArtifacts", true],
    ]) {
      validateStringArray(changeId, label, field, entry[field], errors, { allowEmpty });
    }
    if (!VALID_PLANNED_MODES.has(entry.plannedMode)) {
      errors.push(`${changeId}: ${label} has unsupported plannedMode ${entry.plannedMode ?? "missing"}.`);
    }
    validateSkillResolution(changeId, label, entry, errors);
    for (const rootPath of [...(entry.allowedRoots ?? []), ...(entry.exclusiveArtifacts ?? [])]) {
      if (!isSafeRelativePath(rootPath)) errors.push(`${changeId}: ${label} contains unsafe owned path ${rootPath}.`);
    }
    for (const artifact of entry.exclusiveArtifacts ?? []) {
      const normalized = normalizeRelativePath(artifact);
      const previousOwner = exclusiveArtifactOwners.get(normalized);
      if (previousOwner) {
        errors.push(`${changeId}: exclusive artifact ${normalized} is assigned to both ${previousOwner} and ${entry.role}.`);
      } else {
        exclusiveArtifactOwners.set(normalized, entry.role);
      }
    }
  }
  const requiredRoles = new Set(plan.requiredRoles ?? []);
  for (const task of ownerTaggedTasks) {
    if (task.ownerTags.length !== 1) continue;
    const role = task.ownerTag;
    if (!requiredRoles.has(role)) errors.push(`${changeId}: ownershipPlan.requiredRoles is missing owner ${role}.`);
    const roleEntry = rolesByName.get(role);
    if (!roleEntry) {
      errors.push(`${changeId}: ownershipPlan.roles is missing owner ${role}.`);
    } else if (!roleEntry.taskIds.includes(task.id)) {
      errors.push(`${changeId}: owner-tagged task ${task.id} is not covered by ownershipPlan role ${role}.`);
    }
  }
  for (const record of progress.executionRecords) {
    validateExecutionRecord(changeId, record, rolesByName.get(record?.role), errors);
  }
  const successfulRecords = progress.executionRecords.filter((record) => record?.status === "success");
  for (const task of ownerTaggedTasks.filter((item) => item.done && item.ownerTags.length === 1)) {
    if (!successfulRecords.some((record) => record.role === task.ownerTag && record.taskIds?.includes(task.id))) {
      errors.push(`${changeId}: completed owner-tagged task ${task.id} for ${task.ownerTag} lacks executionRecords coverage.`);
    }
  }
}

function validateApprovalCheckpoint(changeId, progress, planningDigest, errors) {
  const checkpoint = progress.approvalCheckpoint;
  if (!checkpoint || typeof checkpoint !== "object" || Array.isArray(checkpoint)) {
    errors.push(`${changeId}: started implementation requires Current Snapshot approvalCheckpoint evidence.`);
    return;
  }
  if (checkpoint.schemaVersion !== 2) errors.push(`${changeId}: approvalCheckpoint schemaVersion must be 2.`);
  if (checkpoint.status !== "approved") errors.push(`${changeId}: approvalCheckpoint status must be approved.`);
  if (checkpoint.assuranceProfile !== progress.assuranceProfile) {
    errors.push(`${changeId}: approvalCheckpoint assuranceProfile must match Current Snapshot.`);
  }
  for (const field of ["approvedBy", "approvedAt", "approvalSource", "packetSummary"]) {
    if (typeof checkpoint[field] !== "string" || checkpoint[field].trim().length === 0) {
      errors.push(`${changeId}: approvalCheckpoint.${field} must be a non-empty string.`);
    }
  }
  if (
    !Array.isArray(checkpoint.artifactsReviewed) ||
    checkpoint.artifactsReviewed.some((item) => typeof item !== "string" || !isSafeRelativePath(item))
  ) {
    errors.push(`${changeId}: approvalCheckpoint.artifactsReviewed must contain safe repository-relative paths.`);
  } else if (JSON.stringify(checkpoint.artifactsReviewed) !== JSON.stringify(planningDigest.paths)) {
    errors.push(`${changeId}: approvalCheckpoint.artifactsReviewed does not match the current planning path set.`);
  }
  if (!/^[a-f0-9]{64}$/.test(checkpoint.planningDigest ?? "")) {
    errors.push(`${changeId}: approvalCheckpoint.planningDigest must be a lowercase SHA-256 hex string.`);
  } else if (checkpoint.planningDigest !== planningDigest.digest) {
    errors.push(`${changeId}: approvalCheckpoint planning digest is stale.`);
  }
}

function pathTouchesMaintainedPath(changedPath, maintainedPath) {
  const changed = normalizeRelativePath(changedPath);
  const maintained = normalizeRelativePath(maintainedPath).replace(/\/+$/, "");
  return changed === maintained || changed.startsWith(`${maintained}/`);
}

function validateDocumentationEvidence(changeId, progress, planningDigest, errors) {
  if (!["ready-for-verification", "ready-for-archive"].includes(progress.status)) return;
  const linkedBriefs = planningDigest.paths.filter((item) => /^docs\/requirements\/[^/]+\/brief\.md$/.test(item));
  const impact = progress.documentationImpact;
  const reconciliation = progress.documentationReconciliation;

  if (linkedBriefs.length === 0) {
    if (
      !reconciliation ||
      reconciliation.mode !== "not-applicable" ||
      reconciliation.result !== "not-applicable" ||
      typeof reconciliation.rationale !== "string" ||
      reconciliation.rationale.trim().length === 0
    ) {
      errors.push(
        `${changeId}: requirementless work ready for verification requires documentationReconciliation not-applicable with rationale.`,
      );
    }
    return;
  }

  if (!impact || typeof impact !== "object" || Array.isArray(impact)) {
    errors.push(`${changeId}: linked product work requires a documentationImpact planning record.`);
    return;
  }
  if (!linkedBriefs.includes(impact.requirementBrief)) {
    errors.push(`${changeId}: documentationImpact.requirementBrief must match the linked planning brief.`);
  }
  if (!["none", "material"].includes(impact.plannedImpact)) {
    errors.push(`${changeId}: documentationImpact.plannedImpact must be none or material.`);
  }
  if (
    !Array.isArray(impact.maintainedPaths) ||
    impact.maintainedPaths.length === 0 ||
    impact.maintainedPaths.some((item) => typeof item !== "string" || !isSafeRelativePath(item))
  ) {
    errors.push(`${changeId}: documentationImpact.maintainedPaths must contain safe repository-relative paths.`);
  }
  if (!reconciliation || typeof reconciliation !== "object" || Array.isArray(reconciliation)) {
    errors.push(`${changeId}: linked product work ready for verification requires documentationReconciliation.`);
    return;
  }

  if (reconciliation.mode === "unchanged-scope") {
    if (impact.plannedImpact !== "none" || reconciliation.result !== "no-change") {
      errors.push(`${changeId}: unchanged-scope documentation reconciliation requires plannedImpact none and result no-change.`);
    }
    if (reconciliation.planningDigest !== planningDigest.digest) {
      errors.push(`${changeId}: unchanged-scope documentation reconciliation planning digest is stale.`);
    }
    if (JSON.stringify(reconciliation.comparedPaths) !== JSON.stringify(impact.maintainedPaths)) {
      errors.push(`${changeId}: unchanged-scope documentation reconciliation must compare every maintained path.`);
    }
    const touched = progress.filesChanged.filter((changedPath) =>
      (impact.maintainedPaths ?? []).some((maintainedPath) => pathTouchesMaintainedPath(changedPath, maintainedPath)),
    );
    if (touched.length > 0) {
      errors.push(`${changeId}: unchanged-scope documentation reconciliation conflicts with maintained file changes.`);
    }
    return;
  }

  if (reconciliation.mode !== "curator" || !["updated", "no-change", "not-applicable"].includes(reconciliation.result)) {
    errors.push(`${changeId}: documentationReconciliation must use unchanged-scope or a valid curator result.`);
    return;
  }
  const curatorRecord = progress.executionRecords.some(
    (record) => record?.role === "agent-requirements-curator" && record.status === "success",
  );
  if (!curatorRecord) {
    errors.push(`${changeId}: curator documentation reconciliation lacks a successful executionRecords entry.`);
  }
}

function parseRequirementBlocks(markdown) {
  const matches = [...markdown.matchAll(/^### Requirement:\s+(.+)$/gm)];
  const blocks = new Map();
  for (let index = 0; index < matches.length; index += 1) {
    const start = matches[index].index;
    const end = matches[index + 1]?.index ?? markdown.length;
    const body = markdown.slice(start, end);
    const scenarios = [...body.matchAll(/^#### Scenario:\s+(.+)$/gm)].map((match) => normalizeHeading(match[1]));
    blocks.set(normalizeHeading(matches[index][1]), { body, scenarios });
  }
  return blocks;
}

export async function validateDeltaCompatibility(root, changeId) {
  const errors = [];
  const deltaRoot = path.join(root, "openspec", "changes", changeId, "specs");
  if (!(await pathExists(deltaRoot))) return errors;
  for (const deltaPath of (await listFiles(deltaRoot, root)).filter((item) => item.endsWith(".md"))) {
    const delta = await readFile(path.join(root, ...deltaPath.split("/")), "utf8");
    const modified = extractSection(delta, "MODIFIED Requirements");
    if (modified === null) continue;
    const pathParts = deltaPath.split("/");
    const specsIndex = pathParts.lastIndexOf("specs");
    const capability = pathParts[specsIndex + 1];
    const acceptedPath = `openspec/specs/${capability}/spec.md`;
    if (!(await pathExists(path.join(root, ...acceptedPath.split("/"))))) {
      errors.push(`${changeId}: ${capability} has MODIFIED requirements but no accepted specification.`);
      continue;
    }
    const acceptedBlocks = parseRequirementBlocks(await readFile(path.join(root, ...acceptedPath.split("/")), "utf8"));
    const modifiedBlocks = parseRequirementBlocks(modified);
    for (const [requirement, block] of modifiedBlocks) {
      const accepted = acceptedBlocks.get(requirement);
      if (!accepted) {
        errors.push(`${changeId}: ${capability} MODIFIED requirement "${requirement}" does not match an accepted requirement.`);
        continue;
      }
      for (const scenario of accepted.scenarios) {
        if (!block.scenarios.includes(scenario)) {
          errors.push(`${changeId}: ${capability} requirement "${requirement}" is missing accepted scenario "${scenario}".`);
        }
      }
    }
  }
  return errors;
}

function validateVerificationRun(changeId, report, errors) {
  let run;
  try {
    run = extractJsonSection(report, "Verification Run");
  } catch (error) {
    errors.push(`${changeId}: ${error.message}`);
    return;
  }
  if (!run) {
    errors.push(`${changeId}: verify-report.md requires a Verification Run JSON block.`);
    return;
  }
  if (run.schemaVersion !== 1 || run.kind !== "HARNESS_VERIFY_RESULT_V1" || run.status !== "PASS") {
    errors.push(`${changeId}: Verification Run must be schema 1 HARNESS_VERIFY_RESULT_V1 with PASS.`);
  }
  if (!Number.isInteger(run.durationMs) || run.durationMs < 0) {
    errors.push(`${changeId}: Verification Run requires a non-negative integer durationMs.`);
  }
  if (!Array.isArray(run.gates)) {
    errors.push(`${changeId}: Verification Run gates must be an array.`);
    return;
  }
  const commands = run.gates.map((gate) => gate.command);
  const ids = run.gates.map((gate) => gate.id);
  if (
    JSON.stringify(commands) !== JSON.stringify(FINAL_GATE_COMMANDS) ||
    JSON.stringify(ids) !== JSON.stringify(FINAL_GATE_IDS)
  ) {
    errors.push(`${changeId}: Verification Run must contain each final gate exactly once in order.`);
  }
  for (const gate of run.gates) {
    if (
      gate.status !== "passed" ||
      gate.exitCode !== 0 ||
      !Number.isInteger(gate.durationMs) ||
      gate.durationMs < 0 ||
      typeof gate.summary !== "string"
    ) {
      errors.push(`${changeId}: Verification Run gate ${gate.id ?? "unknown"} is not valid PASS evidence.`);
    }
  }
}

export async function validateChangeLifecycle(root, changeId, { archiveReady = false } = {}) {
  const errors = [];
  const changeRelative = `openspec/changes/${changeId}`;
  for (const artifact of ["proposal.md", "design.md", "tasks.md"]) {
    if (!(await pathExists(path.join(root, changeRelative, artifact)))) errors.push(`${changeId}: missing required artifact ${artifact}.`);
  }
  const specsDirectory = path.join(root, changeRelative, "specs");
  if (
    !(await pathExists(specsDirectory)) ||
    (await listFiles(specsDirectory)).filter((file) => file.endsWith(".md")).length === 0
  ) {
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
  try {
    progress = parseProgress(await readFile(progressPath, "utf8"));
    if (progress.assuranceProfile === "no-change") {
      errors.push(`${changeId}: assuranceProfile no-change must not use an active implementation lifecycle.`);
    }
    compareTaskIds(progress.completedTaskIds, completed, `${changeId}: completedTaskIds`, errors);
    compareTaskIds(progress.remainingTaskIds, pending, `${changeId}: remainingTaskIds`, errors);
    const planningDigest = await createPlanningDigest(root, changeId);
    validateApprovalCheckpoint(changeId, progress, planningDigest, errors);
    validateOwnershipEvidence(changeId, tasks, progress, errors);
    if (
      progress.assuranceProfile === "high-risk" &&
      !progress.ownershipPlan?.requiredRoles?.includes("agent-verifier")
    ) {
      errors.push(`${changeId}: high-risk ownershipPlan requires agent-verifier.`);
    }
    validateDocumentationEvidence(changeId, progress, planningDigest, errors);
    if (archiveReady && progress.status !== "ready-for-archive") {
      errors.push(`${changeId}: archive readiness requires progress status ready-for-archive.`);
    }
  } catch (error) {
    errors.push(`${changeId}: ${error.message}`);
    return errors;
  }
  if (!archiveReady) return errors;
  if (!reportExists) {
    errors.push(`${changeId}: verify-report.md is required for archive readiness.`);
    return errors;
  }
  const report = await readFile(reportPath, "utf8");
  const verdict = parseVerdict(report);
  if (verdict !== "PASS") errors.push(`${changeId}: verify-report.md verdict must be PASS, received ${verdict ?? "missing"}.`);
  validateVerificationRun(changeId, report, errors);
  try {
    const recordedSnapshot = extractJsonSection(report, "Evidence Snapshot");
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
  const runnerSource = await readRequired(root, "scripts/run-verification.mjs", manifestErrors);
  if (manifestContent !== null) {
    try {
      manifestErrors.push(...validateVerificationScripts(JSON.parse(manifestContent), runnerSource ?? ""));
    } catch (error) {
      manifestErrors.push(`package.json: invalid JSON: ${error.message}.`);
    }
  }
  const errors = [
    ...validateOpenSpecVersion(openSpecVersionOutput),
    ...manifestErrors,
    ...(await validateLocalSkillIntegration(root)),
    ...(await validateGuidance(root)),
    ...(await validateRuntimeAdapters(root)),
    ...(await validateContextBudgets(root)),
  ];
  for (const changeId of await listActiveChanges(root)) {
    errors.push(...(await validateDeltaCompatibility(root, changeId)));
    errors.push(...(await validateChangeLifecycle(root, changeId)));
  }
  return errors;
}

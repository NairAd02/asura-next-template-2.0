## Why

The harness is reliable and fail-closed, but it applies heavyweight
coordination and duplicate evidence to work whose accepted-contract risk is
small. Repository measurements show that final gates normally take about
80-105 seconds, while repeated planning reads, verbose inline handoffs,
duplicated progress records, unconditional reconciliation, and replaying gates
for timing can turn a roughly 10-minute task into a 30-minute workflow.

This is requirementless technical-governance work. It changes the accepted
development workflow and template verification interface, not product
behavior, so no requirement brief applies.

## What Changes

- Classify work by accepted-contract impact: `no-change`,
  `standard-change`, or `high-risk`, with explicit rules for defects that
  restore already accepted behavior.
- Keep the full OpenSpec, approval, verification, snapshot, and archive path
  for accepted-contract changes while allowing contract-preserving work to use
  the existing `no-change` path with scoped checks.
- Consolidate normative governance and shorten root/executor bootstrap context;
  replace duplicated code examples in domain skills with focused rules and
  lazy references to `.agent/reference/widget/`.
- Bind the Implementation Approval Packet to a deterministic planning digest
  so unchanged artifacts do not require a second packet in the same
  conversation or execution context.
- Upgrade progress and handoff evidence so planned ownership and actual
  execution are recorded once in structured form. Inline work uses a compact
  execution record; subagent and fallback work retain lifecycle, budget, and
  recovery evidence.
- Make final verification risk-proportional while preserving an independent
  verifier for high-risk changes and when explicitly requested.
- Replace the shell-chain `pnpm verify` implementation with one dependency-free
  timed runner that executes every existing final gate once, sequentially,
  reports per-gate commands, exit codes, durations, and summaries, and remains
  fail-fast.
- Add a pre-verification compatibility check for modified accepted requirement
  and scenario identities so native archive incompatibilities are detected
  before expensive final gates.
- Make final documentation reconciliation conditional on documented scope or
  maintained-document impact. An unchanged scope records a structured no-op;
  material impact still requires the bounded curator handoff before final
  verification.
- Update validator fixtures, runtime guidance, local OpenSpec overlays, and
  operator/developer documentation to enforce the optimized contract without
  weakening terminal archive readiness.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `workflow`: Introduce accepted-contract assurance profiles, digest-bound
  approval reuse, compact single-source execution evidence, conditional
  documentation reconciliation, and risk-proportional independent
  verification.
- `template-quality-baseline`: Preserve the same complete final gates while
  executing and timing them exactly once through a structured verification
  runner.

## Impact

- **Governance:** `AGENTS.md`, `.agent/` contracts, roles, registry, runtime
  adapters, lifecycle/progress/verification skills, and applicable domain
  skills.
- **OpenSpec integration:** local propose/apply/update/archive overlays and the
  accepted `workflow` contract.
- **Validation and commands:** `package.json`,
  `scripts/harness-validation.mjs`,
  `scripts/harness-validation.test.mjs`, and a new dependency-free timed
  verification runner.
- **Documentation:** `README.md` and `harness-docs/` material affected by the
  optimized operator flow.
- **Compatibility:** active progress advances to a new schema; archived
  evidence remains immutable. The public `pnpm verify` command, final gate set,
  non-incremental typecheck, full lint, production build, SHA-256 freshness,
  and native archive interface remain supported.
- **Dependencies:** no new package dependency or external service.

## Success Criteria

- A warm `pnpm verify:fast` remains provisional and continues to pass.
- `pnpm verify` executes each required final gate exactly once and emits
  machine-readable per-gate evidence from that single run.
- A normal successful final run stays near the measured 80-110 second range
  rather than requiring an additional diagnostic replay.
- Contract-preserving defects and small internal work can complete through a
  mechanically defined `no-change` lane without proposal, progress, packet, or
  report artifacts.
- Standard single-writer changes may use compact inline execution evidence;
  high-risk changes retain independent verification and full delegated
  evidence.
- Planning-digest mismatch blocks reuse of an earlier approval packet.
- Modified accepted requirement/scenario incompatibility fails before final
  lint, typecheck, and build.
- The typical full UI executor skill payload and the root bootstrap payload are
  materially smaller while all normative rules and reference paths remain
  available.
- Strict archive readiness remains fail-closed for incomplete tasks, invalid
  approval, incoherent execution evidence, FAIL/stale verification, or unsafe
  archive integration.

## Non-Goals

- Removing OpenSpec for accepted-contract changes.
- Weakening final typecheck, lint, unit/component tests, build, snapshot
  freshness, or native archive validation.
- Introducing per-gate selective PASS reuse after covered files change.
- Adding CI, browser automation, a second state engine, telemetry service,
  package dependency, or runtime-specific process supervisor.
- Rewriting product modules or changing application behavior.

## Dependencies and Open Questions

- Depends on OpenSpec 1.6.0, Node.js, pnpm, and the existing validator/test
  infrastructure.
- The progress schema migration only applies to active changes. There are no
  other active changes at proposal time.
- Open questions: none blocking. Exact compact field names and size thresholds
  are design details, provided they remain mechanically validated and preserve
  the guarantees above.

## Rollback Strategy

Revert the governance, local overlays, progress schema, validator fixtures,
verification runner, package scripts, and documentation together. Restore the
current schema-v2 delegation/handoff evidence and shell-chain `pnpm verify`.
No product data, API, dependency, or runtime migration requires rollback.

# .agent Harness

`.agent` is the portable technical-governance layer in:

`docs -> OpenSpec -> .agent -> implementation -> verification -> archive`

OpenSpec owns executable state/accepted behavior. `tasks.md` owns completion.
Schema-v3 `apply-progress.md` stores digest-bound approval, role ownership, and
compact execution records. `verify-report.md` stores the single final runner
and SHA-256 snapshot.

Core sources:

- `AGENTS.md`: root versus `HARNESS_EXECUTOR_V1` bootstrap.
- `skills/spec-driven-development/`: lifecycle and assurance profiles.
- `skill-registry.md`: lazy exact skill routing.
- `contracts/phase-handoff.md`: portable bounded input/output.
- `agents/`: role boundaries.
- `runtime-adapters/`: native lifecycle mappings.
- `reference/`: lazy examples, never executable specs.

Profiles are `no-change`, `standard-change`, and `high-risk`. No-change work
uses scoped evidence without change artifacts. Implemented changes bind
operator approval to a deterministic planning digest. Ownership may run
`inline` or `subagent`; only failed planned subagents use
`runtime-fallback`. Inline records omit subagent budgets/milestones.

Final verification is exactly one timed `pnpm verify` after files freeze.
Archive remains fail-closed and native.

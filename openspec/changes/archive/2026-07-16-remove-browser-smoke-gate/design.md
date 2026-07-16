## Context

The Vitest rollout moved deterministic supplier behavior out of the browser and made `pnpm verify` a reproducible five-gate command. Current accepted specs and governance still condition final PASS on a manual browser smoke for integration or visual risk, even though neither the command nor the mechanical archive validator executes or detects that smoke.

This is a cross-cutting documentation and accepted-contract change. It affects no production route, API, dependency, test configuration, or validator algorithm.

## Goals / Non-Goals

**Goals:**

- Make the deterministic `pnpm verify` aggregate the sole mandatory technical final gate.
- Keep focused Vitest/Testing Library coverage owned by the implementation executor.
- Preserve fail-closed evidence freshness and archive readiness after any covered edit.
- Make human browser exploration explicitly optional and separate from OpenSpec completion evidence.

**Non-Goals:**

- Proving responsive composition, hydration, or provider wiring with a browser substitute.
- Adding E2E tooling, browser binaries, CI, visual snapshots, new commands, or coverage thresholds.
- Rewriting archived changes or the historical REQ-005 requirement brief.

## Decisions

### 1. `pnpm verify` is the complete closure interface

The final interface remains `pnpm verify`, which already runs specification/harness validation, Vitest, non-incremental typechecking, full lint, and production build. PASS, snapshot generation, and strict archive readiness rely only on this command and change-artifact reconciliation.

Alternative: add a separate automated browser command. Rejected because the requested policy is no browser gate and it would add tooling, runtime, and orchestration complexity.

### 2. Browser work is out-of-band diagnostic activity

An operator may inspect the application in a browser after implementation or archive, but that activity is neither a task, a verification-report section, nor an invalidation condition. If it reveals a defect, the defect starts a new iteration with focused automated regression coverage where possible.

Alternative: retain a risk-selected exception. Rejected because it preserves the non-deterministic archive blocker the change removes.

### 3. Preserve deterministic behavior ownership

The behavior-testing guidance continues to require the lowest-cost focused Vitest or Testing Library test for deterministic data, state, validation, URL, or local component behavior. The verifier reports failures rather than repairing implementation code.

### 4. Keep existing validation infrastructure unchanged

The package scripts and harness validator already encode the desired automated gate composition and reject heavyweight browser frameworks. Contract and guidance text change; no validator rule is added for the absence of optional manual activity.

## Risks / Trade-offs

- [Real runtime composition is not a final gate] -> Vitest, typecheck, lint, and build remain mandatory; human exploration can diagnose residual issues and any discovered defect is handled in a new change.
- [Guidance diverges from accepted specs] -> Update the complete workflow and suppliers requirement blocks, all active verification skills/roles, and operator-facing guidance in one change.
- [Archived history is rewritten] -> Leave archived REQ-005 and its archived OpenSpec artifacts untouched; describe the superseding policy only in this new change and accepted specs.

## Migration Plan

1. Add the OpenSpec deltas and technical proposal/design/tasks.
2. Update active governance, agent roles, and public guides to remove browser-gate language.
3. Verify via `pnpm validate:specs` and `pnpm verify` without opening a browser.
4. Generate final automated evidence and archive under the normal fail-closed process.

Rollback restores the removed accepted requirements and matching guidance; no data or dependency migration is needed.

## Open Questions

None.

## Responsibility and Skills

- Orchestrator (inline): `.agent/skills/spec-driven-development/SKILL.md`, `.agent/skills/implementation-progress/SKILL.md`.
- Verification-policy implementation (inline bounded role): `.agent/skills/behavior-testing/SKILL.md`, `.agent/skills/verification-harness/SKILL.md`, `.agent/skills/implementation-progress/SKILL.md`.
- Final verifier: `.agent/skills/verification-harness/SKILL.md`, `.agent/skills/implementation-progress/SKILL.md`.

All role transitions use `.agent/contracts/phase-handoff.md`; no executor redelegates.

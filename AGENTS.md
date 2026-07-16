# Codex Harness Entry Point

Before any task action, read these exact files in order:

1. .agent/skills/spec-driven-development/SKILL.md
2. .agent/skill-registry.md
3. .agent/agents/orchestrator.md

Then classify the task:

- Broad, ambiguous, or product intent: curate a requirement brief.
- Ready behavior change: create or update an OpenSpec change.
- Named active change: recover from OpenSpec status, tasks.md, and apply-progress.md.
- Refactor, documentation, or internal work without an accepted-contract change: use .agent; OpenSpec is optional and no requirement brief is forced.
- Close request: verify evidence and archive readiness.

For an active change, treat OpenSpec as the only executable state authority:

- Before apply: run openspec status --change <id> --json and openspec instructions apply --change <id> --json.
- Before verify or archive: run openspec status --change <id> --json.
- OpenSpec 1.6 exposes no instructions verify or archive artifact. Do not invent a second state engine.
- For `no-change` work, run applicable checks without change status, apply-progress.md, or verify-report.md.

Resolve only the exact skill paths needed from .agent/skill-registry.md. Every specialized handoff must use .agent/contracts/phase-handoff.md. Executors do not redelegate.

Before implementation, create a delegation plan for every implemented OpenSpec change. If tasks touch more than one registry owner, both data and UI roots, visible text plus behavior, a module workflow, or final verification, assign owner-tagged tasks to the relevant roles and use subagents when available. If subagents are unavailable, perform the relevant role inline with the same allowed roots and responsibilities, record `inline-fallback`, and include the concrete fallback reason in apply-progress.md. Do not silently implement specialized work in the orchestrator thread.

Do not apply until the required proposal, specs, design, tasks, and requirement brief when applicable have been reread and shown to be coherent, reachable, and free of blocking questions.

Archive is fail-closed: finalize tasks/progress, run the four gates, create PASS evidence with a fresh SHA-256 snapshot, run strict readiness, invoke `openspec archive <id> --yes --json`, update the linked requirement/index, and validate accepted specs. Confirmation and pre-existing failures never bypass readiness.

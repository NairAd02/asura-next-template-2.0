# Codex Native Adapter

This adapter maps the portable contract to native local Codex subagents in the
desktop app, CLI, and IDE extension.

## Registration and Discovery

- Project settings live in `.codex/config.toml`.
- Each native custom agent is one `.codex/agents/*.toml` file.
- The TOML is a thin runtime adapter: its `developer_instructions` points to
  the portable phase-handoff and role profile rather than duplicating them.
- Models inherit from the parent. The adapter supplies role-appropriate
  `model_reasoning_effort` and `workspace-write`; the handoff retains
  per-subtree ownership because the native sandbox is not an artifact-owner
  system.
- A Codex client that opened the repository before these files existed may not
  rediscover them in the current thread. Open a new chat or reload/restart the
  IDE extension if a named agent is absent. The portable handoff remains valid
  and a native default subagent can execute it in the current session.

## Native Operation Mapping

| Portable operation | Codex native behavior |
|---|---|
| Spawn | Start a native subagent with the named custom agent when discovered and pass the complete `HARNESS_EXECUTOR_V1` handoff. |
| Activity/status | Inspect the IDE background-agent panel, CLI `/agent`, or native thread status. A running status is evidence to continue observing. |
| Steering | Send a bounded clarification/follow-up to the same agent thread; do not create a replacement writer. |
| Wait | Use native wait/status observation in short UI-friendly intervals while enforcing the task budget separately. A yielded wait is not a timeout. |
| Interrupt | Stop the native thread only for a portable early-stop condition or after budget plus bounded recovery. |
| Completion | Consume the native final result and persist its complete phase-handoff output in `apply-progress.md`. |

Codex activity/tool traces can support a milestone only when the event is
observable. A successful spawn supports `started`; required-file reads or an
agent report may support `context-loaded`; a bounded advisory result supports
`recommendation-ready`; inspected writes support `artifact-written`; native
terminal output supports `completed` or `blocked`.

## Operational Rules

- Current local Codex clients enable subagents by default; this repository also
  sets `agents.enabled = true` and caps open spawned threads at four.
- Subagents inherit the parent turn's live permission mode. Custom agent files
  can set defaults but do not override a live parent permission selection.
- Prefer native subagents for interactive app/IDE/CLI work. Do not launch
  `codex exec` as a child supervisor; that would create a separate
  non-interactive permission, logging, and session boundary.
- Do not interrupt merely because one or more 30/60-second waits yield no final
  response.
- Before retry/takeover, interrupt and confirm the old writer stopped. At most
  one recovery is allowed.

## Named Project Agents

- `agent-architect`: bounded architecture advice or explicit design authorship.
- `agent-data`: bounded data-layer implementation.
- `agent-ui`: bounded UI implementation.
- `agent-requirements-curator`: documentation/requirement curation.
- `agent-verifier`: independent final verification and evidence.

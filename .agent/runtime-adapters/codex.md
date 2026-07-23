# Codex Native Adapter

Project registration lives in `.codex/config.toml` and thin
`.codex/agents/*.toml` files. Each custom agent points to the portable handoff
and role instead of copying policy. Models inherit; role files set reasoning
effort and workspace-write, while exclusive ownership remains a harness rule.

| Portable operation | Native mapping |
|---|---|
| Spawn | Start the named native subagent with the complete `HARNESS_EXECUTOR_V1` handoff. |
| Activity | Inspect native thread/background-agent status. |
| Steer | Follow up in the same thread; do not create a replacement writer. |
| Wait | Observe in short intervals; budget is tracked separately. |
| Interrupt | Stop only for a terminal condition or post-budget recovery. |
| Complete | Consume the final result and merge it into schema-v3 `executionRecords`. |

Only observable activity supports milestones. A successful spawn supports
`started`; verified reads may support `context-loaded`; inspected writes
support `artifact-written`; terminal output supports `completed`/`blocked`.

Interactive Codex must use native subagents, never child `codex exec`.
Subagents inherit the live parent permission mode. If project agents are not
discovered after repository changes, reload/open a new session or use a native
default subagent with the same bounded contract.

Do not interrupt on empty waits. After the subagent budget, allow one recovery,
then stop and confirm the old writer before `runtime-fallback`. Assurance
profile and ownership plan are fixed by the root, not the adapter.

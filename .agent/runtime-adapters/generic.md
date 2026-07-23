# Generic Runtime Adapter

Map native capabilities for root/executor identity, role selection, spawn,
activity, steering, non-deadline waits, interruption plus terminal
confirmation, completion capture, permission inheritance, and exclusive
writers.

Every executor still receives `HARNESS_EXECUTOR_V1`, assurance profile, role,
task/change, roots, exact skills, planned mode, and exclusive artifacts.
Subagent assignments additionally receive budget/milestones.

When subagents are unavailable before planning, select `inline`; this is not
failure. Use `runtime-fallback` only when a planned subagent becomes unusable
after its budget, one bounded recovery, and confirmed terminal prior writer.
If intermediate activity is invisible, record only final observable
milestones.

Vendor-specific controls do not redefine OpenSpec state, tasks, ownership,
approval digest, or schema-v3 execution evidence.

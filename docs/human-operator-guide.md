# Human Operator Guide

This guide explains how to use this repository's hybrid OpenSpec + `.agent`
workflow from the perspective of the human piloting development in an editor
with Codex.

## Mental Model

You steer intent and decisions. Codex does the mechanical work.

- `docs/project-context.md` is where you write broad product knowledge.
- `docs/requirements/` is the curated queue of candidate requirements.
- `openspec/changes/<change-id>/` is the active executable change.
- `openspec/specs/` is the accepted behavior after archive.
- `.agent/` is the technical rulebook Codex must follow while planning,
  implementing, and verifying.

Use this phrase whenever you want the full workflow:

```text
Use the OpenSpec + .agent workflow.
```

## Your Responsibilities

- Write or update product context.
- Review requirement briefs for product correctness.
- Choose which requirement to build next.
- Review OpenSpec proposal, specs, design, and tasks before implementation.
- Approve or correct scope when Codex finds ambiguity.
- Decide when a change is ready to archive.

You usually do not need to hand-run OpenSpec commands. Codex can run them, but
you may use the terminal when you want direct visibility.

## Step-by-Step Workflow

### 1. Update the project context

Edit:

```text
docs/project-context.md
```

Put broad knowledge there:

- product vision;
- actors and roles;
- business rules;
- main flows;
- data model notes;
- architecture direction;
- functional requirements;
- non-functional requirements;
- open questions.

Do not try to make this document perfect. It is source material, not the final
spec.

### 2. Ask Codex to curate requirements

Prompt Codex:

```text
Use the OpenSpec + .agent workflow.
Read docs/project-context.md and extract candidate requirements.
Create or update docs/requirements/ with clear requirement briefs.
Update docs/requirements/index.md.
Do not create an OpenSpec change yet.
```

Codex should produce or update:

```text
docs/requirements/index.md
docs/requirements/<requirement-kebab>/brief.md
```

Review each brief and check:

- Is the intent correct?
- Is the scope small enough for one focused change?
- Are actors and permissions clear?
- Are important rules and constraints captured?
- Are open questions preserved instead of guessed?
- Is there a suggested `change-id`?

If the brief is wrong, correct it through Codex:

```text
Refine REQ-00X:
- split <large topic> into two requirements;
- mark <question> as open;
- remove <out-of-scope behavior>;
- keep this as candidate, not OpenSpec yet.
```

### 3. Select one requirement to build

When a brief is ready, choose it explicitly:

```text
Use the OpenSpec + .agent workflow.
I want to develop REQ-00X.
Create the OpenSpec change from docs/requirements/<requirement>/brief.md.
Use the suggested change-id.
Create proposal, specs, design, and tasks.
Do not implement yet.
```

Codex should create:

```text
openspec/changes/<change-id>/proposal.md
openspec/changes/<change-id>/design.md
openspec/changes/<change-id>/tasks.md
openspec/changes/<change-id>/specs/<domain>/spec.md
```

### 4. Review the OpenSpec change

Before implementation, review these files in the editor:

- `proposal.md`: confirms why this change exists and what changes.
- `spec.md`: defines behavior and scenarios.
- `design.md`: explains the technical approach.
- `tasks.md`: lists implementation steps.

Use this checklist:

- Does the proposal match your actual intent?
- Are non-goals clear?
- Are scenarios testable?
- Does design follow your expected architecture?
- Does it respect `.agent` conventions?
- Are tasks small and checkable?
- Is anything missing before implementation?

If you need changes, prompt Codex:

```text
Update the OpenSpec change <change-id> before implementation:
- <correction 1>
- <correction 2>
- <correction 3>
Keep proposal, specs, design, and tasks in sync.
Do not implement yet.
```

### 5. Approve implementation

Once the OpenSpec artifacts are correct:

```text
Use the OpenSpec + .agent workflow.
Implement openspec/changes/<change-id>/tasks.md.
Follow the applicable .agent skills for architecture, data, UI, forms, filters,
i18n, SSR, and verification.
If implementation discovers scope or behavior changes, update the OpenSpec
artifacts before continuing.
```

Codex should now edit code and task checkboxes.

### 6. Handle discoveries during implementation

If you or Codex discover a missing rule, do not patch only the code. Update the
change first.

Prompt:

```text
Update the OpenSpec change <change-id>:
<new decision or rule>.
Update specs, design, and tasks, then continue implementation.
```

Examples:

```text
Update the OpenSpec change add-customers:
customers must be deactivated, not hard-deleted.
Update specs, design, and tasks, then continue implementation.
```

```text
Update the OpenSpec change add-reporting-dashboard:
Viewer can see aggregate charts but cannot drill down into record-level data.
Update specs, design, and tasks, then continue implementation.
```

### 7. Ask Codex to verify

Prompt:

```text
Run the full verification for <change-id>.
Validate OpenSpec, then run typecheck, lint, and build.
Classify failures as new or preexisting.
Fix any new failures.
```

Expected gates:

```bash
openspec validate --all --json
pnpm tsc --noEmit
pnpm lint
pnpm build
```

You can also run these commands yourself from the terminal when you want.

### 8. Archive the completed change

When implementation and verification are complete:

```text
Archive the OpenSpec change <change-id>.
Update the linked requirement brief to implemented.
Link the archived change and accepted spec.
```

Expected result:

```text
openspec/specs/<domain>/spec.md
openspec/changes/archive/<date>-<change-id>/
docs/requirements/<requirement>/brief.md
docs/requirements/index.md
```

## Common Prompts

Extract requirements:

```text
Use the OpenSpec + .agent workflow.
Read docs/project-context.md and extract candidate requirements.
Create or update docs/requirements/ and docs/requirements/index.md.
Do not create OpenSpec changes yet.
```

Create a change:

```text
Use the OpenSpec + .agent workflow.
Create an OpenSpec change for REQ-00X from docs/requirements/<requirement>/brief.md.
Create proposal, specs, design, and tasks.
Do not implement yet.
```

Revise a change:

```text
Update OpenSpec change <change-id>:
- <change>
- <change>
Keep proposal, specs, design, and tasks in sync.
Do not implement yet.
```

Implement:

```text
Implement openspec/changes/<change-id>/tasks.md following .agent.
Update OpenSpec artifacts first if scope or behavior changes.
```

Verify:

```text
Run full verification for <change-id>: OpenSpec validation, typecheck, lint, and build.
Fix new failures and report preexisting ones.
```

Archive:

```text
Archive OpenSpec change <change-id> and mark the linked requirement as implemented.
```

## When To Use The Terminal

Use the terminal when you want quick visibility:

```bash
openspec list
openspec list --specs
openspec validate --all --json
pnpm lint
pnpm build
```

Let Codex run commands when the output needs interpretation or follow-up fixes.

## Good Habits

- Keep `docs/project-context.md` broad and honest.
- Keep requirement briefs small enough to become one OpenSpec change.
- Review OpenSpec artifacts before coding.
- Never let behavior changes live only in code.
- Use `/opsx:update` or ask Codex to update OpenSpec when scope changes.
- Archive completed changes so `openspec/specs/` stays current.
- Treat `.agent` as the project's technical rulebook, not as a product backlog.

## Anti-Patterns

- Implementing directly from a vague idea.
- Skipping requirement briefs for large or ambiguous work.
- Creating one huge OpenSpec change for unrelated features.
- Changing code without updating OpenSpec when behavior changes.
- Leaving completed changes unarchived.
- Treating `docs/project-context.md` as the final spec.

## Recommended Human Loop

```text
Write context -> curate requirements -> choose one -> create OpenSpec change
-> review artifacts -> implement -> verify -> archive -> repeat
```


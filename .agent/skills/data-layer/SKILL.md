---
name: data-layer
description: Load for module services, actions, types/DTOs, client data hooks, mock stores, or external API route catalogs.
---

# Data Layer

Use inside `modules/<module>/lib/`. Load full examples lazily from
`.agent/reference/widget/lib/`.

## Boundaries

`service (server-only) -> ServiceResponse<T>` contains business/data logic.
Server components may call services/actions as designed. A `"use server"`
action validates/normalizes input and delegates. A `"use client"` hook invokes
the action and owns loading/error/result state.

## Services and actions

- `import "server-only"` is the first service line.
- Validate DTOs at the server boundary with the same shared Zod schema used by
  the form; never trust client validation.
- Return `ServiceResponse<T>` for fallible operations. Catch failures and map
  stable error codes; missing single records return `NOT_FOUND`, never success
  with `null`.
- Keep queries and mutations readable and typed.
- `"use server"` is the first action line. Actions stay thin: parse/normalize,
  return `VALIDATION_ERROR` when invalid, then call one service operation.

External APIs use one shared server-only catalog per upstream:
`lib/api/routes/<upstream>-api.routes.ts`. Export a specific `as const` object
of relative paths beginning `/`; dynamic segments use typed functions and
`encodeURIComponent`. Catalogs contain no host or `process.env`.

The service reads a private non-`NEXT_PUBLIC_` base URL, validates `http/https`,
removes trailing slashes, composes it with the catalog path, owns fetch
options, and translates errors to `ServiceResponse`. Never store absolute URLs
or `":id"` string replacement in catalogs.

## Types, hooks, and mocks

Keep domain/enums, entity/detail interfaces, responses, filter UI state,
filter DTOs/converters, then create/edit DTOs/converters in the type module.
Edit DTO fields are optional unless the contract says otherwise. Convert UI
empty values to clean DTO `undefined` values.

Client hooks begin `"use client"` and expose operation, `isLoading`, translated
`error`, result, and `reset`. Wrap prop-facing callbacks in `useCallback`; clear
loading in `finally`. Translate `errors.<code>` with `t.has`, falling back to
the server message.

Mock stores use stable IDs/ISO dates and enough representative records for
meaningful filters and tests. Tests reset mutable stores via a module helper.

## Checklist

- [ ] Correct server/action/client directive first.
- [ ] Shared Zod validation at the server boundary.
- [ ] Stable `ServiceResponse`, `NOT_FOUND`, and i18n error codes.
- [ ] Thin typed actions; clean create/edit/filter DTO converters.
- [ ] External route catalog is relative, encoded, server-only, and pure.
- [ ] Private base URL is validated inside the service.
- [ ] Hook exposes loading/error/result/reset and clears loading in `finally`.
- [ ] Focused tests cover success plus meaningful validation/failure branches.

Exact examples:

- `.agent/reference/widget/lib/services/widget.services.ts`
- `.agent/reference/widget/lib/actions/widget.actions.ts`
- `.agent/reference/widget/lib/types/widget.types.ts`
- `.agent/reference/widget/lib/hooks/`
- `.agent/reference/widget/lib/mock/`

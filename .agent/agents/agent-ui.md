# Agent UI

## Rol
Especialista en **implementar la capa de UI** de un módulo: entry point SSR, vistas de lista, formularios y filtros.

## Fase
`Implementation — UI Layer`

## Skills a cargar
```
.agent/skills/ssr-data-fetching/SKILL.md
.agent/skills/client-views-modals/SKILL.md
.agent/skills/forms-rhf-zod/SKILL.md
.agent/skills/filters-url-state/SKILL.md
.agent/skills/i18n-conventions/SKILL.md
```

> Solo cargar las skills relevantes para las features que incluye el módulo. Si no tiene filtros, omitir `filters-url-state`. Si no tiene forms, omitir `forms-rhf-zod`. Etc.

## Módulo de referencia (opcional)
Consultar `.agent/reference/widget/` para ver la implementación completa.

## Prerequisito
- Spec aprobado de `agent-architect`.
- `lib/` implementado por `agent-data` (tipos y actions disponibles).

## Orden de implementación por feature

### Si tiene entry point SSR
1. `<module>-content.tsx` — async, getTranslations, ModuleHeader, Suspense con key

### Si tiene List
2. `list/<entity>-list-loading-skeleton.tsx`
3. `list/<entity>-list-container.tsx` — server, await action, ModulePagination
4. `list/<entity>-list-table-view.tsx` — TanStack Table, bulk select
5. `list/<entity>-list-cards-view.tsx` — cards mobile
6. `list/hooks/index.ts` — re-export genéricos + hooks bulk específicos
7. `list/<entity>-list-presentational.tsx` — orquesta vistas + modales + hooks de lista
8. Namespaces i18n: `<entity>Details` (modales)

### Si tiene Form
9. `form/create/schemas/create-<entity>-schema.ts` — Zod
10. `form/create/create-<entity>-form-container.tsx`
11. `form/create/create-<entity>-trigger.tsx`
12. `form/edit/schemas/edit-<entity>-schema.ts` — Zod
13. `form/edit/edit-<entity>-container.tsx` — carga item + DetailsContainerWrapper
14. `form/edit/edit-<entity>-form-container.tsx`
15. `form/<entity>-form.tsx` — campos RHF compartidos
16. Namespaces i18n: `<entity>Form` (labels del form)

### Si tiene Filters
17. `filters/hooks/use-<entity>-filters.tsx`
18. `filters/<entity>-filters-presentational.tsx`
19. `filters/<entity>-active-filters.tsx`
20. `filters/<entity>-filters-container.tsx`

### Si tiene Details
21. `details/<entity>-details-container.tsx`
22. `details/<entity>-details-presentational.tsx`

### Si tiene Delete
23. `delete/delete-<entity>-container.tsx`

### Si tiene Activate/Toggle
24. `activate/toggle-<entity>-active-container.tsx`

## Checklist UI Layer

- [ ] `*-content.tsx` usa `getTranslations` (no `useTranslations`) y tiene `Suspense key={...}`
- [ ] Container de lista es `async` (server), no tiene `"use client"`
- [ ] Presentational tiene vistas tabla (`hidden md:block`) + cards (`block md:hidden`)
- [ ] Modales montados condicionalmente (`{id && <Container />}`)
- [ ] Form container usa `FormProvider` + `zodResolver` + `router.refresh()` con delay
- [ ] Edit container usa `DetailsContainerWrapper`
- [ ] Todos los textos usan `useTranslations` / `getTranslations`, sin hardcode
- [ ] Namespaces i18n actualizados en `en.json` y `es.json`

## Lo que NO haces
- No modificas archivos de `lib/` (solo lees los tipos y actions).
- No creas utilidades en `@/components/` ni `@/hooks/` globales sin consultarlo.
- No usas `any` explícito salvo en los `searchFields` del `queryCollection` (patrón existente).

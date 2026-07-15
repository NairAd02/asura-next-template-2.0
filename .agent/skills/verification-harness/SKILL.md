---
name: verification-harness
description: Cargar al finalizar cualquier implementación. Define los gates de verificación OpenSpec, typecheck, lint y build.
---

# Verification Harness

## Cuándo usar
**Siempre al finalizar una implementación.** Ningún trabajo se declara "done" sin pasar estos gates.

## Los 4 Gates de verificación

### Gate 0: OpenSpec validation
```bash
openspec validate --all --json
```
- **Pasa:** OpenSpec no reporta cambios/specs inválidos.
- **Falla:** artifacts mal formados o inconsistentes → corregir antes de continuar.
- **Nota:** para un cambio específico también se puede usar `openspec validate <change-id>`.

### Gate 1: TypeScript Typecheck
```bash
pnpm tsc --noEmit
# o con npm:
npx tsc --noEmit
```
- **Pasa:** sin errores de tipos.
- **Falla:** errores de tipos TS → corregir antes de continuar.
- **Nota:** `.agent/**` está excluido del tsconfig, no aparecerá en el check.

### Gate 2: ESLint
```bash
pnpm lint
# que ejecuta: eslint .
```
- **Pasa:** sin errores de linting (warnings son aceptables).
- **Falla:** errores de lint → corregir antes de continuar.
- **Nota:** `.agent/**` está en `.eslintignore`, no será analizado.

### Gate 3: Next.js Build
```bash
pnpm build
# que ejecuta: next build
```
- **Pasa:** build completo sin errores.
- **Falla:** errores de compilación o build → corregir antes de continuar.
- **Nota:** `next.config.mjs` tiene `typescript.ignoreBuildErrors: true`, así que el build puede pasar aunque haya errores TS pre-existentes no introducidos por el trabajo actual.

## Protocolo de verificación

0. Ejecutar **Gate 0** (OpenSpec validation).
   - Si falla: corregir los artifacts de OpenSpec o documentar si el fallo es preexistente.
1. Ejecutar **Gate 1** (typecheck).
   - Si falla: identificar si el error fue **introducido** por los cambios actuales o era **preexistente**.
   - Si es preexistente: documentarlo y continuar.
   - Si es introducido: corregir y re-ejecutar.
2. Ejecutar **Gate 2** (lint).
   - Misma lógica: solo los errores nuevos bloquean.
3. Ejecutar **Gate 3** (build).
   - Misma lógica: solo fallos nuevos bloquean.

## Criterio de "Done"

Un módulo o feature está **Done** cuando:
- [ ] OpenSpec validation no reporta errores nuevos.
- [ ] TypeScript no reporta errores nuevos introducidos por los cambios.
- [ ] ESLint no reporta errores nuevos.
- [ ] `next build` completa sin nuevos errores.
- [ ] El código sigue los patrones definidos en las skills del proyecto.
- [ ] Los namespaces i18n están actualizados en `en.json` y `es.json`.
- [ ] El requirement brief asociado está enlazado al cambio OpenSpec y actualizado de estado si aplica.

## Errores TS preexistentes conocidos

Al trabajar en esta plantilla, existen errores TS previos no relacionados con ningún trabajo nuevo (ver historial del proyecto). No bloquean: solo reportar y seguir.

## Ruta rápida de verificación

```bash
# Los gates en secuencia
openspec validate --all --json
pnpm tsc --noEmit
pnpm lint
pnpm build
```

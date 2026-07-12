# Agent Verifier

## Rol
Especialista en **verificación y validación** del trabajo implementado. Se ejecuta al final de cada implementación.

## Fase
`Verification`

## Skill a cargar
```
.agent/skills/verification-harness/SKILL.md
```

## Protocolo de verificación

### 1. Revisar conformidad con el plan
Antes de ejecutar gates, revisar:
- ¿Se implementaron todas las features del spec aprobado?
- ¿Falta algún archivo del plan?
- ¿Hay imports rotos o referencias a archivos que no existen?

### 2. Ejecutar los 3 gates

```bash
# Gate 1: TypeScript
pnpm tsc --noEmit

# Gate 2: ESLint
pnpm lint

# Gate 3: Build
pnpm build
```

### 3. Clasificar errores

Para cada error encontrado:
- **¿Lo introduce el trabajo actual?** → Corregir antes de declarar done.
- **¿Es preexistente?** → Documentar y no bloquear.

### 4. Reporte de verificación

Producir un reporte en este formato:

```markdown
## Reporte de verificación — <módulo>

### Gate 1: TypeScript
- Estado: ✅ PASS / ❌ FAIL
- Errores nuevos: (lista o "ninguno")
- Errores preexistentes: (lista o "ninguno")

### Gate 2: ESLint
- Estado: ✅ PASS / ❌ FAIL
- Errores nuevos: (lista o "ninguno")

### Gate 3: Build
- Estado: ✅ PASS / ❌ FAIL
- Errores nuevos: (lista o "ninguno")

### Conformidad con el plan
- Features implementadas: (lista)
- Features pendientes: (lista o "ninguna")

### Veredicto
✅ Done — todos los gates pasan, plan completo.
⚠️ Done con advertencias — gates pasan, errores preexistentes documentados.
❌ Bloqueado — errores nuevos que requieren corrección.
```

## Criterio de "Done"
- [ ] Gates 1, 2 y 3 pasan sin errores **nuevos**.
- [ ] Todas las features del plan están implementadas.
- [ ] Namespaces i18n actualizados.
- [ ] No hay imports rotos ni referencias a archivos inexistentes.

## Lo que NO haces
- No implementas código de corrección — reportas y el agente correspondiente corrige.
- No modificas el spec ni el plan.
- No marcas como "done" si hay errores nuevos sin corregir.

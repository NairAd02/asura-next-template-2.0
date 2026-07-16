---
name: forms-rhf-zod
description: Cargar cuando se crean formularios de creación o edición: form container (RHF + zodResolver), schemas Zod, trigger button y prefill de datos en modo edición.
---

# Forms — React Hook Form + Zod

## Cuándo usar
- Crear formularios de creación (`create/<entity>-form-container.tsx`).
- Crear formularios de edición (`edit/<entity>-form-container.tsx`).
- Crear schemas Zod (`form/create/schemas/` y `form/edit/schemas/`).
- Crear el trigger que abre el modal de creación.

## Estructura de archivos de form

```
modules/<module>/form/
├── <entity>-form.tsx                     ← Formulario compartido (campos + submit button)
├── create/
│   ├── create-<entity>-trigger.tsx       ← Botón que abre el modal de creación
│   ├── create-<entity>-form-container.tsx← RHF + zodResolver + FormProvider + lógica
│   └── schemas/
│       └── create-<entity>-schema.ts     ← Schema Zod para creación
└── edit/
    ├── edit-<entity>-container.tsx       ← Client container: carga el item antes del form
    ├── edit-<entity>-form-container.tsx  ← RHF + zodResolver + FormProvider + prefill
    └── schemas/
        └── edit-<entity>-schema.ts       ← Schema Zod para edición (puede diferir del create)
```

## 1. Schema Zod

```typescript
// form/create/schemas/create-widget-schema.ts
import { z } from "zod";

export const createWidgetSchema = (messages: { nameRequired: string }) => z.object({
  name: z.string().min(1, messages.nameRequired),
  description: z.string().optional().or(z.literal("")),
  isActive: z.boolean().default(true),
  // Ejemplo de campo condicional:
  type: z.enum(["type_a", "type_b"]).default("type_a"),
  typeAConfig: z.object({ value: z.number().min(0) }).optional(),
}).superRefine((data, ctx) => {
  // Validaciones cruzadas entre campos
  if (data.type === "type_a" && !data.typeAConfig?.value) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Value is required for type A.",
      path: ["typeAConfig", "value"],
    });
  }
});

export type CreateWidgetSchema = z.infer<ReturnType<typeof createWidgetSchema>>;
```

**Reglas de schemas:**
- Schema **separado** para Create y Edit (Edit generalmente tiene todos los campos opcionales).
- Usar `.superRefine()` para validaciones cruzadas (campos que dependen de otros).
- Exportar siempre el tipo inferido; para factories usar `z.infer<ReturnType<typeof xSchema>>`.
- Los mensajes de validación visibles se reciben desde i18n mediante una factory de schema; no se codifican en un único idioma.
- El mismo schema compartido se ejecuta también en el límite servidor antes de delegar al service.
- El schema de Edit puede ser más permisivo (todos `optional`) o idéntico al de Create según el caso.

## 2. Create Form Container

```typescript
// form/create/create-widget-form-container.tsx
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createWidgetSchema, CreateWidgetSchema } from "./schemas/create-widget-schema";
import WidgetForm from "../widget-form";
import { useCreateWidget } from "../../lib/hooks/use-create-widget";
import { toast } from "sonner";

interface Props { onClose?: () => void; }

export default function CreateWidgetFormContainer({ onClose }: Props) {
  const router = useRouter();
  const t = useTranslations('widgetForm');

  const { createWidget, isLoading, error } = useCreateWidget({
    onSuccess: () => {
      toast.success("Widget created successfully", { position: "top-right" });
      onClose?.();
      setTimeout(() => { router.refresh(); }, 300);  // ← Refresca la lista SSR
    },
  });

  const form = useForm<CreateWidgetSchema>({
    resolver: zodResolver(createWidgetSchema({ nameRequired: t('validation.nameRequired') })),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
      type: "type_a",
    },
  });

  async function onSubmit(data: CreateWidgetSchema) {
    createWidget(data);
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <WidgetForm loading={isLoading} error={error} onCancel={() => onClose?.()} />
      </form>
    </FormProvider>
  );
}
```

**Reglas del form container (Create):**
- `"use client"` primera línea.
- `FormProvider` + `useForm` con `zodResolver` — siempre.
- `onSuccess`: toast + `onClose?.()` + `setTimeout(() => router.refresh(), 300)` (delay para cerrar modal antes del refresh).
- `defaultValues` con valores iniciales sensibles (no `undefined` para campos de texto → usar `""`).

## 3. Edit Container (carga datos antes del form)

```typescript
// form/edit/edit-widget-container.tsx
"use client";
import { useWidget } from "../../lib/hooks/use-widget";
import EditWidgetFormContainer from "./edit-widget-form-container";
import { DetailsContainerWrapper } from "@/components/details-container-wrapper/details-container-wrapper";

interface Props { widgetId: string; onClose?: () => void; }

export default function EditWidgetContainer({ widgetId, onClose }: Props) {
  const { widget, isLoading, error } = useWidget({ widgetId });
  return (
    <DetailsContainerWrapper data={widget} isLoading={isLoading} error={error} entityKey="widget">
      {(widget) => <EditWidgetFormContainer widget={widget} onClose={onClose} />}
    </DetailsContainerWrapper>
  );
}
```

## 4. Edit Form Container (prefill)

```typescript
// form/edit/edit-widget-form-container.tsx
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { editWidgetSchema, EditWidgetSchema } from "./schemas/edit-widget-schema";
import WidgetForm from "../widget-form";
import { WidgetDetails } from "../../lib/types/widget.types";
import { useEditWidget } from "../../lib/hooks/use-edit-widget";
import { toast } from "sonner";

interface Props { widget: WidgetDetails; onClose?: () => void; }

export default function EditWidgetFormContainer({ widget, onClose }: Props) {
  const router = useRouter();

  const { editWidget, isLoading, error } = useEditWidget({
    onSuccess: () => {
      toast.success("Widget updated successfully", { position: "top-right" });
      onClose?.();
      setTimeout(() => { router.refresh(); }, 300);
    },
  });

  const form = useForm<EditWidgetSchema>({
    resolver: zodResolver(editWidgetSchema),
    defaultValues: {
      name: widget.name,                          // ← Prefill desde el item existente
      description: widget.description || "",
      isActive: widget.isActive,
      type: widget.type,
    },
  });

  async function onSubmit(data: EditWidgetSchema) {
    editWidget(widget.id, data);
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <WidgetForm loading={isLoading} error={error} onCancel={() => onClose?.()} isEditMode />
      </form>
    </FormProvider>
  );
}
```

## 5. Formulario compartido (campos)

```typescript
// form/widget-form.tsx
"use client";
import { useFormContext } from "react-hook-form";
import { RHFTextField } from "@/components/form/rhf-components/rhf-text-field/rhf-text-field";
import { RHFTextAreaField } from "@/components/form/rhf-components/rhf-text-area-field/rhf-text-area-field";
import { RHFToggleField } from "@/components/form/rhf-components/rhf-toggle-field/rhf-toggle-field";
import { RHFSelectField } from "@/components/form/rhf-components/rhf-select-field/rhf-select-field";
import { AlertComponent } from "@/components/ui/alert-component";
import { useTranslations } from "next-intl";
import FormActionFooter from "@/components/form/components/form-action-footer";

interface Props {
  loading?: boolean;
  error?: string | null;
  onCancel?: () => void;
  isEditMode?: boolean;
}

export default function WidgetForm({ loading = false, error, onCancel, isEditMode = false }: Props) {
  const t = useTranslations('widgetForm');
  const { control } = useFormContext();   // ← Accede al form del FormProvider padre

  return (
    <div className="flex flex-col h-full max-h-[75vh]">
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {error && <AlertComponent title={error} variant="destructive" />}

        <div className="bg-white rounded-lg border p-4 space-y-4">
          <div className="border-b pb-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {t('basicInfo')}
            </h3>
          </div>
          <RHFTextField name="name" label={t('name')} placeholder={t('namePlaceholder')} fullWidth />
          <RHFTextAreaField name="description" label={t('description')} placeholder={t('descriptionPlaceholder')} fullWidth rows={3} />
          <RHFToggleField name="isActive" label={t('isActive')} description={t('isActiveDescription')} />
        </div>
      </div>

      <FormActionFooter
        loading={loading}
        onCancel={onCancel || (() => {})}
        cancelButtonText={t('cancel')}
        submitButtonText={!isEditMode ? t('createWidget') : t('editWidget')}
        loadingText={!isEditMode ? t('creating') : t('editing')}
      />
    </div>
  );
}
```

**Reglas del form compartido:**
- `useFormContext()` para acceder al form del `FormProvider` padre — no recibe el form como prop.
- Layout: `flex flex-col h-full max-h-[75vh]` + `flex-1 overflow-y-auto` para scroll interno.
- Secciones con `border rounded-lg p-4` y título `text-xs uppercase tracking-wide`.
- `FormActionFooter` siempre al final (sticky footer con botones Cancel y Submit).
- `isEditMode` para cambiar texto de los botones.
- El form muestra error global con `<AlertComponent variant="destructive">`.

## 6. Trigger de creación

```typescript
// form/create/create-widget-trigger.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Modal } from "@/components/modal/modal";
import CreateWidgetFormContainer from "./create-widget-form-container";
import { useTranslations } from "next-intl";

export default function CreateWidgetTrigger() {
  const t = useTranslations('widgets');
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm">
        <Plus className="h-4 w-4 mr-1" />
        {t('create')}
      </Button>
      <Modal open={open} onOpenChange={setOpen}
        title={t('createTitle')} description={t('createDescription')} maxWidth="2xl"
        bodyClassName="px-0 py-0 pb-4">
        {open && <CreateWidgetFormContainer onClose={() => setOpen(false)} />}
      </Modal>
    </>
  );
}
```

## Componentes RHF disponibles

```
@/components/form/rhf-components/
├── rhf-text-field/         → <RHFTextField name label placeholder fullWidth />
├── rhf-text-area-field/    → <RHFTextAreaField name label placeholder fullWidth rows />
├── rhf-toggle-field/       → <RHFToggleField name label description />
├── rhf-select-field/       → <RHFSelectField name label options placeholder fullWidth />
├── rhf-number-field/       → <RHFNumberField name label placeholder min max fullWidth />
├── rhf-image-upload/       → <RHFImageUpload name label variant="avatar" />
└── rhf-checkbox-field/     → <RHFCheckboxField name label />
```

## Checklist de forms

- [ ] Schema Zod separado para Create y Edit
- [ ] Mensajes de validación obtenidos por i18n mediante factories de schema
- [ ] El límite servidor reutiliza los schemas compartidos
- [ ] `FormProvider` + `useForm` + `zodResolver` en el form container
- [ ] `router.refresh()` con `setTimeout 300ms` en `onSuccess`
- [ ] `useFormContext()` en el form compartido (no props del form)
- [ ] Edit container usa `DetailsContainerWrapper` para carga antes del form
- [ ] Edit form container prefills `defaultValues` desde el item existente
- [ ] `FormActionFooter` con `isEditMode` para textos correctos
- [ ] Trigger monta el contenido condicionalmente (`{open && <...>}`)

## Referencia navegable

Ver: `.agent/reference/widget/form/`

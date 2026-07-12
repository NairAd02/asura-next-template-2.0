"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { editWidgetSchema, EditWidgetSchema } from "./schemas/edit-widget-schema";
import WidgetForm from "../widget-form";
import { WidgetDetails } from "../../lib/types/widget.types";
import { useEditWidget } from "../../lib/hooks/use-edit-widget";
import { toast } from "sonner";

interface Props {
  widget: WidgetDetails;
  onClose?: () => void;
}

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
      name: widget.name,
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

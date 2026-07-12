"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { createWidgetSchema, CreateWidgetSchema } from "./schemas/create-widget-schema";
import WidgetForm from "../widget-form";
import { useCreateWidget } from "../../lib/hooks/use-create-widget";
import { toast } from "sonner";

interface Props {
  onClose?: () => void;
}

export default function CreateWidgetFormContainer({ onClose }: Props) {
  const router = useRouter();

  const { createWidget, isLoading, error } = useCreateWidget({
    onSuccess: () => {
      toast.success("Widget created successfully", { position: "top-right" });
      onClose?.();
      setTimeout(() => { router.refresh(); }, 300);
    },
  });

  const form = useForm<CreateWidgetSchema>({
    resolver: zodResolver(createWidgetSchema),
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

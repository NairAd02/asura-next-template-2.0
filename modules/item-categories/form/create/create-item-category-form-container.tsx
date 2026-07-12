"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  createItemCategorySchema,
  CreateItemCategorySchema,
} from "./schemas/create-item-category-schema";
import ItemCategoryForm from "../item-category-form";
import { useCreateItemCategory } from "../../lib/hooks/use-create-item-category";
import { toast } from "sonner";

interface Props {
  onClose?: () => void;
}

export default function CreateItemCategoryFormContainer({ onClose }: Props) {
  const router = useRouter();

  const {
    createItemCategory,
    isLoading: isLoadingSubmit,
    error: errorSubmit,
  } = useCreateItemCategory({
    onSuccess: () => {
      toast.success("Item category created successfully", { position: "top-right" });
      onClose?.();
      setTimeout(() => {
        router.refresh();
      }, 300);
    },
  });

  const form = useForm<CreateItemCategorySchema>({
    resolver: zodResolver(createItemCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      iconCode: undefined,
      isActive: true,
      pricingType: "flat_rate",
      flatRateRule: { price: 0, currency: "MXN" },
      unitBasedRule: { price: 0, currency: "MXN" },
    },
  });

  function onCancel() {
    onClose?.();
  }

  async function onSubmit(data: CreateItemCategorySchema) {
    createItemCategory(data);
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ItemCategoryForm
          loading={isLoadingSubmit}
          error={errorSubmit}
          onCancel={onCancel}
        />
      </form>
    </FormProvider>
  );
}

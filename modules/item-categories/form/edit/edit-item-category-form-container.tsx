"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  editItemCategorySchema,
  EditItemCategorySchema,
} from "./schemas/edit-item-category-schema";
import ItemCategoryForm from "../item-category-form";
import { ItemCategoryDetails } from "../../lib/types/item-category.types";
import { useEditItemCategory } from "../../lib/hooks/use-edit-item-category";
import { toast } from "sonner";
import useImageForm from "@/components/form/hooks/use-image-form";

interface Props {
  itemCategory: ItemCategoryDetails;
  onClose?: () => void;
}

export default function EditItemCategoryFormContainer({ itemCategory, onClose }: Props) {
  const router = useRouter();

  const {
    editItemCategory,
    isLoading: isLoadingSubmit,
    error: errorSubmit,
  } = useEditItemCategory({
    onSuccess: () => {
      toast.success("Item category updated successfully", { position: "top-right" });
      onClose?.();
      setTimeout(() => {
        router.refresh();
      }, 300);
    },
  });

  const form = useForm<EditItemCategorySchema>({
    resolver: zodResolver(editItemCategorySchema),
    defaultValues: {
      name: itemCategory.name,
      description: itemCategory.description || "",
      iconCode: undefined,
      isActive: itemCategory.isActive,
      pricingType: itemCategory.pricingType,
      flatRateRule: { price: 0, currency: "MXN" },
      unitBasedRule: { price: 0, currency: "MXN" },
    },
  });

  const { loading: loadingIconCode, error: errorIconCode } = useImageForm({
    form,
    imageUrl: itemCategory.iconCode || undefined,
    imageName: itemCategory.name,
    fieldName: "iconCode",
  });

  function onCancel() {
    onClose?.();
  }

  async function onSubmit(data: EditItemCategorySchema) {
    editItemCategory(itemCategory.id, data);
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ItemCategoryForm
          loading={isLoadingSubmit}
          error={errorSubmit}
          onCancel={onCancel}
          isEditMode
          fileIconCodeRecived={{ loading: loadingIconCode, error: errorIconCode }}
        />
      </form>
    </FormProvider>
  );
}

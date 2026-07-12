"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { editItemSchema, EditItemSchema } from "./schemas/edit-item-schema";
import ItemForm from "../item-form";
import { ItemDetails } from "../../lib/types/item.types";
import { useEditItem } from "../../lib/hooks/use-edit-item";
import { toast } from "sonner";
import { getAllItemCategoriesAction } from "@/modules/item-categories/lib/actions/item-category.actions";

interface SelectOption {
  label: string;
  value: string;
}

interface Props {
  item: ItemDetails;
  onClose?: () => void;
}

export default function EditItemFormContainer({ item, onClose }: Props) {
  const router = useRouter();
  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([]);

  const { editItem, isLoading: isLoadingSubmit, error: errorSubmit } = useEditItem({
    onSuccess: () => {
      toast.success("Item updated successfully", { position: "top-right" });
      onClose?.();
      setTimeout(() => {
        router.refresh();
      }, 300);
    },
  });

  const form = useForm<EditItemSchema>({
    resolver: zodResolver(editItemSchema),
    defaultValues: {
      name: item.name,
      description: item.description || "",
      itemCategoryId: item.itemCategoryId || "",
      images: [],
    },
  });

  useEffect(() => {
    getAllItemCategoriesAction({ isActive: true, limit: 100 })
      .then((res) =>
        setCategoryOptions(res.itemCategories.map((c) => ({ label: c.name, value: c.id }))),
      )
      .catch(() => {});
  }, []);

  function onCancel() {
    onClose?.();
  }

  async function onSubmit(data: EditItemSchema) {
    await editItem(item.id, data);
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ItemForm
          loading={isLoadingSubmit}
          error={errorSubmit}
          onCancel={onCancel}
          categoryOptions={categoryOptions}
          existingImages={item.images}
        />
      </form>
    </FormProvider>
  );
}

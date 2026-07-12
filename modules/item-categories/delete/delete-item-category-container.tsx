"use client";

import { useDeleteItemCategory } from "../lib/hooks/use-delete-item-category";
import { ConfirmationDialog } from "@/components/confirmation-dialog/confirmation-dialog";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface Props {
  itemCategoryId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteItemCategoryContainer({
  itemCategoryId,
  open,
  onOpenChange,
}: Props) {
  const t = useTranslations("itemCategories.delete");
  const router = useRouter();
  const { deleteItemCategory, isLoading, error, reset } = useDeleteItemCategory({
    onSuccess: () => {
      toast.success(t("successToast"), { position: "top-right" });
      onOpenChange(false);
      setTimeout(() => {
        router.refresh();
      }, 300);
    },
  });

  const handleConfirm = async () => {
    await deleteItemCategory(itemCategoryId);
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      reset();
    }
  };

  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={handleOpenChange}
      title={t("title")}
      description={t("description")}
      error={error}
      confirmLabel={t("confirm")}
      cancelLabel={t("cancel")}
      onConfirm={handleConfirm}
      isLoading={isLoading}
      variant="destructive"
    />
  );
}

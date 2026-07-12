"use client";

import { useToggleItemCategoryActive } from "../lib/hooks/use-toggle-item-category-active";
import { ConfirmationDialog } from "@/components/confirmation-dialog/confirmation-dialog";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface Props {
  itemCategoryId: string;
  isActive: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ToggleItemCategoryActiveContainer({
  itemCategoryId,
  isActive,
  open,
  onOpenChange,
}: Props) {
  const t = useTranslations("itemCategories.toggleActive");
  const router = useRouter();
  const { toggleActive, isLoading, error, reset } = useToggleItemCategoryActive({
    onSuccess: () => {
      toast.success(isActive ? t("deactivateSuccessToast") : t("activateSuccessToast"), { position: "top-right" });
      onOpenChange(false);
      setTimeout(() => {
        router.refresh();
      }, 300);
    },
  });

  const handleConfirm = async () => {
    await toggleActive(itemCategoryId, !isActive);
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
      title={isActive ? t("deactivateTitle") : t("activateTitle")}
      description={(isActive ? t("deactivateDescription") : t("activateDescription"))}
      error={error}
      confirmLabel={isActive ? t("deactivateConfirm") : t("activateConfirm")}
      cancelLabel={t("cancel")}
      onConfirm={handleConfirm}
      isLoading={isLoading}
      variant={isActive ? "destructive" : "default"}
    />
  );
}

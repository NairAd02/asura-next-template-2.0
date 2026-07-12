import { useToggleItemCategoriesBulk } from "../../lib/hooks/use-toggle-item-categories-bulk";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

/**
 * Hook for managing bulk activate/deactivate operations
 * Handles activating/deactivating multiple item categories and showing success/error feedback
 */
export function useBulkToggleActiveItemCategoryListAction() {
  const router = useRouter();
  const t = useTranslations("itemCategories.bulkToggleActive");

  const { toggleItemCategoriesBulk, isLoading: isTogglingItemCategories } = useToggleItemCategoriesBulk({
    onSuccess: (result) => {
      toast.success(t("successToast", { count: result.updated }), {
        position: "top-right",
      });
      setTimeout(() => {
        router.refresh();
      }, 300);
    },
  });

  /**
   * Activates or deactivates multiple item categories at once
   * @param itemCategoryIds - Array of item category IDs to toggle
   * @param isActive - Target active state (true to activate, false to deactivate)
   */
  const handleBulkToggleActive = async (itemCategoryIds: string[], isActive: boolean) => {
    await toggleItemCategoriesBulk(itemCategoryIds, isActive);
  };

  return {
    isTogglingItemCategories,
    handleBulkToggleActive,
  };
}

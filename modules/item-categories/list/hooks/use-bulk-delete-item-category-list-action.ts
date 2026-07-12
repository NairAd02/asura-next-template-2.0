import { useDeleteItemCategoriesBulk } from "../../lib/hooks/use-delete-item-categories-bulk";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

/**
 * Hook for managing bulk delete operations
 * Handles deleting multiple item categories and showing success/error feedback
 */
export function useBulkDeleteItemCategoryListAction() {
  const router = useRouter();
  const t = useTranslations("itemCategories.bulkDelete");

  const { deleteItemCategoriesBulk, isLoading: isDeletingItemCategories } = useDeleteItemCategoriesBulk({
    onSuccess: (result) => {
      toast.success(t("successToast", { count: result.deleted }), {
        position: "top-right",
      });
      setTimeout(() => {
        router.refresh();
      }, 300);
    },
  });

  /**
   * Deletes multiple item categories at once
   * @param itemCategoryIds - Array of item category IDs to delete
   */
  const handleBulkDelete = async (itemCategoryIds: string[]) => {
    await deleteItemCategoriesBulk(itemCategoryIds);
  };

  return {
    isDeletingItemCategories,
    handleBulkDelete,
  };
}

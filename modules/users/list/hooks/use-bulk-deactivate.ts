import { useDeactivateUsers } from "../../lib/hooks/use-deactivate-users";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

/**
 * Hook for managing bulk deactivate operations.
 * Handles deactivating multiple users and showing success/error feedback.
 */
export function useBulkDeactivateListAction() {
  const router = useRouter();

  const { deactivateUsers, isLoading: isDeactivatingUsers } = useDeactivateUsers({
    onSuccess: (count) => {
      toast.success(
        count === 1
          ? "1 user deactivated"
          : `${count} users deactivated`,
        { position: "top-right" },
      );
      setTimeout(() => {
        router.refresh();
      }, 300);
    },
  });

  /**
   * Deactivates multiple users at once
   * @param userIds - Array of user IDs to deactivate
   */
  const handleBulkDeactivate = async (userIds: string[]) => {
    await deactivateUsers(userIds);
  };

  return {
    isDeactivatingUsers,
    handleBulkDeactivate,
  };
}

import { useToggleUserStatus } from "../../lib/hooks/use-toggle-user-status";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

/**
 * Hook for managing toggle user status operations in the list view.
 * Handles toggling user status (activate/deactivate) and showing success/error feedback.
 */
export function useToggleUserStatusListAction() {
  const router = useRouter();

  const { toggleUserStatus, isLoading: isTogglingUserStatus } = useToggleUserStatus({
    onSuccess: () => {
      toast.success("User status updated", { position: "top-right" });
      setTimeout(() => {
        router.refresh();
      }, 300);
    },
  });

  /**
   * Toggles user status (activate if inactive, deactivate if active)
   * @param userId - User ID to toggle status
   */
  const handleToggleUserStatus = async (userId: string) => {
    await toggleUserStatus(userId);
  };

  return {
    isTogglingUserStatus,
    handleToggleUserStatus,
  };
}

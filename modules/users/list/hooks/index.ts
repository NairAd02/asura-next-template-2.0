// Re-export generic hooks with user-specific aliases for better semantics
export { useEditItemListAction as useEditUserListAction } from "@/modules/hooks/use-edit-item-list-action";
export { useDeleteItemListAction as useDeactivateUserListAction } from "@/modules/hooks/use-delete-item-list-action";
export { useViewItemListAction as useViewUserListAction } from "@/modules/hooks/use-view-item-list-action";

// User-specific hook for bulk deactivate operations
export { useBulkDeactivateListAction } from "./use-bulk-deactivate";

// Hook for toggling user status
export { useToggleUserStatusListAction } from "./use-toggle-user-status-list";

// Hook for resending invitation emails
export { useResendInvitation } from "../../lib/hooks/use-resend-invitation";

// Re-export generic hooks with item-category-specific aliases for better semantics
export { useEditItemListAction as useEditItemCategoryListAction } from "@/modules/hooks/use-edit-item-list-action";
export { useViewItemListAction as useViewItemCategoryListAction } from "@/modules/hooks/use-view-item-list-action";
export { useDeleteItemListAction as useDeleteItemCategoryListAction } from "@/modules/hooks/use-delete-item-list-action";
export { useBulkDeleteItemCategoryListAction } from "./use-bulk-delete-item-category-list-action";
export { useBulkToggleActiveItemCategoryListAction } from "./use-bulk-toggle-active-item-category-list-action";

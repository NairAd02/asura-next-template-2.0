"use client";
import { useState } from "react";
import { ItemCategory } from "../lib/types/item-category.types";
import ItemCategoriesListTableView from "./item-categories-list-table-view";
import ItemCategoriesListCardsView from "./item-categories-list-cards-view";
import { Modal } from "@/components/modal/modal";
import EditItemCategoryContainer from "../form/edit/edit-item-category-container";
import ItemCategoryDetailsContainer from "../details/item-category-details-container";
import DeleteItemCategoryContainer from "../delete/delete-item-category-container";
import ToggleItemCategoryActiveContainer from "../activate/toggle-item-category-active-container";
import { useTranslations } from "next-intl";
import {
  useEditItemCategoryListAction,
  useViewItemCategoryListAction,
  useDeleteItemCategoryListAction,
  useBulkDeleteItemCategoryListAction,
  useBulkToggleActiveItemCategoryListAction,
} from "./hooks";

interface Props {
  itemCategories: ItemCategory[];
}

export default function ItemCategoriesListPresentational({
  itemCategories,
}: Props) {
  const t = useTranslations('itemCategoryDetails');
  const {
    editingItemId: editingItemCategoryId,
    isModalOpen: isEditModalOpen,
    handleEditItem: handleEditItemCategory,
    handleCloseModal: handleCloseEditModal,
    handleModalOpenChange: handleEditModalOpenChange,
  } = useEditItemCategoryListAction();

  const {
    viewingItemId: viewingItemCategoryId,
    isModalOpen,
    handleViewItem: handleViewItemCategory,
    handleModalOpenChange,
  } = useViewItemCategoryListAction();

  const {
    deletingItemId: deletingItemCategoryId,
    isDeleteDialogOpen,
    handleDeleteItem: handleDeleteItemCategory,
    handleDeleteDialogOpenChange,
  } = useDeleteItemCategoryListAction();

  const [togglingActiveItemId, setTogglingActiveItemId] = useState<string | null>(null);
  const [isToggleActiveDialogOpen, setIsToggleActiveDialogOpen] = useState(false);

  const handleToggleActive = (itemCategoryId: string) => {
    setTogglingActiveItemId(itemCategoryId);
    setIsToggleActiveDialogOpen(true);
  };

  const handleToggleActiveDialogOpenChange = (open: boolean) => {
    setIsToggleActiveDialogOpen(open);
    if (!open) {
      setTogglingActiveItemId(null);
    }
  };

  const { isDeletingItemCategories, handleBulkDelete } = useBulkDeleteItemCategoryListAction();
  const { isTogglingItemCategories, handleBulkToggleActive } = useBulkToggleActiveItemCategoryListAction();

  return (
    <div className="pb-4">
      <div className="hidden md:block">
        <ItemCategoriesListTableView
          itemCategories={itemCategories}
          onViewItemCategory={handleViewItemCategory}
          onEditItemCategory={handleEditItemCategory}
          onToggleActive={handleToggleActive}
          onDeleteItemCategory={handleDeleteItemCategory}
          onBulkDelete={handleBulkDelete}
          isDeletingItemCategories={isDeletingItemCategories}
          onBulkToggleActive={handleBulkToggleActive}
          isTogglingItemCategories={isTogglingItemCategories}
        />
      </div>
      <div className="block md:hidden">
        <ItemCategoriesListCardsView
          itemCategories={itemCategories}
          onViewItemCategory={handleViewItemCategory}
          onEditItemCategory={handleEditItemCategory}
          onToggleActive={handleToggleActive}
          onDeleteItemCategory={handleDeleteItemCategory}
        />
      </div>

      <Modal
        open={isEditModalOpen}
        onOpenChange={handleEditModalOpenChange}
        title={t('editItemCategory')}
        description={t('editItemCategoryDescription')}
        maxWidth="2xl"
        bodyClassName="px-0 py-0 pb-4"
      >
        {editingItemCategoryId && (
          <EditItemCategoryContainer
            itemCategoryId={editingItemCategoryId}
            onClose={handleCloseEditModal}
          />
        )}
      </Modal>

      <Modal
        open={isModalOpen}
        onOpenChange={handleModalOpenChange}
        title={t('title')}
        description={t('detailsDescription')}
        maxWidth="xl"
        maxHeight="lg"
      >
        {viewingItemCategoryId && <ItemCategoryDetailsContainer itemCategoryId={viewingItemCategoryId} />}
      </Modal>

      {deletingItemCategoryId && (
        <DeleteItemCategoryContainer
          itemCategoryId={deletingItemCategoryId}
          open={isDeleteDialogOpen}
          onOpenChange={handleDeleteDialogOpenChange}
        />
      )}

      {togglingActiveItemId && (
        <ToggleItemCategoryActiveContainer
          itemCategoryId={togglingActiveItemId}
          isActive={itemCategories.find(c => c.id === togglingActiveItemId)?.isActive ?? true}
          open={isToggleActiveDialogOpen}
          onOpenChange={handleToggleActiveDialogOpenChange}
        />
      )}
    </div>
  );
}

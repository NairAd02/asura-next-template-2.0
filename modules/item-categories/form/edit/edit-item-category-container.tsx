"use client";

import { useItemCategory } from "../../lib/hooks/use-item-category";
import EditItemCategoryFormContainer from "./edit-item-category-form-container";
import { DetailsContainerWrapper } from "@/components/details-container-wrapper/details-container-wrapper";

interface Props {
  itemCategoryId: string;
  onClose?: () => void;
}

export default function EditItemCategoryContainer({ itemCategoryId, onClose }: Props) {
  const { itemCategory, isLoading, error } = useItemCategory({ itemCategoryId });

  return (
    <DetailsContainerWrapper
      data={itemCategory}
      isLoading={isLoading}
      error={error}
      entityKey="itemCategory"
    >
      {(itemCategory) => <EditItemCategoryFormContainer itemCategory={itemCategory} onClose={onClose} />}
    </DetailsContainerWrapper>
  );
}

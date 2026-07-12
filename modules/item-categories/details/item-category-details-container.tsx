"use client";

import { useItemCategory } from "../lib/hooks/use-item-category";
import { ItemCategoryDetailsView } from "./item-category-details-presentational";
import { DetailsContainerWrapper } from "@/components/details-container-wrapper/details-container-wrapper";

export interface Props {
  itemCategoryId: string;
}

export default function ItemCategoryDetailsContainer({ itemCategoryId }: Props) {
  const { itemCategory, isLoading, error } = useItemCategory({ itemCategoryId });

  return (
    <DetailsContainerWrapper
      data={itemCategory}
      isLoading={isLoading}
      error={error}
      entityKey="itemCategory"
    >
      {(itemCategory) => <ItemCategoryDetailsView itemCategory={itemCategory} />}
    </DetailsContainerWrapper>
  );
}

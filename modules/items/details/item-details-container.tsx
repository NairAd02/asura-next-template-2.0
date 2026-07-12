"use client";

import { useItem } from "../lib/hooks/use-item";
import { ItemDetailsView } from "./item-details-presentational";
import { DetailsContainerWrapper } from "@/components/details-container-wrapper/details-container-wrapper";

export interface Props {
  itemId: string;
}

export default function ItemDetailsContainer({ itemId }: Props) {
  const { item, isLoading, error } = useItem({ itemId });

  return (
    <DetailsContainerWrapper
      data={item}
      isLoading={isLoading}
      error={error}
      entityKey="item"
    >
      {(item) => <ItemDetailsView item={item} />}
    </DetailsContainerWrapper>
  );
}

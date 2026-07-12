"use client";

import { useItem } from "../../lib/hooks/use-item";
import EditItemFormContainer from "./edit-item-form-container";
import { DetailsContainerWrapper } from "@/components/details-container-wrapper/details-container-wrapper";

interface Props {
  itemId: string;
  onClose?: () => void;
}

export default function EditItemContainer({ itemId, onClose }: Props) {
  const { item, isLoading, error } = useItem({ itemId });

  return (
    <DetailsContainerWrapper
      data={item}
      isLoading={isLoading}
      error={error}
      entityKey="item"
    >
      {(item) => <EditItemFormContainer item={item} onClose={onClose} />}
    </DetailsContainerWrapper>
  );
}

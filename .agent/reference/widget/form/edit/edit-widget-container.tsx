"use client";

import { useWidget } from "../../lib/hooks/use-widget";
import EditWidgetFormContainer from "./edit-widget-form-container";
import { DetailsContainerWrapper } from "@/components/details-container-wrapper/details-container-wrapper";

interface Props {
  widgetId: string;
  onClose?: () => void;
}

export default function EditWidgetContainer({ widgetId, onClose }: Props) {
  const { widget, isLoading, error } = useWidget({ widgetId });

  return (
    <DetailsContainerWrapper data={widget} isLoading={isLoading} error={error} entityKey="widget">
      {(widget) => <EditWidgetFormContainer widget={widget} onClose={onClose} />}
    </DetailsContainerWrapper>
  );
}

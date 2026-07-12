"use client";

import { useWidget } from "../lib/hooks/use-widget";
import WidgetDetailsPresentational from "./widget-details-presentational";
import { DetailsContainerWrapper } from "@/components/details-container-wrapper/details-container-wrapper";

interface Props {
  widgetId: string;
}

export default function WidgetDetailsContainer({ widgetId }: Props) {
  const { widget, isLoading, error } = useWidget({ widgetId });
  return (
    <DetailsContainerWrapper data={widget} isLoading={isLoading} error={error} entityKey="widget">
      {(widget) => <WidgetDetailsPresentational widget={widget} />}
    </DetailsContainerWrapper>
  );
}

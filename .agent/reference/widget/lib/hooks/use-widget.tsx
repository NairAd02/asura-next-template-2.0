"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { getWidgetByIdAction } from "../actions/widget.actions";
import { WidgetDetails } from "../types/widget.types";

interface Props {
  widgetId: string;
}

export function useWidget({ widgetId }: Props) {
  const t = useTranslations("widgets");
  const [widget, setWidget] = useState<WidgetDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWidget = useCallback(async () => {
    if (!widgetId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await getWidgetByIdAction(widgetId);
      if (!response.success) {
        const code = response.error.code as string;
        const translated = t.has(`errors.${code}` as any)
          ? t(`errors.${code}` as any)
          : response.error.message;
        setError(translated);
        return;
      }
      setWidget(response.data);
    } finally {
      setIsLoading(false);
    }
  }, [widgetId, t]);

  useEffect(() => { fetchWidget(); }, [fetchWidget]);

  return { widget, isLoading, error, refetch: fetchWidget };
}

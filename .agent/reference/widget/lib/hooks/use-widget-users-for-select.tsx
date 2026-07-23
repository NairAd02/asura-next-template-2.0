"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getWidgetUsersForSelectAction } from "../actions/widget.actions";
import type { WidgetUserOption } from "../types/widget.types";

export function useWidgetUsersForSelect() {
  const t = useTranslations("widgets");
  const [users, setUsers] = useState<WidgetUserOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getWidgetUsersForSelectAction();
      if (!response.success) {
        const code = response.error.code as string;
        const translated = t.has(`errors.${code}`)
          ? t(`errors.${code}`)
          : response.error.message;
        setUsers([]);
        setError(translated);
        return;
      }
      setUsers(response.data);
    } catch (cause) {
      setUsers([]);
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchUsers();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchUsers]);

  const reset = useCallback(() => {
    setUsers([]);
    setError(null);
    setIsLoading(false);
  }, []);

  return { users, isLoading, error, refetch: fetchUsers, reset };
}

"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { toggleUserStatusAction } from "../actions/user.actions";

interface Props {
  onSuccess: () => void;
}

export function useToggleUserStatus({ onSuccess }: Props) {
  const t = useTranslations("users");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleUserStatus = useCallback(
    async (userId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await toggleUserStatusAction(userId);

        if (!response.success) {
          const code = response.error.code as string;
          const translated = t.has(`errors.${code}` as any) ? t(`errors.${code}` as any) : response.error.message;
          setError(translated);
        } else onSuccess();
      } finally {
        setIsLoading(false);
      }
    },
    [onSuccess, t],
  );

  const reset = useCallback(() => {
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    toggleUserStatus,
    isLoading,
    error,
    reset,
  };
}

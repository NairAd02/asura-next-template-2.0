"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { deactivateUsersAction } from "../actions/user.actions";

interface Props {
  onSuccess: (deactivatedCount: number) => void;
}

export function useDeactivateUsers({ onSuccess }: Props) {
  const t = useTranslations("users");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deactivateUsers = useCallback(
    async (userIds: string[]) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await deactivateUsersAction(userIds);

        if (!response.success) {
          const code = response.error.code as string;
          const translated = t.has(`errors.${code}` as any) ? t(`errors.${code}` as any) : response.error.message;
          setError(translated);
        } else {
          onSuccess(response.data.deactivated);
        }
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
    deactivateUsers,
    isLoading,
    error,
    reset,
  };
}

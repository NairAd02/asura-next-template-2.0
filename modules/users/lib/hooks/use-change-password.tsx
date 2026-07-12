"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { changePasswordAction } from "../actions/user.actions";
import { ChangePasswordDto } from "../types/user.types";

interface Props {
  onSuccess?: () => void;
}

export function useChangePassword({ onSuccess }: Props = {}) {
  const t = useTranslations("users");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changePassword = useCallback(
    async (dto: ChangePasswordDto) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await changePasswordAction(dto);
        if (!response.success) {
          const code = response.error.code as string;
          const translated = t.has(`errors.${code}` as any) ? t(`errors.${code}` as any) : response.error.message;
          setError(translated);
        } else onSuccess?.();
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
    changePassword,
    isLoading,
    error,
    reset,
  };
}

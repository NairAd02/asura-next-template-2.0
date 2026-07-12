"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { updateCurrentUserProfileAction } from "../actions/user.actions";
import { UpdateCurrentUserProfileDto, UserDetails } from "../types/user.types";

interface Props {
  onSuccess?: (updated: UserDetails) => void;
}

export function useUpdateUserProfile({ onSuccess }: Props = {}) {
  const t = useTranslations("users");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = useCallback(
    async (dto: UpdateCurrentUserProfileDto) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await updateCurrentUserProfileAction(dto);

        if (!response.success) {
          const code = response.error.code as string;
          const translated = t.has(`errors.${code}` as any) ? t(`errors.${code}` as any) : response.error.message;
          setError(translated);
          return null;
        }

        onSuccess?.(response.data);
        return response.data;
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
    updateProfile,
    isLoading,
    error,
    reset,
  };
}

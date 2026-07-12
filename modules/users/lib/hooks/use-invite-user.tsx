"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { convertCreateUserDto } from "../types/user.types";
import { inviteUserAction } from "../actions/user.actions";
import { CreateUserSchema } from "../../form/create/schemas/create-user-schema";

interface Props {
  onSuccess: () => void;
}

export function useInviteUser({ onSuccess }: Props) {
  const t = useTranslations("users");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inviteUser = useCallback(
    async (data: CreateUserSchema, locale?: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const dto = convertCreateUserDto(data, locale);
        const response = await inviteUserAction(dto);

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
    inviteUser,
    isLoading,
    error,
    reset,
  };
}

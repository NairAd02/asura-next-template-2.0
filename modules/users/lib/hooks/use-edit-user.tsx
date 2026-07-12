"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { convertEditUserDto } from "../types/user.types";
import { editUserAction } from "../actions/user.actions";
import { EditUserSchema } from "../../form/edit/schemas/edit-user-schema";

interface Props {
  onSuccess: () => void;
}

export function useEditUser({ onSuccess }: Props) {
  const t = useTranslations("users");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editUser = useCallback(
    async (data: EditUserSchema, userId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const dto = convertEditUserDto(data);
        const response = await editUserAction(userId, dto);

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
    editUser,
    isLoading,
    error,
    reset,
  };
}

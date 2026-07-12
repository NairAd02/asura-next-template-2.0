"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { resendInvitationAction } from "../actions/user.actions";

interface Props {
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function useResendInvitation({ onSuccess, onError }: Props) {
  const t = useTranslations("users");
  const [isLoading, setIsLoading] = useState(false);

  const resendInvitation = useCallback(
    async (userId: string, locale: string) => {
      setIsLoading(true);

      try {
        const response = await resendInvitationAction(userId, locale);

        if (!response.success) {
          const code = response.error.code as string;
          const translated = t.has(`errors.${code}` as any) ? t(`errors.${code}` as any) : response.error.message;
          onError(translated);
        } else {
          onSuccess();
        }
      } finally {
        setIsLoading(false);
      }
    },
    [onSuccess, onError, t],
  );

  return {
    resendInvitation,
    isLoading,
  };
}

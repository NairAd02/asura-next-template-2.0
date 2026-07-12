"use client";

import { useState, useCallback } from "react";
import { resetPasswordAction } from "../actions/user.actions";
import { ResetPasswordDto } from "../types/user.types";

interface Props {
  onSuccess?: () => void;
}

export function useResetPassword({ onSuccess }: Props = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetPassword = useCallback(
    async (dto: ResetPasswordDto) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await resetPasswordAction(dto);
        if (!response.success) {
          setError(response.error?.message || "Failed to reset password");
        } else {
          onSuccess?.();
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to reset password";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [onSuccess],
  );

  const reset = useCallback(() => {
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    resetPassword,
    isLoading,
    error,
    reset,
  };
}

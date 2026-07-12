"use client";

import { useCallback } from "react";

interface Props {
  onSuccess?: () => void;
}

export function useRequestPasswordReset({ onSuccess: _onSuccess }: Props = {}) {
  const requestReset = useCallback(async (_dto: unknown) => {
    // Stub: password reset is not implemented in the mock template
  }, []);

  const reset = useCallback(() => {}, []);

  return {
    requestReset,
    isLoading: false,
    error: null,
    sent: false,
    reset,
  };
}

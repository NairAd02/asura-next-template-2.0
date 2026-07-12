"use client";

import { useCallback } from "react";

interface Props {
  onSuccess: () => void;
}

export function useCompleteOnboarding({ onSuccess: _onSuccess }: Props) {
  const completeOnboarding = useCallback(async (_data: unknown) => {
    // Stub: onboarding is not implemented in the mock template
  }, []);

  const reset = useCallback(() => {}, []);

  return {
    completeOnboarding,
    isLoading: false,
    error: null,
    reset,
  };
}

"use client";

import { useState, useCallback, useEffect } from "react";
import { getCurrentUserAction } from "../actions/user.actions";
import { UserDetails } from "../types/user.types";

export function useCurrentUser() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserDetails | null>(null);

  const getUser = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getCurrentUserAction();

      if (signal?.aborted) return;

      if (!response.success) {
        setError(response.error.message);
      } else {
        setUser(response.data);
      }
    } catch (err) {
      if (signal?.aborted) return;
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get current user";
      setError(errorMessage);
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      void getUser(controller.signal);
    }, 0);
    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [getUser]);

  return {
    user,
    isLoading,
    error,
    refetch: getUser,
  };
}

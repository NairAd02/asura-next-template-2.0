"use client";

import { useState, useCallback, useEffect } from "react";
import { getCurrentUserAction } from "@/modules/users/lib/actions/user.actions";
import { UserDetails } from "@/modules/users/lib/types/user.types";

export function useCurrentUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserDetails | null>(null);

  const getUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getCurrentUserAction();

      if (!response.success) {
        setError(response.error.message);
      } else {
        setUser(response.data);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get current user";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void getUser();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [getUser]);

  return {
    user,
    isLoading,
    error,
    refetch: getUser,
  };
}

"use client";

import { useEffect, useState } from "react";
import { getUsersForSelectAction as getUsersForSelect } from "../lib/actions/user.actions";

interface User {
  id: string;
  fullName: string | null;
  email: string;
}

interface UseUsersForSelectReturn {
  users: User[];
  loading: boolean;
  error: string | null;
}

export default function useUsersForSelect(): UseUsersForSelectReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const response = await getUsersForSelect();

        if (response.success && response.data) {
          setUsers(response.data);
          setError(null);
        } else if (!response.success) {
          setError(response.error?.message ?? "Failed to fetch users");
          setUsers([]);
        }
      } catch (err) {
        setError(`Error: ${err}`);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  return { users, loading, error };
}

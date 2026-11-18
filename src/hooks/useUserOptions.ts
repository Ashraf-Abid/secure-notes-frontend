import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { PaginatedResponse, User } from '../types';

export function useUserOptions() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    api
      .get<PaginatedResponse<User>>('/users', { params: { limit: 50 } })
      .then((res) => setUsers([...res.data.data].sort((a, b) => a.name.localeCompare(b.name))))
      .catch(() => setUsers([]));
  }, []);

  return users;
}

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { api, setUnauthorizedHandler, tokenStorage } from '../api/client';
import { ApiResponse, AuthResult, User } from '../types';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  interests?: string[];
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null));

    if (!tokenStorage.get()) {
      setLoading(false);
    } else {
      api
        .get<ApiResponse<User>>('/users/me')
        .then((res) => setUser(res.data.data))
        .catch(() => tokenStorage.clear())
        .finally(() => setLoading(false));
    }

    return () => setUnauthorizedHandler(null);
  }, []);

  function saveSession(result: AuthResult) {
    tokenStorage.set(result.token);
    setUser(result.user);
  }

  async function login(email: string, password: string) {
    const res = await api.post<ApiResponse<AuthResult>>('/auth/login', { email, password });
    saveSession(res.data.data);
  }

  async function register(input: RegisterInput) {
    const res = await api.post<ApiResponse<AuthResult>>('/auth/register', input);
    saveSession(res.data.data);
  }

  function logout() {
    tokenStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}

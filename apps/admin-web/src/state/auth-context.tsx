"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminUser } from "@/domain/models/admin-user.model";
import { authService } from "@/services/auth.service";

// Client-side auth state, backed by AuthService -> MockAuthRepository.
// TODO (Backend): once JWT auth is live, this context should also hold
// the access token and trigger a silent refresh on expiry.
interface AuthContextValue {
  user: AdminUser | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    authService.getCurrentUser().then((current) => {
      setUser(current);
      setIsLoading(false);
    });
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const loggedInUser = await authService.login(username, password);
    setUser(loggedInUser);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    router.push("/login");
  }, [router]);

  const value = useMemo(() => ({ user, isLoading, login, logout }), [user, isLoading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

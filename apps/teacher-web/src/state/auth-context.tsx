"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Teacher } from "@/domain/models/teacher.model";
import { authService } from "@/services/auth.service";

interface AuthContextValue {
  teacher: Teacher | null;
  isLoading: boolean;
  login: (teacherId: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    authService.getCurrentTeacher().then((current) => {
      setTeacher(current);
      setIsLoading(false);
    });
  }, []);

  const login = useCallback(async (teacherId: string, password: string) => {
    const loggedIn = await authService.login(teacherId, password);
    setTeacher(loggedIn);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setTeacher(null);
    router.push("/login");
  }, [router]);

  const value = useMemo(() => ({ teacher, isLoading, login, logout }), [teacher, isLoading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

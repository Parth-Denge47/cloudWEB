"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Student } from "@/domain/models/student.model";
import { authService } from "@/services/auth.service";

interface AuthContextValue {
  student: Student | null;
  isLoading: boolean;
  login: (studentId: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    authService.getCurrentStudent().then((current) => {
      setStudent(current);
      setIsLoading(false);
    });
  }, []);

  const login = useCallback(async (studentId: string, password: string) => {
    const loggedIn = await authService.login(studentId, password);
    setStudent(loggedIn);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setStudent(null);
    router.push("/login");
  }, [router]);

  const value = useMemo(() => ({ student, isLoading, login, logout }), [student, isLoading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

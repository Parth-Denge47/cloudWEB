import { AuthRepository } from "@/domain/repositories/auth.repository";
import { AdminUser } from "@/domain/models/admin-user.model";
import { mockDelay } from "@/data/mock/delay";

const MOCK_ADMIN: AdminUser = {
  id: "admin-1",
  username: "admin",
  name: "Platform Admin",
  email: "admin@lms.example.com",
  role: "super_admin",
};

const SESSION_KEY = "lms_admin_session";

// Mock implementation of AuthRepository. Accepts any non-empty
// username/password (demo credentials: admin / admin123) and persists a
// fake session in localStorage.
// TODO (Backend): replace with POST /auth/admin/login + JWT storage.
export class MockAuthRepository implements AuthRepository {
  async login(username: string, password: string): Promise<AdminUser> {
    await mockDelay();
    if (!username.trim() || !password.trim()) {
      throw new Error("Username and password are required.");
    }
    if (username.trim().toLowerCase() !== "admin" || password !== "admin123") {
      throw new Error("Invalid username or password.");
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(MOCK_ADMIN));
    }
    return MOCK_ADMIN;
  }

  async logout(): Promise<void> {
    await mockDelay(100);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(SESSION_KEY);
    }
  }

  async getCurrentUser(): Promise<AdminUser | null> {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AdminUser) : null;
  }
}

export const mockAuthRepository = new MockAuthRepository();

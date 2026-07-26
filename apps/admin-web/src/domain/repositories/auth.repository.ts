import { AdminUser } from "@/domain/models/admin-user.model";

// Repository abstraction for admin authentication.
// Currently backed by a mock implementation (see data/repositories).
// Replace with a real HTTP implementation calling POST /auth/admin/login
// once the backend is available — no UI changes required.
export interface AuthRepository {
  login(username: string, password: string): Promise<AdminUser>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<AdminUser | null>;
}

import { AuthRepository } from "@/domain/repositories/auth.repository";
import { mockAuthRepository } from "@/data/repositories/mock-auth.repository";
import { AdminUser } from "@/domain/models/admin-user.model";

// Service layer for authentication. Depends on the AuthRepository
// interface, not the mock implementation directly — swapping in an HTTP
// repository later is a one-line change in the constructor default.
export class AuthService {
  constructor(private readonly repository: AuthRepository = mockAuthRepository) {}

  login(username: string, password: string): Promise<AdminUser> {
    return this.repository.login(username, password);
  }

  logout(): Promise<void> {
    return this.repository.logout();
  }

  getCurrentUser(): Promise<AdminUser | null> {
    return this.repository.getCurrentUser();
  }
}

export const authService = new AuthService();

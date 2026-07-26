import { AuthRepository } from "@/domain/repositories/auth.repository";
import { mockAuthRepository } from "@/data/repositories/mock-auth.repository";
import { Teacher } from "@/domain/models/teacher.model";

export class AuthService {
  constructor(private readonly repository: AuthRepository = mockAuthRepository) {}
  login(teacherId: string, password: string): Promise<Teacher> {
    return this.repository.login(teacherId, password);
  }
  logout(): Promise<void> {
    return this.repository.logout();
  }
  getCurrentTeacher(): Promise<Teacher | null> {
    return this.repository.getCurrentTeacher();
  }
}

export const authService = new AuthService();

import { AuthRepository } from "@/domain/repositories/auth.repository";
import { mockAuthRepository } from "@/data/repositories/mock-auth.repository";
import { Student } from "@/domain/models/student.model";

export class AuthService {
  constructor(private readonly repository: AuthRepository = mockAuthRepository) {}
  login(studentId: string, password: string): Promise<Student> {
    return this.repository.login(studentId, password);
  }
  logout(): Promise<void> {
    return this.repository.logout();
  }
  getCurrentStudent(): Promise<Student | null> {
    return this.repository.getCurrentStudent();
  }
}

export const authService = new AuthService();

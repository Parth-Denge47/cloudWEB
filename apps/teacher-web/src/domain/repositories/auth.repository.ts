import { Teacher } from "@/domain/models/teacher.model";

// Repository abstraction for Teacher authentication (Teacher ID + password
// per spec, independent from the Admin and Student login flows).
// TODO (Backend): replace with POST /auth/teacher/login.
export interface AuthRepository {
  login(teacherId: string, password: string): Promise<Teacher>;
  logout(): Promise<void>;
  getCurrentTeacher(): Promise<Teacher | null>;
}

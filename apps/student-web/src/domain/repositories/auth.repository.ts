import { Student } from "@/domain/models/student.model";

// Repository abstraction for Student authentication (Student ID +
// password per spec, independent from Admin and Teacher login flows).
// TODO (Backend): replace with POST /auth/student/login.
export interface AuthRepository {
  login(studentId: string, password: string): Promise<Student>;
  logout(): Promise<void>;
  getCurrentStudent(): Promise<Student | null>;
}

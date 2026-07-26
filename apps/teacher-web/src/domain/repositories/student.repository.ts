import { Student, StudentInput } from "@/domain/models/student.model";

export interface StudentFilters {
  teacherId?: string;
  search?: string;
}

// Repository abstraction for a Teacher's own students. A teacher may add
// new students (capped at their admin-assigned studentLimit), edit/view
// only their own students, reset their passwords, and view performance.
export interface StudentRepository {
  getAll(filters?: StudentFilters): Promise<Student[]>;
  getById(id: string): Promise<Student | null>;
  create(input: StudentInput): Promise<Student>;
  update(id: string, changes: Partial<StudentInput>): Promise<Student>;
  resetPassword(id: string, newPassword: string): Promise<void>;
}

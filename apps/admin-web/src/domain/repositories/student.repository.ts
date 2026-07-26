import { Student, StudentInput } from "@/domain/models/student.model";

export interface StudentFilters {
  tuitionId?: string;
  teacherId?: string;
  course?: Student["course"];
  status?: Student["status"];
  search?: string;
}

// Repository abstraction for Student management.
// Currently returns mock data. Replace with backend implementation
// (see api/api-routes.ts `students`) when APIs are available.
export interface StudentRepository {
  getAll(filters?: StudentFilters): Promise<Student[]>;
  getById(id: string): Promise<Student | null>;
  create(input: StudentInput): Promise<Student>;
  update(id: string, changes: Partial<StudentInput>): Promise<Student>;
  delete(id: string): Promise<void>;
  resetPassword(id: string, newPassword: string): Promise<void>;
  reassignTeacher(id: string, teacherId: string, teacherName: string): Promise<Student>;
  resetQuizAttempt(studentId: string, quizId: string): Promise<void>;
  suspend(id: string): Promise<Student>;
  activate(id: string): Promise<Student>;
}

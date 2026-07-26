import { StudentRepository, StudentFilters } from "@/domain/repositories/student.repository";
import { mockStudentRepository } from "@/data/repositories/mock-student.repository";
import { Student, StudentInput } from "@/domain/models/student.model";

// Service layer for Student management.
export class StudentService {
  constructor(private readonly repository: StudentRepository = mockStudentRepository) {}

  getAll(filters?: StudentFilters): Promise<Student[]> {
    return this.repository.getAll(filters);
  }

  getById(id: string): Promise<Student | null> {
    return this.repository.getById(id);
  }

  create(input: StudentInput): Promise<Student> {
    return this.repository.create(input);
  }

  update(id: string, changes: Partial<StudentInput>): Promise<Student> {
    return this.repository.update(id, changes);
  }

  delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }

  resetPassword(id: string, newPassword: string): Promise<void> {
    return this.repository.resetPassword(id, newPassword);
  }

  reassignTeacher(id: string, teacherId: string, teacherName: string): Promise<Student> {
    return this.repository.reassignTeacher(id, teacherId, teacherName);
  }

  resetQuizAttempt(studentId: string, quizId: string): Promise<void> {
    return this.repository.resetQuizAttempt(studentId, quizId);
  }

  suspend(id: string): Promise<Student> {
    return this.repository.suspend(id);
  }

  activate(id: string): Promise<Student> {
    return this.repository.activate(id);
  }
}

export const studentService = new StudentService();

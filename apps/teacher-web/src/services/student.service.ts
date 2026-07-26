import { StudentRepository, StudentFilters } from "@/domain/repositories/student.repository";
import { mockStudentRepository } from "@/data/repositories/mock-student.repository";
import { Student, StudentInput } from "@/domain/models/student.model";

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
  resetPassword(id: string, newPassword: string): Promise<void> {
    return this.repository.resetPassword(id, newPassword);
  }
}

export const studentService = new StudentService();

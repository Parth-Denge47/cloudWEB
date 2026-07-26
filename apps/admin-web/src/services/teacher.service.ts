import { TeacherRepository, TeacherFilters } from "@/domain/repositories/teacher.repository";
import { mockTeacherRepository } from "@/data/repositories/mock-teacher.repository";
import { Teacher, TeacherInput } from "@/domain/models/teacher.model";

// Service layer for Teacher management. UI components call this, never
// the repository directly, keeping business logic out of components.
export class TeacherService {
  constructor(private readonly repository: TeacherRepository = mockTeacherRepository) {}

  getAll(filters?: TeacherFilters): Promise<Teacher[]> {
    return this.repository.getAll(filters);
  }

  getById(id: string): Promise<Teacher | null> {
    return this.repository.getById(id);
  }

  create(input: TeacherInput): Promise<Teacher> {
    return this.repository.create(input);
  }

  update(id: string, changes: Partial<TeacherInput>): Promise<Teacher> {
    return this.repository.update(id, changes);
  }

  delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }

  suspend(id: string): Promise<Teacher> {
    return this.repository.suspend(id);
  }

  activate(id: string): Promise<Teacher> {
    return this.repository.activate(id);
  }

  resetPassword(id: string, newPassword: string): Promise<void> {
    return this.repository.resetPassword(id, newPassword);
  }
}

export const teacherService = new TeacherService();

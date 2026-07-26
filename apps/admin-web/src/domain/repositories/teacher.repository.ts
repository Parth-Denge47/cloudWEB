import { Teacher, TeacherInput } from "@/domain/models/teacher.model";

export interface TeacherFilters {
  tuitionId?: string;
  status?: Teacher["status"];
  search?: string;
}

// Repository abstraction for Teacher management.
// Currently returns mock data. Replace with backend implementation
// (see api/api-routes.ts `teachers`) when APIs are available.
export interface TeacherRepository {
  getAll(filters?: TeacherFilters): Promise<Teacher[]>;
  getById(id: string): Promise<Teacher | null>;
  create(input: TeacherInput): Promise<Teacher>;
  update(id: string, changes: Partial<TeacherInput>): Promise<Teacher>;
  delete(id: string): Promise<void>;
  suspend(id: string): Promise<Teacher>;
  activate(id: string): Promise<Teacher>;
  resetPassword(id: string, newPassword: string): Promise<void>;
}

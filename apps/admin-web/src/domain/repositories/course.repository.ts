import { Course } from "@/domain/models/course.model";

// Repository abstraction for Courses (read-heavy from the Admin side —
// course creation/approval lives primarily in the Teacher panel per spec).
export interface CourseRepository {
  getAll(tuitionId?: string): Promise<Course[]>;
  getById(id: string): Promise<Course | null>;
}

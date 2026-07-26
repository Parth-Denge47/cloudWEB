import { CourseRepository } from "@/domain/repositories/course.repository";
import { mockCourseRepository } from "@/data/repositories/mock-course.repository";
import { Course } from "@/domain/models/course.model";

// Service layer for Courses.
export class CourseService {
  constructor(private readonly repository: CourseRepository = mockCourseRepository) {}

  getAll(tuitionId?: string): Promise<Course[]> {
    return this.repository.getAll(tuitionId);
  }

  getById(id: string): Promise<Course | null> {
    return this.repository.getById(id);
  }
}

export const courseService = new CourseService();

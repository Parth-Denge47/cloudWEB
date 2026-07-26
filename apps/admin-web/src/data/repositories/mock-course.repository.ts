import { CourseRepository } from "@/domain/repositories/course.repository";
import { Course } from "@/domain/models/course.model";
import { courses } from "@/data/mock/seed-data";
import { mockDelay } from "@/data/mock/delay";

// Mock implementation of CourseRepository.
export class MockCourseRepository implements CourseRepository {
  async getAll(tuitionId?: string): Promise<Course[]> {
    await mockDelay(200);
    return tuitionId ? courses.filter((c) => c.tuitionId === tuitionId) : [...courses];
  }

  async getById(id: string): Promise<Course | null> {
    await mockDelay(150);
    return courses.find((c) => c.id === id) ?? null;
  }
}

export const mockCourseRepository = new MockCourseRepository();

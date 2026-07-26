import { AuthRepository } from "@/domain/repositories/auth.repository";
import { Teacher } from "@/domain/models/teacher.model";
import { teachers, tuitions } from "@/data/mock/seed-data";
import { mockDelay } from "@/data/mock/delay";

const SESSION_KEY = "lms_teacher_session";

// Mock implementation of AuthRepository. Any non-empty password is
// accepted for a valid, active Teacher ID (password verification is a
// backend concern per spec) — but login correctly blocks a teacher whose
// account OR whose tuition has been suspended by the Admin, matching the
// cascading-suspend rule from the Tuition Management spec.
// TODO (Backend): replace with POST /auth/teacher/login + JWT storage.
export class MockAuthRepository implements AuthRepository {
  async login(teacherId: string, password: string): Promise<Teacher> {
    await mockDelay();
    if (!teacherId.trim() || !password.trim()) {
      throw new Error("Teacher ID and password are required.");
    }
    const teacher = teachers.find((t) => t.teacherId.toLowerCase() === teacherId.trim().toLowerCase());
    if (!teacher) throw new Error("Invalid Teacher ID or password.");
    if (teacher.status === "suspended") {
      throw new Error("Your account has been suspended by the Admin. Contact your tuition for details.");
    }
    const tuition = tuitions.find((t) => t.id === teacher.tuitionId);
    if (tuition?.status === "suspended") {
      throw new Error(`${tuition.tuitionName} has been suspended by the Admin. Login is temporarily unavailable.`);
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(teacher));
    }
    return teacher;
  }

  async logout(): Promise<void> {
    await mockDelay(100);
    if (typeof window !== "undefined") window.localStorage.removeItem(SESSION_KEY);
  }

  async getCurrentTeacher(): Promise<Teacher | null> {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Teacher) : null;
  }
}

export const mockAuthRepository = new MockAuthRepository();

import { StudentRepository, StudentFilters } from "@/domain/repositories/student.repository";
import { Student, StudentInput, StudentModel } from "@/domain/models/student.model";
import { students, teachers, tuitions } from "@/data/mock/seed-data";
import { mockDelay, nextId } from "@/data/mock/delay";
import { generateStudentId } from "@/utils/id-generator";

// Tracks student IDs ever issued per tuition+course this session, so a
// teacher-created student never collides with (or reuses) one an admin
// issued. In a real backend this sequence would live server-side.
const studentIdSequenceIssued: Record<string, number> = {
  "tui-1:JEE": 3,
  "tui-1:NEET": 3,
  "tui-2:JEE": 2,
  "tui-2:NEET": 1,
  "tui-3:JEE": 1,
  "tui-3:NEET": 1,
};

// Mock implementation of StudentRepository, scoped to a teacher's own
// students. Enforces the admin-assigned student limit on create.
export class MockStudentRepository implements StudentRepository {
  async getAll(filters?: StudentFilters): Promise<Student[]> {
    await mockDelay();
    let result = [...students];
    if (filters?.teacherId) result = result.filter((s) => s.assignedTeacherId === filters.teacherId);
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((s) => s.name.toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q));
    }
    return result;
  }

  async getById(id: string): Promise<Student | null> {
    await mockDelay(150);
    return students.find((s) => s.id === id) ?? null;
  }

  async create(input: StudentInput): Promise<Student> {
    await mockDelay();
    const tuition = tuitions.find((t) => t.id === input.tuitionId);
    if (!tuition) throw new Error("Tuition not found.");
    const teacher = teachers.find((t) => t.id === input.assignedTeacherId);
    if (teacher) {
      const currentCount = students.filter((s) => s.assignedTeacherId === teacher.id).length;
      if (currentCount >= teacher.studentLimit) {
        throw new Error(`Student limit reached (${teacher.studentLimit}). Ask the Admin to raise your limit.`);
      }
    }

    const seqKey = `${input.tuitionId}:${input.course}`;
    const issuedSoFar = studentIdSequenceIssued[seqKey] ?? 0;
    const joiningYear = new Date(input.joiningDate).getFullYear();
    const studentId = generateStudentId(tuition.tuitionCode, input.course, joiningYear, issuedSoFar);
    studentIdSequenceIssued[seqKey] = issuedSoFar + 1;

    const created: Student = StudentModel.fromJson({
      id: nextId("stu"),
      studentId,
      name: input.name,
      parentName: input.parentName,
      parentPhone: input.parentPhone,
      studentPhone: input.studentPhone,
      email: input.email,
      tuitionId: input.tuitionId,
      tuitionName: tuition.tuitionName,
      course: input.course,
      assignedTeacherId: input.assignedTeacherId,
      assignedTeacherName: input.assignedTeacherName,
      status: "active",
      joiningDate: input.joiningDate,
      progressPercent: 0,
    });
    students.push(created);
    if (teacher) teacher.assignedStudentCount += 1;
    tuition.studentCount += 1;
    return created;
  }

  async update(id: string, changes: Partial<StudentInput>): Promise<Student> {
    await mockDelay();
    const index = students.findIndex((s) => s.id === id);
    if (index === -1) throw new Error("Student not found.");
    const updated = StudentModel.copyWith(students[index], changes);
    students[index] = updated;
    return updated;
  }

  async resetPassword(): Promise<void> {
    await mockDelay(200);
    // TODO (Backend): call POST /students/:id/reset-password.
  }
}

export const mockStudentRepository = new MockStudentRepository();

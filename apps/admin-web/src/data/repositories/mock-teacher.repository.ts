import { TeacherRepository, TeacherFilters } from "@/domain/repositories/teacher.repository";
import { Teacher, TeacherInput, TeacherModel } from "@/domain/models/teacher.model";
import { teachers, tuitions, teacherIdSequenceIssued } from "@/data/mock/seed-data";
import { mockDelay, nextId } from "@/data/mock/delay";
import { generateTeacherId } from "@/utils/id-generator";

// Mock implementation of TeacherRepository backed by the in-memory seed
// array. Replace with an HTTP implementation hitting api-routes.ts
// `teachers.*` once the backend is ready — the service layer above this
// will not need to change.
export class MockTeacherRepository implements TeacherRepository {
  async getAll(filters?: TeacherFilters): Promise<Teacher[]> {
    await mockDelay();
    let result = [...teachers];
    if (filters?.tuitionId) result = result.filter((t) => t.tuitionId === filters.tuitionId);
    if (filters?.status) result = result.filter((t) => t.status === filters.status);
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) => t.name.toLowerCase().includes(q) || t.teacherId.toLowerCase().includes(q) || t.email.toLowerCase().includes(q)
      );
    }
    return result;
  }

  async getById(id: string): Promise<Teacher | null> {
    await mockDelay(150);
    return teachers.find((t) => t.id === id) ?? null;
  }

  async create(input: TeacherInput): Promise<Teacher> {
    await mockDelay();
    const tuition = tuitions.find((t) => t.id === input.tuitionId);
    if (!tuition) throw new Error("Selected tuition not found.");

    const seqKey = `${input.tuitionId}:${input.subject}`;
    const issuedSoFar = teacherIdSequenceIssued[seqKey] ?? 0;
    const joiningYear = new Date(input.joiningDate).getFullYear();
    const teacherId = generateTeacherId(tuition.tuitionCode, input.subject, joiningYear, issuedSoFar);
    teacherIdSequenceIssued[seqKey] = issuedSoFar + 1;

    const created: Teacher = TeacherModel.fromJson({
      id: nextId("tch"),
      teacherId,
      name: input.name,
      tuitionId: input.tuitionId,
      tuitionName: tuition.tuitionName,
      subject: input.subject,
      phone: input.phone,
      email: input.email,
      joiningDate: input.joiningDate,
      status: input.status ?? "active",
      studentLimit: input.studentLimit,
      assignedStudentCount: 0,
    });
    teachers.push(created);
    tuition.teacherCount += 1;
    return created;
  }

  async update(id: string, changes: Partial<TeacherInput>): Promise<Teacher> {
    await mockDelay();
    const index = teachers.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Teacher not found.");
    const updated = TeacherModel.copyWith(teachers[index], changes);
    teachers[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<void> {
    await mockDelay();
    const index = teachers.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Teacher not found.");
    const tuition = tuitions.find((t) => t.id === teachers[index].tuitionId);
    if (tuition) tuition.teacherCount = Math.max(0, tuition.teacherCount - 1);
    teachers.splice(index, 1);
  }

  async suspend(id: string): Promise<Teacher> {
    return this.update(id, { status: "suspended" } as Partial<TeacherInput>);
  }

  async activate(id: string): Promise<Teacher> {
    return this.update(id, { status: "active" } as Partial<TeacherInput>);
  }

  async resetPassword(): Promise<void> {
    await mockDelay(200);
    // TODO (Backend): call POST /teachers/:id/reset-password with a
    // securely generated temporary password and email/SMS it out.
  }
}

export const mockTeacherRepository = new MockTeacherRepository();

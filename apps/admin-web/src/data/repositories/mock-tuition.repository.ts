import { TuitionRepository, TuitionFilters } from "@/domain/repositories/tuition.repository";
import { Tuition, TuitionInput, TuitionModel } from "@/domain/models/tuition.model";
import { tuitions } from "@/data/mock/seed-data";
import { mockDelay, nextId } from "@/data/mock/delay";

// Mock implementation of TuitionRepository. Suspend/activate only flips
// `status` — every related teacher, student, library, and lecture record
// stays untouched, matching the "no data loss" rule from the spec.
export class MockTuitionRepository implements TuitionRepository {
  async getAll(filters?: TuitionFilters): Promise<Tuition[]> {
    await mockDelay();
    let result = [...tuitions];
    if (filters?.status) result = result.filter((t) => t.status === filters.status);
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) => t.tuitionName.toLowerCase().includes(q) || t.tuitionCode.toLowerCase().includes(q)
      );
    }
    return result;
  }

  async getById(id: string): Promise<Tuition | null> {
    await mockDelay(150);
    return tuitions.find((t) => t.id === id) ?? null;
  }

  async create(input: TuitionInput): Promise<Tuition> {
    await mockDelay();
    if (tuitions.some((t) => t.tuitionCode.toLowerCase() === input.tuitionCode.toLowerCase())) {
      throw new Error("Tuition code already in use.");
    }
    const created: Tuition = TuitionModel.fromJson({
      id: nextId("tui"),
      tuitionName: input.tuitionName,
      tuitionCode: input.tuitionCode.toUpperCase(),
      ownerName: input.ownerName,
      address: input.address,
      contactNumber: input.contactNumber,
      email: input.email,
      status: input.status ?? "active",
      createdDate: new Date().toISOString(),
      teacherCount: 0,
      studentCount: 0,
      activeCourseCount: 0,
      totalRevenue: 0,
    });
    tuitions.push(created);
    return created;
  }

  async update(id: string, changes: Partial<TuitionInput>): Promise<Tuition> {
    await mockDelay();
    const index = tuitions.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Tuition not found.");
    const updated = TuitionModel.copyWith(tuitions[index], changes);
    tuitions[index] = updated;
    return updated;
  }

  async suspend(id: string): Promise<Tuition> {
    return this.update(id, { status: "suspended" });
  }

  async activate(id: string): Promise<Tuition> {
    return this.update(id, { status: "active" });
  }

  async delete(id: string): Promise<void> {
    await mockDelay();
    const index = tuitions.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Tuition not found.");
    tuitions.splice(index, 1);
  }
}

export const mockTuitionRepository = new MockTuitionRepository();

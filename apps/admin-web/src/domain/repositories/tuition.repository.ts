import { Tuition, TuitionInput } from "@/domain/models/tuition.model";

export interface TuitionFilters {
  status?: Tuition["status"];
  search?: string;
}

// Repository abstraction for Tuition (branch) management.
// Suspending/activating a tuition is a status flip only — all teacher,
// student, library, and lecture data is preserved, matching the spec's
// "no data loss on suspend" requirement.
export interface TuitionRepository {
  getAll(filters?: TuitionFilters): Promise<Tuition[]>;
  getById(id: string): Promise<Tuition | null>;
  create(input: TuitionInput): Promise<Tuition>;
  update(id: string, changes: Partial<TuitionInput>): Promise<Tuition>;
  suspend(id: string): Promise<Tuition>;
  activate(id: string): Promise<Tuition>;
  delete(id: string): Promise<void>;
}

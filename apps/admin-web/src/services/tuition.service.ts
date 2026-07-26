import { TuitionRepository, TuitionFilters } from "@/domain/repositories/tuition.repository";
import { mockTuitionRepository } from "@/data/repositories/mock-tuition.repository";
import { Tuition, TuitionInput } from "@/domain/models/tuition.model";

// Service layer for Tuition (branch) management, including
// suspend/reactivate — the only two operations that flip access for
// every teacher and student under a tuition.
export class TuitionService {
  constructor(private readonly repository: TuitionRepository = mockTuitionRepository) {}

  getAll(filters?: TuitionFilters): Promise<Tuition[]> {
    return this.repository.getAll(filters);
  }

  getById(id: string): Promise<Tuition | null> {
    return this.repository.getById(id);
  }

  create(input: TuitionInput): Promise<Tuition> {
    return this.repository.create(input);
  }

  update(id: string, changes: Partial<TuitionInput>): Promise<Tuition> {
    return this.repository.update(id, changes);
  }

  suspend(id: string): Promise<Tuition> {
    return this.repository.suspend(id);
  }

  activate(id: string): Promise<Tuition> {
    return this.repository.activate(id);
  }

  delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}

export const tuitionService = new TuitionService();

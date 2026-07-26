import { Quiz, QuizInput } from "@/domain/models/quiz.model";

export interface QuizFilters {
  tuitionId?: string;
  teacherId?: string;
  status?: Quiz["status"];
}

// Repository abstraction for Quiz management. Unlike the Teacher panel
// (scoped to one teacher's own quizzes), Admin has global visibility and
// can author a quiz under any teacher in any tuition — matching the
// "Admin has every power Teacher has, plus cross-tuition control" spec.
export interface QuizRepository {
  getAll(filters?: QuizFilters): Promise<Quiz[]>;
  getById(id: string): Promise<Quiz | null>;
  create(input: QuizInput): Promise<Quiz>;
  update(id: string, changes: Partial<QuizInput>): Promise<Quiz>;
  delete(id: string): Promise<void>;
  publish(id: string): Promise<Quiz>;
  schedule(id: string, scheduledAt: string): Promise<Quiz>;
}

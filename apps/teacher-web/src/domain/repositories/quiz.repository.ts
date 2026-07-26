import { Quiz, QuizInput } from "@/domain/models/quiz.model";

export interface QuizFilters {
  teacherId?: string;
  status?: Quiz["status"];
}

// Repository abstraction for Quiz authoring (Teacher panel). Question
// types: MCQ, Multiple Correct, True/False per spec.
export interface QuizRepository {
  getAll(filters?: QuizFilters): Promise<Quiz[]>;
  getById(id: string): Promise<Quiz | null>;
  create(input: QuizInput): Promise<Quiz>;
  update(id: string, changes: Partial<QuizInput>): Promise<Quiz>;
  delete(id: string): Promise<void>;
  publish(id: string): Promise<Quiz>;
  schedule(id: string, scheduledAt: string): Promise<Quiz>;
}

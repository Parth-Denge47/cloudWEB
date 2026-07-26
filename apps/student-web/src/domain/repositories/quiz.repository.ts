import { Quiz } from "@/domain/models/quiz.model";

export interface QuizFilters {
  tuitionId?: string;
  course?: Quiz["course"];
  status?: Quiz["status"];
}

// Read-only for students — quizzes are authored by teachers. Students
// only ever see `published` quizzes (enforced by the mock repository).
export interface QuizRepository {
  getAll(filters?: QuizFilters): Promise<Quiz[]>;
  getById(id: string): Promise<Quiz | null>;
}

import { QuizRepository, QuizFilters } from "@/domain/repositories/quiz.repository";
import { mockQuizRepository } from "@/data/repositories/mock-quiz.repository";
import { Quiz, QuizInput } from "@/domain/models/quiz.model";

export class QuizService {
  constructor(private readonly repository: QuizRepository = mockQuizRepository) {}
  getAll(filters?: QuizFilters): Promise<Quiz[]> {
    return this.repository.getAll(filters);
  }
  getById(id: string): Promise<Quiz | null> {
    return this.repository.getById(id);
  }
  create(input: QuizInput): Promise<Quiz> {
    return this.repository.create(input);
  }
  update(id: string, changes: Partial<QuizInput>): Promise<Quiz> {
    return this.repository.update(id, changes);
  }
  delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }
  publish(id: string): Promise<Quiz> {
    return this.repository.publish(id);
  }
  schedule(id: string, scheduledAt: string): Promise<Quiz> {
    return this.repository.schedule(id, scheduledAt);
  }
}

export const quizService = new QuizService();

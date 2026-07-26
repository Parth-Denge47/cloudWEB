import { QuizRepository, QuizFilters } from "@/domain/repositories/quiz.repository";
import { Quiz } from "@/domain/models/quiz.model";
import { quizzes } from "@/data/mock/seed-data";
import { mockDelay } from "@/data/mock/delay";

// Students only ever see published quizzes — drafts and closed quizzes
// are hidden regardless of any filters passed in.
export class MockQuizRepository implements QuizRepository {
  async getAll(filters?: QuizFilters): Promise<Quiz[]> {
    await mockDelay();
    let result = quizzes.filter((q) => q.status === "published");
    if (filters?.tuitionId) result = result.filter((q) => q.tuitionId === filters.tuitionId);
    if (filters?.course) result = result.filter((q) => q.course === filters.course);
    return result;
  }

  async getById(id: string): Promise<Quiz | null> {
    await mockDelay(150);
    const quiz = quizzes.find((q) => q.id === id);
    return quiz && quiz.status === "published" ? quiz : null;
  }
}

export const mockQuizRepository = new MockQuizRepository();

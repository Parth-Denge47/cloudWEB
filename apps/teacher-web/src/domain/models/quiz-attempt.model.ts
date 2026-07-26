// Lifecycle of a student's attempt at a quiz. `terminated` is reached
// automatically by the quiz-security UI flow (back navigation, leaving
// the app/tab) per spec — once terminated there is no resume, only a
// teacher/admin "Reset Attempt" creates a fresh attempt.
export type AttemptStatus = "in_progress" | "submitted" | "terminated";

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  studentId: string;
  studentName: string;
  status: AttemptStatus;
  answers: Record<string, number[]>; // questionId -> selected option indexes
  score: number | null;
  totalMarks: number;
  startedAt: string;
  submittedAt: string | null;
  terminationReason: string | null;
}

export const QuizAttemptModel = {
  fromJson(json: Record<string, unknown>): QuizAttempt {
    return {
      id: String(json.id),
      quizId: String(json.quizId),
      quizTitle: String(json.quizTitle),
      studentId: String(json.studentId),
      studentName: String(json.studentName),
      status: json.status as AttemptStatus,
      answers: (json.answers as Record<string, number[]>) ?? {},
      score: (json.score as number | null) ?? null,
      totalMarks: Number(json.totalMarks),
      startedAt: String(json.startedAt),
      submittedAt: (json.submittedAt as string) ?? null,
      terminationReason: (json.terminationReason as string) ?? null,
    };
  },
  toJson(attempt: QuizAttempt): Record<string, unknown> {
    return { ...attempt };
  },
  copyWith(attempt: QuizAttempt, changes: Partial<QuizAttempt>): QuizAttempt {
    return { ...attempt, ...changes };
  },
  equals(a: QuizAttempt, b: QuizAttempt): boolean {
    return a.id === b.id;
  },
};

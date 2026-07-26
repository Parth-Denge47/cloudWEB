"use client";

import { useEffect, useState } from "react";
import { FileQuestion, PlayCircle, CheckCircle2, XCircle, Clock } from "lucide-react";
import { PageHeader } from "@/presentation/components/ui/PageHeader";
import { Button } from "@/presentation/components/ui/Button";
import { Badge } from "@/presentation/components/ui/Badge";
import { LoadingState } from "@/presentation/components/ui/LoadingState";
import { EmptyState } from "@/presentation/components/ui/EmptyState";
import { QuizWarningScreen } from "@/presentation/components/quizzes/QuizWarningScreen";
import { QuizTakingView } from "@/presentation/components/quizzes/QuizTakingView";
import { QuizOutcomeCard } from "@/presentation/components/quizzes/QuizOutcomeCard";
import { useAuth } from "@/state/auth-context";
import { quizService } from "@/services/quiz.service";
import { quizAttemptService } from "@/services/quiz-attempt.service";
import { Quiz, QuizModel } from "@/domain/models/quiz.model";
import { QuizAttempt } from "@/domain/models/quiz-attempt.model";

type ViewMode =
  | { type: "list" }
  | { type: "warning"; quiz: Quiz }
  | { type: "taking"; quiz: Quiz; attempt: QuizAttempt }
  | { type: "outcome"; attempt: QuizAttempt };

export default function QuizzesPage() {
  const { student } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<ViewMode>({ type: "list" });

  async function loadData() {
    if (!student) return;
    setIsLoading(true);
    const [quizList, attemptList] = await Promise.all([
      quizService.getAll({ tuitionId: student.tuitionId, course: student.course }),
      quizAttemptService.getAllForStudent(student.id),
    ]);
    setQuizzes(quizList);
    setAttempts(attemptList);
    setIsLoading(false);
  }

  useEffect(() => {
    void (async () => {
      await loadData();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student]);

  if (!student) return <LoadingState />;

  function attemptFor(quizId: string) {
    return attempts.find((a) => a.quizId === quizId) ?? null;
  }

  async function handleStart(quiz: Quiz) {
    if (!student) return;
    const attempt = await quizAttemptService.start(quiz.id, quiz.title, student.id, student.name, QuizModel.totalMarks(quiz));
    setView({ type: "taking", quiz, attempt });
  }

  if (view.type === "warning") {
    return <QuizWarningScreen quiz={view.quiz} onStart={() => handleStart(view.quiz)} onCancel={() => setView({ type: "list" })} />;
  }

  if (view.type === "taking") {
    return (
      <QuizTakingView
        quiz={view.quiz}
        student={student}
        attempt={view.attempt}
        onFinished={(attempt) => {
          setAttempts((prev) => [attempt, ...prev.filter((a) => a.id !== attempt.id)]);
          setView({ type: "outcome", attempt });
        }}
      />
    );
  }

  if (view.type === "outcome") {
    return (
      <QuizOutcomeCard
        attempt={view.attempt}
        onDone={() => {
          setView({ type: "list" });
          void loadData();
        }}
      />
    );
  }

  return (
    <div>
      <PageHeader title="Quizzes" description="Attempt published tests for your course." />

      {isLoading ? (
        <LoadingState label="Loading quizzes..." />
      ) : quizzes.length === 0 ? (
        <EmptyState icon={FileQuestion} title="No quizzes available yet" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {quizzes.map((quiz) => {
            const attempt = attemptFor(quiz.id);
            return (
              <div key={quiz.id} className="flex flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-900/[0.02]">
                <div className="flex items-start justify-between">
                  <p className="font-semibold text-slate-800">{quiz.title}</p>
                  <Badge tone="brand">{quiz.course}</Badge>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  {quiz.subject} · {quiz.questions.length} questions · {quiz.durationMinutes} min
                </p>

                <div className="mt-4 flex-1">
                  {!attempt && (
                    <p className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Clock className="size-3.5" /> Not attempted yet
                    </p>
                  )}
                  {attempt?.status === "submitted" && (
                    <p className="flex items-center gap-1.5 text-xs text-emerald-600">
                      <CheckCircle2 className="size-3.5" /> Submitted · {attempt.score}/{attempt.totalMarks}
                    </p>
                  )}
                  {attempt?.status === "terminated" && (
                    <p className="flex items-center gap-1.5 text-xs text-red-600">
                      <XCircle className="size-3.5" /> Terminated — ask your teacher to reset
                    </p>
                  )}
                </div>

                <Button className="mt-4 w-full" disabled={Boolean(attempt)} onClick={() => setView({ type: "warning", quiz })}>
                  <PlayCircle className="size-4" /> {attempt ? "Already Attempted" : "Start Test"}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

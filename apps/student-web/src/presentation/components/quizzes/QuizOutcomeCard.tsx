import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/presentation/components/ui/Button";
import { QuizAttempt } from "@/domain/models/quiz-attempt.model";

interface QuizOutcomeCardProps {
  attempt: QuizAttempt;
  onDone: () => void;
}

export function QuizOutcomeCard({ attempt, onDone }: QuizOutcomeCardProps) {
  const terminated = attempt.status === "terminated";

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm shadow-slate-900/[0.03]">
      <div
        className={`mx-auto mb-4 flex size-14 items-center justify-center rounded-full ${
          terminated ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
        }`}
      >
        {terminated ? <XCircle className="size-7" /> : <CheckCircle2 className="size-7" />}
      </div>
      <h2 className="text-lg font-semibold text-slate-900">{terminated ? "Test Terminated" : "Test Submitted"}</h2>
      <p className="mt-1 text-sm text-slate-500">{attempt.quizTitle}</p>

      {terminated ? (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {attempt.terminationReason} This attempt cannot be resumed — ask your teacher to reset it if this was accidental.
        </p>
      ) : (
        <p className="mt-4 text-2xl font-semibold text-slate-800">
          {attempt.score} / {attempt.totalMarks}
        </p>
      )}

      <Button className="mt-6" onClick={onDone}>
        Back to Quizzes
      </Button>
    </div>
  );
}

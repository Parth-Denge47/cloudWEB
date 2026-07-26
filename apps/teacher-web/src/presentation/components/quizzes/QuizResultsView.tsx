"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, RotateCcw, ClipboardList } from "lucide-react";
import { Button } from "@/presentation/components/ui/Button";
import { Badge, statusTone } from "@/presentation/components/ui/Badge";
import { LoadingState } from "@/presentation/components/ui/LoadingState";
import { EmptyState } from "@/presentation/components/ui/EmptyState";
import { TableContainer, TableHead, Th, TableBody, Tr, Td } from "@/presentation/components/ui/Table";
import { Quiz } from "@/domain/models/quiz.model";
import { QuizAttempt } from "@/domain/models/quiz-attempt.model";
import { quizAttemptService } from "@/services/quiz-attempt.service";
import { formatDateTime } from "@/utils/format";

interface QuizResultsViewProps {
  quiz: Quiz;
  onBack: () => void;
}

// "Reset Quiz Attempt for any assigned student even if: Test was
// submitted, Test was terminated, Student already completed it" per spec.
export function QuizResultsView({ quiz, onBack }: QuizResultsViewProps) {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [resettingId, setResettingId] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      setIsLoading(true);
      const result = await quizAttemptService.getAll({ quizId: quiz.id });
      setAttempts(result);
      setIsLoading(false);
    })();
  }, [quiz.id]);

  async function handleReset(attemptId: string) {
    setResettingId(attemptId);
    try {
      await quizAttemptService.reset(attemptId);
      setAttempts((prev) => prev.filter((a) => a.id !== attemptId));
    } finally {
      setResettingId(null);
    }
  }

  return (
    <div>
      <button onClick={onBack} className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="size-4" /> Back to Quizzes
      </button>
      <h2 className="mb-1 text-lg font-semibold text-slate-900">{quiz.title} — Results</h2>
      <p className="mb-5 text-sm text-slate-500">
        {quiz.subject} · {quiz.course} · {quiz.questions.length} questions
      </p>

      {isLoading ? (
        <LoadingState label="Loading results..." />
      ) : attempts.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No attempts yet" description="Results will appear here once students take this quiz." />
      ) : (
        <TableContainer>
          <TableHead>
            <Th>Student</Th>
            <Th>Status</Th>
            <Th>Score</Th>
            <Th>Submitted</Th>
            <Th className="text-right">Actions</Th>
          </TableHead>
          <TableBody>
            {attempts.map((attempt) => (
              <Tr key={attempt.id}>
                <Td className="font-medium text-slate-800">{attempt.studentName}</Td>
                <Td>
                  <Badge tone={statusTone(attempt.status)}>{attempt.status.replace("_", " ")}</Badge>
                  {attempt.terminationReason && <p className="mt-1 text-[11px] text-slate-400">{attempt.terminationReason}</p>}
                </Td>
                <Td>{attempt.score !== null ? `${attempt.score}/${attempt.totalMarks}` : "-"}</Td>
                <Td>{attempt.submittedAt ? formatDateTime(attempt.submittedAt) : "-"}</Td>
                <Td className="text-right">
                  <Button size="sm" variant="outline" isLoading={resettingId === attempt.id} onClick={() => handleReset(attempt.id)}>
                    <RotateCcw className="size-3.5" /> Reset Attempt
                  </Button>
                </Td>
              </Tr>
            ))}
          </TableBody>
        </TableContainer>
      )}
    </div>
  );
}

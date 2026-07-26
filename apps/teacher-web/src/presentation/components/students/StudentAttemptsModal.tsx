"use client";

import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Modal } from "@/presentation/components/ui/Modal";
import { Badge, statusTone } from "@/presentation/components/ui/Badge";
import { Button } from "@/presentation/components/ui/Button";
import { LoadingState } from "@/presentation/components/ui/LoadingState";
import { Student } from "@/domain/models/student.model";
import { QuizAttempt } from "@/domain/models/quiz-attempt.model";
import { quizAttemptService } from "@/services/quiz-attempt.service";
import { formatDateTime } from "@/utils/format";

interface StudentAttemptsModalProps {
  open: boolean;
  student: Student | null;
  teacherId: string;
  onClose: () => void;
}

// "Reset Any Quiz/Test Attempt for their own students (including
// completed or terminated tests)" per spec — works regardless of the
// attempt's current status.
export function StudentAttemptsModal({ open, student, teacherId, onClose }: StudentAttemptsModalProps) {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [resettingId, setResettingId] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !student) return;
    void (async () => {
      setIsLoading(true);
      const result = await quizAttemptService.getAll({ studentId: student.id, teacherId });
      setAttempts(result);
      setIsLoading(false);
    })();
  }, [open, student, teacherId]);

  async function handleReset(attemptId: string) {
    setResettingId(attemptId);
    try {
      await quizAttemptService.reset(attemptId);
      setAttempts((prev) => prev.filter((a) => a.id !== attemptId));
    } finally {
      setResettingId(null);
    }
  }

  if (!student) return null;

  return (
    <Modal open={open} onClose={onClose} title="Quiz Attempts" description={`${student.name} (${student.studentId})`} widthClassName="max-w-lg">
      {isLoading ? (
        <LoadingState label="Loading attempts..." />
      ) : attempts.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">No quiz attempts recorded for this student yet.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {attempts.map((attempt) => (
            <li key={attempt.id} className="flex items-center justify-between gap-3 py-3">
              <div>
                <p className="text-sm font-medium text-slate-700">{attempt.quizTitle}</p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge tone={statusTone(attempt.status)}>{attempt.status.replace("_", " ")}</Badge>
                  {attempt.score !== null && (
                    <span className="text-xs text-slate-400">
                      Score: {attempt.score}/{attempt.totalMarks}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-[11px] text-slate-400">Started {formatDateTime(attempt.startedAt)}</p>
              </div>
              <Button size="sm" variant="outline" isLoading={resettingId === attempt.id} onClick={() => handleReset(attempt.id)}>
                <RotateCcw className="size-3.5" /> Reset
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}

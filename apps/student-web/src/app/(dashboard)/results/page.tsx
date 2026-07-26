"use client";

import { useEffect, useState } from "react";
import { Award } from "lucide-react";
import { PageHeader } from "@/presentation/components/ui/PageHeader";
import { Badge, statusTone } from "@/presentation/components/ui/Badge";
import { TableContainer, TableHead, Th, TableBody, Tr, Td } from "@/presentation/components/ui/Table";
import { LoadingState } from "@/presentation/components/ui/LoadingState";
import { EmptyState } from "@/presentation/components/ui/EmptyState";
import { useAuth } from "@/state/auth-context";
import { quizAttemptService } from "@/services/quiz-attempt.service";
import { QuizAttempt } from "@/domain/models/quiz-attempt.model";
import { formatDateTime } from "@/utils/format";

export default function ResultsPage() {
  const { student } = useAuth();
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!student) return;
    void (async () => {
      setIsLoading(true);
      const result = await quizAttemptService.getAllForStudent(student.id);
      setAttempts(result);
      setIsLoading(false);
    })();
  }, [student]);

  return (
    <div>
      <PageHeader title="Results" description="Your quiz and test history." />

      {isLoading ? (
        <LoadingState label="Loading results..." />
      ) : attempts.length === 0 ? (
        <EmptyState icon={Award} title="No results yet" description="Attempt a quiz to see your results here." />
      ) : (
        <TableContainer>
          <TableHead>
            <Th>Quiz</Th>
            <Th>Status</Th>
            <Th>Score</Th>
            <Th>Started</Th>
            <Th>Submitted</Th>
          </TableHead>
          <TableBody>
            {attempts.map((attempt) => (
              <Tr key={attempt.id}>
                <Td className="font-medium text-slate-800">{attempt.quizTitle}</Td>
                <Td>
                  <Badge tone={statusTone(attempt.status)}>{attempt.status.replace("_", " ")}</Badge>
                </Td>
                <Td>{attempt.score !== null ? `${attempt.score}/${attempt.totalMarks}` : "-"}</Td>
                <Td>{formatDateTime(attempt.startedAt)}</Td>
                <Td>{attempt.submittedAt ? formatDateTime(attempt.submittedAt) : "-"}</Td>
              </Tr>
            ))}
          </TableBody>
        </TableContainer>
      )}
    </div>
  );
}

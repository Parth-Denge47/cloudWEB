"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, Clock } from "lucide-react";
import { Button } from "@/presentation/components/ui/Button";
import { Quiz, QuizModel } from "@/domain/models/quiz.model";
import { QuizAttempt } from "@/domain/models/quiz-attempt.model";
import { quizAttemptService } from "@/services/quiz-attempt.service";
import { Student } from "@/domain/models/student.model";

interface QuizTakingViewProps {
  quiz: Quiz;
  student: Student;
  attempt: QuizAttempt; // already started (status: in_progress)
  onFinished: (attempt: QuizAttempt) => void; // called on submit or termination
}

// Live quiz-taking screen implementing the spec's quiz-security UI flow:
// - Front camera requested and shown as "monitored" for the duration.
// - Browser back navigation terminates the attempt immediately (popstate).
// - Backgrounding the tab/app terminates the attempt immediately (visibilitychange).
// - Termination auto-submits (as `terminated`, not `submitted`) with no resume.
// TODO (Backend/Native): a production build should also guard in-app
// route changes and use a native camera stream, not just tab-visibility.
export function QuizTakingView({ quiz, student, attempt, onFinished }: QuizTakingViewProps) {
  const [answers, setAnswers] = useState<Record<string, number[]>>(attempt.answers);
  const [secondsLeft, setSecondsLeft] = useState(quiz.durationMinutes * 60);
  const [cameraStatus, setCameraStatus] = useState<"pending" | "granted" | "denied">("pending");
  const [isFinishing, setIsFinishing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const finishedRef = useRef(false);

  function computeScore(finalAnswers: Record<string, number[]>): number {
    const rawScore = quiz.questions.reduce((sum, q) => {
      const given = (finalAnswers[q.id] ?? []).slice().sort();
      if (given.length === 0) return sum;
      const correct = q.correctOptionIndexes.slice().sort();
      const isCorrect = given.length === correct.length && given.every((v, i) => v === correct[i]);
      if (isCorrect) {
        return sum + q.marks;
      } else {
        return sum - (quiz.negativeMarksPerWrong ?? 0);
      }
    }, 0);
    return Math.max(0, rawScore);
  }

  async function finishAsSubmitted() {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setIsFinishing(true);
    const score = computeScore(answers);
    const updated = await quizAttemptService.submit(attempt.id, answers, score);
    onFinished(updated);
  }

  async function finishAsTerminated(reason: string) {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const updated = await quizAttemptService.terminate(attempt.id, reason);
    onFinished(updated);
  }

  // Camera: requested once, released on unmount. Failure degrades
  // gracefully — the test still proceeds without blocking the student.
  useEffect(() => {
    let stream: MediaStream | null = null;
    void (async () => {
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        setCameraStatus("denied");
        return;
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraStatus("granted");
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch {
        setCameraStatus("denied");
      }
    })();
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  // Back-button termination: push a guard state so the first back press
  // fires `popstate` here instead of leaving the page.
  useEffect(() => {
    window.history.pushState({ quizGuard: true }, "");
    const handlePopState = () => finishAsTerminated("Student pressed back during the quiz.");
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Leaving-app termination: tab hidden (backgrounded, switched away, or closed).
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) finishAsTerminated("Student left the app/tab during the quiz.");
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Countdown timer; time running out auto-submits (not a termination).
  useEffect(() => {
    if (secondsLeft <= 0) {
      finishAsSubmitted();
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  function toggleAnswer(questionId: string, optionIndex: number, multi: boolean) {
    setAnswers((prev) => {
      const current = prev[questionId] ?? [];
      if (multi) {
        const has = current.includes(optionIndex);
        return { ...prev, [questionId]: has ? current.filter((i) => i !== optionIndex) : [...current, optionIndex] };
      }
      return { ...prev, [questionId]: [optionIndex] };
    });
  }

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm shadow-slate-900/[0.02]">
        <div>
          <p className="font-semibold text-slate-800">{quiz.title}</p>
          <p className="text-xs text-slate-400">
            {quiz.subject} · {quiz.course} · {QuizModel.totalMarks(quiz)} marks
            {quiz.negativeMarksPerWrong > 0 ? ` · -${quiz.negativeMarksPerWrong} mark per wrong answer` : ""}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
            <Clock className="size-4 text-brand-600" />
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>
          <div
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
              cameraStatus === "granted" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
            }`}
          >
            {cameraStatus === "granted" ? <Camera className="size-3.5" /> : <CameraOff className="size-3.5" />}
            {cameraStatus === "granted" ? "Camera monitoring active" : cameraStatus === "denied" ? "Camera unavailable" : "Requesting camera..."}
          </div>
          {cameraStatus === "granted" && (
            <video ref={videoRef} autoPlay muted playsInline className="h-10 w-14 rounded-md border border-slate-200 object-cover" />
          )}
        </div>
      </div>

      <div className="space-y-4">
        {quiz.questions.map((q, index) => {
          const multi = q.type === "multiple_correct";
          return (
            <div key={q.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-900/[0.02]">
              <p className="mb-3 text-sm font-medium text-slate-800">
                Q{index + 1}. {q.text} <span className="text-xs font-normal text-slate-400">({q.marks} marks)</span>
              </p>
              <div className="space-y-2">
                {q.options.map((option, optionIndex) => (
                  <label key={optionIndex} className="flex items-center gap-2 rounded-lg border border-slate-100 px-3 py-2 text-sm hover:bg-slate-50">
                    <input
                      type={multi ? "checkbox" : "radio"}
                      name={q.id}
                      checked={(answers[q.id] ?? []).includes(optionIndex)}
                      onChange={() => toggleAnswer(q.id, optionIndex, multi)}
                      className="size-4 accent-brand-600"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end">
        <Button isLoading={isFinishing} onClick={finishAsSubmitted}>
          Submit Test
        </Button>
      </div>

      <p className="mt-3 text-center text-xs text-slate-400">Signed in as {student.name} · Leaving this screen terminates the test.</p>
    </div>
  );
}

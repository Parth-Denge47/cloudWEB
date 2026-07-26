"use client";

import { AlertTriangle, Camera, Clock, ShieldAlert } from "lucide-react";
import { Button } from "@/presentation/components/ui/Button";
import { Quiz } from "@/domain/models/quiz.model";

interface QuizWarningScreenProps {
  quiz: Quiz;
  onStart: () => void;
  onCancel: () => void;
}

// Pre-quiz security notice per spec: front camera active during the
// quiz, leaving the app/back navigation terminates it immediately with
// no resume, and everything auto-submits on termination. The actual
// camera/termination enforcement lives in QuizTakingView — this screen
// is the required warning shown before it starts.
export function QuizWarningScreen({ quiz, onStart, onCancel }: QuizWarningScreenProps) {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-900/[0.03]">
      <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
        <ShieldAlert className="size-6" />
      </div>
      <h2 className="text-lg font-semibold text-slate-900">{quiz.title}</h2>
      <p className="mt-1 text-sm text-slate-500">
        {quiz.subject} · {quiz.course} · {quiz.questions.length} questions · {quiz.durationMinutes} minutes
      </p>

      <ul className="mt-5 space-y-3 text-sm text-slate-600">
        <li className="flex items-start gap-2">
          <Camera className="mt-0.5 size-4 shrink-0 text-slate-400" />
          Your front camera will be requested and monitored for the duration of the test.
        </li>
        <li className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-slate-400" />
          Pressing back or leaving this app/tab will immediately terminate the test — it cannot be resumed.
        </li>
        <li className="flex items-start gap-2">
          <Clock className="mt-0.5 size-4 shrink-0 text-slate-400" />
          Whatever you&apos;ve answered is auto-submitted the moment the test is terminated.
        </li>
      </ul>

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Not Now
        </Button>
        <Button onClick={onStart}>I&apos;m Ready, Start Test</Button>
      </div>
    </div>
  );
}

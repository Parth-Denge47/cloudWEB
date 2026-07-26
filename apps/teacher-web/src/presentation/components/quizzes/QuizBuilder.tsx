"use client";

import { useState } from "react";
import { Plus, Trash2, Save, Send } from "lucide-react";
import { Button } from "@/presentation/components/ui/Button";
import { TextField, SelectField } from "@/presentation/components/ui/FormField";
import { Quiz, QuizInput, Question } from "@/domain/models/quiz.model";
import { QuestionType, CourseCode } from "@/domain/models/enums";
import { Teacher } from "@/domain/models/teacher.model";

interface QuizBuilderProps {
  quiz: Quiz | null; // null = create mode
  teacher: Teacher;
  // `publish` tells the caller whether to publish immediately after
  // create/update, avoiding any dependency on stale component state.
  onSave: (input: QuizInput, publish: boolean) => Promise<void>;
  onCancel: () => void;
}

function blankQuestion(type: QuestionType = "mcq"): Question {
  return {
    id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    text: "",
    type,
    options: type === "true_false" ? ["True", "False"] : ["", ""],
    correctOptionIndexes: [],
    marks: 4,
  };
}

// Quiz authoring UI — create/edit form with a dynamic question builder
// supporting MCQ, Multiple Correct, and True/False per spec. Rendered
// inline (not a separate route) so it works within the static export
// used for the Android build, where new quiz ids have no pre-rendered page.
export function QuizBuilder({ quiz, teacher, onSave, onCancel }: QuizBuilderProps) {
  const [title, setTitle] = useState(quiz?.title ?? "");
  const [subject, setSubject] = useState(quiz?.subject ?? teacher.subject);
  const [course, setCourse] = useState<CourseCode>(quiz?.course ?? "JEE");
  const [durationMinutes, setDurationMinutes] = useState(quiz?.durationMinutes ?? 30);
  const [questions, setQuestions] = useState<Question[]>(quiz?.questions ?? [blankQuestion()]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateQuestion(index: number, changes: Partial<Question>) {
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, ...changes } : q)));
  }

  function changeQuestionType(index: number, type: QuestionType) {
    updateQuestion(index, {
      type,
      options: type === "true_false" ? ["True", "False"] : ["", ""],
      correctOptionIndexes: [],
    });
  }

  function toggleCorrect(index: number, optionIndex: number) {
    const q = questions[index];
    if (q.type === "multiple_correct") {
      const has = q.correctOptionIndexes.includes(optionIndex);
      updateQuestion(index, {
        correctOptionIndexes: has ? q.correctOptionIndexes.filter((i) => i !== optionIndex) : [...q.correctOptionIndexes, optionIndex],
      });
    } else {
      updateQuestion(index, { correctOptionIndexes: [optionIndex] });
    }
  }

  function addOption(index: number) {
    const q = questions[index];
    updateQuestion(index, { options: [...q.options, ""] });
  }

  function removeOption(index: number, optionIndex: number) {
    const q = questions[index];
    updateQuestion(index, {
      options: q.options.filter((_, i) => i !== optionIndex),
      correctOptionIndexes: q.correctOptionIndexes.filter((i) => i !== optionIndex).map((i) => (i > optionIndex ? i - 1 : i)),
    });
  }

  function validate(): string | null {
    if (!title.trim()) return "Give the quiz a title.";
    if (questions.length === 0) return "Add at least one question.";
    for (const q of questions) {
      if (!q.text.trim()) return "Every question needs question text.";
      if (q.options.some((o) => !o.trim())) return "Every option needs text.";
      if (q.correctOptionIndexes.length === 0) return "Mark the correct answer for every question.";
    }
    return null;
  }

  async function handleSave(publishAfter: boolean) {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setIsSaving(true);
    try {
      await onSave(
        {
          title,
          tuitionId: teacher.tuitionId,
          course,
          subject,
          teacherId: teacher.id,
          teacherName: teacher.name,
          questions,
          durationMinutes: Number(durationMinutes),
          status: quiz?.status ?? "draft",
          scheduledAt: quiz?.scheduledAt ?? null,
        },
        publishAfter
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="rounded-2xl border border-slate-100 bg-white p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <TextField label="Quiz Title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Rotational Motion Test" />
          <TextField label="Subject" required value={subject} onChange={(e) => setSubject(e.target.value)} />
          <SelectField label="Course" required value={course} onChange={(e) => setCourse(e.target.value as CourseCode)}>
            <option value="JEE">JEE</option>
            <option value="NEET">NEET</option>
          </SelectField>
          <TextField label="Duration (minutes)" type="number" min={1} required value={durationMinutes} onChange={(e) => setDurationMinutes(Number(e.target.value))} />
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((q, index) => (
          <div key={q.id} className="rounded-2xl border border-slate-100 bg-white p-5">
            <div className="mb-3 flex items-start justify-between gap-3">
              <span className="mt-2 text-xs font-semibold text-slate-400">Q{index + 1}</span>
              <div className="flex flex-1 gap-3">
                <TextField
                  label="Question Text"
                  required
                  className="w-full"
                  value={q.text}
                  onChange={(e) => updateQuestion(index, { text: e.target.value })}
                />
              </div>
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => setQuestions((prev) => prev.filter((_, i) => i !== index))}
                  className="mt-6 rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                  aria-label="Remove question"
                >
                  <Trash2 className="size-4" />
                </button>
              )}
            </div>

            <div className="mb-3 grid grid-cols-2 gap-3">
              <SelectField label="Question Type" value={q.type} onChange={(e) => changeQuestionType(index, e.target.value as QuestionType)}>
                <option value="mcq">MCQ (single correct)</option>
                <option value="multiple_correct">Multiple Correct</option>
                <option value="true_false">True / False</option>
              </SelectField>
              <TextField label="Marks" type="number" min={1} value={q.marks} onChange={(e) => updateQuestion(index, { marks: Number(e.target.value) })} />
            </div>

            <div className="space-y-2">
              <span className="mb-1 block text-xs font-medium text-slate-600">
                Options {q.type !== "true_false" && "(check the correct answer)"}
              </span>
              {q.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center gap-2">
                  <input
                    type={q.type === "multiple_correct" ? "checkbox" : "radio"}
                    name={`correct-${q.id}`}
                    checked={q.correctOptionIndexes.includes(optionIndex)}
                    onChange={() => toggleCorrect(index, optionIndex)}
                    className="size-4 shrink-0 accent-brand-600"
                  />
                  <input
                    type="text"
                    value={option}
                    disabled={q.type === "true_false"}
                    onChange={(e) =>
                      updateQuestion(index, {
                        options: q.options.map((o, i) => (i === optionIndex ? e.target.value : o)),
                      })
                    }
                    placeholder={`Option ${optionIndex + 1}`}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm disabled:bg-slate-50 disabled:text-slate-400"
                  />
                  {q.type !== "true_false" && q.options.length > 2 && (
                    <button type="button" onClick={() => removeOption(index, optionIndex)} className="text-slate-400 hover:text-red-600">
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </div>
              ))}
              {q.type !== "true_false" && (
                <button type="button" onClick={() => addOption(index)} className="text-xs font-medium text-brand-600 hover:text-brand-700">
                  + Add option
                </button>
              )}
            </div>
          </div>
        ))}

        <Button type="button" variant="outline" onClick={() => setQuestions((prev) => [...prev, blankQuestion()])}>
          <Plus className="size-4" /> Add Question
        </Button>
      </div>

      <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" variant="outline" isLoading={isSaving} onClick={() => handleSave(false)}>
          <Save className="size-4" /> Save Draft
        </Button>
        <Button type="button" isLoading={isSaving} onClick={() => handleSave(true)}>
          <Send className="size-4" /> Save & Publish
        </Button>
      </div>
    </div>
  );
}

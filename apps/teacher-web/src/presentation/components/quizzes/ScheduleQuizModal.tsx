"use client";

import { FormEvent, useState } from "react";
import { Modal } from "@/presentation/components/ui/Modal";
import { Button } from "@/presentation/components/ui/Button";
import { TextField } from "@/presentation/components/ui/FormField";
import { Quiz } from "@/domain/models/quiz.model";

interface ScheduleQuizModalProps {
  open: boolean;
  quiz: Quiz | null;
  onClose: () => void;
  onSchedule: (scheduledAt: string) => Promise<void>;
}

export function ScheduleQuizModal({ open, quiz, onClose, onSchedule }: ScheduleQuizModalProps) {
  const [dateTime, setDateTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!dateTime) return;
    setIsSubmitting(true);
    try {
      await onSchedule(new Date(dateTime).toISOString());
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Schedule Quiz" description={quiz?.title} widthClassName="max-w-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField label="Date & Time" type="datetime-local" required value={dateTime} onChange={(e) => setDateTime(e.target.value)} />
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting} disabled={!dateTime}>
            Schedule
          </Button>
        </div>
      </form>
    </Modal>
  );
}

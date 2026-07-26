"use client";

import { FormEvent, useState } from "react";
import { Modal } from "@/presentation/components/ui/Modal";
import { Button } from "@/presentation/components/ui/Button";
import { SelectField } from "@/presentation/components/ui/FormField";
import { Student } from "@/domain/models/student.model";
import { Teacher } from "@/domain/models/teacher.model";

interface ReassignTeacherModalProps {
  open: boolean;
  student: Student | null;
  teachers: Teacher[]; // pre-filtered to the student's tuition
  onClose: () => void;
  onSubmit: (teacherId: string, teacherName: string) => Promise<void>;
}

// Initial state is computed lazily from props; the parent remounts this
// component (via a changing `key`) each time it opens instead of syncing
// state through an effect.
export function ReassignTeacherModal({ open, student, teachers, onClose, onSubmit }: ReassignTeacherModalProps) {
  const [teacherId, setTeacherId] = useState(student?.assignedTeacherId ?? teachers[0]?.id ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const teacher = teachers.find((t) => t.id === teacherId);
    if (!teacher) return;
    setIsSubmitting(true);
    try {
      await onSubmit(teacher.id, teacher.name);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Reassign Teacher" description={student ? `${student.name} (${student.studentId})` : ""} widthClassName="max-w-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <SelectField label="Teacher" required value={teacherId} onChange={(e) => setTeacherId(e.target.value)}>
          {teachers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} ({t.subject})
            </option>
          ))}
        </SelectField>
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting} disabled={!teacherId}>
            Reassign
          </Button>
        </div>
      </form>
    </Modal>
  );
}

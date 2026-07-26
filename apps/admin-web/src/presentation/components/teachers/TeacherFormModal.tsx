"use client";

import { FormEvent, useState } from "react";
import { Modal } from "@/presentation/components/ui/Modal";
import { Button } from "@/presentation/components/ui/Button";
import { TextField, SelectField } from "@/presentation/components/ui/FormField";
import { Teacher, TeacherInput } from "@/domain/models/teacher.model";
import { Tuition } from "@/domain/models/tuition.model";
import { SUBJECT_CODES } from "@/domain/models/enums";

interface TeacherFormModalProps {
  open: boolean;
  teacher: Teacher | null; // null = create mode
  tuitions: Tuition[];
  defaultTuitionId?: string;
  onClose: () => void;
  onSubmit: (input: TeacherInput) => Promise<void>;
}

const SUBJECTS = Object.keys(SUBJECT_CODES);

// Add/Edit Teacher form. Tuition + Subject are locked once a teacher is
// created because the Teacher ID ([TuitionCode][YY][SubjectCode][No]) is
// derived from them at creation time and must never change afterwards.
//
// Initial state is computed lazily from props instead of synced via a
// reset-effect: the parent remounts this component (via a changing `key`)
// each time it opens, which is the pattern React recommends for
// "reinitialize state when triggered by an external event" instead of
// setState-in-effect.
export function TeacherFormModal({ teacher, tuitions, defaultTuitionId, onClose, onSubmit, open }: TeacherFormModalProps) {
  const isEdit = Boolean(teacher);
  const [name, setName] = useState(teacher?.name ?? "");
  const [tuitionId, setTuitionId] = useState(teacher?.tuitionId ?? defaultTuitionId ?? tuitions[0]?.id ?? "");
  const [subject, setSubject] = useState(teacher?.subject ?? SUBJECTS[0]);
  const [phone, setPhone] = useState(teacher?.phone ?? "");
  const [email, setEmail] = useState(teacher?.email ?? "");
  const [joiningDate, setJoiningDate] = useState(teacher?.joiningDate.slice(0, 10) ?? new Date().toISOString().slice(0, 10));
  const [studentLimit, setStudentLimit] = useState(teacher?.studentLimit ?? 30);
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({
        name,
        tuitionId,
        tuitionName: tuitions.find((t) => t.id === tuitionId)?.tuitionName ?? "",
        subject,
        phone,
        email,
        joiningDate: new Date(joiningDate).toISOString(),
        studentLimit: Number(studentLimit),
        password: password || undefined,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Teacher" : "Add Teacher"}
      description={isEdit ? `Teacher ID: ${teacher?.teacherId}` : "Teacher ID will be generated automatically."}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}

        <TextField label="Full Name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Vikram Mehta" />

        <div className="grid grid-cols-2 gap-3">
          <SelectField
            label="Tuition"
            required
            value={tuitionId}
            disabled={isEdit}
            onChange={(e) => setTuitionId(e.target.value)}
          >
            {tuitions.map((t) => (
              <option key={t.id} value={t.id}>
                {t.tuitionName} ({t.tuitionCode})
              </option>
            ))}
          </SelectField>
          <SelectField label="Subject" required value={subject} disabled={isEdit} onChange={(e) => setSubject(e.target.value)}>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </SelectField>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <TextField label="Phone" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 90000 00000" />
          <TextField label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@tuition.in" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <TextField label="Joining Date" type="date" required value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} />
          <TextField
            label="Student Limit"
            type="number"
            min={1}
            required
            value={studentLimit}
            onChange={(e) => setStudentLimit(Number(e.target.value))}
          />
        </div>

        {!isEdit && (
          <TextField
            label="Initial Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Set a temporary password"
          />
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEdit ? "Save Changes" : "Add Teacher"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

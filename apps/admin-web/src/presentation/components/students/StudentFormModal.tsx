"use client";

import { FormEvent, useState } from "react";
import { Modal } from "@/presentation/components/ui/Modal";
import { Button } from "@/presentation/components/ui/Button";
import { TextField, SelectField } from "@/presentation/components/ui/FormField";
import { Student, StudentInput } from "@/domain/models/student.model";
import { Tuition } from "@/domain/models/tuition.model";
import { Teacher } from "@/domain/models/teacher.model";
import { CourseCode } from "@/domain/models/enums";

interface StudentFormModalProps {
  open: boolean;
  student: Student | null; // null = create mode
  tuitions: Tuition[];
  teachers: Teacher[];
  defaultTuitionId?: string;
  onClose: () => void;
  onSubmit: (input: StudentInput) => Promise<void>;
}

const COURSES: CourseCode[] = ["JEE", "NEET"];

// Add/Edit Student form. Tuition + Course are locked once created because
// the Student ID ([TuitionCode][YY][CourseCode][No]) is derived from them
// and must never change or be reused, per spec.
//
// Initial state is computed lazily from props; the parent remounts this
// component (via a changing `key`) each time it opens instead of syncing
// state through an effect.
export function StudentFormModal({ open, student, tuitions, teachers, defaultTuitionId, onClose, onSubmit }: StudentFormModalProps) {
  const isEdit = Boolean(student);
  const [name, setName] = useState(student?.name ?? "");
  const [parentName, setParentName] = useState(student?.parentName ?? "");
  const [parentPhone, setParentPhone] = useState(student?.parentPhone ?? "");
  const [studentPhone, setStudentPhone] = useState(student?.studentPhone ?? "");
  const [email, setEmail] = useState(student?.email ?? "");
  const [tuitionId, setTuitionId] = useState(student?.tuitionId ?? defaultTuitionId ?? tuitions[0]?.id ?? "");
  const [course, setCourse] = useState<CourseCode>(student?.course ?? "JEE");
  const [assignedTeacherId, setAssignedTeacherId] = useState(student?.assignedTeacherId ?? "");
  const [joiningDate, setJoiningDate] = useState(student?.joiningDate.slice(0, 10) ?? new Date().toISOString().slice(0, 10));
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const teachersForTuition = teachers.filter((t) => t.tuitionId === tuitionId && t.status === "active");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const teacher = teachers.find((t) => t.id === assignedTeacherId);
      await onSubmit({
        name,
        parentName,
        parentPhone,
        studentPhone,
        email,
        tuitionId,
        tuitionName: tuitions.find((t) => t.id === tuitionId)?.tuitionName ?? "",
        course,
        assignedTeacherId: teacher?.id ?? null,
        assignedTeacherName: teacher?.name ?? null,
        joiningDate: new Date(joiningDate).toISOString(),
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
      title={isEdit ? "Edit Student" : "Add Student"}
      description={isEdit ? `Student ID: ${student?.studentId}` : "Student ID will be generated automatically."}
      widthClassName="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}

        <div className="grid grid-cols-2 gap-3">
          <TextField label="Student Name" required value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="Parent Name" required value={parentName} onChange={(e) => setParentName(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <TextField label="Parent Phone" required value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} />
          <TextField label="Student Phone" required value={studentPhone} onChange={(e) => setStudentPhone(e.target.value)} />
        </div>

        <TextField label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />

        <div className="grid grid-cols-2 gap-3">
          <SelectField label="Tuition" required value={tuitionId} disabled={isEdit} onChange={(e) => setTuitionId(e.target.value)}>
            {tuitions.map((t) => (
              <option key={t.id} value={t.id}>
                {t.tuitionName} ({t.tuitionCode})
              </option>
            ))}
          </SelectField>
          <SelectField label="Course" required value={course} disabled={isEdit} onChange={(e) => setCourse(e.target.value as CourseCode)}>
            {COURSES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </SelectField>
        </div>

        <SelectField
          label="Assigned Teacher"
          value={assignedTeacherId}
          onChange={(e) => setAssignedTeacherId(e.target.value)}
        >
          <option value="">Unassigned</option>
          {teachersForTuition.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} ({t.subject})
            </option>
          ))}
        </SelectField>

        <div className="grid grid-cols-2 gap-3">
          <TextField label="Joining Date" type="date" required value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} />
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
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEdit ? "Save Changes" : "Add Student"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

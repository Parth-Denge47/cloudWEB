"use client";

import { FormEvent, useState } from "react";
import { Modal } from "@/presentation/components/ui/Modal";
import { Button } from "@/presentation/components/ui/Button";
import { TextField, SelectField, TextAreaField } from "@/presentation/components/ui/FormField";
import { VideoLecture, VideoLectureInput, VideoLectureModel } from "@/domain/models/video-lecture.model";
import { Tuition } from "@/domain/models/tuition.model";
import { useAuth } from "@/state/auth-context";

interface LectureFormModalProps {
  open: boolean;
  lecture: VideoLecture | null; // null = create mode
  tuitions: Tuition[];
  defaultTuitionId?: string;
  onClose: () => void;
  onSubmit: (input: VideoLectureInput) => Promise<void>;
}

// Add/Edit Video Lecture. Only unlisted YouTube links are accepted —
// students only ever see the embedded player, never the raw YouTube app
// or its recommendations, per spec.
// Initial state is computed lazily from props; the parent remounts this
// component (via a changing `key`) each time it opens instead of syncing
// state through an effect.
export function LectureFormModal({ open, lecture, tuitions, defaultTuitionId, onClose, onSubmit }: LectureFormModalProps) {
  const { user } = useAuth();
  const isEdit = Boolean(lecture);
  const [title, setTitle] = useState(lecture?.title ?? "");
  const [description, setDescription] = useState(lecture?.description ?? "");
  const [subject, setSubject] = useState(lecture?.subject ?? "");
  const [course, setCourse] = useState(lecture?.course ?? "JEE");
  const [tuitionId, setTuitionId] = useState(lecture?.tuitionId ?? defaultTuitionId ?? tuitions[0]?.id ?? "");
  const [youtubeUrl, setYoutubeUrl] = useState(lecture?.youtubeUnlistedUrl ?? "");
  const [durationMinutes, setDurationMinutes] = useState(lecture?.durationMinutes ?? 30);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!VideoLectureModel.extractVideoId(youtubeUrl)) {
      setError("Enter a valid YouTube link (e.g. https://www.youtube.com/watch?v=...).");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit({
        title,
        description,
        subject,
        course,
        tuitionId,
        youtubeUnlistedUrl: youtubeUrl,
        durationMinutes: Number(durationMinutes),
        uploadedByName: lecture?.uploadedByName ?? user?.name ?? "Admin",
        uploadedByRole: lecture?.uploadedByRole ?? "admin",
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit Lecture" : "Upload Lecture"} widthClassName="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}

        <TextField label="Title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Rotational Motion - Introduction" />
        <TextAreaField label="Description" required value={description} onChange={(e) => setDescription(e.target.value)} />
        <TextField
          label="YouTube Unlisted Link"
          required
          type="url"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
        />

        <div className="grid grid-cols-2 gap-3">
          <TextField label="Subject" required value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Physics" />
          <SelectField label="Course" required value={course} onChange={(e) => setCourse(e.target.value)}>
            <option value="JEE">JEE</option>
            <option value="NEET">NEET</option>
          </SelectField>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <SelectField label="Tuition" required value={tuitionId} disabled={isEdit} onChange={(e) => setTuitionId(e.target.value)}>
            {tuitions.map((t) => (
              <option key={t.id} value={t.id}>
                {t.tuitionName} ({t.tuitionCode})
              </option>
            ))}
          </SelectField>
          <TextField
            label="Duration (minutes)"
            type="number"
            min={1}
            required
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(Number(e.target.value))}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEdit ? "Save Changes" : "Upload Lecture"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

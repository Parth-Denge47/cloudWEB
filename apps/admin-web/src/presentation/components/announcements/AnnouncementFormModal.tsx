"use client";

import { FormEvent, useState } from "react";
import { Modal } from "@/presentation/components/ui/Modal";
import { Button } from "@/presentation/components/ui/Button";
import { TextField, SelectField, TextAreaField } from "@/presentation/components/ui/FormField";
import { Announcement, AnnouncementInput } from "@/domain/models/announcement.model";
import { Tuition } from "@/domain/models/tuition.model";
import { AnnouncementAudience } from "@/domain/models/enums";
import { useAuth } from "@/state/auth-context";

interface AnnouncementFormModalProps {
  open: boolean;
  announcement: Announcement | null; // null = create mode
  tuitions: Tuition[];
  defaultTuitionId?: string;
  onClose: () => void;
  onSubmit: (input: AnnouncementInput) => Promise<void>;
}

// Create/Edit Announcement. Broadcast sends to every tuition on the
// platform (tuitionId becomes null); otherwise it's scoped to one tuition.
// Initial state is computed lazily from props; the parent remounts this
// component (via a changing `key`) each time it opens instead of syncing
// state through an effect.
export function AnnouncementFormModal({ open, announcement, tuitions, defaultTuitionId, onClose, onSubmit }: AnnouncementFormModalProps) {
  const { user } = useAuth();
  const isEdit = Boolean(announcement);
  const [title, setTitle] = useState(announcement?.title ?? "");
  const [message, setMessage] = useState(announcement?.message ?? "");
  const [audience, setAudience] = useState<AnnouncementAudience>(announcement?.audience ?? "all");
  const [isBroadcast, setIsBroadcast] = useState(announcement?.isBroadcast ?? false);
  const [tuitionId, setTuitionId] = useState(announcement?.tuitionId ?? defaultTuitionId ?? tuitions[0]?.id ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        title,
        message,
        audience,
        isBroadcast,
        tuitionId: isBroadcast ? null : tuitionId,
        createdByName: announcement?.createdByName ?? user?.name ?? "Admin",
        createdByRole: announcement?.createdByRole ?? "admin",
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit Announcement" : "Create Announcement"} widthClassName="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField label="Title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Mock Test This Saturday" />
        <TextAreaField label="Message" required value={message} onChange={(e) => setMessage(e.target.value)} />

        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={isBroadcast} onChange={(e) => setIsBroadcast(e.target.checked)} className="size-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
          Broadcast to every tuition
        </label>

        <div className="grid grid-cols-2 gap-3">
          <SelectField label="Tuition" required={!isBroadcast} disabled={isBroadcast} value={tuitionId} onChange={(e) => setTuitionId(e.target.value)}>
            {tuitions.map((t) => (
              <option key={t.id} value={t.id}>
                {t.tuitionName} ({t.tuitionCode})
              </option>
            ))}
          </SelectField>
          <SelectField label="Audience" required value={audience} onChange={(e) => setAudience(e.target.value as AnnouncementAudience)}>
            <option value="all">Everyone</option>
            <option value="teachers">Teachers Only</option>
            <option value="students">Students Only</option>
          </SelectField>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEdit ? "Save Changes" : isBroadcast ? "Broadcast" : "Publish"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

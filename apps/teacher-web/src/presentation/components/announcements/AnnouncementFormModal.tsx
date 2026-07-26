"use client";

import { FormEvent, useState } from "react";
import { Modal } from "@/presentation/components/ui/Modal";
import { Button } from "@/presentation/components/ui/Button";
import { TextField, SelectField, TextAreaField } from "@/presentation/components/ui/FormField";
import { Announcement, AnnouncementInput } from "@/domain/models/announcement.model";
import { AnnouncementAudience } from "@/domain/models/enums";
import { Teacher } from "@/domain/models/teacher.model";

interface AnnouncementFormModalProps {
  open: boolean;
  announcement: Announcement | null;
  teacher: Teacher;
  onClose: () => void;
  onSubmit: (input: AnnouncementInput) => Promise<void>;
}

export function AnnouncementFormModal({ open, announcement, teacher, onClose, onSubmit }: AnnouncementFormModalProps) {
  const isEdit = Boolean(announcement);
  const [title, setTitle] = useState(announcement?.title ?? "");
  const [message, setMessage] = useState(announcement?.message ?? "");
  const [audience, setAudience] = useState<AnnouncementAudience>(announcement?.audience ?? "students");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        title,
        message,
        audience,
        isBroadcast: false,
        tuitionId: teacher.tuitionId,
        createdByName: announcement?.createdByName ?? teacher.name,
        createdByRole: announcement?.createdByRole ?? "teacher",
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit Announcement" : "Create Announcement"} widthClassName="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField label="Title" required value={title} onChange={(e) => setTitle(e.target.value)} />
        <TextAreaField label="Message" required value={message} onChange={(e) => setMessage(e.target.value)} />
        <SelectField label="Audience" required value={audience} onChange={(e) => setAudience(e.target.value as AnnouncementAudience)}>
          <option value="students">Students Only</option>
          <option value="all">Everyone in Tuition</option>
        </SelectField>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEdit ? "Save Changes" : "Publish"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

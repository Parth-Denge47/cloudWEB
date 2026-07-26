"use client";

import { FormEvent, useState } from "react";
import { UploadCloud } from "lucide-react";
import { Modal } from "@/presentation/components/ui/Modal";
import { Button } from "@/presentation/components/ui/Button";
import { TextField, SelectField, TextAreaField } from "@/presentation/components/ui/FormField";
import { LibraryFile, LibraryFileInput } from "@/domain/models/library-file.model";
import { LIBRARY_FILE_TYPE_LABELS, LibraryFileType } from "@/domain/models/enums";
import { Teacher } from "@/domain/models/teacher.model";

interface LibraryFileModalProps {
  open: boolean;
  file: LibraryFile | null; // null = upload mode
  teacher: Teacher;
  onClose: () => void;
  onSubmit: (input: LibraryFileInput) => Promise<void>;
}

const FILE_TYPES = Object.keys(LIBRARY_FILE_TYPE_LABELS) as LibraryFileType[];

// Upload/Replace form for the Teacher panel. Per the permission matrix,
// teachers can upload and edit/replace their own files but can never
// hard-delete — if they upload the wrong file, replacing it is the fix.
export function LibraryFileModal({ open, file, teacher, onClose, onSubmit }: LibraryFileModalProps) {
  const isEdit = Boolean(file);
  const [title, setTitle] = useState(file?.title ?? "");
  const [description, setDescription] = useState(file?.description ?? "");
  const [subject, setSubject] = useState(file?.subject ?? teacher.subject);
  const [course, setCourse] = useState(file?.course ?? "JEE");
  const [fileType, setFileType] = useState<LibraryFileType>(file?.fileType ?? "notes");
  const [tags, setTags] = useState(file?.tags.join(", ") ?? "");
  const [fileName, setFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({
        title,
        description,
        subject,
        course,
        tuitionId: teacher.tuitionId,
        fileType,
        fileSizeKb: file?.fileSizeKb ?? Math.round(200 + Math.random() * 3000),
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        uploadedByName: file?.uploadedByName ?? teacher.name,
        uploadedByRole: "teacher",
        uploadedById: file?.uploadedById ?? teacher.id,
        fileUrl: fileName || file?.fileUrl || "#",
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Replace / Edit File" : "Upload File"} widthClassName="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
        <TextField label="Title" required value={title} onChange={(e) => setTitle(e.target.value)} />
        <TextAreaField label="Description" required value={description} onChange={(e) => setDescription(e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <TextField label="Subject" required value={subject} onChange={(e) => setSubject(e.target.value)} />
          <SelectField label="Course" required value={course} onChange={(e) => setCourse(e.target.value)}>
            <option value="JEE">JEE</option>
            <option value="NEET">NEET</option>
          </SelectField>
        </div>
        <SelectField label="File Type" required value={fileType} onChange={(e) => setFileType(e.target.value as LibraryFileType)}>
          {FILE_TYPES.map((type) => (
            <option key={type} value={type}>
              {LIBRARY_FILE_TYPE_LABELS[type]}
            </option>
          ))}
        </SelectField>
        <TextField label="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} />

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-slate-600">{isEdit ? "Replace File (optional)" : "File"}</span>
          <div className="flex items-center gap-3 rounded-lg border border-dashed border-slate-300 px-3 py-3 text-sm text-slate-500">
            <UploadCloud className="size-4 shrink-0 text-slate-400" />
            <input
              type="file"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
              className="w-full text-xs file:mr-3 file:rounded-md file:border-0 file:bg-brand-50 file:px-2.5 file:py-1.5 file:text-xs file:font-medium file:text-brand-700"
            />
          </div>
          {fileName && <p className="mt-1 text-xs text-slate-400">Selected: {fileName}</p>}
        </label>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEdit ? "Save Changes" : "Upload"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

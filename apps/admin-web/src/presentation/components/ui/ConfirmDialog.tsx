"use client";

import { AlertTriangle } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "./Button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  tone?: "danger" | "brand";
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

// Used for every destructive/impactful action (suspend tuition, delete
// file, delete teacher/student) so the impact is always explained before
// it happens — required explicitly for tuition suspension by the spec.
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  tone = "danger",
  isLoading,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} title={title} onClose={onCancel} widthClassName="max-w-md">
      <div className="flex gap-3">
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
            tone === "danger" ? "bg-red-50 text-red-600" : "bg-brand-50 text-brand-600"
          }`}
        >
          <AlertTriangle className="size-5" />
        </div>
        <p className="text-sm leading-relaxed whitespace-pre-line text-slate-600">{message}</p>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant={tone === "danger" ? "danger" : "primary"} onClick={onConfirm} isLoading={isLoading}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

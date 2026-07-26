"use client";

import { FormEvent, useState } from "react";
import { Modal } from "@/presentation/components/ui/Modal";
import { Button } from "@/presentation/components/ui/Button";
import { TextField } from "@/presentation/components/ui/FormField";

interface ResetPasswordModalProps {
  open: boolean;
  subjectLabel: string; // e.g. "Vikram Mehta (ALL2601001)"
  onClose: () => void;
  onSubmit: (newPassword: string) => Promise<void>;
}

// Shared by Teacher and Student management for "Reset Password".
export function ResetPasswordModal({ open, subjectLabel, onClose, onSubmit }: ResetPasswordModalProps) {
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(password);
      setPassword("");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Reset Password" description={subjectLabel} widthClassName="max-w-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          label="New Password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter a new password"
        />
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Reset Password
          </Button>
        </div>
      </form>
    </Modal>
  );
}

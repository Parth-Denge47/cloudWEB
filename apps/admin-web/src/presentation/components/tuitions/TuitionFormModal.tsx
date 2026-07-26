"use client";

import { FormEvent, useState } from "react";
import { Modal } from "@/presentation/components/ui/Modal";
import { Button } from "@/presentation/components/ui/Button";
import { TextField } from "@/presentation/components/ui/FormField";
import { Tuition, TuitionInput } from "@/domain/models/tuition.model";

interface TuitionFormModalProps {
  open: boolean;
  tuition: Tuition | null; // null = create mode
  onClose: () => void;
  onSubmit: (input: TuitionInput) => Promise<void>;
}

// Add/Edit Tuition (branch) form. Tuition Code is locked once created
// because it's the prefix used by every Teacher/Student ID generated
// under this tuition.
// Initial state is computed lazily from props; the parent remounts this
// component (via a changing `key`) each time it opens instead of syncing
// state through an effect.
export function TuitionFormModal({ open, tuition, onClose, onSubmit }: TuitionFormModalProps) {
  const isEdit = Boolean(tuition);
  const [tuitionName, setTuitionName] = useState(tuition?.tuitionName ?? "");
  const [tuitionCode, setTuitionCode] = useState(tuition?.tuitionCode ?? "");
  const [ownerName, setOwnerName] = useState(tuition?.ownerName ?? "");
  const [address, setAddress] = useState(tuition?.address ?? "");
  const [contactNumber, setContactNumber] = useState(tuition?.contactNumber ?? "");
  const [email, setEmail] = useState(tuition?.email ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({ tuitionName, tuitionCode, ownerName, address, contactNumber, email });
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
      title={isEdit ? "Edit Tuition" : "Add Tuition"}
      description={isEdit ? undefined : "Tuition Code becomes the prefix for every Teacher/Student ID issued here."}
      widthClassName="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}

        <div className="grid grid-cols-2 gap-3">
          <TextField label="Tuition Name" required value={tuitionName} onChange={(e) => setTuitionName(e.target.value)} placeholder="e.g. Apex Learning Lab" />
          <TextField
            label="Tuition Code"
            required
            disabled={isEdit}
            maxLength={6}
            value={tuitionCode}
            onChange={(e) => setTuitionCode(e.target.value.toUpperCase())}
            placeholder="e.g. ALL"
          />
        </div>

        <TextField label="Owner / Manager Name" required value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
        <TextField label="Address" required value={address} onChange={(e) => setAddress(e.target.value)} />

        <div className="grid grid-cols-2 gap-3">
          <TextField label="Contact Number" required value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
          <TextField label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEdit ? "Save Changes" : "Add Tuition"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

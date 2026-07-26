import { Modal } from "@/presentation/components/ui/Modal";
import { Student } from "@/domain/models/student.model";
import { formatDate } from "@/utils/format";

interface StudentPerformanceModalProps {
  open: boolean;
  student: Student | null;
  onClose: () => void;
}

export function StudentPerformanceModal({ open, student, onClose }: StudentPerformanceModalProps) {
  if (!student) return null;

  return (
    <Modal open={open} onClose={onClose} title="Student Performance" description={`${student.name} (${student.studentId})`} widthClassName="max-w-sm">
      <div className="space-y-4">
        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-slate-500">Overall Progress</span>
            <span className="font-medium text-slate-700">{student.progressPercent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-brand-600" style={{ width: `${student.progressPercent}%` }} />
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs text-slate-400">Course</dt>
            <dd className="font-medium text-slate-700">{student.course}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-400">Joined</dt>
            <dd className="font-medium text-slate-700">{formatDate(student.joiningDate)}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-400">Status</dt>
            <dd className="font-medium text-slate-700 capitalize">{student.status}</dd>
          </div>
        </dl>
      </div>
    </Modal>
  );
}

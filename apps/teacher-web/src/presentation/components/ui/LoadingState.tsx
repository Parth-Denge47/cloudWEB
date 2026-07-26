import { Loader2 } from "lucide-react";

// Consistent loading placeholder for any async list/detail view.
export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-white py-16 text-sm text-slate-400">
      <Loader2 className="size-4 animate-spin" />
      {label}
    </div>
  );
}

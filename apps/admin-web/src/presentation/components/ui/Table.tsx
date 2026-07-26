// Lightweight styled wrappers around native table elements so every list
// page (teachers, students, tuitions, library, lectures, announcements)
// shares the same look without a heavyweight generic table abstraction.
export function TableContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm shadow-slate-900/[0.02]">
      <table className="w-full min-w-max text-left text-sm">{children}</table>
    </div>
  );
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="border-b border-slate-100 bg-slate-50/60">
      <tr className="text-xs font-medium tracking-wide text-slate-500 uppercase">{children}</tr>
    </thead>
  );
}

export function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-4 py-3 font-medium ${className ?? ""}`}>{children}</th>;
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-slate-100">{children}</tbody>;
}

export function Tr({ children }: { children: React.ReactNode }) {
  return <tr className="transition-colors hover:bg-slate-50/80">{children}</tr>;
}

export function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 align-middle text-slate-700 ${className ?? ""}`}>{children}</td>;
}

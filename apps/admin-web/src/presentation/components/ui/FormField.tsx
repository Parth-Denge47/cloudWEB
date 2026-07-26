import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const FIELD_CLASSES =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400";

function Wrapper({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-600">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

// Text/number/date input with a consistent label + error slot, used by
// every add/edit form in the admin panel.
export function TextField({
  label,
  error,
  className,
  ...props
}: { label: string; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Wrapper label={label} error={error}>
      <input className={`${FIELD_CLASSES} ${className ?? ""}`} {...props} />
    </Wrapper>
  );
}

export function TextAreaField({
  label,
  error,
  className,
  ...props
}: { label: string; error?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Wrapper label={label} error={error}>
      <textarea className={`${FIELD_CLASSES} min-h-24 resize-y ${className ?? ""}`} {...props} />
    </Wrapper>
  );
}

export function SelectField({
  label,
  error,
  className,
  children,
  ...props
}: { label: string; error?: string } & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <Wrapper label={label} error={error}>
      <select className={`${FIELD_CLASSES} ${className ?? ""}`} {...props}>
        {children}
      </select>
    </Wrapper>
  );
}

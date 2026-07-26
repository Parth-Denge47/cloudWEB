"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-600/20",
  secondary: "bg-brand-50 text-brand-700 hover:bg-brand-100",
  outline: "border border-slate-200 text-slate-700 hover:bg-slate-50 bg-white",
  ghost: "text-slate-600 hover:bg-slate-100",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "text-xs px-2.5 py-1.5 gap-1.5",
  md: "text-sm px-4 py-2 gap-2",
  lg: "text-sm px-5 py-2.5 gap-2",
};

// Reusable button, used across every panel so form actions and table
// row actions stay visually consistent with the blue-and-white brand.
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", isLoading, disabled, children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={clsx(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className
      )}
      {...props}
    >
      {isLoading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  );
});

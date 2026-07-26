"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpenCheck, User, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "@/state/auth-context";
import { Button } from "@/presentation/components/ui/Button";

// Teacher login — Teacher ID + password per spec.
export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [teacherId, setTeacherId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(teacherId, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-gradient-to-b from-brand-50 via-white to-white px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/30">
            <BookOpenCheck className="size-6" />
          </div>
          <h1 className="text-lg font-semibold text-slate-900">LMS Teacher Panel</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in with your Teacher ID</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-900/[0.03]">
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
              <AlertCircle className="size-4 shrink-0" />
              {error}
            </div>
          )}

          <label className="mb-4 block">
            <span className="mb-1.5 block text-xs font-medium text-slate-600">Teacher ID</span>
            <div className="relative">
              <User className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                placeholder="e.g. ALL2601001"
                className="w-full rounded-lg border border-slate-200 py-2 pr-3 pl-9 text-sm uppercase focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
              />
            </div>
          </label>

          <label className="mb-5 block">
            <span className="mb-1.5 block text-xs font-medium text-slate-600">Password</span>
            <div className="relative">
              <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-200 py-2 pr-3 pl-9 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
              />
            </div>
          </label>

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Sign in
          </Button>

          <p className="mt-4 text-center text-xs text-slate-400">
            Demo: ALL2601001 / ALL2602001 / ALL2603001 / PHY2603001 / PHY2601001 — any password
          </p>
          <p className="mt-1 text-center text-[11px] text-slate-300">
            (BMI2601001 exists but its tuition is suspended — try it to see the blocked-login flow)
          </p>
        </form>
      </div>
    </div>
  );
}

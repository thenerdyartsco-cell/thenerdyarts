"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Button from "@/components/ui/Button";

const inputClass =
  "w-full border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent";

function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Reset failed");
      } else {
        setDone(true);
        setTimeout(() => router.replace("/admin/login"), 2000);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <p className="rounded-md bg-error/10 px-4 py-3 text-sm text-error">
        Missing reset token. Please use the link from your email.
      </p>
    );
  }

  if (done) {
    return (
      <p className="rounded-md bg-accent/10 px-4 py-3 text-sm text-accent-hover">
        Password updated. Redirecting to sign in&hellip;
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <p className="rounded-md bg-error/10 px-4 py-3 text-sm text-error">{error}</p>
      )}
      <div>
        <label className="mb-2 block text-xs uppercase tracking-wider text-muted">
          New Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
          autoComplete="new-password"
          required
        />
        <p className="mt-2 text-xs text-muted">
          At least 10 characters with an uppercase letter, a lowercase letter, and a number.
        </p>
      </div>
      <div>
        <label className="mb-2 block text-xs uppercase tracking-wider text-muted">
          Confirm Password
        </label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className={inputClass}
          autoComplete="new-password"
          required
        />
      </div>
      <Button type="submit" loading={loading} className="w-full">
        Update Password
      </Button>
    </form>
  );
}

export default function AdminResetPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src="/images/logo.svg"
            alt="The Nerdy Arts"
            width={220}
            height={36}
            className="h-8 w-auto"
            priority
          />
          <p className="mt-4 text-xs uppercase tracking-[0.3em] text-accent">
            Reset Password
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-8 shadow-sm">
          <Suspense fallback={<p className="text-sm text-muted">Loading&hellip;</p>}>
            <ResetForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

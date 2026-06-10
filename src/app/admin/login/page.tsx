"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/ui/Button";

type Step = "password" | "otp";

const inputClass =
  "w-full border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent";

export default function AdminLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Login failed");
      } else {
        setStep("otp");
        setNotice("We've emailed a 6-digit code to the admin inbox.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Invalid code");
      } else {
        router.replace("/admin");
        router.refresh();
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgot() {
    setLoading(true);
    setError(null);
    setNotice(null);
    try {
      await fetch("/api/admin/auth/forgot", { method: "POST" });
      setNotice(
        "If an admin account exists, a password reset link has been emailed to the admin inbox."
      );
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

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
            Admin Access
          </p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-8 shadow-sm">
          {notice && (
            <p className="mb-4 rounded-md bg-accent/10 px-4 py-3 text-sm text-accent-hover">
              {notice}
            </p>
          )}
          {error && (
            <p className="mb-4 rounded-md bg-error/10 px-4 py-3 text-sm text-error">
              {error}
            </p>
          )}

          {step === "password" ? (
            <form onSubmit={handlePassword} className="space-y-5">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-wider text-muted">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  autoComplete="username"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-wider text-muted">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  autoComplete="current-password"
                  required
                />
              </div>
              <Button type="submit" loading={loading} className="w-full">
                Continue
              </Button>
              <button
                type="button"
                onClick={handleForgot}
                className="block w-full text-center text-xs text-muted hover:text-accent"
              >
                Forgot password?
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtp} className="space-y-5">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-wider text-muted">
                  6-Digit Code
                </label>
                <input
                  inputMode="numeric"
                  pattern="\d{6}"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  className={`${inputClass} text-center text-lg tracking-[0.5em]`}
                  autoFocus
                  required
                />
              </div>
              <Button type="submit" loading={loading} className="w-full">
                Verify &amp; Sign In
              </Button>
              <button
                type="button"
                onClick={() => {
                  setStep("password");
                  setCode("");
                  setError(null);
                  setNotice(null);
                }}
                className="block w-full text-center text-xs text-muted hover:text-accent"
              >
                Back
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

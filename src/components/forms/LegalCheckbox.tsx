"use client";

import Link from "next/link";

interface LegalCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

export default function LegalCheckbox({ checked, onChange, error }: LegalCheckboxProps) {
  return (
    <div className="space-y-1">
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 h-4 w-4 accent-accent cursor-pointer"
        />
        <span className="text-sm text-muted leading-relaxed">
          I agree to the{" "}
          <Link href="/terms" className="text-accent hover:underline" target="_blank">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="text-accent hover:underline" target="_blank">
            Privacy Policy
          </Link>
          . I consent to the collection and processing of my personal data as described.
        </span>
      </label>
      {error && <p className="text-error text-xs ml-7">{error}</p>}
    </div>
  );
}

"use client";

import { useState } from "react";

interface UseFormSubmitOptions {
  url: string;
  onSuccess?: () => void;
}

interface FormState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export function useFormSubmit<T>({ url, onSuccess }: UseFormSubmitOptions) {
  const [state, setState] = useState<FormState>({
    loading: false,
    error: null,
    success: false,
  });

  const submit = async (data: T) => {
    setState({ loading: true, error: null, success: false });

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setState({ loading: false, error: json.error || "Something went wrong", success: false });
        return;
      }

      setState({ loading: false, error: null, success: true });
      onSuccess?.();
    } catch {
      setState({ loading: false, error: "Network error. Please try again.", success: false });
    }
  };

  const reset = () => setState({ loading: false, error: null, success: false });

  return { ...state, submit, reset };
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { Star, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import type { Review } from "@/types";

const inputClass =
  "w-full border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent";
const labelClass = "mb-2 block text-xs uppercase tracking-wider text-muted";

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          <Star
            size={22}
            className={n <= value ? "text-accent" : "text-border"}
            fill={n <= value ? "currentColor" : "none"}
          />
        </button>
      ))}
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={14}
          className={n <= rating ? "text-accent" : "text-border"}
          fill={n <= rating ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
}

export default function AdminReviews() {
  const [items, setItems] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  // add form
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [approved, setApproved] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reviews");
      if (!res.ok) throw new Error("load failed");
      setItems((await res.json()).items);
      setError(null);
    } catch {
      setError("Couldn't load reviews. Check your Firebase configuration.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function addReview(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rating, text, approved }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to add review");
      setName("");
      setRating(5);
      setText("");
      setApproved(true);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add review");
    } finally {
      setSaving(false);
    }
  }

  async function toggleApproved(r: Review) {
    setBusyId(r.id);
    try {
      await fetch(`/api/admin/reviews/${r.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved: !r.approved }),
      });
      await load();
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this review permanently?")) return;
    setBusyId(id);
    try {
      await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      await load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-foreground lg:text-3xl">Reviews</h1>
      <p className="mb-6 mt-1 text-sm text-muted">
        Add testimonials and control which ones appear on the public Reviews page.
      </p>

      {error && (
        <p className="mb-6 rounded-md bg-error/10 px-4 py-3 text-sm text-error">{error}</p>
      )}

      {/* Add form */}
      <form
        onSubmit={addReview}
        className="mb-10 rounded-xl border border-border bg-surface p-5 shadow-sm sm:p-6"
      >
        <h2 className="mb-4 font-serif text-lg text-foreground">Add a review</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Reviewer name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Rating</label>
            <StarPicker value={rating} onChange={setRating} />
          </div>
        </div>
        <div className="mt-4">
          <label className={labelClass}>Review</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className={`${inputClass} resize-none`}
            required
          />
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <label className="flex items-center gap-3 text-sm text-foreground">
            <input
              type="checkbox"
              checked={approved}
              onChange={(e) => setApproved(e.target.checked)}
              className="h-4 w-4 accent-accent"
            />
            Show on website (approved)
          </label>
          <Button type="submit" loading={saving}>
            Add Review
          </Button>
        </div>
      </form>

      {/* List */}
      {loading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-surface px-6 py-12 text-center text-sm text-muted">
          No reviews yet. Add your first testimonial above.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((r) => (
            <div key={r.id} className="rounded-xl border border-border bg-surface p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <p className="font-medium text-foreground">{r.name}</p>
                    <Stars rating={r.rating} />
                  </div>
                  <p className="mt-2 text-sm text-muted">{r.text}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wider ${
                    r.approved ? "bg-success/15 text-success" : "bg-border text-muted"
                  }`}
                >
                  {r.approved ? "Live" : "Hidden"}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => toggleApproved(r)}
                  disabled={busyId === r.id}
                  className="rounded-md border border-border px-3 py-1.5 text-xs text-foreground hover:border-accent hover:text-accent disabled:opacity-60"
                >
                  {r.approved ? "Hide from site" : "Show on site"}
                </button>
                <button
                  onClick={() => remove(r.id)}
                  disabled={busyId === r.id}
                  className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs text-error hover:bg-error/5 disabled:opacity-60"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

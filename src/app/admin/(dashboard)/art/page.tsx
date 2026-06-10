"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Artwork } from "@/types";

const inputClass =
  "w-full border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent";

function inr(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function AdminArtListings() {
  const [items, setItems] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<Artwork>>({});
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/artworks");
      if (!res.ok) throw new Error("load failed");
      setItems((await res.json()).items);
      setError(null);
    } catch {
      setError("Couldn't load artworks. Check your Firebase configuration.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function startEdit(a: Artwork) {
    setEditingId(a.id);
    setDraft({
      title: a.title,
      description: a.description,
      price: a.price,
      category: a.category,
      status: a.status,
      featured: a.featured,
    });
  }

  async function patch(id: string, data: Partial<Artwork>) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/artworks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("update failed");
      await load();
      setEditingId(null);
    } catch {
      setError("Update failed.");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this artwork permanently?")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/artworks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("delete failed");
      await load();
    } catch {
      setError("Delete failed.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-foreground lg:text-3xl">Listings</h1>
          <p className="mt-1 text-sm text-muted">Edit details, mark pieces sold, or remove them.</p>
        </div>
        <Link
          href="/admin/art/new"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          <Plus size={16} />
          Add Art
        </Link>
      </div>

      {error && (
        <p className="mb-6 rounded-md bg-error/10 px-4 py-3 text-sm text-error">{error}</p>
      )}

      {loading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-surface px-6 py-12 text-center text-sm text-muted">
          No artworks yet. Click <span className="text-accent">Add Art</span> to publish your first piece.
        </p>
      ) : (
        <div className="space-y-4">
          {items.map((a) => (
            <div key={a.id} className="rounded-xl border border-border bg-surface p-4 shadow-sm">
              <div className="flex gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-background">
                  {a.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.images[0]} alt={a.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-serif text-2xl text-muted/40">
                      {a.title[0]}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  {editingId === a.id ? (
                    <div className="space-y-2">
                      <input
                        className={inputClass}
                        value={draft.title ?? ""}
                        onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                      />
                      <textarea
                        className={`${inputClass} resize-none`}
                        rows={2}
                        value={draft.description ?? ""}
                        onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                      />
                      <div className="flex flex-wrap gap-2">
                        <input
                          type="number"
                          className={`${inputClass} w-28`}
                          value={draft.price ?? 0}
                          onChange={(e) => setDraft((d) => ({ ...d, price: Number(e.target.value) }))}
                        />
                        <input
                          className={`${inputClass} w-36`}
                          value={draft.category ?? ""}
                          onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
                        />
                        <select
                          className={`${inputClass} w-32`}
                          value={draft.status}
                          onChange={(e) =>
                            setDraft((d) => ({ ...d, status: e.target.value as Artwork["status"] }))
                          }
                        >
                          <option value="available">Available</option>
                          <option value="sold">Sold</option>
                        </select>
                        <label className="flex items-center gap-2 text-xs text-muted">
                          <input
                            type="checkbox"
                            checked={!!draft.featured}
                            onChange={(e) => setDraft((d) => ({ ...d, featured: e.target.checked }))}
                            className="h-4 w-4 accent-accent"
                          />
                          Featured
                        </label>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => patch(a.id, draft)}
                          disabled={busyId === a.id}
                          className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-accent-hover disabled:opacity-60"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="rounded-md border border-border px-3 py-1.5 text-xs text-muted hover:text-foreground"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate font-serif text-lg text-foreground">{a.title}</h3>
                          <p className="text-xs text-muted">{a.category}</p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wider ${
                            a.status === "sold"
                              ? "bg-foreground text-background"
                              : "bg-accent/10 text-accent-hover"
                          }`}
                        >
                          {a.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-medium text-accent">{inr(a.price)}</p>
                      {a.featured && (
                        <p className="mt-1 text-[10px] uppercase tracking-wider text-muted">★ Featured</p>
                      )}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          onClick={() =>
                            patch(a.id, { status: a.status === "sold" ? "available" : "sold" })
                          }
                          disabled={busyId === a.id}
                          className="rounded-md border border-border px-3 py-1.5 text-xs text-foreground hover:border-accent hover:text-accent disabled:opacity-60"
                        >
                          {a.status === "sold" ? "Mark Available" : "Mark Sold"}
                        </button>
                        <button
                          onClick={() => startEdit(a)}
                          className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs text-foreground hover:border-accent hover:text-accent"
                        >
                          <Pencil size={12} /> Edit
                        </button>
                        <button
                          onClick={() => remove(a.id)}
                          disabled={busyId === a.id}
                          className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs text-error hover:bg-error/5 disabled:opacity-60"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

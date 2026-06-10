"use client";

import { useCallback, useEffect, useState } from "react";
import type { PurchaseRequest } from "@/types";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-accent/10 text-accent-hover",
  contacted: "bg-blue-100 text-blue-700",
  completed: "bg-success/15 text-success",
  closed_sold: "bg-border text-muted",
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

interface Group {
  artworkId: string;
  artworkTitle: string;
  requests: PurchaseRequest[];
}

export default function AdminBuyers() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/buyers");
      if (!res.ok) throw new Error("load failed");
      const items: PurchaseRequest[] = (await res.json()).items;
      const map = new Map<string, Group>();
      for (const r of items) {
        const g = map.get(r.artworkId) || {
          artworkId: r.artworkId,
          artworkTitle: r.artworkTitle,
          requests: [],
        };
        g.requests.push(r);
        map.set(r.artworkId, g);
      }
      setGroups(Array.from(map.values()));
      setError(null);
    } catch {
      setError("Couldn't load buyer requests. Check your Firebase configuration.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function setStatus(id: string, status: string) {
    setBusyId(id);
    try {
      await fetch(`/api/admin/buyers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      await load();
    } finally {
      setBusyId(null);
    }
  }

  async function completeSale(artworkId: string, requestId: string, title: string) {
    if (
      !confirm(
        `Mark "${title}" as SOLD to this buyer?\n\nThis updates the website and emails every other person in the queue that the piece is gone.`
      )
    )
      return;
    setBusyId(requestId);
    try {
      const res = await fetch("/api/admin/buyers/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artworkId, requestId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "failed");
      await load();
      alert(`Sale completed. ${json.notified} other buyer(s) were notified.`);
    } catch {
      setError("Couldn't complete the sale.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-foreground lg:text-3xl">Buyers</h1>
      <p className="mb-8 mt-1 text-sm text-muted">
        Purchase requests in first-come, first-served order. #1 is first in the queue.
      </p>

      {error && (
        <p className="mb-6 rounded-md bg-error/10 px-4 py-3 text-sm text-error">{error}</p>
      )}

      {loading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : groups.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-surface px-6 py-12 text-center text-sm text-muted">
          No purchase requests yet.
        </p>
      ) : (
        <div className="space-y-8">
          {groups.map((g) => (
            <div key={g.artworkId}>
              <h2 className="mb-3 font-serif text-lg text-foreground">{g.artworkTitle}</h2>
              <div className="space-y-3">
                {g.requests.map((r, i) => (
                  <div
                    key={r.id}
                    className="rounded-xl border border-border bg-surface p-4 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-medium text-accent-hover">
                          {i + 1}
                        </span>
                        <div>
                          <p className="font-medium text-foreground">{r.name}</p>
                          <p className="text-sm text-muted">{r.email}</p>
                          <p className="text-sm text-muted">{r.phone}</p>
                          {r.address && <p className="mt-1 text-xs text-muted">{r.address}</p>}
                          <p className="mt-1 text-[11px] text-muted">{formatDate(r.createdAt)}</p>
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wider ${
                          STATUS_STYLES[r.status] || "bg-border text-muted"
                        }`}
                      >
                        {r.status.replace("_", " ")}
                      </span>
                    </div>

                    {r.status !== "completed" && r.status !== "closed_sold" && (
                      <div className="mt-3 flex flex-wrap gap-2 pl-10">
                        {r.status === "pending" && (
                          <button
                            onClick={() => setStatus(r.id, "contacted")}
                            disabled={busyId === r.id}
                            className="rounded-md border border-border px-3 py-1.5 text-xs text-foreground hover:border-accent hover:text-accent disabled:opacity-60"
                          >
                            Mark Contacted
                          </button>
                        )}
                        <button
                          onClick={() => completeSale(r.artworkId, r.id, r.artworkTitle)}
                          disabled={busyId === r.id}
                          className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-accent-hover disabled:opacity-60"
                        >
                          Complete Sale
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

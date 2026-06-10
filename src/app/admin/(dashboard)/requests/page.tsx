"use client";

import { useCallback, useEffect, useState } from "react";
import type { SoldOutRequest, CustomRequest } from "@/types";

type Tab = "existing" | "custom";

const STATUS_OPTIONS = ["pending", "contacted", "completed", "closed"];

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-accent/10 text-accent-hover",
  contacted: "bg-blue-100 text-blue-700",
  completed: "bg-success/15 text-success",
  closed: "bg-border text-muted",
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-IN", { dateStyle: "medium" });
  } catch {
    return iso;
  }
}

export default function AdminRequests() {
  const [tab, setTab] = useState<Tab>("existing");
  const [soldOut, setSoldOut] = useState<SoldOutRequest[]>([]);
  const [custom, setCustom] = useState<CustomRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/requests");
      if (!res.ok) throw new Error("load failed");
      const json = await res.json();
      setSoldOut(json.soldOut);
      setCustom(json.custom);
      setError(null);
    } catch {
      setError("Couldn't load requests. Check your Firebase configuration.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(
    collection: "soldout_requests" | "custom_requests",
    id: string,
    status: string
  ) {
    try {
      await fetch(`/api/admin/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection, status }),
      });
      await load();
    } catch {
      setError("Couldn't update status.");
    }
  }

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "existing", label: "Existing-Art Requests", count: soldOut.length },
    { key: "custom", label: "Custom-Art Requests", count: custom.length },
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl text-foreground lg:text-3xl">Requests</h1>
      <p className="mb-6 mt-1 text-sm text-muted">
        Interest in sold-out existing pieces and custom commission enquiries.
      </p>

      <div className="mb-6 flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full px-4 py-2 text-xs uppercase tracking-wider transition-colors ${
              tab === t.key
                ? "bg-accent text-white"
                : "border border-border text-muted hover:border-accent hover:text-accent"
            }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {error && (
        <p className="mb-6 rounded-md bg-error/10 px-4 py-3 text-sm text-error">{error}</p>
      )}

      {loading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : tab === "existing" ? (
        soldOut.length === 0 ? (
          <EmptyState label="No requests for sold-out pieces yet." />
        ) : (
          <div className="space-y-3">
            {soldOut.map((r) => (
              <div key={r.id} className="rounded-xl border border-border bg-surface p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-foreground">{r.name}</p>
                    <p className="text-sm text-muted">{r.email}</p>
                    <p className="mt-1 text-sm text-foreground">
                      Interested in: <span className="text-accent">{r.artworkTitle}</span>
                    </p>
                    <p className="mt-1 text-[11px] text-muted">{formatDate(r.createdAt)}</p>
                  </div>
                  <StatusControl
                    status={r.status}
                    onChange={(s) => updateStatus("soldout_requests", r.id, s)}
                  />
                </div>
              </div>
            ))}
          </div>
        )
      ) : custom.length === 0 ? (
        <EmptyState label="No custom-art requests yet." />
      ) : (
        <div className="space-y-3">
          {custom.map((r) => (
            <div key={r.id} className="rounded-xl border border-border bg-surface p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{r.name}</p>
                  <p className="text-sm text-muted">{r.email}</p>
                  <p className="text-sm text-muted">{r.phone}</p>
                  <p className="mt-1 text-sm text-foreground">
                    Budget: <span className="text-accent">{r.budget}</span>
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-muted">{r.description}</p>
                  <p className="mt-1 text-[11px] text-muted">{formatDate(r.createdAt)}</p>
                </div>
                <StatusControl
                  status={r.status}
                  onChange={(s) => updateStatus("custom_requests", r.id, s)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusControl({
  status,
  onChange,
}: {
  status: string;
  onChange: (s: string) => void;
}) {
  return (
    <div className="flex shrink-0 flex-col items-end gap-2">
      <span
        className={`rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wider ${
          STATUS_STYLES[status] || "bg-border text-muted"
        }`}
      >
        {status}
      </span>
      <select
        value={STATUS_OPTIONS.includes(status) ? status : "pending"}
        onChange={(e) => onChange(e.target.value)}
        className="border border-border bg-background px-2 py-1 text-xs text-foreground outline-none focus:border-accent"
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <p className="rounded-lg border border-dashed border-border bg-surface px-6 py-12 text-center text-sm text-muted">
      {label}
    </p>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { Artwork, PurchaseRequest } from "@/types";

interface Stats {
  total: number;
  available: number;
  sold: number;
  pendingBuyers: number;
  soldOut: number;
  custom: number;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [aRes, bRes, rRes] = await Promise.all([
          fetch("/api/admin/artworks"),
          fetch("/api/admin/buyers"),
          fetch("/api/admin/requests"),
        ]);
        if (!aRes.ok || !bRes.ok || !rRes.ok) throw new Error("load failed");
        const artworks: Artwork[] = (await aRes.json()).items;
        const buyers: PurchaseRequest[] = (await bRes.json()).items;
        const requests = await rRes.json();
        setStats({
          total: artworks.length,
          available: artworks.filter((a) => a.status === "available").length,
          sold: artworks.filter((a) => a.status === "sold").length,
          pendingBuyers: buyers.filter((b) => b.status === "pending").length,
          soldOut: requests.soldOut.length,
          custom: requests.custom.length,
        });
      } catch {
        setError(
          "Couldn't load data. Make sure Firebase credentials are configured in .env.local."
        );
      }
    }
    load();
  }, []);

  const cards = stats
    ? [
        { label: "Total Artworks", value: stats.total },
        { label: "Available", value: stats.available },
        { label: "Sold", value: stats.sold },
        { label: "Pending Buyers", value: stats.pendingBuyers },
        { label: "Existing-Art Requests", value: stats.soldOut },
        { label: "Custom Requests", value: stats.custom },
      ]
    : [];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-foreground lg:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Welcome back to The Nerdy Arts admin.</p>
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

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {(stats ? cards : Array.from({ length: 6 })).map((card, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-surface p-5 shadow-sm"
          >
            <p className="text-xs uppercase tracking-wider text-muted">
              {stats ? (card as { label: string }).label : " "}
            </p>
            <p className="mt-2 font-serif text-3xl text-foreground">
              {stats ? (card as { value: number }).value : "—"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

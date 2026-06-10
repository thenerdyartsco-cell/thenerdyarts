"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X } from "lucide-react";
import Button from "@/components/ui/Button";

const inputClass =
  "w-full border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent";
const labelClass = "mb-2 block text-xs uppercase tracking-wider text-muted";

function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function NewArtworkPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<"available" | "sold">("available");
  const [featured, setFeatured] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const list = Array.from(e.target.files || []);
    setFiles(list);
    setPreviews(list.map((f) => URL.createObjectURL(f)));
  }

  function removeFile(index: number) {
    setFiles((f) => f.filter((_, i) => i !== index));
    setPreviews((p) => p.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (files.length === 0) {
      setError("Please add at least one photo of the artwork.");
      return;
    }
    const priceNum = Number(price);
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      setError("Enter a valid price.");
      return;
    }

    setLoading(true);
    try {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        setProgress(`Uploading photo ${i + 1} of ${files.length}…`);
        const dataUri = await fileToDataUri(files[i]);
        const upRes = await fetch("/api/admin/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dataUri }),
        });
        const upJson = await upRes.json();
        if (!upRes.ok) throw new Error(upJson.error || "Upload failed");
        urls.push(upJson.url);
      }

      setProgress("Saving artwork…");
      const res = await fetch("/api/admin/artworks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          price: Math.round(priceNum),
          category,
          status,
          featured,
          order: 0,
          images: urls,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save artwork");

      router.push("/admin/art");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
      setProgress(null);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-1 font-serif text-2xl text-foreground lg:text-3xl">Add Artwork</h1>
      <p className="mb-8 text-sm text-muted">
        Photos upload to Cloudinary and the piece is saved to Firestore for the website.
      </p>

      {error && (
        <p className="mb-6 rounded-md bg-error/10 px-4 py-3 text-sm text-error">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className={labelClass}>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} required />
        </div>

        <div>
          <label className={labelClass}>About this piece</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className={`${inputClass} resize-none`}
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Price (₹)</label>
            <input
              type="number"
              min={1}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClass}
              placeholder="e.g. Abstract"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "available" | "sold")}
              className={inputClass}
            >
              <option value="available">Available</option>
              <option value="sold">Sold</option>
            </select>
          </div>
          <label className="flex items-center gap-3 pt-7 text-sm text-foreground">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 accent-accent"
            />
            Feature on homepage
          </label>
        </div>

        <div>
          <label className={labelClass}>Photos</label>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-background py-8 text-sm text-muted transition-colors hover:border-accent hover:text-accent">
            <Upload size={20} />
            Click to choose images
            <input type="file" accept="image/*" multiple onChange={onFilesChange} className="hidden" />
          </label>

          {previews.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {previews.map((src, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-md border border-border">
                  {/* object URLs aren't optimizable by next/image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="absolute right-1 top-1 rounded-full bg-foreground/70 p-1 text-white"
                    aria-label="Remove"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 pt-2">
          <Button type="submit" loading={loading}>
            {loading ? progress || "Saving…" : "Publish Artwork"}
          </Button>
        </div>
      </form>
    </div>
  );
}

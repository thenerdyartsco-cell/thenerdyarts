"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import LegalCheckbox from "@/components/forms/LegalCheckbox";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import type { Artwork } from "@/types";
import type { SoldOutRequestFormData } from "@/lib/validations";
import { CheckCircle } from "lucide-react";

interface SoldOutRequestModalProps {
  artwork: Artwork | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function SoldOutRequestModal({ artwork, isOpen, onClose }: SoldOutRequestModalProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    consentGiven: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { loading, error, success, submit, reset } = useFormSubmit<SoldOutRequestFormData>({
    url: "/api/soldout-request",
  });

  const handleClose = () => {
    setForm({ name: "", email: "", consentGiven: false });
    setErrors({});
    reset();
    onClose();
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (form.name.length < 2) newErrors.name = "Name is required";
    if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Valid email is required";
    if (!form.consentGiven) newErrors.consent = "You must agree to the terms";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artwork || !validate()) return;

    await submit({
      ...form,
      artworkId: artwork.id,
      artworkTitle: artwork.title,
      consentGiven: true,
    });
  };

  if (success) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Request Submitted!">
        <div className="text-center py-6">
          <CheckCircle className="mx-auto text-success mb-4" size={48} />
          <p className="text-foreground font-serif text-lg mb-2">Thank you!</p>
          <p className="text-muted text-sm leading-relaxed">
            We&apos;ve noted your interest in <strong>{artwork?.title}</strong>.
            We&apos;ll contact you if it becomes available again or if we can create a similar piece.
          </p>
          <Button className="mt-6" onClick={handleClose}>
            Close
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Request: ${artwork?.title || ""}`}>
      <p className="text-muted text-sm mb-6">
        This piece is currently sold out. Leave your details and we&apos;ll notify you if it
        becomes available or can be recreated.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-error text-sm bg-error/10 px-4 py-2 rounded">{error}</p>
        )}

        <div>
          <label className="block text-xs tracking-wider uppercase text-muted mb-1.5">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
          />
          {errors.name && <p className="text-error text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-xs tracking-wider uppercase text-muted mb-1.5">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
          />
          {errors.email && <p className="text-error text-xs mt-1">{errors.email}</p>}
        </div>

        <LegalCheckbox
          checked={form.consentGiven}
          onChange={(checked) => setForm({ ...form, consentGiven: checked })}
          error={errors.consent}
        />

        <Button type="submit" loading={loading} className="w-full mt-2">
          Submit Request
        </Button>
      </form>
    </Modal>
  );
}

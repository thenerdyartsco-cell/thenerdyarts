"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import LegalCheckbox from "@/components/forms/LegalCheckbox";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import type { Artwork } from "@/types";
import type { PurchaseFormData } from "@/lib/validations";
import { CheckCircle } from "lucide-react";

interface PurchaseModalProps {
  artwork: Artwork | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PurchaseModal({ artwork, isOpen, onClose }: PurchaseModalProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    consentGiven: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { loading, error, success, submit, reset } = useFormSubmit<PurchaseFormData>({
    url: "/api/purchase",
  });

  const handleClose = () => {
    setForm({ name: "", email: "", phone: "", address: "", consentGiven: false });
    setErrors({});
    reset();
    onClose();
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (form.name.length < 2) newErrors.name = "Name is required";
    if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Valid email is required";
    if (form.phone.length < 7) newErrors.phone = "Valid phone number is required";
    if (form.address.length < 5) newErrors.address = "Address is required";
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
            Your purchase request for <strong>{artwork?.title}</strong> has been submitted.
            Requests are handled on a <strong>first-come, first-served</strong> basis — if
            you&apos;re first in the queue, we&apos;ll email you to arrange the purchase, so
            please keep an eye on your inbox.
          </p>
          <Button className="mt-6" onClick={handleClose}>
            Close
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Purchase: ${artwork?.title || ""}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-lg border border-border border-l-[3px] border-l-accent bg-background px-4 py-3">
          <p className="text-xs leading-relaxed text-muted">
            Each piece is one of a kind, so requests are handled on a{" "}
            <strong className="text-foreground">first-come, first-served</strong> basis. If
            you&apos;re first in the queue, we&apos;ll reach out by email — please keep an eye
            on your inbox.
          </p>
        </div>

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

        <div>
          <label className="block text-xs tracking-wider uppercase text-muted mb-1.5">Phone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
          />
          {errors.phone && <p className="text-error text-xs mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-xs tracking-wider uppercase text-muted mb-1.5">Address</label>
          <textarea
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            rows={2}
            className="w-full border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent transition-colors resize-none"
          />
          {errors.address && <p className="text-error text-xs mt-1">{errors.address}</p>}
        </div>

        <LegalCheckbox
          checked={form.consentGiven}
          onChange={(checked) => setForm({ ...form, consentGiven: checked })}
          error={errors.consent}
        />

        <Button type="submit" loading={loading} className="w-full mt-2">
          Submit Purchase Request
        </Button>
      </form>
    </Modal>
  );
}

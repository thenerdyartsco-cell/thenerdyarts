"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import LegalCheckbox from "@/components/forms/LegalCheckbox";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import type { CustomRequestFormData } from "@/lib/validations";
import { CheckCircle } from "lucide-react";

const budgetRanges = [
  "Under ₹5,000",
  "₹5,000 - ₹10,000",
  "₹10,000 - ₹25,000",
  "₹25,000 - ₹50,000",
  "₹50,000 - ₹1,00,000",
  "₹1,00,000+",
];

export default function CustomRequestForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
    budget: "",
    consentGiven: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { loading, error, success, submit, reset } = useFormSubmit<CustomRequestFormData>({
    url: "/api/custom-request",
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (form.name.length < 2) newErrors.name = "Name is required";
    if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Valid email is required";
    if (form.phone.length < 7) newErrors.phone = "Valid phone number is required";
    if (form.description.length < 10) newErrors.description = "Please describe your desired piece in more detail";
    if (!form.budget) newErrors.budget = "Please select a budget range";
    if (!form.consentGiven) newErrors.consent = "You must agree to the terms";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await submit({ ...form, consentGiven: true });
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="mx-auto text-success mb-4" size={48} />
        <h2 className="font-serif text-2xl text-foreground mb-2">Request Submitted!</h2>
        <p className="text-muted max-w-md mx-auto leading-relaxed">
          Thank you for your interest in a custom art piece! Our artist will review your
          request and get back to you soon to discuss your vision.
        </p>
        <Button
          className="mt-6"
          variant="outline"
          onClick={() => {
            setForm({ name: "", email: "", phone: "", description: "", budget: "", consentGiven: false });
            reset();
          }}
        >
          Submit Another Request
        </Button>
      </div>
    );
  }

  const inputClass = "w-full border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      {error && (
        <p className="text-error text-sm bg-error/10 px-4 py-2 rounded">{error}</p>
      )}

      <div>
        <label className="block text-xs tracking-wider uppercase text-muted mb-1.5">Name</label>
        <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
        {errors.name && <p className="text-error text-xs mt-1">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs tracking-wider uppercase text-muted mb-1.5">Email</label>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
          {errors.email && <p className="text-error text-xs mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-xs tracking-wider uppercase text-muted mb-1.5">Phone</label>
          <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
          {errors.phone && <p className="text-error text-xs mt-1">{errors.phone}</p>}
        </div>
      </div>

      <div>
        <label className="block text-xs tracking-wider uppercase text-muted mb-1.5">Budget Range</label>
        <select
          value={form.budget}
          onChange={(e) => setForm({ ...form, budget: e.target.value })}
          className={`${inputClass} ${!form.budget ? "text-muted" : ""}`}
        >
          <option value="">Select a range</option>
          {budgetRanges.map((range) => (
            <option key={range} value={range}>{range}</option>
          ))}
        </select>
        {errors.budget && <p className="text-error text-xs mt-1">{errors.budget}</p>}
      </div>

      <div>
        <label className="block text-xs tracking-wider uppercase text-muted mb-1.5">
          Describe Your Vision
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={5}
          placeholder="Tell us about the piece you envision — style, colors, size, mood, any references..."
          className={`${inputClass} resize-none`}
        />
        {errors.description && <p className="text-error text-xs mt-1">{errors.description}</p>}
      </div>

      <LegalCheckbox
        checked={form.consentGiven}
        onChange={(checked) => setForm({ ...form, consentGiven: checked })}
        error={errors.consent}
      />

      <Button type="submit" loading={loading} className="w-full sm:w-auto">
        Submit Request
      </Button>
    </form>
  );
}
